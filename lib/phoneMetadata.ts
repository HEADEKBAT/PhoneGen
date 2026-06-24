// ── Phone Metadata: derived from libphonenumber-js ──────────────────────
// This module reads libphonenumber-js mobile metadata to avoid duplicating
// phone number patterns manually. All data (country codes, national patterns,
// possible lengths, example numbers) comes directly from Google's
// libphonenumber dataset via the npm package.
//
// Metadata files used:
//   - metadata.mobile.json   → country code, national pattern, lengths
//   - examples.mobile.json   → one example NSN per country

// Note: libphonenumber-js ships .json.js wrappers (ESM re-exports) for metadata.
// Importing bare .json resolves through package.json exports to the .json.js file,
// which is a valid ES module — no 'with { type: "json" }' needed.
import mobileMetadata from 'libphonenumber-js/metadata.mobile.json';
import mobileExamples from 'libphonenumber-js/examples.mobile.json';

export interface PhoneMetadata {
  isoCode: string;
  /** Country calling code without "+" (e.g. "44", "1", "7") */
  countryCode: string;
  /** Regex pattern matching valid mobile NSNs (national significant number) */
  nationalPattern: string;
  /** All possible NSN lengths for mobile numbers in this country */
  possibleLengths: number[];
  /** The "primary" NSN length — typically the most common mobile length */
  primaryLength: number;
  /** A real example NSN from libphonenumber (e.g. "7400123456" for GB) */
  exampleNumber: string;
}

// The metadata JSON has positional array entries per country:
//   [0] countryCode (string)
//   [1] exitCode (string)
//   [2] nationalPattern (string — regex)
//   [3] possibleLengths (number[])
//   [4] formats (array of format entries)

const _raw = mobileMetadata as { countries: Record<string, unknown[]> };
const _examples = mobileExamples as Record<string, string>;

function buildMetadata(): Record<string, PhoneMetadata> {
  const result: Record<string, PhoneMetadata> = {};

  for (const iso of Object.keys(_raw.countries)) {
    const entry = _raw.countries[iso];
    const possibleLengths: number[] = entry[3] as number[];
    const exampleNsn = _examples[iso] || '';
    const primaryLength = exampleNsn.length || (possibleLengths.length > 0 ? possibleLengths[0] : 10);

    result[iso] = {
      isoCode: iso,
      countryCode: entry[0] as string,
      nationalPattern: entry[2] as string,
      possibleLengths,
      primaryLength,
      exampleNumber: exampleNsn,
    };
  }

  return result;
}

export const PHONE_METADATA = buildMetadata();

/**
 * Get metadata for a specific country by ISO code (case-insensitive).
 */
export function getPhoneMetadata(isoCode: string): PhoneMetadata | undefined {
  return PHONE_METADATA[isoCode.toUpperCase()];
}

/**
 * Get example NSN(s) for a country.
 * Returns a deterministic cycle if count > 1, otherwise a single example.
 */
const exampleCounters: Record<string, number> = {};

export function getExampleNumber(isoCode: string, examples?: string[]): string {
  const meta = getPhoneMetadata(isoCode);
  if (!meta || !meta.exampleNumber) return '';

  const counter = exampleCounters[isoCode] ?? 0;
  const next = (counter + 1) & 0x7fffffff;

  // If caller provided additional examples, cycle through them
  if (examples && examples.length > 0) {
    const all = [meta.exampleNumber, ...examples];
    exampleCounters[isoCode] = (counter + 1) % all.length;
    return all[counter % all.length];
  }

  // Single deterministic example
  exampleCounters[isoCode] = next;
  return meta.exampleNumber;
}

/** Reset example counters (for deterministic seeded generation). */
export function resetExampleCounters() {
  for (const key of Object.keys(exampleCounters)) {
    delete exampleCounters[key];
  }
}
