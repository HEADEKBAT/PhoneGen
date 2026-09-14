'use client';

/**
 * Turns an m3u8 URL into the bytes ffmpeg can open.
 *
 * ── Why this is not just fetch() in a loop ──────────────────────────────────
 *
 * Three things get in the way, and all three are the reason "paste a link" is
 * rare in browser-only converters:
 *
 *   1. CORS. Almost no stream sends `Access-Control-Allow-Origin`, so the
 *      browser makes the request and then refuses to hand over the bytes.
 *      Every fetch here tries direct first — a file from disk or a CORS-open
 *      CDN never touches our server — and falls back to the proxy, once, with
 *      the fallback recorded so the UI can say the segments went through it.
 *
 *   2. Encryption. A large share of real playlists are AES-128, which is
 *      decryptable here with Web Crypto. SAMPLE-AES and the DRM methods are
 *      not, and the difference has to be a sentence rather than a corrupt file.
 *
 *   3. Shape. fMP4 streams need their initialisation segment prepended or the
 *      output is unplayable; byte-range playlists point many segments at one
 *      resource and differ only by Range.
 */

import {
  parseHlsPlaylist,
  type HlsMediaPlaylist,
  type HlsMasterPlaylist,
  type HlsSegment,
  type HlsPlaylist,
} from './hls';

export type FetchRoute = 'direct' | 'proxy';

export class StreamFetchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StreamFetchError';
  }
}

const PROXY = '/api/stream-proxy?url=';

function proxied(url: string): string {
  return PROXY + encodeURIComponent(url);
}

/**
 * Fetches a URL, direct first, then through the proxy.
 *
 * `route` lets a caller skip the direct attempt once it is known to fail: on a
 * playlist of 400 segments, retrying a doomed direct request each time doubles
 * the request count for nothing.
 */
async function fetchWithFallback(
  url: string,
  init: RequestInit,
  route: FetchRoute | null,
): Promise<{ response: Response; route: FetchRoute }> {
  if (route !== 'proxy') {
    try {
      const response = await fetch(url, { ...init, mode: 'cors' });
      if (response.ok || response.status === 206) return { response, route: 'direct' };
      /* A real HTTP error is the origin's answer, not a CORS problem — the
         proxy would get the same 404. */
      if (response.status >= 400 && response.status < 500) {
        throw new StreamFetchError(`The stream host answered ${response.status}.`);
      }
    } catch (error) {
      if (error instanceof StreamFetchError) throw error;
      if (init.signal?.aborted) throw error;
      /* A CORS refusal is indistinguishable from a network failure here — the
         browser deliberately tells scripts nothing. Either way, try the proxy. */
    }
  }

  const response = await fetch(proxied(url), init);
  if (!response.ok && response.status !== 206) {
    let detail = `status ${response.status}`;
    try {
      const body = (await response.json()) as { error?: string };
      if (body.error) detail = body.error;
    } catch {
      /* not JSON; the status is all we have */
    }
    throw new StreamFetchError(detail);
  }

  return { response, route: 'proxy' };
}

/* ── Playlists ──────────────────────────────────────────────────────────── */

export interface FetchedPlaylist {
  playlist: HlsPlaylist;
  /** The URL it was actually read from, which relative URIs resolve against. */
  url: string;
  route: FetchRoute;
}

export async function fetchPlaylist(
  url: string,
  route: FetchRoute | null = null,
  signal?: AbortSignal,
): Promise<FetchedPlaylist> {
  const { response, route: used } = await fetchWithFallback(url, { signal }, route);
  const text = await response.text();

  return { playlist: parseHlsPlaylist(text, url), url, route: used };
}

/**
 * Follows a master playlist to the chosen variant.
 *
 * A variant's own playlist can in principle be another master; one hop is
 * where this stops, because a chain deeper than that is a redirect loop in
 * disguise.
 */
export async function resolveToMedia(
  fetched: FetchedPlaylist,
  variantIndex: number,
  signal?: AbortSignal,
): Promise<{ media: HlsMediaPlaylist; route: FetchRoute; variantUrl: string }> {
  if (fetched.playlist.kind === 'media') {
    return { media: fetched.playlist, route: fetched.route, variantUrl: fetched.url };
  }

  const master = fetched.playlist as HlsMasterPlaylist;
  const variant = master.variants[variantIndex] ?? master.variants[0];

  const inner = await fetchPlaylist(variant.uri, fetched.route, signal);
  if (inner.playlist.kind !== 'media') {
    throw new StreamFetchError('That variant points at another master playlist rather than at segments.');
  }

  return { media: inner.playlist, route: inner.route, variantUrl: variant.uri };
}

/* ── AES-128 ────────────────────────────────────────────────────────────── */

/**
 * The IV for a segment.
 *
 * The playlist may state one; otherwise RFC 8216 says to use the segment's
 * media sequence number as a 128-bit big-endian integer. Getting this wrong
 * produces bytes that decrypt without error and decode into noise.
 */
