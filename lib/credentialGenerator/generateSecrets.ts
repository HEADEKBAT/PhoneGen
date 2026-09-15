/**
 * Developer secrets: UUIDs, signing keys, API-key-shaped strings, tokens.
 *
 * Everything here draws from `crypto.getRandomValues` by way of `./random`,
 * which rejects the biased tail of the range instead of folding it back with
 * `%`.
 */

import { pickChar, randomString } from './random';

/* ── Alphabets ───────────────────────────────────────────────────────── */

const HEX = '0123456789abcdef';
const ALNUM = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

/* The two base64 alphabets are genuinely different and are not
   interchangeable. RFC 4648 §4 ends in `+/`; §5 ("base64url") ends in `-_` so
   the value survives a URL or a filename. The file used to hold only the URL
   alphabet and build the standard one as `BASE64_URL + '+/'` — a 66-character
   mixture that is valid under neither RFC, so a token generated as "base64"
   could contain `-` or `_` and no decoder would take it. */
const BASE64_STD = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const BASE64_URL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

/** Base64url encoding of raw bytes, unpadded (RFC 4648 §5). */
function base64UrlEncode(bytes: Uint8Array): string {
  let out = '';
  for (let i = 0; i < bytes.length; i += 3) {
    const b1 = bytes[i];
    const b2 = i + 1 < bytes.length ? bytes[i + 1] : 0;
    const b3 = i + 2 < bytes.length ? bytes[i + 2] : 0;

    out += BASE64_URL[b1 >> 2];
    out += BASE64_URL[((b1 & 0x03) << 4) | (b2 >> 4)];
    if (i + 1 < bytes.length) out += BASE64_URL[((b2 & 0x0f) << 2) | (b3 >> 6)];
    if (i + 2 < bytes.length) out += BASE64_URL[b3 & 0x3f];
  }
  return out;
}

function randomBytes(count: number): Uint8Array {
  const bytes = new Uint8Array(count);
  crypto.getRandomValues(bytes);
  return bytes;
}

function formatUuid(bytes: Uint8Array): string {
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
}

/* ── UUID ────────────────────────────────────────────────────────────── */

/**
 * UUID v4 — 122 random bits (RFC 9562 §5.4).
 */
export function generateUUID(): string {
  const bytes = randomBytes(16);
  bytes[6] = (bytes[6] & 0x0f) | 0x40; // version 4
  bytes[8] = (bytes[8] & 0x3f) | 0x80; // variant 10
  return formatUuid(bytes);
}

/* UUID v7 monotonicity state. See the comment on `generateUUIDv7`. */
let lastTimestamp = -1;
let sequence = 0;

/** A v7 counter is 12 bits wide: it lives in `rand_a`, bytes 6–7 minus version. */
const SEQUENCE_MAX = 0x0fff;

/**
 * UUID v7 — a 48-bit Unix millisecond timestamp followed by random bits
 * (RFC 9562 §5.7), so that generated identifiers sort by creation time. That
 * ordering is the entire reason to choose v7 over v4: it keeps a B-tree
 * primary key appending at the right-hand edge instead of scattering inserts
 * across the index.
 *
 * ── Two things this had to get right ────────────────────────────────────────
 *
 * **The timestamp did not fit.** It was written with `(now >> 40) & 0xff`, and
 * `>>` in JavaScript is a 32-bit operator: the operand is truncated to int32
 * and the shift count is taken modulo 32, so `>> 40` is really `>> 8` and
 * `>> 32` is `>> 0`. The top 16 bits of the timestamp were dropped and the
 * remaining bytes came out transposed, leaving the leading byte cycling once
 * every 65 seconds. Five UUIDs a minute apart sorted `fef8… e958… d3b8…
 * be18… a878…` — descending, on the one property the page selling this
 * generator advertises. `BigInt` shifts the full 48 bits.
 *
 * **A batch shares a millisecond.** The tool generates ten or a hundred at a
 * time, well inside one tick, and with `rand_a` random those all sort at
 * random against each other. RFC 9562 §6.2 allows a counter in the random
 * field for exactly this; `sequence` is that counter, reset whenever the clock
 * advances and carried into the next millisecond if it ever overflows.
 */
