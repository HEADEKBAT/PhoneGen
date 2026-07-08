/**
 * Barcode Studio — Engine.
 *
 * Abstraction layer over JsBarcode. All components call this single
 * function; they never import JsBarcode directly. If we need a different
 * renderer (bwip-js for GS1 DataMatrix / PDF417), add it behind the
 * same interface — components stay unchanged.
 */

import JsBarcode from 'jsbarcode';
import { type BarcodeConfig, type BarcodeResult, type BarcodeMetadata, BARCODE_DISPLAY_NAMES } from './types';
import { parseBarcodeMetadata } from './metadata';

/**
 * Generate a barcode SVG.
 *
 * This function is synchronous — JsBarcode renders instantly.
 *
 * @returns A BarcodeResult with SVG markup and parsed metadata.
 */
export function generateBarcode(config: BarcodeConfig): BarcodeResult {
  const { type, data, width, height, margin, fontSize, foreground, background, showText } = config;

  // Validate input
  if (!data) throw new Error('Barcode data is required');

  // Create a temporary SVG element for JsBarcode to render into
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

  try {
    JsBarcode(svg, data, {
      format: jsbarcodeFormat(type),
      width: width ?? 2,
      height: height ?? 80,
      margin: margin ?? 10,
      fontSize: fontSize ?? 16,
      lineColor: foreground ?? '#000000',
      background: background ?? '#ffffff',
      displayValue: showText ?? true,
      // Flat/EAN-8 must be left-justified for library flexibility
      textMargin: 2,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err ?? 'unknown error');
    throw new Error(`Failed to generate ${BARCODE_DISPLAY_NAMES[type]} barcode: ${msg}`);
  }

  const svgString = svg.outerHTML;
  const metadata = parseBarcodeMetadata(type, data);

  return {
    type,
    data,
    svg: svgString,
    checkDigit: metadata.checkDigit,
    metadata,
  };
}

/**
 * Map our BarcodeType to JsBarcode's format string.
 */
function jsbarcodeFormat(type: string): string {
  const map: Record<string, string> = {
    ean13: 'EAN13',
    ean8: 'EAN8',
    upca: 'UPC',
    upce: 'UPCE',
    gtin: 'EAN13',        // GTIN-13 renders as EAN-13
    isbn10: 'ISBN',
    isbn13: 'ISBN',
    issn: 'ISSN',
    ismn: 'ISMN',
    code128: 'CODE128',
    code39: 'CODE39',
    code93: 'CODE93',
    codabar: 'CODABAR',
    itf14: 'ITF14',
    'gs1-128': 'EAN13',   // GS1-128 uses EAN-128 format when available
    pharmacode: 'PHARMACODE',
  };
  return map[type] || 'CODE128';
}
