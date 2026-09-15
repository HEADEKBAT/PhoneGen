/**
 * Pronounceable password generator — syllables you can read down a phone line.
 *
 * Syllables are drawn from a fixed shape set (CVC, CV, VC) with a fixed
 * distribution. That distribution is part of the entropy: a generator that
 * picks CVC seven times in ten and CV one time in ten leaks a little
 * structure, and `calculatePronounceableEntropy` counts the syllable space per
 * shape weighted by how often that shape comes up, rather than pretending
 * every syllable is a CVC.
 */

import { pickChar, randomInt, randomString } from './random';
import type { PronounceableOptions } from './types';

/* 'y' is out of the consonant set: it reads as a vowel as often as not, which
   defeats the point of a password someone has to say out loud. */
const CONSONANTS = 'bcdfghjklmnpqrstvwxz';
const VOWELS = 'aeiou';
const DIGITS = '0123456789';
const SYMBOLS = '!@#$%&*?+_=';

/** Syllable shapes and their weights out of ten. Exported for the entropy module. */
export const SYLLABLE_SHAPES = [
  { shape: 'CVC', weight: 7, size: CONSONANTS.length * VOWELS.length * CONSONANTS.length },
  { shape: 'VC', weight: 2, size: VOWELS.length * CONSONANTS.length },
  { shape: 'CV', weight: 1, size: CONSONANTS.length * VOWELS.length },
] as const;

function generateSyllable(): string {
  const roll = randomInt(10);
  if (roll < 2) return pickChar(VOWELS) + pickChar(CONSONANTS);
  if (roll < 3) return pickChar(CONSONANTS) + pickChar(VOWELS);
  return pickChar(CONSONANTS) + pickChar(VOWELS) + pickChar(CONSONANTS);
}

export function generatePronounceable(opts: PronounceableOptions): string {
  const { syllableCount, capitalize = true, includeNumber = true, includeSymbol = true } = opts;

  let word = '';
  for (let i = 0; i < Math.max(1, syllableCount); i++) word += generateSyllable();

  if (capitalize) word = word.charAt(0).toUpperCase() + word.slice(1);
  if (includeNumber) word += randomString(DIGITS, 2 + randomInt(2));
  if (includeSymbol) word += pickChar(SYMBOLS);

  return word;
}
