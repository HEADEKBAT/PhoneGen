/**
 * PIN generator.
 * Generates numeric PINs of configurable length.
 * Supports optional "no consecutive repeats" constraint.
 */

import type { PinOptions } from './types';

/* ── Helpers ──────────────────────────────────────────────────────────── */

function randomDigit(): string {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return String(buf[0] % 10);
}

/* ── Generator ────────────────────────────────────────────────────────── */

export function generatePin(opts: PinOptions): string {
  const { length, noRepeat } = opts;

  // Simple rejection sampling for the no-repeat constraint is fine for 4-8 digits
  let attempts = 0;
  const maxAttempts = 100;

  while (attempts < maxAttempts) {
    attempts++;
    let pin = '';
    let prev = '';

    for (let i = 0; i < length; i++) {
      let digit: string;
      if (noRepeat) {
        do {
          digit = randomDigit();
        } while (digit === prev);
      } else {
        digit = randomDigit();
      }
      pin += digit;
      prev = digit;
    }

    // For no-repeat, also check first != last (avoid wrapping repeats)
    if (noRepeat && pin[0] === pin[length - 1]) {
      continue;
    }

    return pin;
  }

  // Fallback: should never reach here for 4-8 digit PINs
  let pin = '';
  for (let i = 0; i < length; i++) pin += randomDigit();
  return pin;
}
