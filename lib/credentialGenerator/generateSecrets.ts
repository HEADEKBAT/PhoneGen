/**
 * Secrets generator.
 * Generates various developer-oriented secret types:
 * - UUID v4
 * - JWT Secret (64 bytes, Base64URL)
 * - API Keys (pk_live/sk_test/ghp_/etc.)
 * - Webhook Secret (whsec_)
 * - Hex string of arbitrary length
 * - Base64 string of arbitrary length
 */

/* ── Helpers ──────────────────────────────────────────────────────────── */

const HEX_CHARS = '0123456789abcdef';
const BASE64_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

function getRandomValues(length: number): Uint32Array {
  const buf = new Uint32Array(length);
  crypto.getRandomValues(buf);
  return buf;
}

function pick(set: string, rand: number): string {
  return set[rand % set.length];
}

function hexByte(): string {
  const buf = new Uint8Array(1);
  crypto.getRandomValues(buf);
  return buf[0].toString(16).padStart(2, '0');
}

/* ── Generators ───────────────────────────────────────────────────────── */

/**
 * UUID v4 (random).
 * Format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
 * Where y is one of [8, 9, a, b] (RFC 4122 variant)
 */
export function generateUUID(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);

  // Set version 4 (4 most significant bits of byte 6 = 0100)
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  // Set variant (2 most significant bits of byte 8 = 10)
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  // Format as hex with dashes
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
}

/**
 * JWT Secret (random bytes encoded as Base64URL).
 * @param byteLength Number of random bytes (default 64 for HS256)
 */
export function generateJWTSecret(byteLength: number = 64): string {
  const bytes = new Uint8Array(byteLength);
  crypto.getRandomValues(bytes);

  // Convert to Base64URL
  let result = '';
  for (let i = 0; i < bytes.length; i += 3) {
    const b1 = bytes[i];
    const b2 = i + 1 < bytes.length ? bytes[i + 1] : 0;
    const b3 = i + 2 < bytes.length ? bytes[i + 2] : 0;

    result += BASE64_CHARS[b1 >> 2];
    result += BASE64_CHARS[((b1 & 0x3) << 4) | (b2 >> 4)];
    if (i + 1 < bytes.length) {
      result += BASE64_CHARS[((b2 & 0xf) << 2) | (b3 >> 6)];
    }
    if (i + 2 < bytes.length) {
      result += BASE64_CHARS[b3 & 0x3f];
    }
  }

  return result;
}

/**
 * API Key generator. Creates realistic-looking test API keys.
 * NOTE: All keys are fake — for testing/development only.
 * @param type The key type: 'pk_live' | 'sk_test' | 'sk_live' | 'ghp' | 'ghpat'
 */
export function generateApiKey(type: string = 'sk_test'): string {
  const prefixes: Record<string, string> = {
    'pk_live': 'pk_live_',
    'pk_test': 'pk_test_',
    'sk_live': 'sk_live_',
    'sk_test': 'sk_test_',
    'ghp': 'ghp_',
    'ghpat': 'ghpat_',
    'rk_live': 'rk_live_',
    'rk_test': 'rk_test_',
    'whsec': 'whsec_',
  };

  const prefix = prefixes[type] || 'sk_test_';
  const suffixLength = type === 'ghp' ? 36 : type === 'ghpat' ? 32 : 24;
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const randoms = getRandomValues(suffixLength);

  let suffix = '';
  for (let i = 0; i < suffixLength; i++) {
    suffix += pick(chars, randoms[i]);
  }

  return prefix + suffix;
}

/**
 * Webhook secret (whsec_-prefixed).
 * @param byteLength Number of random bytes (default 32)
 */
export function generateWebhookSecret(byteLength: number = 32): string {
  const bytes = new Uint8Array(byteLength);
  crypto.getRandomValues(bytes);

  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const randoms = getRandomValues(byteLength);

  let suffix = '';
  for (let i = 0; i < byteLength; i++) {
    suffix += pick(chars, randoms[i]);
  }

  return `whsec_${suffix}`;
}

/**
 * Hex string of arbitrary length.
 * @param length Number of hex chars (default 32)
 */
