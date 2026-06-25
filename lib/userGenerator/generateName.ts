/**
 * UserGen — name generator.
 *
 * Uses the locale-aware Faker instance to produce realistic names
 * that match the selected country.
 */

import type { Faker } from '@faker-js/faker';

export interface NameResult {
  firstName: string;
  lastName: string;
  fullName: string;
  gender: 'male' | 'female';
}

/**
 * Generate a realistic name for the given country's locale.
 *
 * @param faker  Locale-aware Faker instance
 * @param gender Optional gender hint ('male' | 'female' | 'any')
 */
export function generateName(
  faker: Faker,
  gender?: 'male' | 'female' | 'any',
): NameResult {
  const sex = gender === 'any' || !gender
    ? (Math.random() > 0.5 ? 'male' : 'female')
    : gender;

  const firstName = faker.person.firstName(sex);
  const lastName = faker.person.lastName();
  const fullName = `${firstName} ${lastName}`;

  return { firstName, lastName, fullName, gender: sex };
}
