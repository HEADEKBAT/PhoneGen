/**
 * Address Generator — standalone engine.
 *
 * Generates locale-aware addresses using Faker, with optional
 * supplementary data for enhanced regional coverage.
 */

import { getFakerForCountry, COUNTRY_NAMES } from './country';
import type { Faker } from '@faker-js/faker';

/* ── Types ──────────────────────────────────────────────────────────────── */

export interface AddressResult {
  country: string;
  countryCode: string;
  region: string;
  city: string;
  street: string;
  streetNumber: string;
  postalCode: string;
  fullAddress: string;
  lat?: number;
  lng?: number;
}

export interface AddressOptions {
  country?: string;
  includeLatLng?: boolean;
}

export interface BulkAddressOptions extends AddressOptions {
  quantity: number;
}

/* ── Generator ──────────────────────────────────────────────────────────── */

/**
 * Generate a single address for the given country.
 */
export function generateAddress(options: AddressOptions = {}): AddressResult {
  const countryCode = options.country ?? 'US';
  const faker: Faker = getFakerForCountry(countryCode);

  const country = COUNTRY_NAMES[countryCode] ?? countryCode;
  const region = faker.location.state();
  const city = faker.location.city();
  const street = faker.location.street();
  const streetNumber = String(faker.number.int({ min: 1, max: 999 }));
  const postalCode = faker.location.zipCode();
  const fullAddress = `${street} ${streetNumber}, ${postalCode} ${city}, ${region}, ${country}`;

  let lat: number | undefined;
  let lng: number | undefined;
  if (options.includeLatLng) {
    lat = faker.location.latitude();
    lng = faker.location.longitude();
  }

  return { country, countryCode, region, city, street, streetNumber, postalCode, fullAddress, lat, lng };
}

/**
 * Generate multiple addresses.
 */
export function generateAddresses(options: BulkAddressOptions): AddressResult[] {
  const results: AddressResult[] = [];
  for (let i = 0; i < options.quantity; i++) {
    results.push(generateAddress(options));
  }
  return results;
}
