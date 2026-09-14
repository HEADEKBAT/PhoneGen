/**
 * HLS playlist parsing.
 *
 * Everything here is pure: text in, structure out. No fetching, no browser
 * APIs, no ffmpeg — which is what makes it testable, and it is worth testing,
 * because the ways a playlist can be almost-valid are the ways a converter
 * fails on somebody's real stream.
 *
 * Covers the parts of RFC 8216 a converter actually meets:
 *
 *   • master playlists — the variant list, so the user picks a quality rather
 *     than getting whichever rendition happened to be first;
 *   • media playlists — segment URIs, durations, byte ranges;
 *   • EXT-X-MAP — the initialisation segment fMP4 streams need before their
 *     first media segment, and without which the output is unplayable;
 *   • EXT-X-KEY — AES-128 is decryptable client-side, SAMPLE-AES and the DRM
 *     methods are not, and the difference has to reach the user as a sentence
 *     rather than as a corrupt file;
 *   • EXT-X-ENDLIST — its absence means a live stream, which is a different
 *     job from converting a finite recording.
 */

/* ── Types ──────────────────────────────────────────────────────────────── */

export interface HlsVariant {
  /** Absolute URI of the variant's media playlist. */
  uri: string;
  /** Peak bandwidth in bits per second, as declared. */
  bandwidth: number;
  averageBandwidth: number | null;
  width: number | null;
  height: number | null;
  codecs: string | null;
  frameRate: number | null;
}

export type HlsKeyMethod = 'NONE' | 'AES-128' | 'SAMPLE-AES' | 'OTHER';

export interface HlsKey {
  method: HlsKeyMethod;
  /** Absolute URI of the key file. Absent for method NONE. */
  uri: string | null;
  /** Explicit IV as a hex string without the 0x prefix, when the playlist gives one. */
  iv: string | null;
  /** The method verbatim, for the error message when it is not one we handle. */
  rawMethod: string;
}

export interface HlsSegment {
  /** Absolute URI of the segment. */
  uri: string;
  /** Duration in seconds, from EXTINF. */
  duration: number;
  /** Media sequence number — the default AES-128 IV derives from it. */
  sequence: number;
  /** Byte range within `uri`, when EXT-X-BYTERANGE narrows it. */
  byteRange: { offset: number; length: number } | null;
  /** The key in effect for this segment, or null when unencrypted. */
  key: HlsKey | null;
  /** Absolute URI of the initialisation segment in effect, for fMP4. */
  initUri: string | null;
}

export interface HlsMasterPlaylist {
  kind: 'master';
  variants: HlsVariant[];
}

export interface HlsMediaPlaylist {
  kind: 'media';
  segments: HlsSegment[];
  targetDuration: number;
  /** Sum of the segment durations, in seconds. */
  totalDuration: number;
  /** No EXT-X-ENDLIST: the playlist is still growing. */
  live: boolean;
  /**
   * 'none'        — no EXT-X-KEY, or METHOD=NONE throughout
   * 'aes-128'     — decryptable in the browser with Web Crypto
   * 'unsupported' — SAMPLE-AES, Widevine, PlayReady, FairPlay …
   */
  encryption: 'none' | 'aes-128' | 'unsupported';
  /** The method that made `encryption` 'unsupported', for the message. */
  unsupportedMethod: string | null;
}

export type HlsPlaylist = HlsMasterPlaylist | HlsMediaPlaylist;

export class HlsParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'HlsParseError';
  }
}

/* ── Attribute lists ────────────────────────────────────────────────────── */

/**
 * Splits an EXT-X attribute list into name → value.
 *
 * Commas separate attributes, but a quoted value may contain them —
 * `CODECS="avc1.64001f,mp4a.40.2"` is one attribute, not two. Splitting on
 * every comma is the classic bug here, and it silently loses the audio codec.
 */
