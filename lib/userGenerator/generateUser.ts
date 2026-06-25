/**
 * UserGen — user-profile orchestrator.
 *
 * Calls every sub-generator and assembles the result into a single
 * `GeneratedUser` object. Exported as `generateUser` and `generateUsers`.
 */

import { getFakerForCountry } from './countryLocaleMap';
import { generateName } from './generateName';
import { generateAddress } from './generateAddress';
import { generateCompany } from './generateCompany';
import { generateEmail } from './generateEmail';
import { generateInternet } from './generateInternet';
import { generatePhone } from './generatePhone';
import { generateAvatar } from './generateAvatar';
import { generatePassword } from './generatePassword';
import type { GeneratedUser, GenerateOptions } from './types';

let _counter = 0;

/**
 * Generate a single realistic user profile.
 */
export function generateUser(options: GenerateOptions): GeneratedUser {
  const faker = getFakerForCountry(options.country);

  /* ── Name + gender ──────────────────────────────────────────────── */
  const name = generateName(faker, options.gender);

  /* ── Birth date + age ───────────────────────────────────────────── */
  const ageMin = options.ageMin ?? 18;
  const ageMax = Math.min(options.ageMax ?? 65, 99);
  const birthDate = faker.date.birthdate({ min: ageMin, max: ageMax, mode: 'age' });
  const age = computeAge(birthDate);

  /* ── Address ────────────────────────────────────────────────────── */
  const address = generateAddress(faker, options.country);

  /* ── Business ───────────────────────────────────────────────────── */
  const company = generateCompany(faker, name.firstName);

  /* ── Contact ────────────────────────────────────────────────────── */
  const { email, alternativeEmail } = generateEmail(name.firstName, name.lastName);
  const phone = generatePhone(options.country);

  /* ── Internet ───────────────────────────────────────────────────── */
  const internet = generateInternet(faker, name.fullName, name.firstName);

  /* ── Security ───────────────────────────────────────────────────── */
  const password = generatePassword(name.firstName);

  /* ── Avatar ─────────────────────────────────────────────────────── */
  const avatar = generateAvatar(`${name.firstName}${name.lastName}`);

  /* ── ID ─────────────────────────────────────────────────────────── */
  _counter += 1;
  const seed = options.seed ?? 'ug';
  const id = `${seed}-${_counter}-${internet.uuid.slice(0, 8)}`;

  return {
    id,
    avatar,

    firstName: name.firstName,
    lastName: name.lastName,
    fullName: name.fullName,
    gender: name.gender,

    birthDate: birthDate.toISOString(),
    age,

    email,
    alternativeEmail,
    phone,

    username: internet.username,
    displayName: internet.displayName,
    password,

    country: address.country,
    countryCode: address.countryCode,
    city: address.city,
    street: address.street,
    postalCode: address.postalCode,
    fullAddress: address.fullAddress,

    company: company.company,
    department: company.department,
    jobTitle: company.jobTitle,
    website: company.website,

    ipAddress: internet.ipAddress,
    macAddress: internet.macAddress,
    uuid: internet.uuid,
  };
}

/**
 * Bulk-generate multiple user profiles.
 *
 * Performance target: 100 users in < 100 ms (synchronous, all in-memory).
 */
export function generateUsers(options: GenerateOptions): GeneratedUser[] {
  /* Reset counter for each bulk call so IDs are 1..N */
  _counter = 0;

  const users: GeneratedUser[] = [];
  for (let i = 0; i < options.quantity; i++) {
    users.push(generateUser(options));
  }
  return users;
}

/* ── Helpers ─────────────────────────────────────────────────────────── */

function computeAge(birthDate: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}
