/**
 * Entropy calculation and password strength scoring.
 *
 * Entropy is calculated as:
 *   bits = length × log2(charsetSize)
 *
 * For random passwords: charsetSize = sum of all enabled character class sizes
 * For passphrases:      bits = wordCount × log2(wordlistSize)
 * For Human Password:   bits ≈ log2(pronouns × verbs × nouns × 10^digits × symbols)
 * For pronounceable:    bits ≈ syllableCount × log2(onsets × nuclei × codas)
 *
 * Crack time estimates:
 *   offline: guesses / 1e10 per second (fast hash, e.g. MD5/NTLM)
 *   online:  guesses / 100 per second (network-bound, rate limited)
 *
 * Score (0-100):
 *   < 30 bits   →  0-20  (Very Weak)
 *   30-40 bits  → 20-40  (Weak)
 *   40-50 bits  → 40-60  (Moderate)
 *   50-60 bits  → 60-80  (Strong)
 *   60+ bits    → 80-100 (Very Strong)
 */

import { WORDS } from './wordlist';
import { PRONOUNS, VERBS, NOUNS } from './humanWordbank';
import { isCommonPassword } from './commonPasswords';
import type { PasswordMode } from './types';

const SYMBOL_SET = '!@#$%^&*()_+-=[]{}|;:,.<>?/~';
const CONSONANTS = 'bcdfghjklmnpqrstvwxyz';
const VOWELS = 'aeiou';

/* ── Charset size helpers ─────────────────────────────────────────────── */

const CHARSETS: Record<string, number> = {
  uppercase: 26,
  uppercaseSafe: 24, // without I, O
  lowercase: 26,
  lowercaseSafe: 24, // without l, o
  digits: 10,
  digitsSafe: 8,     // without 0, 1
  symbols: SYMBOL_SET.length,
};

export function getCharsetSize(opts: {
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
  avoidAmbiguous?: boolean;
}): number {
  let size = 0;
  if (opts.uppercase) size += opts.avoidAmbiguous ? CHARSETS.uppercaseSafe : CHARSETS.uppercase;
  if (opts.lowercase) size += opts.avoidAmbiguous ? CHARSETS.lowercaseSafe : CHARSETS.lowercase;
  if (opts.numbers) size += opts.avoidAmbiguous ? CHARSETS.digitsSafe : CHARSETS.digits;
  if (opts.symbols) size += CHARSETS.symbols;
  return size || 26; // fallback to lowercase if nothing selected
}

/* ── Entropy calculation ──────────────────────────────────────────────── */

/**
 * Calculate entropy bits for a random password.
 * bits = length × log2(charsetSize)
 */
export function calculateRandomPasswordEntropy(
  length: number,
  charsetSize: number,
): number {
  return length * Math.log2(charsetSize);
}

/**
 * Calculate entropy bits for a passphrase.
 * bits = wordCount × log2(wordlistSize)
 */
export function calculatePassphraseEntropy(wordCount: number): number {
  return wordCount * Math.log2(WORDS.length);
}

/**
 * Calculate entropy bits for a Human Password.
 * We estimate by counting the number of possible structures and word choices.
 * Minimum: pronouns × verbs × nouns  (then digits and symbols if enabled)
 */
export function calculateHumanPasswordEntropy(opts: {
  includeNumber?: boolean;
  includeSymbol?: boolean;
}): number {
  let combinations = PRONOUNS.length * VERBS.length * NOUNS.length;
  if (opts.includeNumber) combinations *= 1000; // ~3 digits
  if (opts.includeSymbol) combinations *= SYMBOL_SET.length;
  return Math.log2(combinations);
}

/**
 * Calculate entropy bits for pronounceable passwords.
 * Each CVC syllable: consonants.length × vowels.length × consonants.length
 */
export function calculatePronounceableEntropy(syllableCount: number): number {
  const perSyllable = CONSONANTS.length * VOWELS.length * CONSONANTS.length;
  return syllableCount * Math.log2(perSyllable);
}

