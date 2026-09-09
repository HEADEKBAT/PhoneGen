import { describe, expect, it } from 'vitest';

import {
  extractBIN,
  generateInvalidPAN,
  generatePAN,
  luhnCheckDigit,
  luhnValidate,
  maskPAN,
} from './luhn';

/**
 * The card numbers below are the standard test values published by the card
 * networks and by payment gateways. They are structurally valid and belong to
 * no account.
 */

const VALID = [
  ['79927398713', 'the textbook Luhn example'],
  ['4242424242424242', 'Stripe test Visa'],
  ['4539578763621486', 'Visa test number'],
  ['5555555555554444', 'Mastercard test number'],
  ['378282246310005', 'American Express test number'],
  ['6011111111111117', 'Discover test number'],
] as const;

describe('luhnValidate', () => {
  it.each(VALID)('accepts %s (%s)', (pan) => {
    expect(luhnValidate(pan)).toBe(true);
  });

  it('rejects a number with one digit changed', () => {
    expect(luhnValidate('79927398710')).toBe(false);
    expect(luhnValidate('4242424242424243')).toBe(false);
  });

  it('rejects empty and non-numeric input', () => {
    expect(luhnValidate('')).toBe(false);
    expect(luhnValidate('not-a-card')).toBe(false);
  });
});

describe('luhnCheckDigit', () => {
  it('completes a partial number so it validates', () => {
    expect(String(luhnCheckDigit('424242424242424'))).toBe('2');
    expect(String(luhnCheckDigit('7992739871'))).toBe('3');
  });

  it('agrees with luhnValidate for any partial number', () => {
    const partial = '453957876362148';
    const completed = partial + luhnCheckDigit(partial);

    expect(luhnValidate(completed)).toBe(true);
  });
});

describe('generatePAN', () => {
  it('honours the requested prefix and length', () => {
    const pan = generatePAN('4', 16);

    expect(pan).toHaveLength(16);
    expect(pan.startsWith('4')).toBe(true);
  });

  it('always produces a number that passes Luhn', () => {
    // Generated, not fixed: the property has to hold for every draw, and a
    // single fixture would hide a one-in-ten failure.
    for (let i = 0; i < 200; i++) {
      expect(luhnValidate(generatePAN('4', 16))).toBe(true);
    }
  });

  it('supports the 15-digit Amex length', () => {
    const pan = generatePAN('37', 15);

    expect(pan).toHaveLength(15);
    expect(luhnValidate(pan)).toBe(true);
  });
});

describe('generateInvalidPAN', () => {
  it('always produces a number that fails Luhn', () => {
    for (let i = 0; i < 200; i++) {
      expect(luhnValidate(generateInvalidPAN('4', 16))).toBe(false);
    }
  });
});

describe('formatting helpers', () => {
  it('reads the BIN from the leading digits', () => {
    expect(extractBIN('4242424242424242')).toBe('424242');
  });

  it('masks the middle but keeps the last four', () => {
    const masked = maskPAN('4242424242424242');

    expect(masked.endsWith('4242')).toBe(true);
    expect(masked).toContain('*');
  });
});
