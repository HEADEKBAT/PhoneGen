/**
 * Passphrase generator — words from `./wordlist`, joined by a separator.
 *
 * The list holds exactly 4096 words, so each one contributes exactly 12 bits
 * and the strength meter's arithmetic is checkable in your head: four words is
 * 48 bits, six is 72. See scripts/credential/wordlist.build.mjs for where the
 * words come from.
 */

import { WORDS, BITS_PER_WORD } from './wordlist';
import { distinctIndices, randomInt, randomString } from './random';
import type { PassphraseOptions } from './types';

const DIGITS = '0123456789';

export { BITS_PER_WORD };

export function generatePassphrase(opts: PassphraseOptions): string {
  const { wordCount, separator, capitalize, includeNumber } = opts;

  /* Words are drawn without replacement, which is what a reader expects from
     a passphrase ("correct horse battery staple", not "horse horse battery
     horse"). It costs a sliver of entropy against sampling with replacement —
     about 0.004 bits at six words out of 4096 — and `calculatePassphraseEntropy`
     reports the exact figure rather than the round one. */
  const count = Math.max(1, Math.min(Math.floor(wordCount), WORDS.length));
  const words = distinctIndices(WORDS.length, count).map((index) => {
    const word = WORDS[index];
    return capitalize ? word.charAt(0).toUpperCase() + word.slice(1) : word;
  });

  let passphrase = words.join(separator);

  if (includeNumber) {
    /* Two to four digits, appended. Worth roughly 8.8 bits, and deliberately
       not counted by the entropy function: a trailing number is the first
       thing a cracking rule appends, so counting it in full would overstate
       what it buys. */
    passphrase += randomString(DIGITS, 2 + randomInt(3));
  }

  return passphrase;
}
