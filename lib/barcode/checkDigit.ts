/**
 * Check Digit Calculator.
 *
 * Pure functions for computing and explaining check digits for
 * EAN-13, EAN-8, UPC-A, GTIN, ISBN-10, ISBN-13, ISSN, and ISMN.
 *
 * All weight-based (alternating 1/3 or 3/1) except ISBN-10 which uses
 * weighted sum mod 11.
 */

import {
  type BarcodeType,
  type CheckDigitExplanation,
  BARCODE_DISPLAY_NAMES,
} from './types';

type CheckDigitAlgo = 'ean-upc' | 'isbn10';

function algoForType(type: BarcodeType): CheckDigitAlgo | null {
  switch (type) {
    case 'ean13':
    case 'ean8':
    case 'upca':
    case 'upce':
    case 'gtin':
    case 'isbn13':
    case 'issn':
    case 'ismn':
      return 'ean-upc';
    case 'isbn10':
      return 'isbn10';
    default:
      return null;
  }
}

/**
 * Calculate check digit using the EAN/UPC algorithm (weights 1/3).
 */
function eanUpcCheckDigit(digits: number[]): number {
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    // Weights: 3 for odd positions (1-indexed), 1 for even positions
    const weight = (i % 2 === 0) ? 3 : 1;
    sum += digits[i] * weight;
  }
  const mod = (10 - (sum % 10)) % 10;
  return mod;
}

/**
 * Calculate check digit using ISBN-10 algorithm (weighted sum mod 11).
 */
function isbn10CheckDigit(digits: number[]): string {
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    sum += digits[i] * (10 - i);
  }
  const rem = sum % 11;
  const cd = rem === 0 ? 0 : 11 - rem;
  return cd === 10 ? 'X' : String(cd);
}

/**
 * Calculate the check digit for a given barcode data and type.
 *
 * @param data  The barcode data WITHOUT the check digit.
 * @param type  Barcode symbology.
 * @returns     The computed check digit character.
 */
export function calculateCheckDigit(data: string, type: BarcodeType): string {
  const clean = data.replace(/\D/g, '');
  const digits = clean.split('').map(Number);
  const algo = algoForType(type);

  if (!algo) return '';

  if (algo === 'ean-upc') {
    return String(eanUpcCheckDigit(digits));
  }

  return isbn10CheckDigit(digits);
}

/**
 * Validate whether the check digit in a full code is correct.
 */
export function validateCheckDigit(
  code: string,
  type: BarcodeType,
): { valid: boolean; expected: string; actual: string } {
  const clean = code.replace(/\D/g, '');
  if (clean.length < 2) return { valid: false, expected: '', actual: clean };

  const actual = clean[clean.length - 1];
  const dataWithoutCd = clean.slice(0, -1);
  const expected = calculateCheckDigit(dataWithoutCd, type);

  return {
    valid: actual === expected,
    expected,
    actual,
  };
}

/**
 * Generate a full, human-readable step-by-step explanation of how the
 * check digit was calculated for a given barcode code.
 */
export function explainCheckDigit(code: string, type: BarcodeType): CheckDigitExplanation | null {
  const clean = code.replace(/\D/g, '');
  const algo = algoForType(type);
  if (!algo) return null;

  const dataWithoutCd = clean.slice(0, -1);
  const actualCd = clean[clean.length - 1];
  const digits = dataWithoutCd.split('').map(Number);

  if (algo === 'ean-upc') {
    const steps: string[] = [];
    steps.push(`1. Take the first ${digits.length} digits: ${dataWithoutCd}`);

    const weighted = digits.map((d, i) => {
      const weight = (i % 2 === 0) ? 3 : 1;
      return { d, weight, product: d * weight };
    });

    const weightDesc = weighted.map(w => `${w.d} × ${w.weight}`).join(' + ');
    steps.push(`2. Apply weights (alternating 3, 1, 3, 1…): ${weightDesc}`);

    const sum = weighted.reduce((s, w) => s + w.product, 0);
    steps.push(`3. Sum of weighted digits: ${sum}`);

    const mod = sum % 10;
    const cd = (10 - mod) % 10;
    steps.push(`4. ${sum} ÷ 10 = ${Math.floor(sum / 10)} remainder ${mod}`);
    steps.push(`5. Check digit: (10 - ${mod}) mod 10 = ${cd}`);

    const expectedCd = String(cd);

    return {
      input: dataWithoutCd,
      checkDigit: expectedCd,
      fullCode: dataWithoutCd + expectedCd,
      type,
      steps,
    };
  }

  if (algo === 'isbn10') {
    const steps: string[] = [];
    steps.push(`1. Take the first ${digits.length} digits: ${dataWithoutCd}`);

    const weighted = digits.map((d, i) => {
      const weight = 10 - i;
      return { d, weight, product: d * weight };
    });

    const weightDesc = weighted.map(w => `${w.d} × ${w.weight}`).join(' + ');
    steps.push(`2. Apply weights (10, 9, 8, …, 1): ${weightDesc}`);

    const sum = weighted.reduce((s, w) => s + w.product, 0);
    steps.push(`3. Sum of weighted digits: ${sum}`);

    const rem = sum % 11;
    const cd = rem === 0 ? 0 : 11 - rem;
    const cdStr = cd === 10 ? 'X' : String(cd);
    steps.push(`4. ${sum} ÷ 11 = ${Math.floor(sum / 11)} remainder ${rem}`);
    steps.push(`5. Check digit: (11 - ${rem}) mod 11 = ${cdStr}`);

    return {
      input: dataWithoutCd,
      checkDigit: cdStr,
      fullCode: dataWithoutCd + cdStr,
      type,
      steps,
    };
  }

  return null;
}
