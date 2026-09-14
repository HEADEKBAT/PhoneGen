import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  parsePublicUrl,
  assertPublicHost,
  fetchFollowingSafeRedirects,
  BlockedUrlError,
} from '@/lib/net/ssrf';

/**
 * Fetches an HLS playlist or media segment on the browser's behalf.
 *
 * Converting an m3u8 in the browser means downloading the playlist and every
 * segment it lists. Almost no stream sends `Access-Control-Allow-Origin`, so
 * the browser is not allowed to read the response even when the server would
 * happily send it — the request succeeds and the bytes are withheld. That is
 * why "paste a link" does not work as a purely client-side feature, and why
 * this route exists.
 *
 * The client tries the direct fetch first and only falls back here, so files
 * from disk and CORS-open streams never touch the server. When this route is
 * used, the segments do pass through it, and the UI says so rather than
 * repeating the site's usual "nothing leaves your browser".
 *
 * ── Why this is not an open proxy ───────────────────────────────────────────
 *
 * Because it fetches a caller-chosen URL from inside the hosting network, it
 * is an SSRF surface; lib/net/ssrf.ts holds the address checks and explains
 * what they can and cannot cover. On top of those:
 *
 *   • only media-ish content types come back — this cannot be used to read
 *     arbitrary pages, and `nosniff` stops the browser guessing otherwise;
 *   • redirects are followed by hand, with every hop vetted again — refusing
 *     them outright broke ordinary CDN and shortener links, and following them
 *     blindly is the textbook way past an address check;
 *   • hard size cap per request, enforced while streaming rather than after,
 *     so a hostile URL cannot exhaust memory by sending an endless body;
 *   • a per-IP rate limit, and no caching of anything it returns.
 */

export const runtime = 'nodejs';
/* Streamed, so this is the time to first byte plus the transfer — a large
   segment on a slow origin needs more than the default. */
export const maxDuration = 60;

const MAX_BYTES = 100 * 1024 * 1024; // one segment; whole streams arrive in pieces
const FETCH_TIMEOUT_MS = 20_000;

/** Content types a playlist or a segment can legitimately arrive as. */
const ALLOWED_TYPES = [
  'application/vnd.apple.mpegurl',
  'application/x-mpegurl',
  'audio/mpegurl',
  'audio/x-mpegurl',
  'video/mp2t',
  'video/mp4',
  'video/iso.segment',
  'audio/mp4',
  'audio/aac',
  'application/octet-stream',
  'binary/octet-stream',
  'application/mp4',
  'text/plain', // some CDNs serve .m3u8 as plain text
];

/* ── Rate limiting ──────────────────────────────────────────────────────────
 *
 * In-memory, therefore per serverless instance: it thins out a single abusive
 * client, it does not stop a distributed one. Anything stronger needs shared
 * state (KV, Redis), which is a deliberate next step rather than an oversight.
 */
const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 240; // a 20-minute video is ~120 segments
const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimited(key: string): boolean {
  const now = Date.now();
  const entry = hits.get(key);

  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS });

    /* Bound the map: without this it grows for the life of the instance. */
    if (hits.size > 5_000) {
      for (const [k, v] of hits) if (now > v.resetAt) hits.delete(k);
    }
    return false;
  }

  entry.count += 1;
  return entry.count > MAX_REQUESTS_PER_WINDOW;
}

function clientKey(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  return forwarded?.split(',')[0].trim() || request.headers.get('x-real-ip') || 'unknown';
}

/* ── Response helpers ───────────────────────────────────────────────────── */

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Range',
  'Access-Control-Expose-Headers': 'Content-Length, Content-Range, X-Proxy-Content-Type',
};

function fail(message: string, status: number) {
  return NextResponse.json({ error: message }, { status, headers: CORS });
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

export async function GET(request: NextRequest) {
  if (rateLimited(clientKey(request))) {
    return fail('Too many requests through the proxy. Wait a minute and try again.', 429);
  }

  const target = request.nextUrl.searchParams.get('url');
  if (!target) return fail('Missing "url" parameter.', 400);

  let url: URL;
  try {
    url = parsePublicUrl(target);
    await assertPublicHost(url);
  } catch (error) {
    if (error instanceof BlockedUrlError) return fail(error.message, error.status);
    return fail('That URL could not be checked.', 400);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    /* Range passes through so byte-range segments (EXT-X-BYTERANGE) work. */
    const range = request.headers.get('range');

    const { response: upstream } = await fetchFollowingSafeRedirects(url, {
      signal: controller.signal,
      cache: 'no-store',
      headers: {
        Accept: '*/*',
        ...(range ? { Range: range } : {}),
        /* Many CDNs reject an empty or bot-like UA outright. */
        'User-Agent': 'Mozilla/5.0 (compatible; GenCore media proxy)',
      },
    });

    if (!upstream.ok && upstream.status !== 206) {
      return fail(`The stream host responded with ${upstream.status}.`, 502);
    }

    const contentType = (upstream.headers.get('content-type') ?? 'application/octet-stream')
      .split(';')[0]
      .trim()
      .toLowerCase();

    if (!ALLOWED_TYPES.includes(contentType)) {
      return fail(
        `That URL returned ${contentType}, which is not a playlist or a media segment.`,
        415,
      );
    }

    const declared = Number(upstream.headers.get('content-length') ?? '0');
    if (declared > MAX_BYTES) {
      return fail('That segment is larger than 100MB.', 413);
    }

    if (!upstream.body) return fail('The stream host sent an empty response.', 502);

    /* Count while streaming: a response with no Content-Length, or a lying
       one, would otherwise be read to the end before anyone noticed. */
    let seen = 0;
    const capped = upstream.body.pipeThrough(
      new TransformStream<Uint8Array, Uint8Array>({
        transform(chunk, controllerOut) {
          seen += chunk.byteLength;
          if (seen > MAX_BYTES) {
            controllerOut.error(new Error('size cap exceeded'));
            controller.abort();
            return;
          }
          controllerOut.enqueue(chunk);
        },
      }),
    );

    const headers = new Headers(CORS);
    headers.set('Content-Type', contentType);
    headers.set('Cache-Control', 'no-store');
    headers.set('X-Content-Type-Options', 'nosniff');
    /* The client needs the real type to tell a playlist from a segment, and
       Content-Type alone is unreliable — see text/plain in the list above. */
    headers.set('X-Proxy-Content-Type', contentType);

    const contentRange = upstream.headers.get('content-range');
    if (contentRange) headers.set('Content-Range', contentRange);
    if (declared > 0) headers.set('Content-Length', String(declared));

    return new NextResponse(capped, { status: upstream.status, headers });
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return fail('The stream host took too long to respond.', 504);
    }
    return fail('Could not load that URL.', 502);
  } finally {
    clearTimeout(timeout);
  }
}
