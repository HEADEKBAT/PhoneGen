/**
 * Human Password generator.
 * Creates grammatically coherent, memorable phrases following the pattern:
 *   {pronoun}{verb}{noun}{number?}{symbol?}
 *
 * Examples: MyDogLikesPizza92!, CoffeeBeforeMeetings#17, IUseGenCoreEveryDay84$
 *
 * All word banks are in English for maximum compatibility and entropy.
 */

import { PRONOUNS, VERBS, NOUNS } from './humanWordbank';
import type { HumanPasswordOptions } from './types';

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

function randomSymbol(): string {
  const symbols = '!@#$%&*?+_=';
  return symbols[randomInt(symbols.length)];
}

function randomYear(): string {
  return String(1980 + randomInt(45)); // 1980-2024
}

/* ── Generator ────────────────────────────────────────────────────────── */

export function generateHumanPassword(opts: HumanPasswordOptions = {}): string {
  const {
    capitalize = true,
    includeNumber = true,
    includeSymbol = true,
  } = opts;

  // Build phrase: pronoun + verb + noun
  const pronoun = pick(PRONOUNS);
  const verb = pick(VERBS);
  const noun = pick(NOUNS);

  let phrase = pronoun + verb + noun;

  // Optionally append a number
  if (includeNumber) {
    // Random: 2-digit, 4-digit year, or 3-digit
    const numType = randomInt(3);
    if (numType === 0) phrase += randomDigit() + randomDigit();
    else if (numType === 1) phrase += randomYear();
    else phrase += randomDigit() + randomDigit() + randomDigit();
  }

  // Optionally append a symbol
  if (includeSymbol) {
    phrase += randomSymbol();
  }

  // Ensure minimum length of 12 (pad with digits if needed)
  if (phrase.length < 12) {
    const needed = 12 - phrase.length;
    for (let i = 0; i < needed; i++) {
      // Insert at varying positions
      const pos = phrase.length > 2
        ? randomInt(phrase.length - 2) + 1
        : phrase.length;
      phrase = phrase.slice(0, pos) + randomDigit() + phrase.slice(pos);
    }
  }

  return phrase;
}