export function parseAttributes(input: string): Record<string, string> {
  const out: Record<string, string> = {};
  let i = 0;

  while (i < input.length) {
    const eq = input.indexOf('=', i);
    if (eq === -1) break;

    const name = input.slice(i, eq).trim().toUpperCase();
    i = eq + 1;

    let value: string;
    if (input[i] === '"') {
      const end = input.indexOf('"', i + 1);
      if (end === -1) {
        value = input.slice(i + 1);
        i = input.length;
      } else {
        value = input.slice(i + 1, end);
        i = end + 1;
        if (input[i] === ',') i += 1;
      }
    } else {
      let end = input.indexOf(',', i);
      if (end === -1) end = input.length;
      value = input.slice(i, end).trim();
      i = end + 1;
    }

    if (name) out[name] = value;
  }

  return out;
}

/* ── Helpers ────────────────────────────────────────────────────────────── */

/** Resolves a playlist-relative URI against the playlist's own URL. */
function resolve(uri: string, baseUrl: string): string {
  try {
    return new URL(uri, baseUrl).toString();
  } catch {
    throw new HlsParseError(`Cannot resolve "${uri}" against "${baseUrl}".`);
  }
}

function toNumber(value: string | undefined): number | null {
  if (value === undefined) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function keyMethod(raw: string): HlsKeyMethod {
  const method = raw.toUpperCase();
  if (method === 'NONE') return 'NONE';
  if (method === 'AES-128') return 'AES-128';
  if (method === 'SAMPLE-AES') return 'SAMPLE-AES';
  return 'OTHER';
}

/* ── Parser ─────────────────────────────────────────────────────────────── */

/**
 * Parses a playlist and reports whether it is a master or a media playlist.
 *
 * @param text     The playlist body.
 * @param baseUrl  Absolute URL the playlist was fetched from — every relative
 *                 URI inside is resolved against it.
 */
export function parseHlsPlaylist(text: string, baseUrl: string): HlsPlaylist {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines[0] !== '#EXTM3U') {
    throw new HlsParseError('That does not look like an HLS playlist: no #EXTM3U on the first line.');
  }

  if (lines.some((line) => line.startsWith('#EXT-X-STREAM-INF:'))) {
    return parseMaster(lines, baseUrl);
  }
  return parseMedia(lines, baseUrl);
}

function parseMaster(lines: string[], baseUrl: string): HlsMasterPlaylist {
  const variants: HlsVariant[] = [];

  for (let i = 0; i < lines.length; i++) {
    if (!lines[i].startsWith('#EXT-X-STREAM-INF:')) continue;

    const attrs = parseAttributes(lines[i].slice('#EXT-X-STREAM-INF:'.length));

    /* The URI is the next line that is not a tag. Comments and unrelated tags
       may sit between the two, so skipping only one line is not enough. */
    let uriLine: string | undefined;
    for (let j = i + 1; j < lines.length; j++) {
      if (!lines[j].startsWith('#')) {
        uriLine = lines[j];
        i = j;
        break;
      }
      if (lines[j].startsWith('#EXT-X-STREAM-INF:')) break;
    }
    if (!uriLine) continue;

    const resolution = attrs.RESOLUTION?.split('x') ?? [];

    variants.push({
      uri: resolve(uriLine, baseUrl),
      bandwidth: toNumber(attrs.BANDWIDTH) ?? 0,
      averageBandwidth: toNumber(attrs['AVERAGE-BANDWIDTH']),
      width: toNumber(resolution[0]),
      height: toNumber(resolution[1]),
      codecs: attrs.CODECS ?? null,
      frameRate: toNumber(attrs['FRAME-RATE']),
    });
  }

  if (variants.length === 0) {
    throw new HlsParseError('The master playlist lists no playable variants.');
  }

  /* Highest quality first: it is what someone converting for keeps wants, and
     it makes "the first one" a defensible default. */
  variants.sort((a, b) => (b.height ?? 0) - (a.height ?? 0) || b.bandwidth - a.bandwidth);

  return { kind: 'master', variants };
}