export function generateHex(length: number = 32): string {
  let result = '';
  for (let i = 0; i < length; i += 2) {
    result += hexByte();
  }
  return result.slice(0, length);
}

/**
 * Base64 string of arbitrary length (URL-safe).
 * @param length Number of output chars (default 32)
 */
export function generateBase64(length: number = 32): string {
  const chars = BASE64_CHARS;
  const randoms = getRandomValues(length);
  let result = '';
  for (let i = 0; i < length; i++) {
    result += pick(chars, randoms[i]);
  }
  return result;
}

/**
 * Database password — a single-quote-safe, double-quote-safe random string.
 * @param length Character length (default 20)
 */
export function generateDatabasePassword(length: number = 20): string {
  // Safe chars: no single/double quotes, no backslash, no $ for shell safety
  const safe = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#%&*=+:?<>';
  const randoms = getRandomValues(length);
  let result = '';
  for (let i = 0; i < length; i++) {
    result += pick(safe, randoms[i]);
  }
  return result;
}

/**
 * UUID v7 (time-ordered) per RFC 9562.
 * Format: tttttttt-tttt-7xxx-yxxx-xxxxxxxxxxxx
 * Where t = 48-bit Unix ms timestamp, x = random, y = RFC 4122 variant.
 * Time-ordered UUIDs are sortable by generation time.
 */
export function generateUUIDv7(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);

  // 48-bit Unix timestamp (ms since epoch)
  const now = Date.now();
  bytes[0] = (now >> 40) & 0xff;
  bytes[1] = (now >> 32) & 0xff;
  bytes[2] = (now >> 24) & 0xff;
  bytes[3] = (now >> 16) & 0xff;
  bytes[4] = (now >> 8) & 0xff;
  bytes[5] = now & 0xff;

  // Set version 7 (4 most significant bits of byte 6 = 0111)
  bytes[6] = (bytes[6] & 0x0f) | 0x70;
  // Set variant (2 most significant bits of byte 8 = 10)
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  // Format as hex with dashes
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
}

/**
 * Random Token generator.
 * Creates a cryptographically random token in the specified encoding.
 * @param length Number of output characters (default 32)
 * @param type Encoding type: 'hex', 'base64', or 'base64url' (default 'hex')
 */
export function generateRandomToken(length: number = 32, type: 'hex' | 'base64' | 'base64url' = 'hex'): string {
  if (type === 'hex') {
    return generateHex(length);
  }
  const chars = type === 'base64url' ? BASE64_CHARS : BASE64_CHARS + '+/';
  const randoms = getRandomValues(length);
  let result = '';
  for (let i = 0; i < length; i++) {
    result += pick(chars, randoms[i]);
  }
  return result;
}

/**
 * Session Secret — 32-byte random value encoded as Base64URL.
 * Suitable for session signing and cookie encryption.
 * @param byteLength Number of random bytes (default 32)
 */
export function generateSessionSecret(byteLength: number = 32): string {
  const bytes = new Uint8Array(byteLength);
  crypto.getRandomValues(bytes);

  let result = '';
  for (let i = 0; i < bytes.length; i += 3) {
    const b1 = bytes[i];
    const b2 = i + 1 < bytes.length ? bytes[i + 1] : 0;
    const b3 = i + 2 < bytes.length ? bytes[i + 2] : 0;

    result += BASE64_CHARS[b1 >> 2];
    result += BASE64_CHARS[((b1 & 0x3) << 4) | (b2 >> 4)];
    if (i + 1 < bytes.length) {
      result += BASE64_CHARS[((b2 & 0xf) << 2) | (b3 >> 6)];
    }
    if (i + 2 < bytes.length) {
      result += BASE64_CHARS[b3 & 0x3f];
    }
  }

  return result;
}

/**
 * OAuth Client Secret — 32-byte URL-safe secret with `os_` prefix.
 * Compatible with OAuth 2.0 client secret requirements.
 * @param byteLength Number of random bytes for the suffix (default 32)
 */
export function generateOAuthSecret(byteLength: number = 32): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const randoms = getRandomValues(byteLength);

  let suffix = '';
  for (let i = 0; i < byteLength; i++) {
    suffix += pick(chars, randoms[i]);
  }

  return `os_${suffix}`;
}
