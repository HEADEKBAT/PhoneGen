/**
 * Which other country pages a country page should link to.
 *
 * Until now each of the ~1470 country URLs was a dead end: it carried the
 * long-tail intent ("us phone number generator"), ranked for it, and then
 * offered the visitor — and the crawler — no way onward except the browser's
 * back button. The `<select>` at the top navigates, but a crawler cannot use
 * one, so nothing on the site linked to the other 244 pages.
 *
 * ── What counts as related ──────────────────────────────────────────────────
 *
 * Only one relation here is a real fact about numbering: sharing a calling
 * code. +1 is the North American Numbering Plan — the United States, Canada
 * and twenty Caribbean regions really do dial alike, and that is worth a link
 * and worth saying out loud. Alphabetical neighbours are not a relation at
 * all (Germany next to Ghana encodes nothing), so they are not offered; the
 * second group is simply the countries people ask for most.
 */

import { getAllRegionCodes, getCountryInfo, getLocalizedCountryName } from '@/lib/countryRegistry';
import { POPULAR_PHONE_COUNTRIES } from '@/lib/config/productLanding';

export interface RelatedCountry {
  iso: string;
  name: string;
  /** Calling code with the plus. */
  callingCode: string;
}

export interface RelatedCountries {
  /** Regions on the same calling code. Empty when the code is exclusive. */
  sameCode: RelatedCountry[];
  /** The popular list, minus this country and anything already above. */
  popular: RelatedCountry[];
  /** This country's calling code, for the group's heading. */
  callingCode: string;
}

/** A calling code can be shared by two dozen regions; a list of links is not a directory. */
const MAX_SAME_CODE = 8;

function describe(locale: string, iso: string): RelatedCountry | null {
  const info = getCountryInfo(iso);
  if (!info) return null;
  return {
    iso: info.isoCode,
    name: getLocalizedCountryName(locale, info.isoCode),
    callingCode: `+${info.countryCode}`,
  };
}

export function getRelatedCountries(locale: string, iso: string): RelatedCountries {
  const upper = iso.toUpperCase();
  const info = getCountryInfo(upper);
  const callingCode = info ? `+${info.countryCode}` : '';

  const sameCode = info
    ? getAllRegionCodes()
        .filter((code) => code !== upper && getCountryInfo(code)?.countryCode === info.countryCode)
        .map((code) => describe(locale, code))
        .filter((country): country is RelatedCountry => country !== null)
        /* By name, so the list reads like a list rather than like the ISO
           codes it happens to be sorted by underneath. */
        .sort((a, b) => a.name.localeCompare(b.name, locale))
        .slice(0, MAX_SAME_CODE)
    : [];

  const taken = new Set([upper, ...sameCode.map((country) => country.iso)]);
  const popular = POPULAR_PHONE_COUNTRIES.filter((code) => !taken.has(code))
    .map((code) => describe(locale, code))
    .filter((country): country is RelatedCountry => country !== null);

  return { sameCode, popular, callingCode };
}

/** Every region, named and sorted, for the landing's full index. */
export function getAllCountries(locale: string): RelatedCountry[] {
  return getAllRegionCodes()
    .map((code) => describe(locale, code))
    .filter((country): country is RelatedCountry => country !== null)
    .sort((a, b) => a.name.localeCompare(b.name, locale));
}