function ivFor(segment: HlsSegment): Uint8Array {
  const iv = new Uint8Array(16);

  if (segment.key?.iv) {
    const hex = segment.key.iv.padStart(32, '0');
    for (let i = 0; i < 16; i++) iv[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
    return iv;
  }

  const view = new DataView(iv.buffer);
  view.setUint32(12, segment.sequence >>> 0, false);
  return iv;
}

async function loadKey(
  uri: string,
  cache: Map<string, CryptoKey>,
  route: FetchRoute | null,
  signal?: AbortSignal,
): Promise<CryptoKey> {
  const cached = cache.get(uri);
  if (cached) return cached;

  const { response } = await fetchWithFallback(uri, { signal }, route);
  const raw = await response.arrayBuffer();

  if (raw.byteLength !== 16) {
    throw new StreamFetchError(`The decryption key is ${raw.byteLength} bytes; AES-128 needs 16.`);
  }

  const key = await crypto.subtle.importKey('raw', raw, { name: 'AES-CBC' }, false, ['decrypt']);
  cache.set(uri, key);
  return key;
}

/* ── Segments ───────────────────────────────────────────────────────────── */

export interface DownloadProgress {
  /** Segments finished. */
  done: number;
  total: number;
  /** Bytes fetched so far. */
  bytes: number;
  route: FetchRoute;
}

export interface DownloadResult {
  data: Uint8Array;
  /** 'ts' or 'mp4' — the extension ffmpeg should see. */
  extension: 'ts' | 'mp4';
  bytes: number;
  route: FetchRoute;
}

/**
 * Downloads every segment and returns one buffer.
 *
 * Sequential on purpose. Parallel downloads would be faster, but the parts
 * must be concatenated in order anyway, and holding several segments in
 * flight on top of the whole output multiplies the peak memory of a tab that
 * is about to hand all of it to WebAssembly.
 */
export async function downloadSegments(
  media: HlsMediaPlaylist,
  options: {
    route?: FetchRoute | null;
    onProgress?: (p: DownloadProgress) => void;
    signal?: AbortSignal;
    /** Refuse to start above this many bytes of declared content. */
    maxBytes?: number;
  } = {},
): Promise<DownloadResult> {
  if (media.encryption === 'unsupported') {
    throw new StreamFetchError(
      `This stream uses ${media.unsupportedMethod} encryption, which cannot be decrypted in a browser. ` +
        'Streams protected this way are meant to be played, not downloaded.',
    );
  }

  const { onProgress, signal, maxBytes = 2 * 1024 * 1024 * 1024 } = options;
  let route: FetchRoute | null = options.route ?? null;

  const parts: Uint8Array[] = [];
  const keys = new Map<string, CryptoKey>();
  let bytes = 0;

  /* fMP4: the initialisation segment holds the moov box, and without it the
     media segments are unopenable. It is fetched once, before everything. */
  const initUri = media.segments[0]?.initUri ?? null;
  if (initUri) {
    const { response, route: used } = await fetchWithFallback(initUri, { signal }, route);
    route = used;
    const buffer = new Uint8Array(await response.arrayBuffer());
    parts.push(buffer);
    bytes += buffer.byteLength;
  }

  for (let i = 0; i < media.segments.length; i++) {
    if (signal?.aborted) throw new DOMException('Cancelled', 'AbortError');

    const segment = media.segments[i];
    const headers: Record<string, string> = {};
    if (segment.byteRange) {
      const { offset, length } = segment.byteRange;
      headers.Range = `bytes=${offset}-${offset + length - 1}`;
    }

    const { response, route: used } = await fetchWithFallback(
      segment.uri,
      { signal, headers },
      route,
    );
    route = used;

    let buffer = new Uint8Array(await response.arrayBuffer());

    if (segment.key?.method === 'AES-128' && segment.key.uri) {
      const key = await loadKey(segment.key.uri, keys, route, signal);
      const plain = await crypto.subtle.decrypt(
        { name: 'AES-CBC', iv: ivFor(segment) as unknown as BufferSource },
        key,
        buffer as unknown as BufferSource,
      );
      buffer = new Uint8Array(plain);
    }

    parts.push(buffer);
    bytes += buffer.byteLength;

    if (bytes > maxBytes) {
      throw new StreamFetchError(
        `This stream is over ${Math.round(maxBytes / (1024 * 1024))}MB, which will not fit in browser memory.`,
      );
    }

    onProgress?.({ done: i + 1, total: media.segments.length, bytes, route });
  }

  /* One allocation for the join: pushing into a growing array would copy the
     whole thing on every segment. */
  const data = new Uint8Array(bytes);
  let offset = 0;
  for (const part of parts) {
    data.set(part, offset);
    offset += part.byteLength;
  }

  return {
    data,
    extension: initUri ? 'mp4' : 'ts',
    bytes,
    route: route ?? 'direct',
  };
}
