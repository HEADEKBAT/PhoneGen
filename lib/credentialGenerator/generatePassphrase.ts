/**
 * Passphrase generator (XKCD-style).
 * Samples words from the EFF-style wordlist and combines them with a separator.
 * Supports optional leet speak substitution (Phase 2 — not blocking MVP).
 */

import { WORDS } from './wordlist';
import type { PassphraseOptions } from './types';

/* ── Helpers ──────────────────────────────────────────────────────────── */

function randomInt(max: number): number {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0] % max;
}

function pick<T>(arr: readonly T[]): T {
  return arr[randomInt(arr.length)];
}

function randomDigit(): string {
  return String(randomInt(10));
}

/* ── Leet speak map (reserved for Phase 2) ────────────────────────────── */

const LEET_MAP: Record<string, string> = {
  a: '@', e: '3', o: '0', i: '1', s: '$', t: '7', b: '8', g: '9',
};

function applyLeet(word: string): string {
  return [...word].map((c) => LEET_MAP[c.toLowerCase()] || c).join('');
}

/* ── Generator ────────────────────────────────────────────────────────── */

export function generatePassphrase(opts: PassphraseOptions): string {
  const {
    wordCount,
    separator,
    capitalize,
    includeNumber,
  } = opts;

  const words: string[] = [];
  const indices = new Set<number>();

  // Pick unique random words
  while (indices.size < wordCount) {
    indices.add(randomInt(WORDS.length));
  }

  for (const idx of indices) {
    let word = WORDS[idx];
    if (capitalize) {
      word = word.charAt(0).toUpperCase() + word.slice(1);
    }
    words.push(word);
  }

  let passphrase = words.join(separator);

  if (includeNumber) {
    // Append a random 2-4 digit number
    const digits = 2 + randomInt(3);
    let num = '';
    for (let i = 0; i < digits; i++) num += randomDigit();
    passphrase += num;
  }

  return passphrase;
}
