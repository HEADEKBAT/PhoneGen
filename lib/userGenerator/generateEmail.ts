/**
 * UserGen — custom email generator.
 *
 * Builds email addresses from the user's real name + real email domains.
 * This is intentionally NOT using Faker's email generator because
 * we want addresses that look genuinely real.
 *
 * Patterns:
 *   first.last##@domain
 *   f.last##@domain
 *   firstlast##@domain
 */

import { EMAIL_DOMAINS } from './emailDomains';

export interface EmailResult {
  email: string;
  alternativeEmail: string;
}

/**
 * Generate one or two realistic email addresses from name components.
 *
 * @param firstName  User's first name
 * @param lastName   User's last name
 * @returns         Primary and alternative email
 */
export function generateEmail(firstName: string, lastName: string): EmailResult {
  const domains = [...EMAIL_DOMAINS];
  shuffle(domains);

  const primaryDomain = domains[0];
  const altDomain = domains[1] ?? 'gmail.com';

  return {
    email: buildAddress(firstName, lastName, primaryDomain),
    alternativeEmail: buildAddress(firstName, lastName, altDomain, true),
  };
}

/* ── Helpers ─────────────────────────────────────────────────────────── */

function buildAddress(
  first: string,
  last: string,
  domain: string,
  useAltPattern = false,
): string {
  const f = first.toLowerCase();
  const l = last.toLowerCase();
  const suffix = String(Math.floor(Math.random() * 90) + 10); // 10–99

  const patterns = [
    () => `${f}.${l}${suffix}@${domain}`,
    () => `${f[0]}.${l}${suffix}@${domain}`,
    () => `${f}${l}${suffix}@${domain}`,
    () => `${f}.${l}@${domain}`,
    () => `${f[0]}${l}@${domain}`,
  ];

  const idx = useAltPattern
    ? Math.floor(Math.random() * patterns.length)
    : 0;

  return patterns[idx]();
}

function shuffle<T>(arr: T[]): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}
