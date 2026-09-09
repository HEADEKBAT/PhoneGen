/**
 * Payment Profile Definitions — Realistic test profiles by country & type.
 *
 * Each profile defines locale-aware defaults: holder name patterns, address
 * formats, currency, phone formats, and email domains.
 */

import type { AddressInfo, PaymentProfile } from './types';
import { generatePAN } from './luhn';
import { getNetworkBIN } from './cardNetworks';

/* ── Profile configs ─────────────────────────────────────────────────────────── */

export interface ProfileConfig {
  label: string;
  countryCode: string;
  currency: string;
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  emailDomain: string;
}

const PROFILES: Record<string, ProfileConfig> = {
  'us-personal': {
    label: 'US Personal',
    countryCode: 'US',
    currency: 'USD',
    firstName: 'John',
    lastName: 'Doe',
    street: '123 Main Street',
    city: 'New York',
    state: 'NY',
    zip: '10001',
    country: 'United States',
    phone: '+1 (212) 555-0198',
    emailDomain: 'example.com',
  },
  'us-business': {
    label: 'US Business',
    countryCode: 'US',
    currency: 'USD',
    firstName: 'Jane',
    lastName: 'Smith',
    street: '500 Park Avenue, Suite 1200',
    city: 'San Francisco',
    state: 'CA',
    zip: '94102',
    country: 'United States',
    phone: '+1 (415) 555-0421',
    emailDomain: 'business.com',
  },
  'eu-personal': {
    label: 'EU Personal',
    countryCode: 'DE',
    currency: 'EUR',
    firstName: 'Hans',
    lastName: 'Müller',
    street: 'Hauptstraße 42',
    city: 'Berlin',
    state: 'BE',
    zip: '10115',
    country: 'Germany',
    phone: '+49 30 5550123',
    emailDomain: 'example.de',
  },
  'eu-business': {
    label: 'EU Business',
    countryCode: 'FR',
    currency: 'EUR',
    firstName: 'Marie',
    lastName: 'Dubois',
    street: '15 Rue de la Paix',
    city: 'Paris',
    state: 'IDF',
    zip: '75002',
    country: 'France',
    phone: '+33 1 55 55 01 23',
    emailDomain: 'entreprise.fr',
  },
  'uk-personal': {
    label: 'UK Personal',
    countryCode: 'GB',
    currency: 'GBP',
    firstName: 'James',
    lastName: 'Wilson',
    street: '42 Baker Street',
    city: 'London',
    state: 'LDN',
    zip: 'NW1 6XE',
    country: 'United Kingdom',
    phone: '+44 20 7946 0123',
    emailDomain: 'example.co.uk',
  },
  'jp-personal': {
    label: 'Japan Personal',
    countryCode: 'JP',
    currency: 'JPY',
    firstName: 'Taro',
    lastName: 'Yamamoto',
    street: '1-2-3 Shibuya, Shibuya-ku',
    city: 'Tokyo',
    state: '13',
    zip: '150-0001',
    country: 'Japan',
    phone: '+81 3-5555-0123',
    emailDomain: 'example.jp',
  },
  'br-personal': {
    label: 'Brazil Personal',
    countryCode: 'BR',
    currency: 'BRL',
    firstName: 'Carlos',
    lastName: 'Silva',
    street: 'Av. Paulista, 1000',
    city: 'São Paulo',
    state: 'SP',
    zip: '01310-100',
    country: 'Brazil',
    phone: '+55 11 5555-0123',
    emailDomain: 'example.com.br',
  },
  'corporate-premium': {
    label: 'Corporate Premium',
    countryCode: 'US',
    currency: 'USD',
    firstName: 'Robert',
    lastName: 'Johnson',
    street: '1 Infinite Loop',
    city: 'Cupertino',
    state: 'CA',
    zip: '95014',
    country: 'United States',
    phone: '+1 (408) 555-0199',
    emailDomain: 'corp.net',
  },
};

/** Get all profile IDs */
export function getProfileIds(): string[] {
  return Object.keys(PROFILES);
}

/** Get all profiles */
export function getAllProfiles(): ProfileConfig[] {
  return Object.values(PROFILES);
}

/** Get a profile by ID */
export function getProfile(id: string): ProfileConfig | undefined {
  return PROFILES[id];
}

/** Get profile IDs for a specific country */
export function getProfilesByCountry(countryCode: string): string[] {
  return Object.entries(PROFILES)
    .filter(([, p]) => p.countryCode === countryCode)
    .map(([id]) => id);
}

/* ── Profile builder ─────────────────────────────────────────────────────────── */

/**
 * Build a full PaymentProfile from a profile config + generated card data.
 */
export function buildProfile(
  profileId: string,
  networkId: string,
  expiryMonth: string,
  expiryYear: string,
): PaymentProfile | null {
  const config = PROFILES[profileId];
  if (!config) return null;

  const bin = getNetworkBIN(networkId);
  const length = networkId === 'amex' ? 15 : 16;
  const pan = generatePAN(bin, length);
  const last4 = pan.slice(-4);
  const formattedPan = `${pan.slice(0, 4)} ${pan.slice(4, 8)} ${pan.slice(8, 12)} ${pan.slice(12)}`;
  const amexFormatted = networkId === 'amex'
    ? `${pan.slice(0, 4)} ${pan.slice(4, 10)} ${pan.slice(10)}`
    : formattedPan;

  // Generate CVV
  const cvvLength = networkId === 'amex' ? 4 : 3;
  const cvvBuf = new Uint8Array(cvvLength);
  crypto.getRandomValues(cvvBuf);
  const cvv = Array.from(cvvBuf).map((b) => (b % 10).toString()).join('');

  // Generate email
  const email = `${config.firstName.toLowerCase()}.${config.lastName.toLowerCase()}@${config.emailDomain}`;

  return {
    card: {
      pan,
      formattedPan: networkId === 'amex' ? amexFormatted : formattedPan,
      maskedPan: `${pan.slice(0, 4)} **** **** ${last4}`,
      network: networkId,
      holder: `${config.firstName} ${config.lastName}`,
      expiryMonth,
      expiryYear,
      expiryShort: `${expiryMonth}/${expiryYear.slice(2)}`,
      expiryFull: `${expiryMonth}/${expiryYear}`,
      cvv,
      bin: pan.slice(0, 6),
      last4,
      luhnValid: true,
    },
    email,
    phone: config.phone,
    address: {
      street: config.street,
      city: config.city,
      state: config.state,
      zip: config.zip,
      country: config.country,
      countryCode: config.countryCode,
    },
    currency: config.currency,
    label: config.label,
  };
}
