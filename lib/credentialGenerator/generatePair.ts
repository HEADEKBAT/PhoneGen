/**
 * Credential pairs generator.
 * Produces {username, password} pairs for QA testing.
 * Username is generated using UserGen's name logic (via Faker locale).
 * Password uses the new random password engine.
 */

import { getFakerForCountry } from '@/lib/userGenerator/countryLocaleMap';
import { generateRandomPassword } from './generatePassword';
import type { PairOptions } from './types';

export interface CredentialPair {
  username: string;
  password: string;
}

/* ── Helpers ──────────────────────────────────────────────────────────── */

function randomInt(max: number): number {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0] % max;
}

function generateUsername(faker: ReturnType<typeof getFakerForCountry>): string {
  // Use Faker for locale-appropriate names, then derive username
  const firstName = faker.person.firstName().toLowerCase();
  const lastName = faker.person.lastName().toLowerCase();

  // Pattern: firstname.lastname## or firstname.lastname or firstinitial.lastname
  const pattern = randomInt(3);
  switch (pattern) {
    case 0:
      return `${firstName}.${lastName}${randomInt(99)}`;
    case 1:
      return `${firstName}.${lastName}`;
    case 2:
      return `${firstName[0]}${lastName}${randomInt(999)}`;
    default:
      return `${firstName}.${lastName}`;
  }
}

/* ── Generator ────────────────────────────────────────────────────────── */

export function generateCredentialPair(country: string): CredentialPair {
  const faker = getFakerForCountry(country);

  return {
    username: generateUsername(faker),
    password: generateRandomPassword({
      length: 16,
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: true,
      avoidAmbiguous: true,
    }),
  };
}

export function generateCredentialPairs(options: PairOptions): CredentialPair[] {
  const { quantity, country } = options;
  const pairs: CredentialPair[] = [];

  for (let i = 0; i < quantity; i++) {
    pairs.push(generateCredentialPair(country));
  }

  return pairs;
}
