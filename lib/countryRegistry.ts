/**
 * Country Registry — single source of truth for all supported regions.
 *
 * Powered by libphonenumber-js metadata. Not a single country code is
 * hardcoded here — every region comes from the official Google dataset.
 *
 * Usage (server-only):
 *   getLocalizedCountryName('en', 'US') → "United States"
 *   getLocalizedCountryName('ru', 'US') → "Соединенные Штаты"
 *   getAllRegionCodes()                 → ['AC', 'AD', 'AE', …]
 *   isSupportedRegion('US')            → true
 *   getFlagEmoji('DE')                 → "🇩🇪"
 */

import { PHONE_METADATA } from './phoneMetadata';

export interface CountryInfo {
  isoCode: string;
  countryCode: string;
  possibleLengths: number[];
  primaryLength: number;
  nationalPattern: string;
  exampleNumber: string;
}

/* ── Region list (pure metadata — no manual entries) ─────────────────── */

/** All ISO codes libphonenumber-js supports (245+ regions). */
const ALL_REGIONS = Object.keys(PHONE_METADATA);

/**
 * Sorted stable region list. Sorting ensures deterministic output
 * across builds and environments.
 */
const SORTED_REGIONS = [...ALL_REGIONS].sort();

/* ── Public API ─────────────────────────────────────────────────────── */

/** Get every region code libphonenumber-js supports, sorted. */
export function getAllRegionCodes(): string[] {
  return SORTED_REGIONS;
}

/** Check whether a region code is supported. */
export function isSupportedRegion(isoCode: string): boolean {
  return isoCode.toUpperCase() in PHONE_METADATA;
}

/** Get metadata for a specific country. */
export function getCountryInfo(isoCode: string): CountryInfo | undefined {
  const meta = PHONE_METADATA[isoCode.toUpperCase()];
  if (!meta) return undefined;
  return {
    isoCode: meta.isoCode,
    countryCode: meta.countryCode,
    possibleLengths: meta.possibleLengths,
    primaryLength: meta.primaryLength,
    nationalPattern: meta.nationalPattern,
    exampleNumber: meta.exampleNumber,
  };
}

/** Default country used when no country segment is provided. */
export function getDefaultCountry(): string {
  return SORTED_REGIONS.includes('US') ? 'US' : SORTED_REGIONS[0] || 'US';
}

/**
 * ISO 3166-1 Alpha-2 → emoji flag.
 * Derived algorithmically (no lookup table).
 */
export function getFlagEmoji(isoCode: string): string {
  const base = 0x1f1e6;
  const code = isoCode.toUpperCase();
  return String.fromCodePoint(
    ...code.split('').map((c) => base + c.charCodeAt(0) - 65),
  );
}

/**
 * Localized country name via Intl.DisplayNames (server-side only).
 *
 * Falls back to the ISO code when the display name isn't available
 * (e.g. for some non-standard libphonenumber regions).
 */
export function getLocalizedCountryName(
  locale: string,
  isoCode: string,
): string {
  try {
    const display = new Intl.DisplayNames(locale.split('-')[0], {
      type: 'region',
    }).of(isoCode.toUpperCase());
    return display || isoCode.toUpperCase();
  } catch {
    return isoCode.toUpperCase();
  }
}
