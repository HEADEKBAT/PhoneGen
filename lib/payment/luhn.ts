/**
 * Luhn Algorithm (ISO/IEC 7812) — Generate check digits & validate PANs.
 *
 * All functions are pure, synchronous, and rely only on arithmetic —
 * perfect for client-side use with crypto.getRandomValues() for the
 * preceding digits.
 */

/* ── Validate ────────────────────────────────────────────────────────────────── */

/**
 * Validate a PAN using the Luhn algorithm.
 * Returns `true` if the check digit is correct.
 */
export function luhnValidate(pan: string): boolean {
  if (!/^\d+$/.test(pan)) return false;
  if (pan.length < 8 || pan.length > 19) return false;

  let sum = 0;
  let alternate = false;
  for (let i = pan.length - 1; i >= 0; i--) {
    let digit = parseInt(pan[i], 10);
    if (alternate) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    alternate = !alternate;
  }
  return sum % 10 === 0;
}

/* ── Generate check digit ────────────────────────────────────────────────────── */

/**
 * Calculate the Luhn check digit for a partial PAN (excluding check digit).
 * Returns the check digit (0–9).
 *
 * Example:
 *   luhnCheckDigit("424242424242424") → "2"
 *   Full PAN: "4242424242424242"
 */
export function luhnCheckDigit(partial: string): number {
  const clean = partial.replace(/\D/g, '');
  let sum = 0;
  let alternate = true; // start with rightmost = check pos, so first doubled = alternate
  for (let i = clean.length - 1; i >= 0; i--) {
    let digit = parseInt(clean[i], 10);
    if (alternate) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    alternate = !alternate;
  }
  const mod = sum % 10;
  return mod === 0 ? 0 : 10 - mod;
}

/* ── Generate full PAN ────────────────────────────────────────────────────────── */

/**
 * Generate a complete PAN from a prefix or partial BIN.
 * Optionally include a specific length (must match the network's valid lengths).
 *
 * Example:
 *   generatePAN("4", 16) → "4123456789012345" (random interior digits + Luhn check)
 */
export function generatePAN(prefix: string, length: number): string {
  const partialLength = length - 1; // reserve last digit for check digit
  const remaining = partialLength - prefix.length;

  if (remaining < 0) throw new Error(`Prefix "${prefix}" is longer than target length ${length}`);
  if (remaining > 0) {
    // Generate random interior digits using crypto
    const randomDigits = new Uint8Array(remaining);
    crypto.getRandomValues(randomDigits);
    for (let i = 0; i < remaining; i++) {
      prefix += (randomDigits[i] % 10).toString();
    }
  }

  const check = luhnCheckDigit(prefix);
  return prefix + check.toString();
}

/* ── Generate invalid PAN (wrong check digit) ─────────────────────────────────── */

/**
 * Generate a PAN with an intentionally wrong check digit (for negative testing).
 */
export function generateInvalidPAN(prefix: string, length: number): string {
  const valid = generatePAN(prefix, length);
  const digits = valid.split('');
  // Flip the last digit to a wrong value
  const last = parseInt(digits[digits.length - 1], 10);
  digits[digits.length - 1] = ((last + 1) % 10).toString();
  return digits.join('');
}

/* ── PAN formatting ──────────────────────────────────────────────────────────── */

/**
 * Format a PAN with grouping separators based on the card network.
 *
 * - Visa/MC/Discover:   4-4-4-4
 * - Amex:               4-6-5
 * - UnionPay:           4-4-4-4-? (grouped in 4s)
 * - Maestro:            4-4-4-4-? (grouped in 4s)
 */
export function formatPAN(pan: string, networkId?: string): string {
  if (networkId === 'amex') {
    // 4-6-5
    return `${pan.slice(0, 4)} ${pan.slice(4, 10)} ${pan.slice(10)}`;
  }
  // Default: 4-4-4-4
  const groups: string[] = [];
  for (let i = 0; i < pan.length; i += 4) {
    groups.push(pan.slice(i, i + 4));
  }
  return groups.join(' ');
}

/**
 * Mask a PAN — show first 6 and last 4, mask the middle.
 * "4242424242424242" → "424242******4242"
 */
export function maskPAN(pan: string): string {
  if (pan.length < 10) return pan;
  const first6 = pan.slice(0, 6);
  const last4 = pan.slice(-4);
  const masked = '*'.repeat(pan.length - 10);
  return `${first6}${masked}${last4}`;
}

/**
 * Mask with grouping spaces:
 * "4242424242424242" → "424242 **** **** 4242"
 */
export function maskPANFormatted(pan: string, networkId?: string): string {
  const raw = maskPAN(pan);
  return formatPAN(raw, networkId);
}

/* ── BIN extraction ──────────────────────────────────────────────────────────── */

/** Extract BIN/IIN from a PAN (first 6 digits, or 8 for enhanced BIN). */
export function extractBIN(pan: string, enhanced?: boolean): string {
  return pan.slice(0, enhanced ? 8 : 6);
}
