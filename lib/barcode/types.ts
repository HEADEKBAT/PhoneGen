/**
 * Barcode Studio — Core Types.
 *
 * Defines all barcode encodings, generation configs, and result types.
 * Adding a new barcode standard = one entry in BarcodeType + its format config.
 */

/** All supported barcode symbologies. */
export type BarcodeType =
  | 'ean13' | 'ean8' | 'upca' | 'upce'
  | 'gtin' | 'isbn10' | 'isbn13' | 'issn' | 'ismn'
  | 'code128' | 'code39' | 'code93' | 'codabar'
  | 'itf14' | 'gs1-128' | 'pharmacode';

/** User-facing display names for each barcode type. */
export const BARCODE_DISPLAY_NAMES: Record<BarcodeType, string> = {
  ean13: 'EAN-13',
  ean8: 'EAN-8',
  upca: 'UPC-A',
  upce: 'UPC-E',
  gtin: 'GTIN',
  isbn10: 'ISBN-10',
  isbn13: 'ISBN-13',
  issn: 'ISSN',
  ismn: 'ISMN',
  code128: 'Code 128',
  code39: 'Code 39',
  code93: 'Code 93',
  codabar: 'Codabar',
  itf14: 'ITF-14',
  'gs1-128': 'GS1-128',
  pharmacode: 'Pharmacode',
};

/** Category groupings for the Barcode Studio UI. */
export type BarcodeCategory = 'product' | 'industrial' | 'pharma';

export const BARCODE_CATEGORIES: Record<BarcodeType, BarcodeCategory> = {
  ean13: 'product',
  ean8: 'product',
  upca: 'product',
  upce: 'product',
  gtin: 'product',
  isbn10: 'product',
  isbn13: 'product',
  issn: 'product',
  ismn: 'product',
  code128: 'industrial',
  code39: 'industrial',
  code93: 'industrial',
  codabar: 'industrial',
  itf14: 'industrial',
  'gs1-128': 'industrial',
  pharmacode: 'pharma',
};

/** Generation configuration object. */
export interface BarcodeConfig {
  /** Barcode symbology. */
  type: BarcodeType;
  /** Data to encode (digits or text, depending on type). */
  data: string;
  /** Width of each bar module in px. */
  width?: number;
  /** Height of the barcode in px. */
  height?: number;
  /** Left/right margin in px. */
  margin?: number;
  /** Font size for the human-readable text in px. */
  fontSize?: number;
  /** Foreground (bar) color — any CSS color string. */
  foreground?: string;
  /** Background color — any CSS color string. */
  background?: string;
  /** Whether to display the human-readable text below the barcode. */
  showText?: boolean;
}

/** Parsed metadata for a generated barcode. */
export interface BarcodeMetadata {
  /** User-friendly type name (e.g. "EAN-13"). */
  displayType: string;
  /** GS1 country prefix (for EAN/UPC/GTIN). */
  countryPrefix?: string;
  /** Manufacturer/company prefix. */
  companyPrefix?: string;
  /** Product/item number portion. */
  productNumber?: string;
  /** Check digit (if applicable). */
  checkDigit?: string;
  /** Total barcode length (data digits). */
  length: number;
}

/** Result of a barcode generation operation. */
export interface BarcodeResult {
  /** Barcode symbology. */
  type: BarcodeType;
  /** Raw data encoded. */
  data: string;
  /** SVG markup string ready for rendering. */
  svg: string;
  /** Check digit (computed, if applicable). */
  checkDigit?: string;
  /** Parsed barcode metadata. */
  metadata: BarcodeMetadata;
}

/** Configuration for bulk generation. */
export interface BulkConfig {
  /** Barcode symbology. */
  type: BarcodeType;
  /** Total number of barcodes to generate. */
  quantity: number;
  /** Fixed prefix for all generated codes. */
  prefix?: string;
  /** Start value for sequential generation. */
  startFrom?: number;
  /** If true, generate random codes instead of sequential. */
  random?: boolean;
  /** Length of random codes (excluding prefix). */
  randomLength?: number;
}

/** Validation result for an existing barcode. */
export interface ValidationResult {
  /** Raw code string submitted. */
  code: string;
  /** Detected barcode type (null if unrecognised). */
  detectedType: BarcodeType | null;
  /** Whether the barcode is structurally valid. */
  valid: boolean;
  /** Check digit validation (null if the standard has no check digit). */
  checkDigit?: {
    valid: boolean;
    expected: string;
    actual: string;
  };
  /** Character length. */
  length: number;
  /** Human-readable error messages (empty if valid). */
  errors: string[];
}

/** Detailed step-by-step check digit explanation. */
export interface CheckDigitExplanation {
  /** Input data (without check digit). */
  input: string;
  /** Calculated check digit. */
  checkDigit: string;
  /** The full code with check digit appended. */
  fullCode: string;
  /** Barcode type. */
  type: BarcodeType;
  /** Each step of the calculation as human-readable strings. */
  steps: string[];
}
