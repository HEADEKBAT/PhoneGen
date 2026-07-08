/**
 * Parse human-readable metadata from a barcode.
 *
 * Extracts country prefix, company prefix, product number, and
 * check digit based on the barcode type.
 */

import { type BarcodeType, type BarcodeMetadata, BARCODE_DISPLAY_NAMES } from './types';

export function parseBarcodeMetadata(type: BarcodeType, data: string): BarcodeMetadata {
  const clean = data.replace(/\D/g, '');
  const displayType = BARCODE_DISPLAY_NAMES[type];
  const length = clean.length;

  switch (type) {
    case 'ean13':
      return {
        displayType,
        countryPrefix: clean.slice(0, 3),
        companyPrefix: clean.slice(3, 7),
        productNumber: clean.slice(7, 12),
        checkDigit: clean[12],
        length,
      };

    case 'ean8':
      return {
        displayType,
        companyPrefix: clean.slice(0, 4),
        productNumber: clean.slice(4, 7),
        checkDigit: clean[7],
        length,
      };

    case 'upca':
      return {
        displayType,
        countryPrefix: 'US/CA',
        companyPrefix: clean.slice(0, 5),
        productNumber: clean.slice(5, 10),
        checkDigit: clean[10],
        length,
      };

    case 'upce':
      return {
        displayType,
        countryPrefix: 'US/CA',
        companyPrefix: clean.slice(0, 3),
        productNumber: clean.slice(3, 5),
        checkDigit: clean[5],
        length,
      };

    case 'gtin':
      return {
        displayType,
        countryPrefix: clean.length >= 13 ? clean.slice(0, 3) : undefined,
        checkDigit: clean[clean.length - 1],
        length,
      };

    case 'isbn13':
      return {
        displayType,
        countryPrefix: clean.slice(0, 3),
        companyPrefix: clean.slice(3, 7),
        productNumber: clean.slice(7, 12),
        checkDigit: clean[12],
        length,
      };

    case 'isbn10':
      return {
        displayType,
        countryPrefix: 'Bookland',
        companyPrefix: clean.slice(0, length - 6),
        productNumber: clean.slice(-6, -1),
        checkDigit: clean[clean.length - 1],
        length,
      };

    case 'issn':
      return {
        displayType,
        productNumber: clean.slice(0, 7),
        checkDigit: clean[7],
        length,
      };

    case 'ismn':
      return {
        displayType,
        checkDigit: clean[clean.length - 1],
        length,
      };

    case 'itf14':
      return {
        displayType,
        checkDigit: clean[clean.length - 1],
        length,
      };

    default:
      return { displayType, length };
  }
}