/* ── Crack time estimation ────────────────────────────────────────────── */

export interface CrackTimeEstimate {
  offline: string;
  online: string;
}

/**
 * Convert a number of seconds to a human-readable string.
 */
function formatDuration(seconds: number): string {
  const units: [string, number][] = [
    ['years', 365.25 * 24 * 3600],
    ['months', 30 * 24 * 3600],
    ['weeks', 7 * 24 * 3600],
    ['days', 24 * 3600],
    ['hours', 3600],
    ['minutes', 60],
    ['seconds', 1],
  ];

  for (const [unit, secs] of units) {
    if (seconds >= secs) {
      const val = seconds / secs;
      return val >= 100
        ? `${Math.round(val)} ${unit}`
        : `${val.toFixed(1)} ${unit}`;
    }
  }
  return `${seconds.toFixed(1)} seconds`;
}

/**
 * Estimate crack time given entropy bits.
 * @param bits Entropy in bits
 * @param guessesPerSecond Guesses per second (1e10 offline, 100 online)
 */
export function estimateCrackTime(bits: number, guessesPerSecond: number): string {
  const guesses = Math.pow(2, bits);
  const seconds = guesses / guessesPerSecond;

  // Handle overflow / infinity
  if (!isFinite(seconds) || seconds > 1e15) {
    return 'centuries';
  }

  return formatDuration(seconds);
}

export function getCrackTimeEstimates(bits: number): CrackTimeEstimate {
  return {
    offline: estimateCrackTime(bits, 1e10),
    online: estimateCrackTime(bits, 100),
  };
}

/* ── Scoring ──────────────────────────────────────────────────────────── */

export interface PasswordScore {
  score: number;       // 0-100
  bits: number;
  crackTime: CrackTimeEstimate;
  isCommon: boolean;
  resistant: string[];
  weak: string[];
}

/**
 * Calculate a comprehensive password score (0-100).
 *
 * Score formula:
 *   base = clamp(bits / 60 * 100, 0, 100)  // 60+ bits = 100
 *   If isCommon: score *= 0.1 (severe penalty)
 *   If length < 8: score *= 0.5
 */
export function scorePassword(
  value: string,
  bits: number,
  mode?: PasswordMode,
): PasswordScore {
  const common = isCommonPassword(value);
  let base = Math.min(100, (bits / 60) * 100);

  // Penalties
  if (common) base *= 0.1;
  if (value.length < 8) base *= 0.5;

  const score = Math.round(Math.max(0, Math.min(100, base)));
  const crackTime = getCrackTimeEstimates(bits);

  // Build resistant/weak lists
  const resistant: string[] = [];
  const weak: string[] = [];

  if (bits >= 40) resistant.push('Brute Force (offline)');
  else if (bits < 40) weak.push('Brute Force (offline)');

  if (bits >= 30) resistant.push('Brute Force (online)');
  else weak.push('Brute Force (online)');

  if (bits >= 50) resistant.push('Dictionary Attack');
  else weak.push('Dictionary Attack');

  if (value.length >= 12) resistant.push('Length (12+ chars)');
  else if (value.length < 8) weak.push('Length (too short)');

  if (common) {
    weak.push('Common password — easily guessable');
  } else {
    resistant.push('Not in common password lists');
  }

  // Mixed charset detection for random passwords
  const hasUpper = /[A-Z]/.test(value);
  const hasLower = /[a-z]/.test(value);
  const hasDigit = /[0-9]/.test(value);
  const hasSymbol = /[^A-Za-z0-9]/.test(value);
  const charsetCount = [hasUpper, hasLower, hasDigit, hasSymbol].filter(Boolean).length;

  if (charsetCount >= 3) resistant.push('Mixed character types');
  else if (charsetCount < 2) weak.push('Limited character variety');

  return {
    score,
    bits: Math.round(bits * 10) / 10,
    crackTime,
    isCommon: common,
    resistant,
    weak,
  };
}