function parseMedia(lines: string[], baseUrl: string): HlsMediaPlaylist {
  const segments: HlsSegment[] = [];

  let targetDuration = 0;
  let sequence = 0;
  let live = true;
  let pendingDuration: number | null = null;
  let pendingByteRange: { offset: number; length: number } | null = null;
  let currentKey: HlsKey | null = null;
  let currentInit: string | null = null;
  let previousEnd = 0;
  let unsupportedMethod: string | null = null;
  let sawAes = false;

  for (const line of lines) {
    if (line.startsWith('#EXT-X-TARGETDURATION:')) {
      targetDuration = toNumber(line.slice('#EXT-X-TARGETDURATION:'.length)) ?? 0;
      continue;
    }

    if (line.startsWith('#EXT-X-MEDIA-SEQUENCE:')) {
      sequence = toNumber(line.slice('#EXT-X-MEDIA-SEQUENCE:'.length)) ?? 0;
      continue;
    }

    if (line === '#EXT-X-ENDLIST') {
      live = false;
      continue;
    }

    if (line.startsWith('#EXT-X-KEY:')) {
      const attrs = parseAttributes(line.slice('#EXT-X-KEY:'.length));
      const raw = attrs.METHOD ?? 'NONE';
      const method = keyMethod(raw);

      if (method === 'NONE') {
        currentKey = null;
      } else {
        if (method === 'AES-128') sawAes = true;
        else unsupportedMethod ??= raw;

        currentKey = {
          method,
          uri: attrs.URI ? resolve(attrs.URI, baseUrl) : null,
          iv: attrs.IV ? attrs.IV.replace(/^0x/i, '').toLowerCase() : null,
          rawMethod: raw,
        };
      }
      continue;
    }

    if (line.startsWith('#EXT-X-MAP:')) {
      const attrs = parseAttributes(line.slice('#EXT-X-MAP:'.length));
      currentInit = attrs.URI ? resolve(attrs.URI, baseUrl) : null;
      continue;
    }

    if (line.startsWith('#EXTINF:')) {
      /* `#EXTINF:10.5,title` — the duration ends at the comma. */
      const value = line.slice('#EXTINF:'.length).split(',')[0];
      pendingDuration = toNumber(value) ?? 0;
      continue;
    }

    if (line.startsWith('#EXT-X-BYTERANGE:')) {
      /* `length[@offset]`; without an offset the range continues from the end
         of the previous one in the same resource. */
      const [lengthPart, offsetPart] = line.slice('#EXT-X-BYTERANGE:'.length).split('@');
      const length = toNumber(lengthPart) ?? 0;
      const offset = toNumber(offsetPart) ?? previousEnd;
      pendingByteRange = { offset, length };
      previousEnd = offset + length;
      continue;
    }

    if (line.startsWith('#')) continue;

    /* A URI line closes the pending segment. */
    segments.push({
      uri: resolve(line, baseUrl),
      duration: pendingDuration ?? 0,
      sequence,
      byteRange: pendingByteRange,
      key: currentKey,
      initUri: currentInit,
    });

    sequence += 1;
    pendingDuration = null;
    pendingByteRange = null;
  }

  if (segments.length === 0) {
    throw new HlsParseError('The playlist contains no segments.');
  }

  const encryption: HlsMediaPlaylist['encryption'] = unsupportedMethod
    ? 'unsupported'
    : sawAes
      ? 'aes-128'
      : 'none';

  return {
    kind: 'media',
    segments,
    targetDuration,
    totalDuration: segments.reduce((sum, s) => sum + s.duration, 0),
    live,
    encryption,
    unsupportedMethod,
  };
}

/* ── Presentation ───────────────────────────────────────────────────────── */

/** "1080p · 5.2 Mbps" — what the quality picker shows. */
export function describeVariant(variant: HlsVariant): string {
  const parts: string[] = [];

  if (variant.height) parts.push(`${variant.height}p`);
  else if (variant.width) parts.push(`${variant.width}w`);

  const bps = variant.averageBandwidth ?? variant.bandwidth;
  if (bps > 0) {
    parts.push(bps >= 1_000_000 ? `${(bps / 1_000_000).toFixed(1)} Mbps` : `${Math.round(bps / 1000)} kbps`);
  }

  return parts.join(' · ') || 'unknown quality';
}

/** Whether a URL looks like a playlist rather than a media file. */
export function looksLikePlaylist(url: string): boolean {
  try {
    const { pathname } = new URL(url);
    return /\.m3u8?$/i.test(pathname);
  } catch {
    return false;
  }
}
