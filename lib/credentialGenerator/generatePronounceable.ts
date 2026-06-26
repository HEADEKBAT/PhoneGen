/**
 * Pronounceable password generator.
 * Builds passwords from CVC (Consonant-Vowel-Consonant) syllables.
 * Creates words that look and sound natural: Raviko, Munalex, Boteri.
 * Appends number and symbol affix for security.
 */

import type { PronounceableOptions } from './types';

/* ── Phonotactic sets ─────────────────────────────────────────────────── */

const CONSONANTS = 'bcdfghjklmnpqrstvwxyz';
const VOWELS = 'aeiou';
const CONSONANTS_FULL = 'bcdfghjklmnpqrstvwxz'; // No 'y' as ambiguous

/* ── Helpers ──────────────────────────────────────────────────────────── */

function randomInt(max: number): number {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0] % max;
}

function pick(arr: string): string {
  return arr[randomInt(arr.length)];
}

function randomDigit(): string {
  return String(randomInt(10));
}

function randomSymbol(): string {
  const symbols = '!@#$%&*?+_=';
  return symbols[randomInt(symbols.length)];
}

/* ── Syllable generation ──────────────────────────────────────────────── */

function generateSyllable(): string {
  return pick(CONSONANTS) + pick(VOWELS) + pick(CONSONANTS);
}

function generateSyllableMixed(): string {
  // Random: CVC (70%) or VC (20%) or CV (10%)
  const r = randomInt(10);
  if (r < 2) return pick(VOWELS) + pick(CONSONANTS);
  if (r < 3) return pick(CONSONANTS) + pick(VOWELS);
  return pick(CONSONANTS) + pick(VOWELS) + pick(CONSONANTS);
}

/* ── Generator ────────────────────────────────────────────────────────── */

export function generatePronounceable(opts: PronounceableOptions): string {
  const {
    syllableCount,
    capitalize = true,
    includeNumber = true,
    includeSymbol = true,
  } = opts;

  // Generate base word from syllables
  let word = '';
  for (let i = 0; i < syllableCount; i++) {
    word += generateSyllableMixed();
  }

  // Capitalize first letter
  if (capitalize) {
    word = word.charAt(0).toUpperCase() + word.slice(1);
  }

  // Append number
  if (includeNumber) {
    const digits = 2 + randomInt(2); // 2-3 digits
    let num = '';
    for (let i = 0; i < digits; i++) num += randomDigit();
    word += num;
  }

  // Append symbol
  if (includeSymbol) {
    word += randomSymbol();
  }

  return word;
}
