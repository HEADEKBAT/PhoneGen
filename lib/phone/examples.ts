/**
 * Real example numbers, formatted on the server.
 *
 * Every number the landing shows comes from Google's libphonenumber dataset —
 * the same dataset the generator validates against — rather than from a hand
 * written list that would drift from it. `PHONE_METADATA` carries one example
 * national number per region; this formats it the three ways the tool offers.
 *
 * ── Why the server does it ──────────────────────────────────────────────────
 *
 * `libphonenumber-js` and its metadata are a few hundred kilobytes. A landing
 * page that only needs to *show* eight numbers has no reason to ship a parser
 * to do it: the strings are computed here and handed to the client as props.
 * The country pages load the real generator, where it is earned.
 */

import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { getCountryInfo, getLocalizedCountryName } from '@/lib/countryRegistry';

export interface PhoneExample {
  iso: string;
  /** "+1 201 555 0123" */
  international: string;
  /** "(201) 555-0123" */
  national: string;
  /** "+12015550123" */
  e164: string;
  /** Calling code with the plus, for the label. */
  callingCode: string;
  /** Digits in the national number. */
  digits: number;
}

/**
 * Formats one region's example number, or null when libphonenumber has none
 * or refuses to parse it — a handful of the 245 regions are in that state, and
 * a card rendering "undefined" is worse than a card that is not there.
 */
export function getPhoneExample(iso: string): PhoneExample | null {
  const info = getCountryInfo(iso);
  if (!info?.exampleNumber) return null;

  const parsed = parsePhoneNumberFromString(`+${info.countryCode}${info.exampleNumber}`);
  if (!parsed) return null;

  return {
    iso: iso.toUpperCase(),
    international: parsed.formatInternational(),
    national: parsed.formatNational(),
    e164: parsed.number,
    callingCode: `+${info.countryCode}`,
    digits: info.exampleNumber.length,
  };
}

/** The same, for a list of regions, dropping the ones that cannot be formatted. */
export function getPhoneExamples(isoCodes: string[]): PhoneExample[] {
  return isoCodes
    .map(getPhoneExample)
    .filter((example): example is PhoneExample => example !== null);
}

/** An example plus the country name a card needs to label it. */
export interface PhoneCountryExample extends PhoneExample {
  /** Country name in the visitor's language. */
  name: string;
}

/**
 * The same list, localized.
 *
 * `getLocalizedCountryName` goes through `Intl.DisplayNames`, which every
 * runtime has but which resolves against the *server's* ICU data — so the
 * names are resolved here, once, rather than in six client bundles.
 */
export function getPhoneCountryExamples(
  locale: string,
  isoCodes: string[],
): PhoneCountryExample[] {
  return getPhoneExamples(isoCodes).map((example) => ({
    ...example,
    name: getLocalizedCountryName(locale, example.iso),
  }));
}
