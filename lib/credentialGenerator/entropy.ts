/**
 * How much a generated credential is actually worth, in bits.
 *
 * Entropy here is a property of the *generator*, not of the string it emitted:
 * it is the log of how many equally likely values the chosen settings could
 * have produced. "Tr0ub4dor&3" has the same entropy as "correcthorse" if both
 * came out of the same process. That is why every function below takes the
 * options rather than the password, and why `scorePassword` takes the bits as
 * an argument instead of trying to infer them from characters.
 *
 * ── What was wrong here before ──────────────────────────────────────────────
 *
 * The charset table and the generator had drifted apart, and every drift
 * flattered the result. `getCharsetSize` counted symbols as a 28-character set
 * while `generatePassword` drew from 32; it ignored the user's exclusion list
 * entirely, so excluding twenty characters changed nothing in the reported
 * figure; and the Human Password estimate multiplied by a 28-symbol alphabet
 * that the generator never used (its symbol set had 11). Entropy is now taken
 * from `resolveCharsets`, the same function the generator draws from, so the
 * two cannot disagree again.
 */

import { WORDS } from './wordlist';
import { SYLLABLE_SHAPES } from './generatePronounceable';
import { resolveCharsets, type RandomPasswordOptions } from './generatePassword';
import { isCommonPassword } from './commonPasswords';

/* ── Entropy ──────────────────────────────────────────────────────────── */

/**
 * The size of the alphabet a set of options actually draws from.
 *
 * Counted over the union of the resolved sets, deduplicated — the sets are
 * disjoint today, and a duplicated character would otherwise be counted twice.
 */
export function getCharsetSize(opts: RandomPasswordOptions): number {
  const union = new Set(resolveCharsets(opts).join(''));
  return union.size;
}

/** `length × log2(alphabet)` — the whole of it, for a uniform draw. */
export function calculateRandomPasswordEntropy(opts: RandomPasswordOptions): number {
  return Math.max(1, Math.floor(opts.length)) * Math.log2(getCharsetSize(opts));
}

/**
 * Passphrase entropy, for sampling without replacement.
 *
 * `log2(n · (n−1) · … · (n−k+1))` rather than `k · log2(n)`: the generator does
 * not repeat a word, so the later draws come from a slightly smaller pool. At
 * six words from 4096 the difference is 0.004 bits — reported exactly because
 * there is no reason to report it any other way.
 */
export function calculatePassphraseEntropy(wordCount: number): number {
  const k = Math.max(1, Math.min(Math.floor(wordCount), WORDS.length));
  let bits = 0;
  for (let i = 0; i < k; i++) bits += Math.log2(WORDS.length - i);
  return bits;
}

/**
 * Pronounceable entropy, accounting for the shape distribution.
 *
 * Each syllable is a weighted choice of shape followed by a uniform draw
 * inside it, so the per-syllable entropy is the Shannon entropy of that
 * mixture: −Σ p(shape)·log2(p(shape)/size(shape)).
 */
export function calculatePronounceableEntropy(syllableCount: number): number {
  const total = SYLLABLE_SHAPES.reduce((sum, s) => sum + s.weight, 0);
  const perSyllable = SYLLABLE_SHAPES.reduce((bits, s) => {
    const p = s.weight / total;
    return bits - p * Math.log2(p / s.size);
  }, 0);
  return Math.max(1, syllableCount) * perSyllable;
}

/**
 * PIN entropy.
 *
 * Without constraints it is `length × log2(10)`. With `noRepeat` the space is
 * the number of digit strings where no two neighbours match and the ends
 * differ — counted exactly by the standard cycle formula, because a PIN is
 * short enough that an approximation would be visible.
 */
export function calculatePinEntropy(length: number, noRepeat: boolean): number {
  if (!noRepeat) return length * Math.log2(10);
  /* Proper colourings of a cycle of `length` vertices with 10 colours:
     (k−1)^n + (−1)^n (k−1), with k = 10. */
  const n = Math.max(2, length);
  const count = Math.pow(9, n) + (n % 2 === 0 ? 9 : -9);
  return Math.log2(count);
}

/** Entropy of a string of `length` characters drawn uniformly from `alphabet`. */
export function calculateStringEntropy(length: number, alphabetSize: number): number {
  return length * Math.log2(alphabetSize);
}

/* ── Crack time ───────────────────────────────────────────────────────── */

/**
 * The three scenarios the meter reports.
 *
 * One number labelled "offline" says nothing without naming the hash: the same
 * password falls in minutes against unsalted MD5 and holds for centuries
 * against bcrypt at a sane work factor. Six orders of magnitude separate these
 * rows, and which one applies is a property of the service storing the
 * password, not of the password.
 *
 * Rates are order-of-magnitude figures for a single well-equipped attacker
 * (roughly an 8×GPU rig, 2025). They are meant to be read as exponents, not as
 * measurements.
 */
export const ATTACK_SCENARIOS = [
  /** Rate-limited login form. 100 guesses per second is generous to the attacker. */
  { id: 'online', guessesPerSecond: 1e2 },
  /** Stolen database, fast unsalted hash: MD5, SHA-1, NTLM. */
  { id: 'fastHash', guessesPerSecond: 1e11 },
  /** Stolen database, deliberately slow hash: bcrypt cost 12, argon2id. */
  { id: 'slowHash', guessesPerSecond: 1e4 },
] as const;

export type AttackScenarioId = (typeof ATTACK_SCENARIOS)[number]['id'];

