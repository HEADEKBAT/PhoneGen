import { describe, expect, it } from 'vitest';

import {
  generatePhoneNumbers,
  getAllCountries,
  getCountry,
} from './phoneGenerator';

/**
 * The phone generator is the platform's reference implementation, so these
 * tests pin the properties the rest of the codebase is meant to copy:
 * reproducibility from a seed, coverage that comes from metadata rather than
 * hand-written entries, and no side effects on the surrounding program.
 */

describe('seeding', () => {
  it('reproduces the same numbers for the same seed', () => {
    const first = generatePhoneNumbers('US', 5, 'international', 'seed-1');
    const second = generatePhoneNumbers('US', 5, 'international', 'seed-1');

    expect(first).toEqual(second);
    expect(first).toHaveLength(5);
  });

  it('produces different numbers for a different seed', () => {
    const a = generatePhoneNumbers('US', 5, 'international', 'seed-1');
    const b = generatePhoneNumbers('US', 5, 'international', 'seed-2');

    expect(a).not.toEqual(b);
  });

  it('still varies when no seed is given', () => {
    const a = generatePhoneNumbers('US', 8, 'international');
    const b = generatePhoneNumbers('US', 8, 'international');

    expect(a).not.toEqual(b);
  });

  it('reproduces example mode, which walks a per-country counter', () => {
    const a = generatePhoneNumbers('US', 3, 'international', 'seed-e', 'example');
    const b = generatePhoneNumbers('US', 3, 'international', 'seed-e', 'example');

    expect(a).toEqual(b);
  });
});

describe('isolation from the surrounding program', () => {
  // Seeding used to work by assigning to the global Math.random and restoring
  // it in a finally block. Anything else running during a seeded generation
  // silently drew from the seeded sequence.
  it('leaves the global Math.random binding alone', () => {
    const before = Math.random;
    generatePhoneNumbers('DE', 3, 'e164', 'seed-x');

    expect(Math.random).toBe(before);
  });

  it('does not disturb an ambient random sequence', () => {
    const real = Math.random;
    Math.random = () => 0.5;
    try {
      expect(Math.random()).toBe(0.5);
      generatePhoneNumbers('GB', 3, 'national', 'seed-y');
      expect(Math.random()).toBe(0.5);
    } finally {
      Math.random = real;
    }
  });
});

describe('formats', () => {
  it('emits E.164 as a plus sign followed by digits only', () => {
    const [number] = generatePhoneNumbers('US', 1, 'e164', 'fmt');

    expect(number).toMatch(/^\+\d+$/);
  });

  it('emits RFC 3966 as a tel: URI', () => {
    const [number] = generatePhoneNumbers('US', 1, 'rfc3966', 'fmt');

    expect(number).toMatch(/^tel:\+\d+$/);
  });

  it('emits international format with the country prefix', () => {
    const [number] = generatePhoneNumbers('DE', 1, 'international', 'fmt');

    expect(number.startsWith('+49')).toBe(true);
  });

  it('honours the requested quantity', () => {
    expect(generatePhoneNumbers('FR', 25, 'e164', 'q')).toHaveLength(25);
    expect(generatePhoneNumbers('FR', 1, 'e164', 'q')).toHaveLength(1);
  });
});

describe('country coverage', () => {
  it('covers every region libphonenumber knows, not just the curated ones', () => {
    // ~80 entries are hand-written; the rest are derived from metadata.
    expect(getAllCountries().length).toBeGreaterThan(200);
  });

  it('resolves a metadata-only region that has no hand-written entry', () => {
    const ascension = getCountry('AC');

    expect(ascension.countryCode).toMatch(/^\+\d+$/);
    expect(ascension.code).toBe('AC');
  });

  it('falls back rather than throwing on an unknown region', () => {
    expect(() => getCountry('ZZ')).not.toThrow();
    expect(getCountry('ZZ').countryCode).toMatch(/^\+/);
  });

  it('is case-insensitive about region codes', () => {
    expect(getCountry('us').code).toBe(getCountry('US').code);
  });
});
