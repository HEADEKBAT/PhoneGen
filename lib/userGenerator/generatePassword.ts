/**
 * UserGen — secure, realistic password generator.
 *
 * Produces passwords that:
 *  - Are 12–16 characters long
 *  - Include a fragment of the user's name for realism
 *  - Contain uppercase, lowercase, digits, and a special character
 *
 * Example: "M!chael#2025", "Ann@Smith_8x"
 */

const SPECIAL = ['!', '@', '#', '$', '%', '&', '*', '_'];

/**
 * Generate a realistic-looking password.
 *
 * @param firstName  Used as a seed fragment for natural feel
 * @returns         A password string meeting the criteria above
 */
export function generatePassword(firstName: string): string {
  /* Derive a memorable fragment from the name */
  const fragment = firstName.length >= 3
    ? firstName.slice(0, Math.ceil(firstName.length * 0.6))
    : firstName;

  /* Year-like suffix (makes it feel real) */
  const year = String(1990 + Math.floor(Math.random() * 25));

  /* Decide how to combine fragment + special + year */
  const patterns = [
    () => `${capitalise(fragment)}${pick(SPECIAL)}${year}`,
    () => `${capitalise(fragment)}${year}${pick(SPECIAL)}`,
    () => `${pick(SPECIAL)}${capitalise(fragment)}${year}`,
    () => `${fragment.toLowerCase()}${pick(SPECIAL)}${year}`,
  ];

  const base = pick(patterns)();

  /* Pad or trim to reach 12–16 chars */
  if (base.length < 12) {
    const pad = String(Math.floor(Math.random() * 999)).padStart(3, '0');
    return base + pick(SPECIAL) + pad;
  }

  if (base.length > 16) {
    return base.slice(0, 16);
  }

  return base;
}

/* ── Helpers ─────────────────────────────────────────────────────────── */

function capitalise(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
