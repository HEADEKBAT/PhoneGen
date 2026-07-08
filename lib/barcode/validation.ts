/**
 * Barcode Validator.
 *
 * Detects barcode type from raw input and validates the code,
 * including check digit verification.
 */

import {
  type BarcodeType,
  type ValidationResult,
  BARCODE_DISPLAY_NAMES,
} from './types';
import { validateCheckDigit } from './checkDigit';

/** Known barcode patterns for auto-detection. */
const PATTERNS: { type: BarcodeType; regex: RegExp; length: number }[] = [
  { type: 'isbn13',  regex: /^97[89]\d{10}$/, length: 13 },
  { type: 'isbn10',  regex: /^\d{9}[\dX]$/, length: 10 },
  { type: 'issn',    regex: /^\d{7}[\dX]$/, length: 8 },
  { type: 'ismn',    regex: /^M\d{9}$/, length: 10 },
  { type: 'ean13',   regex: /^\d{13}$/, length: 13 },
  { type: 'ean8',    regex: /^\d{8}$/, length: 8 },
  { type: 'upca',    regex: /^\d{12}$/, length: 12 },
  { type: 'upce',    regex: /^\d{8}$/, length: 8 },
  { type: 'gtin',    regex: /^\d{14}$/, length: 14 },
  { type: 'itf14',   regex: /^\d{14}$/, length: 14 },
  { type: 'code128', regex: /^[\x00-\x7F]+$/, length: -1 },  // any length, ASCII
  { type: 'code39',  regex: /^[A-Z0-9\-\.\$\/\+\%\s]+$/, length: -1 },
  { type: 'code93',  regex: /^[\x00-\x7F]+$/, length: -1 },
  { type: 'codabar', regex: /^[A-D][0-9\-\.\$:\/\+\d]+[A-D]$/, length: -1 },
  { type: 'pharmacode', regex: /^\d{3,6}$/, length: -1 },
];

/**
 * Detect the most likely barcode type from raw input.
 */
export function detectType(code: string): BarcodeType | null {
  const clean = code.trim();
  for (const p of PATTERNS) {
    if (p.length > 0 && clean.length !== p.length) continue;
    if (p.regex.test(clean)) return p.type;
  }
  return null;
}

/**
 * Validate a barcode code.
 *
 * @param code  Raw barcode string.
 * @param type  Optional — if provided, validates against this type.
 *              If omitted, auto-detects.
 */
export function validateBarcode(code: string, type?: BarcodeType): ValidationResult {
  const clean = code.trim();
  const errors: string[] = [];

  if (!clean) {
    return {
      code: '',
      detectedType: null,
      valid: false,
      length: 0,
      errors: ['No code provided'],
    };
  }

  const detectedType = type ?? detectType(clean);

  if (!detectedType) {
    return {
      code: clean,
      detectedType: null,
      valid: false,
      length: clean.length,
      errors: ['Unable to detect barcode type', 'Code does not match any known format'],
    };
  }

  // Length check for fixed-length types
  const pattern = PATTERNS.find(p => p.type === detectedType);
  if (pattern && pattern.length > 0 && clean.length !== pattern.length) {
    errors.push(
      `${BARCODE_DISPLAY_NAMES[detectedType]} must be exactly ${pattern.length} characters (got ${clean.length})`,
    );
  }

  // Check digit validation
  let checkDigitResult: { valid: boolean; expected: string; actual: string } | undefined;
  const cdTypes: BarcodeType[] = ['ean13', 'ean8', 'upca', 'upce', 'gtin', 'isbn13', 'isbn10', 'issn', 'ismn', 'itf14'];
  if (cdTypes.includes(detectedType)) {
    checkDigitResult = validateCheckDigit(clean, detectedType);
    if (!checkDigitResult.valid) {
      errors.push(
        `Check digit is invalid: expected ${checkDigitResult.expected}, got ${checkDigitResult.actual}`,
      );
    }
  }

  return {
    code: clean,
    detectedType,
    valid: errors.length === 0,
    checkDigit: checkDigitResult,
    length: clean.length,
    errors,
  };
}
