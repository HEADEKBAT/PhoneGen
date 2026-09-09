/**
 * PAN Formatters — Display, masking, regex, and developer-mode formatting.
 *
 * These are display-oriented utilities (vs. luhn.ts which has raw formatting
 * without label decorations).
 */

import type { CardData } from './types';
import { formatPAN, maskPAN } from './luhn';

/* ── Developer Mode ──────────────────────────────────────────────────────────── */

export interface DeveloperFormat {
  raw: string;
  formatted: string;
  masked: string;
  grouped: string;
  regexPattern: string;
  bin: string;
  last4: string;
  length: number;
  network: string;
}

/**
 * Format a card for developer-mode display.
 */
export function formatDeveloper(card: CardData): DeveloperFormat {
  return {
    raw: card.pan,
    formatted: card.formattedPan,
    masked: card.maskedPan,
    grouped: card.formattedPan,
    regexPattern: buildRegexPattern(card.pan),
    bin: card.bin,
    last4: card.last4,
    length: card.pan.length,
    network: card.network,
  };
}

/**
 * Build a regex validation pattern from PAN structure.
 * Example: "^4\\d{12}(\\d{3})?$" for Visa
 */
function buildRegexPattern(pan: string): string {
  const firstDigit = pan[0];
  const restLength = pan.length - 1;
  return `^${firstDigit}\\d{${restLength}}$`;
}

/* ── Display labels ──────────────────────────────────────────────────────────── */

export interface DisplayLabels {
  panLabel: string;
  networkBadge: string;
  expiryLabel: string;
  cvvLabel: string;
  holderLabel: string;
}

/**
 * Get display labels for a card's network.
 */
export function getCardLabels(networkId: string): DisplayLabels {
  switch (networkId) {
    case 'amex':
      return {
        panLabel: 'Card Number',
        networkBadge: 'AMEX',
        expiryLabel: 'Good Thru',
        cvvLabel: 'CID',
        holderLabel: 'Cardholder',
      };
    case 'diners':
      return {
        panLabel: 'Card Number',
        networkBadge: 'Diners',
        expiryLabel: 'Expires',
        cvvLabel: 'CVV',
        holderLabel: 'Member Since',
      };
    default:
      return {
        panLabel: 'Card Number',
        networkBadge: networkId.charAt(0).toUpperCase() + networkId.slice(1),
        expiryLabel: 'Expires',
        cvvLabel: 'CVV',
        holderLabel: 'Cardholder',
      };
  }
}

/**
 * Truncate and format card data for tooltip/preview display.
 */
export function formatCardPreview(card: CardData): string {
  return `${card.network.toUpperCase()} •••• ${card.last4}`;
}
