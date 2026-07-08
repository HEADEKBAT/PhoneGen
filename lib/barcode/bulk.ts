/**
 * Bulk Barcode Generator.
 *
 * Generates arrays of barcodes in sequential or random mode.
 * Results are ready for CSV / JSON / TXT export.
 */

import { type BarcodeType, type BulkConfig, type BarcodeResult, BARCODE_DISPLAY_NAMES } from './types';
import { generateBarcode } from './engine';
import { calculateCheckDigit } from './checkDigit';

/**
 * Generate a single barcode with auto-computed check digit for supported types.
 */
function makeOne(type: BarcodeType, digits: string): BarcodeResult {
  const cdTypes: BarcodeType[] = ['ean13', 'ean8', 'upca', 'upce', 'gtin', 'isbn13', 'issn', 'ismn', 'itf14'];
  const base = digits;
  const cd = cdTypes.includes(type) ? calculateCheckDigit(base, type) : '';
  const fullData = cd ? base + cd : base;

  return generateBarcode({ type, data: fullData });
}

/** Required data length (before check digit) for fixed-length barcode types. */
const DATA_LENGTH: Partial<Record<BarcodeType, number>> = {
  ean13: 12,
  ean8: 7,
  upca: 11,
  upce: 7,
  gtin: 12,
  isbn13: 12,
  isbn10: 9,
  issn: 7,
  ismn: 7,
  itf14: 13,
};

/**
 * Generate random numeric digits of given length.
 */
function randomDigits(n: number): string {
  const arr = new Uint8Array(n);
  crypto.getRandomValues(arr);
  return Array.from(arr).map(b => (b % 10).toString()).join('');
}

/**
 * Get the effective data length for a barcode type.
 * Fixed-length types (EAN-13, UPC-A, etc.) ignore `userLength` and
 * return their standard requirement; variable-length types (Code 128, etc.)
 * fall back to `userLength` (default 8).
 */
function effectiveLength(type: BarcodeType, userLength: number): number {
  return DATA_LENGTH[type] ?? userLength;
}

/**
 * Generate a bulk set of barcodes.
 *
 * @returns Array of BarcodeResults.
 */
export function generateBulk(config: BulkConfig): BarcodeResult[] {
  const { type, quantity, prefix = '', startFrom = 1, random = false, randomLength = 8 } = config;
  const results: BarcodeResult[] = [];
  const cdTypes: BarcodeType[] = ['ean13', 'ean8', 'upca', 'upce', 'gtin', 'isbn13', 'issn', 'ismn', 'itf14'];
  const len = effectiveLength(type, randomLength);

  for (let i = 0; i < quantity; i++) {
    const body = random
      ? randomDigits(len)
      : String(startFrom + i).padStart(len, '0');

    const digits = prefix + body;
    const cd = cdTypes.includes(type) ? calculateCheckDigit(digits, type) : '';
    const fullData = cd ? digits + cd : digits;

    results.push(generateBarcode({ type, data: fullData }));
  }

  return results;
}

/**
 * Format bulk results as CSV.
 */
export function bulkToCSV(results: BarcodeResult[]): string {
  const header = 'type,data,displayType,length';
  const rows = results.map(r => `${r.type},${r.data},${r.metadata.displayType},${r.metadata.length}`);
  return [header, ...rows].join('\n');
}

/**
 * Format bulk results as JSON array.
 */
export function bulkToJSON(results: BarcodeResult[]): string {
  return JSON.stringify(
    results.map(r => ({
      type: r.type,
      data: r.data,
      displayType: r.metadata.displayType,
      length: r.metadata.length,
      svg: r.svg,
    })),
    null,
    2,
  );
}

/**
 * Format bulk results as TXT (one code per line).
 */
export function bulkToTXT(results: BarcodeResult[]): string {
  return results.map(r => r.data).join('\n');
}
