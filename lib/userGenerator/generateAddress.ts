/**
 * UserGen — address generator.
 *
 * Uses the locale-aware Faker instance so street formats, city names,
 * and postal code patterns feel authentic for the selected country.
 */

import type { Faker } from '@faker-js/faker';
import { COUNTRY_NAMES } from './countryLocaleMap';

export interface AddressResult {
  country: string;
  countryCode: string;
  city: string;
  street: string;
  postalCode: string;
  fullAddress: string;
}

/**
 * Generate a realistic address for the given country.
 *
 * @param faker       Locale-aware Faker instance
 * @param countryCode ISO 3166-1 alpha-2 code
 */
export function generateAddress(faker: Faker, countryCode: string): AddressResult {
  const country = COUNTRY_NAMES[countryCode] ?? countryCode;
  const city = faker.location.city();
  const street = faker.location.streetAddress();
  const postalCode = faker.location.zipCode();
  const fullAddress = `${street}, ${postalCode} ${city}, ${country}`;

  return { country, countryCode, city, street, postalCode, fullAddress };
}
