import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Image proxy for Image Studio's "load from URL" field.
 *
 * A browser `fetch()` of a third-party image is blocked by CORS on most hosts,
 * and even when it succeeds the resulting canvas would be tainted. Routing the
 * request through the server sidesteps both.
 *
 * Because this endpoint fetches an arbitrary URL on the server's behalf, it is
 * a server-side request forgery surface. The guards below are deliberate:
 *
 *  • http/https only — no file:, gopher:, data:, etc.
 *  • no credentials in the URL, no redirects followed
 *  • hostnames that resolve to loopback / link-local / private ranges rejected
 *  • response must declare an image content type
 *  • hard size cap, so this cannot be used to pull large files through
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

/** Literal addresses that must never be reachable through the proxy. */
function isBlockedHost(hostname: string): boolean {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, '');

  if (host === 'localhost' || host.endsWith('.localhost') || host.endsWith('.local')) {
    return true;
  }
  // IPv6 loopback / link-local / unique-local
  if (host === '::1' || host.startsWith('fe80:') || host.startsWith('fc') || host.startsWith('fd')) {
    return true;
  }

  const ipv4 = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(host);
  if (!ipv4) return false;

  const [a, b] = [Number(ipv4[1]), Number(ipv4[2])];
  return (
    a === 0 ||
    a === 127 ||                        // loopback
    a === 10 ||                         // private
    (a === 172 && b >= 16 && b <= 31) || // private
    (a === 192 && b === 168) ||          // private
    (a === 169 && b === 254) ||          // link-local / cloud metadata
    a >= 224                             // multicast + reserved
  );
}

function badRequest(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function GET(request: NextRequest) {
  const target = request.nextUrl.searchParams.get('url');
  if (!target) return badRequest('Missing "url" parameter.');

  let parsed: URL;
  try {
    parsed = new URL(target);
  } catch {
    return badRequest('That does not look like a valid URL.');
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return badRequest('Only http and https URLs are supported.');
  }
  if (parsed.username || parsed.password) {
    return badRequest('URLs with embedded credentials are not allowed.');
  }
  if (isBlockedHost(parsed.hostname)) {
    return badRequest('That host is not reachable through the proxy.');
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
