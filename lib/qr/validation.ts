/**
 * QR Studio — Validation utilities.
 *
 * Per-type input validation used by content forms.
 * Delegates to contentTypes.ts validators for type-specific checks.
 */

import { QR_CONTENT_TYPES, getContentTypeConfig } from './contentTypes';
import type { QRContentType, ValidationResult } from './types';

export function validateContentType(
  type: QRContentType,
  data: Record<string, string>,
): ValidationResult {
  const config = getContentTypeConfig(type);
  if (!config) {
    return { valid: false, errors: [{ field: 'type', message: 'Unknown content type' }] };
  }
  return config.validate(data);
}

export function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return url.startsWith('http://') || url.startsWith('https://');
  } catch {
    return false;
  }
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePhone(phone: string): boolean {
  return /^\+?[0-9\s\-()]{5,20}$/.test(phone);
}

export function validateCoordinates(lat: string, lng: string): { valid: boolean; error?: string } {
  const latNum = parseFloat(lat);
  const lngNum = parseFloat(lng);
  if (isNaN(latNum) || latNum < -90 || latNum > 90) {
    return { valid: false, error: 'Latitude must be between -90 and 90' };
  }
  if (isNaN(lngNum) || lngNum < -180 || lngNum > 180) {
    return { valid: false, error: 'Longitude must be between -180 and 180' };
  }
  return { valid: true };
}

export function validateIBAN(iban: string): boolean {
  return /^[A-Z]{2}[0-9]{2}[A-Z0-9]{4,30}$/.test(iban.replace(/\s/g, '').toUpperCase());
}

export function validateBIC(bic: string): boolean {
  return /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(bic.toUpperCase());
}

export function validateUPI(upiId: string): boolean {
  return /^[a-zA-Z0-9.\-_]{2,49}@[a-zA-Z]{2,}$/.test(upiId);
}

export function validateBitcoinAddress(address: string): boolean {
  return /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(address) ||
         /^bc1[ac-hj-np-z02-9]{8,87}$/.test(address);
}

export function validateEthereumAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export function validateContentLength(data: string, maxLength: number = 4296): boolean {
  return data.length <= maxLength;
}
