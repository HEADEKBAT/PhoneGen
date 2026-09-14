import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { parsePublicUrl, assertPublicHost, BlockedUrlError } from '@/lib/net/ssrf';

/**
 * Image proxy for Image Studio's "load from URL" field.
 *
 * A browser `fetch()` of a third-party image is blocked by CORS on most hosts,
 * and even when it succeeds the resulting canvas would be tainted. Routing the
 * request through the server sidesteps both.
 *
 * Because this endpoint fetches an arbitrary URL on the server's behalf, it is
 * a server-side request forgery surface. The address checks live in
 * lib/net/ssrf.ts, shared with the stream proxy; on top of them:
 *
 *  • no redirects followed, so a vetted URL cannot bounce to a private one
 *  • response must declare an image content type
 *  • hard size cap, so this cannot be used to pull large files through
 *
 * The local `isBlockedHost` this used to carry claimed to reject "hostnames
 * that resolve to" private ranges, but it only looked at the hostname as
 * written: http://localtest.me/ resolves to 127.0.0.1 and passed. The shared
 * guard resolves.
 */

export const runtime = 'nodejs';

const MAX_BYTES = 20 * 1024 * 1024; // matches the client-side upload limit
const FETCH_TIMEOUT_MS = 10_000;

const ALLOWED_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/avif',
]);

function badRequest(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function GET(request: NextRequest) {
  const target = request.nextUrl.searchParams.get('url');
  if (!target) return badRequest('Missing "url" parameter.');

  let parsed: URL;
  try {
    parsed = parsePublicUrl(target);
    await assertPublicHost(parsed);
  } catch (error) {
    if (error instanceof BlockedUrlError) return badRequest(error.message, error.status);
    return badRequest('That URL could not be checked.');
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const upstream = await fetch(parsed.toString(), {
      signal: controller.signal,
      redirect: 'error', // a redirect could point back at a blocked host
      headers: { Accept: 'image/*' },
      cache: 'no-store',
    });

    if (!upstream.ok) {
      return badRequest(`The image host responded with ${upstream.status}.`, 502);
    }

    const contentType = (upstream.headers.get('content-type') ?? '')
      .split(';')[0]
      .trim()
      .toLowerCase();

    if (!ALLOWED_TYPES.has(contentType)) {
      return badRequest('That URL does not point to a PNG, JPEG, WEBP or AVIF image.', 415);
    }

    const declaredLength = Number(upstream.headers.get('content-length') ?? '0');
    if (declaredLength > MAX_BYTES) {
      return badRequest('That image is larger than 20MB.', 413);
    }

    const buffer = await upstream.arrayBuffer();
    if (buffer.byteLength > MAX_BYTES) {
      return badRequest('That image is larger than 20MB.', 413);
    }

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': String(buffer.byteLength),
        'Cache-Control': 'public, max-age=300',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return badRequest('The image host took too long to respond.', 504);
    }
    return badRequest('Could not load an image from that URL.', 502);
  } finally {
    clearTimeout(timeout);
  }
}