/**
 * A duration, as a magnitude and a unit key — never a formatted English
 * string. The site runs in six languages; the caller does the wording.
 */
export interface Duration {
  value: number;
  unit: 'instant' | 'seconds' | 'minutes' | 'hours' | 'days' | 'months' | 'years' | 'centuries';
}

const UNITS: [Duration['unit'], number][] = [
  ['years', 365.25 * 24 * 3600],
  ['months', 30 * 24 * 3600],
  ['days', 24 * 3600],
  ['hours', 3600],
  ['minutes', 60],
  ['seconds', 1],
];

export function describeDuration(seconds: number): Duration {
  if (!isFinite(seconds) || seconds >= 100 * 365.25 * 24 * 3600) {
    return { value: 0, unit: 'centuries' };
  }
  if (seconds < 1) return { value: 0, unit: 'instant' };

  for (const [unit, size] of UNITS) {
    if (seconds >= size) {
      const value = seconds / size;
      return { value: value >= 10 ? Math.round(value) : Math.round(value * 10) / 10, unit };
    }
  }
  return { value: 0, unit: 'instant' };
}

/**
 * Time to find the password, given entropy and a guess rate.
 *
 * Half the keyspace, not all of it: an exhaustive search finds a uniformly
 * random secret after half the candidates on average, and the average is the
 * number worth quoting.
 */
export function estimateCrackSeconds(bits: number, guessesPerSecond: number): number {
  const guesses = Math.pow(2, bits - 1);
  return guesses / guessesPerSecond;
}

export interface CrackEstimate {
  scenario: AttackScenarioId;
  seconds: number;
  duration: Duration;
}

export function getCrackEstimates(bits: number): CrackEstimate[] {
  return ATTACK_SCENARIOS.map((scenario) => {
    const seconds = estimateCrackSeconds(bits, scenario.guessesPerSecond);
    return { scenario: scenario.id, seconds, duration: describeDuration(seconds) };
  });
}

/* ── Scoring ──────────────────────────────────────────────────────────── */

/**
 * Where the five bands sit.
 *
 * The old scale ran `bits / 60 × 100`, so 60 bits scored a full 100 and was
 * labelled "Very Strong". 60 bits is about a day against a fast hash on one
 * rig — respectable for a forum login, nowhere near what the top of a scale
 * should mean. The bands below are anchored to what the bits survive:
 *
 *   < 40   nothing; minutes even online
 *    40    survives an online attack, falls to a fast hash in minutes
 *    60    a day against a fast hash
 *    80    the point where a fast hash stops being the weak link
 *   100+   not brute-forceable by anyone, on any hash, this century
 */
export const STRENGTH_BANDS = [
  { id: 'veryWeak', minBits: 0 },
  { id: 'weak', minBits: 40 },
  { id: 'moderate', minBits: 60 },
  { id: 'strong', minBits: 80 },
  { id: 'veryStrong', minBits: 100 },
] as const;

export type StrengthBandId = (typeof STRENGTH_BANDS)[number]['id'];

export function bandForBits(bits: number): StrengthBandId {
  let band: StrengthBandId = 'veryWeak';
  for (const candidate of STRENGTH_BANDS) {
    if (bits >= candidate.minBits) band = candidate.id;
  }
  return band;
}

/** Things the meter can say about a credential, as keys rather than sentences. */
export type StrengthNote =
  | 'common'
  | 'tooShort'
  | 'singleCharClass'
  | 'resistsOnline'
  | 'resistsFastHash'
  | 'resistsSlowHash'
  | 'resistsDictionary';

export interface PasswordScore {
  /** 0-100, for the bar. 100 means 120 bits or more, not "as good as it gets". */
  score: number;
  bits: number;
  band: StrengthBandId;
  estimates: CrackEstimate[];
  isCommon: boolean;
  /** Reasons it holds up. */
  resistant: StrengthNote[];
  /** Reasons it does not. */
  weak: StrengthNote[];
}

/**
 * Turns entropy into the numbers and flags the meter renders.
 *
 * The bar is linear in bits up to 120 rather than in "score points", so moving
 * from 40 to 60 bits looks like the same distance as 60 to 80 — which it is.
 */
export function scorePassword(value: string, bits: number): PasswordScore {
  const common = isCommonPassword(value);

  /* A password on a leak list has no entropy left regardless of how it was
     built: the attacker's first few thousand guesses include it. */
  const effectiveBits = common ? Math.min(bits, 12) : bits;

  const resistant: StrengthNote[] = [];
  const weak: StrengthNote[] = [];

  if (common) weak.push('common');
  if (value.length < 8) weak.push('tooShort');

  const classes = [/[a-z]/, /[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/].filter((re) => re.test(value)).length;
  if (classes < 2 && !/^\d+$/.test(value)) weak.push('singleCharClass');

  (effectiveBits >= 30 ? resistant : weak).push('resistsOnline');
  (effectiveBits >= 80 ? resistant : weak).push('resistsFastHash');
  (effectiveBits >= 50 ? resistant : weak).push('resistsSlowHash');
  (common ? weak : resistant).push('resistsDictionary');

  return {
    score: Math.round(Math.max(0, Math.min(100, (effectiveBits / 120) * 100))),
    bits: Math.round(effectiveBits * 10) / 10,
    band: bandForBits(effectiveBits),
    estimates: getCrackEstimates(effectiveBits),
    isCommon: common,
    resistant,
    weak,
  };
}
