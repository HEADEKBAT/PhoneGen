/**
 * Live Validation — Real-time card number validation.
 *
 * Detects brand, validates length, runs Luhn, checks BIN structure.
 * All functions are pure and synchronous.
 */

import type { ValidationResult } from './types';
import { detectNetwork, getNetworkLengths, CARD_NETWORKS } from './cardNetworks';
import { luhnValidate, extractBIN } from './luhn';

/**
 * Validate a raw PAN and return detailed results.
 */
export function validateCard(pan: string): ValidationResult {
  const clean = pan.replace(/\D/g, '');
  const network = detectNetwork(clean);
  const luhnOk = luhnValidate(clean);

  let lengthValid = false;
  if (network) {
    const lengths = getNetworkLengths(network.id);
    lengthValid = lengths.includes(clean.length);
  } else {
    // Accept any 8-19 digit number if network unknown
    lengthValid = clean.length >= 8 && clean.length <= 19;
  }

  let message: string;
  if (!/^\d+$/.test(clean)) {
    message = 'PAN contains non-numeric characters';
  } else if (clean.length < 8) {
    message = 'Too short';
  } else if (!network) {
    message = 'Unknown card network';
  } else if (!lengthValid) {
    message = `Invalid length (expected ${network.length.join(' or ')}, got ${clean.length})`;
  } else if (!luhnOk) {
    message = 'Fails Luhn check';
  } else {
    message = 'Valid ✓';
  }

  return {
    pan: clean,
    network: network?.id ?? null,
    lengthValid,
    luhnValid: luhnOk,
    message,
  };
}

/**
 * Quickly identify the network for display purposes.
 */
export function identifyNetwork(pan: string): { id: string; name: string } | null {
  const network = detectNetwork(pan);
  if (!network) return null;
  return { id: network.id, name: network.name };
}

/**
 * Check if a card is expired.
 */
export function isExpired(month: string, year: string): boolean {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const m = parseInt(month, 10);
  const y = parseInt(year, 10);
  if (isNaN(m) || isNaN(y)) return true;
  return y < currentYear || (y === currentYear && m < currentMonth);
}

/**
 * Validate CVV format.
 */
export function validateCVV(cvv: string, networkId?: string): { valid: boolean; message: string } {
  const expectedLength = networkId === 'amex' ? 4 : 3;
  if (!/^\d+$/.test(cvv)) {
    return { valid: false, message: 'CVV must be numeric' };
  }
  if (cvv.length !== expectedLength) {
    return { valid: false, message: `CVV must be ${expectedLength} digits` };
  }
  return { valid: true, message: 'Valid' };
}

/**
 * Validate expiry date.
 */
export function validateExpiry(month: string, year: string): { valid: boolean; message: string } {
  const m = parseInt(month, 10);
  const y = parseInt(year, 10);

  if (isNaN(m) || isNaN(y)) {
    return { valid: false, message: 'Invalid date' };
  }
  if (m < 1 || m > 12) {
    return { valid: false, message: 'Month must be 01-12' };
  }
  if (y < 100 || y > 9999) {
    return { valid: false, message: 'Invalid year' };
  }
  return { valid: true, message: 'Valid' };
}