export function generateUUIDv7(): string {
  const bytes = randomBytes(16);

  let now = Date.now();
  if (now === lastTimestamp) {
    sequence += 1;
    if (sequence > SEQUENCE_MAX) {
      /* 4096 in a single millisecond. Borrow from the next one rather than
         emit a duplicate ordering key. */
      now = lastTimestamp + 1;
      sequence = 0;
    }
  } else if (now < lastTimestamp) {
    /* The wall clock went backwards (NTP step, daylight saving on a naive
       clock). Keep issuing ordered values from where we were. */
    now = lastTimestamp;
    sequence += 1;
  } else {
    sequence = 0;
  }
  lastTimestamp = now;

  /* Split rather than shift: `>>` would truncate to int32 again, and BigInt
     literals are not available at this project's ES2017 target. `hi` holds
     bits 32-47 of the millisecond value, `lo` the low 32. */
  const hi = Math.floor(now / 0x1_0000_0000);
  const lo = now >>> 0;
  bytes[0] = (hi >>> 8) & 0xff;
  bytes[1] = hi & 0xff;
  bytes[2] = (lo >>> 24) & 0xff;
  bytes[3] = (lo >>> 16) & 0xff;
  bytes[4] = (lo >>> 8) & 0xff;
  bytes[5] = lo & 0xff;

  bytes[6] = 0x70 | ((sequence >> 8) & 0x0f); // version 7 + counter high nibble
  bytes[7] = sequence & 0xff; //                 counter low byte
  bytes[8] = (bytes[8] & 0x3f) | 0x80; //        variant 10

  return formatUuid(bytes);
}

/* ── Signing keys ────────────────────────────────────────────────────── */

/**
 * JWT signing secret: random bytes as base64url.
 *
 * The default is 64 bytes because HS256 hashes its key down to the 64-byte
 * block size of SHA-256 — a longer key buys nothing, a shorter one is what
 * RFC 7518 §3.2 sets the floor for (32 bytes).
 */
export function generateJWTSecret(byteLength: number = 64): string {
  return base64UrlEncode(randomBytes(byteLength));
}

/** Session signing secret: 32 random bytes as base64url. */
export function generateSessionSecret(byteLength: number = 32): string {
  return base64UrlEncode(randomBytes(byteLength));
}

/* ── Prefixed keys ───────────────────────────────────────────────────── */

const API_KEY_PREFIXES: Record<string, string> = {
  pk_live: 'pk_live_',
  pk_test: 'pk_test_',
  sk_live: 'sk_live_',
  sk_test: 'sk_test_',
  ghp: 'ghp_',
  ghpat: 'ghpat_',
  rk_live: 'rk_live_',
  rk_test: 'rk_test_',
  whsec: 'whsec_',
};

/**
 * An API key shaped like the ones the common services issue.
 *
 * These are random strings wearing a familiar prefix — nothing here is
 * registered with anyone, and none of it will authenticate against anything.
 * The shape is the point: it exercises the validation, logging and redaction
 * paths that only fire on a string that looks like a real key.
 */
export function generateApiKey(type: string = 'sk_test'): string {
  const prefix = API_KEY_PREFIXES[type] ?? 'sk_test_';
  const suffixLength = type === 'ghp' ? 36 : type === 'ghpat' ? 32 : 24;
  return prefix + randomString(ALNUM, suffixLength);
}

/** Webhook signing secret, in the `whsec_` shape the common providers use. */
export function generateWebhookSecret(suffixLength: number = 32): string {
  return `whsec_${randomString(ALNUM, suffixLength)}`;
}

/** OAuth 2.0 client secret, URL-safe, `os_`-prefixed. */
export function generateOAuthSecret(suffixLength: number = 32): string {
  return `os_${randomString(ALNUM, suffixLength)}`;
}

/* ── Plain strings ───────────────────────────────────────────────────── */

/** A hex string of exactly `length` characters (4 bits each). */
export function generateHex(length: number = 32): string {
  return randomString(HEX, length);
}

/** A URL-safe base64 string of exactly `length` characters (6 bits each). */
export function generateBase64(length: number = 32): string {
  return randomString(BASE64_URL, length);
}

/**
 * A random token in the requested encoding.
 *
 * `base64` draws from RFC 4648 §4 and `base64url` from §5 — the distinction
 * matters the moment the token goes into a URL path or a filename.
 */
export function generateRandomToken(
  length: number = 32,
  type: 'hex' | 'base64' | 'base64url' = 'hex',
): string {
  if (type === 'hex') return generateHex(length);
  return randomString(type === 'base64url' ? BASE64_URL : BASE64_STD, length);
}

/**
 * A database password safe to paste into a connection string.
 *
 * Drops the characters that break quoting somewhere along the way: quotes and
 * backslash inside SQL or YAML, `$` and backtick inside a shell, `@`, `:`, `/`
 * and `?` inside a `postgres://user:pass@host/db` URL.
 */
export function generateDatabasePassword(length: number = 20): string {
  const safe = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!#%&*=+-_.';
  return randomString(safe, length);
}

/** Exported so the entropy module counts the same alphabet these produce. */
export const ALPHABET_SIZES = {
  hex: HEX.length,
  base64: BASE64_STD.length,
  base64url: BASE64_URL.length,
  alnum: ALNUM.length,
} as const;

export { pickChar };
