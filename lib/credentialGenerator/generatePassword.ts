/**
 * Random password generator.
 * Uses crypto.getRandomValues for secure randomness.
 * Supports character class composition, exclusion list, and ambiguous-char filtering.
 */

/* ── Character sets ──────────────────────────────────────────────────── */

const UPPERCASE = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; // No I, O
const LOWERCASE = 'abcdefghjkmnpqrstuvwxyz';   // No l, o
const DIGITS = '23456789';                     // No 0, 1
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?/~';

const AMBIGUOUS_CHARS = 'l1IO0';

/* Full sets (when ambiguous chars are allowed) */
const UPPERCASE_FULL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE_FULL = 'abcdefghijklmnopqrstuvwxyz';
const DIGITS_FULL = '0123456789';
const SYMBOLS_FULL = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`\'"\\';

/* ── Helpers ──────────────────────────────────────────────────────────── */

function getRandomValues(length: number): Uint32Array {
  const buf = new Uint32Array(length);
  crypto.getRandomValues(buf);
  return buf;
}

function pickChar(charset: string, rand: number): string {
  return charset[rand % charset.length];
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  const vals = getRandomValues(a.length);
  for (let i = a.length - 1; i > 0; i--) {
    const j = vals[i] % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ── Options ──────────────────────────────────────────────────────────── */

export interface RandomPasswordOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
  excludeChars?: string;
  avoidAmbiguous?: boolean;
}

/* ── Generator ────────────────────────────────────────────────────────── */

export function generateRandomPassword(opts: RandomPasswordOptions): string {
  const {
    length,
    uppercase,
    lowercase,
    numbers,
    symbols,
    excludeChars = '',
    avoidAmbiguous = false,
  } = opts;

  // Determine which character sets to use
  const sets: string[] = [];
  if (uppercase) sets.push(avoidAmbiguous ? UPPERCASE : UPPERCASE_FULL);
  if (lowercase) sets.push(avoidAmbiguous ? LOWERCASE : LOWERCASE_FULL);
  if (numbers) sets.push(avoidAmbiguous ? DIGITS : DIGITS_FULL);
  if (symbols) sets.push(avoidAmbiguous ? SYMBOLS : SYMBOLS_FULL);

  // Fallback: at least lowercase if no sets selected
  if (sets.length === 0) {
    sets.push(LOWERCASE_FULL);
  }

  // Apply exclusion list and ambiguous filter to each set
  const filteredSets = sets.map((set) => {
    let s = set;
    if (excludeChars) {
      const exclude = new Set(excludeChars);
      s = [...s].filter((c) => !exclude.has(c)).join('');
    }
    if (avoidAmbiguous) {
      const ambiguous = new Set(AMBIGUOUS_CHARS);
      s = [...s].filter((c) => !ambiguous.has(c)).join('');
    }
    return s;
  }).filter((s) => s.length > 0);

  // If all sets were emptied by filtering, fallback
  if (filteredSets.length === 0) {
    filteredSets.push(LOWERCASE);
  }

  // Build full charset
  const charset = filteredSets.join('');
  const randoms = getRandomValues(length);

  // Generate password
  const password = Array.from({ length }, (_, i) => pickChar(charset, randoms[i]));

  // Ensure at least one character from each requested set
  for (let i = 0; i < filteredSets.length && i < length; i++) {
    const setChars = filteredSets[i];
    // Replace a character at a random position with a char from this set
    const pos = randoms[length - 1 - i] % length;
    const char = pickChar(setChars, randoms[length - 1 - i] + length);
    password[pos] = char;
  }

  return shuffleArray(password).join('');
}
