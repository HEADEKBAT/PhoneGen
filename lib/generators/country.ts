/**
 * Country-to-Faker-locale mapping for standalone generators.
 *
 * Separate copy from `lib/userGenerator/countryLocaleMap.ts` to avoid
 * coupling new generators to the existing User Generator module.
 */

import {
  fakerEN_US,
  fakerEN_CA,
  fakerEN_GB,
  fakerEN_IN,
  fakerEN_NG,
  fakerEN_ZA,
  fakerFR,
  fakerDE,
  fakerES,
  fakerES_MX,
  fakerIT,
  fakerPT_PT,
  fakerPT_BR,
  fakerNL,
  fakerPL,
  fakerRU,
  fakerUK,
  fakerTR,
  fakerJA,
  fakerKO,
} from '@faker-js/faker';
import type { Faker } from '@faker-js/faker';

/**
 * Map of ISO 3166-1 alpha-2 country codes to Faker locale instances.
 */
export const FAKER_LOCALE_MAP: Record<string, Faker> = {
  US: fakerEN_US,
  CA: fakerEN_CA,
  GB: fakerEN_GB,
  FR: fakerFR,
  DE: fakerDE,
  ES: fakerES,
  IT: fakerIT,
  PT: fakerPT_PT,
  NL: fakerNL,
  PL: fakerPL,
  BR: fakerPT_BR,
  MX: fakerES_MX,
  AR: fakerES_MX,
  RU: fakerRU,
  UA: fakerUK,
  TR: fakerTR,
  IN: fakerEN_IN,
  JP: fakerJA,
  KR: fakerKO,
  NG: fakerEN_NG,
  ZA: fakerEN_ZA,
};

/** Ordered list of supported country codes. */
export const SUPPORTED_COUNTRY_CODES = Object.keys(FAKER_LOCALE_MAP);

/**
 * Get the Faker instance for a given country code.
 * Falls back to `fakerEN_US` when the country isn't mapped.
 */
export function getFakerForCountry(code: string): Faker {
  return FAKER_LOCALE_MAP[code] ?? fakerEN_US;
}

/**
 * Full country names keyed by ISO code.
 */
export const COUNTRY_NAMES: Record<string, string> = {
  US: 'United States',
  CA: 'Canada',
  GB: 'United Kingdom',
  FR: 'France',
  DE: 'Germany',
  ES: 'Spain',
  IT: 'Italy',
  PT: 'Portugal',
  NL: 'Netherlands',
  PL: 'Poland',
  BR: 'Brazil',
  MX: 'Mexico',
  AR: 'Argentina',
  RU: 'Russia',
  UA: 'Ukraine',
  TR: 'Turkey',
  IN: 'India',
  JP: 'Japan',
  KR: 'South Korea',
  NG: 'Nigeria',
  ZA: 'South Africa',
};
