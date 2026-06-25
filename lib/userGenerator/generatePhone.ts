/**
 * UserGen — phone number generator.
 *
 * Delegates to PhoneGen's COUNTRY data for authentic phone numbers.
 * This is intentional: Faker phone numbers don't match PhoneGen's
 * validated format, and reusing PhoneGen keeps the ecosystem consistent.
 */

import { COUNTRIES } from '@/lib/phoneGenerator';

/**
 * Generate an international-format phone number for the given country.
 *
 * @param countryCode ISO 3166-1 alpha-2 code
 * @returns           Phone in international format (e.g. "+1 (555) 123-4567")
 *                    or empty string if the country isn't in PhoneGen.
 */
export function generatePhone(countryCode: string): string {
  const country = COUNTRIES[countryCode];
  if (!country) return '';

  return country.formats.international(country.generateNumber());
}
