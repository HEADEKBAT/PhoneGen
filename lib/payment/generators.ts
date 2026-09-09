/**
 * Card Generators — Core generation functions for all modes.
 *
 * Every function is pure, synchronous, and uses only crypto.getRandomValues()
 * for randomness. No server calls, no history storage.
 */

import type {
  CardData,
  CardMode,
  CardNetwork,
  GenerationOptions,
  NegativeTestType,
  BulkProgress,
  PaymentExportFormat,
  PaymentProfile,
} from './types';
import { detectNetwork, getNetworkBIN, getNetworkLengths, CARD_NETWORKS, NETWORK_MAP } from './cardNetworks';
import {
  luhnValidate,
  generatePAN,
  generateInvalidPAN,
  formatPAN,
  maskPAN,
  extractBIN,
} from './luhn';
import { buildProfile, getProfile } from './profiles';

/* ── Random helpers ──────────────────────────────────────────────────────────── */

function randomInt(min: number, max: number): number {
  const range = max - min + 1;
  const buf = new Uint8Array(1);
  crypto.getRandomValues(buf);
  return min + (buf[0] % range);
}

function randomElement<T>(arr: T[]): T {
  return arr[randomInt(0, arr.length - 1)];
}

/** Generate random expiry (month + year) */
function generateExpiry(minYears = 1, maxYears = 5): { month: string; year: string } {
  const now = new Date();
  const currentYear = now.getFullYear();
  const month = String(randomInt(1, 12)).padStart(2, '0');
  const offset = randomInt(minYears, maxYears);
  const year = String(currentYear + offset);
  return { month, year };
}

/** Generate a realistic cardholder name (en-based placeholder list) */
const FIRST_NAMES = ['James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda', 'David', 'Elizabeth', 'William', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Christopher', 'Karen'];
const LAST_NAMES = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Anderson', 'Taylor', 'Thomas', 'Hernandez', 'Moore', 'Jackson', 'Martin', 'Lee', 'Thompson', 'White'];

function generateHolder(): string {
  return `${randomElement(FIRST_NAMES)} ${randomElement(LAST_NAMES)}`;
}

/** Generate CVV */
function generateCVV(networkId: string): string {
  const length = networkId === 'amex' ? 4 : 3;
  const buf = new Uint8Array(length);
  crypto.getRandomValues(buf);
  return Array.from(buf).map((b) => (b % 10).toString()).join('');
}

/* ── Single card generation ─────────────────────────────────────────────────── */

/**
 * Generate a single test card with realistic data.
 */
export function generateCard(
  networkId?: string,
  options?: { expiryMin?: number; expiryMax?: number },
): CardData {
  // Pick random network if not specified
  const network = networkId
    ? (NETWORK_MAP[networkId] ?? randomElement(CARD_NETWORKS))
    : randomElement(CARD_NETWORKS);

  const bin = getNetworkBIN(network.id);
  const lengths = getNetworkLengths(network.id);
  const length = randomElement(lengths);
  const pan = generatePAN(bin, length);
  const last4 = pan.slice(-4);
  const expiry = generateExpiry(options?.expiryMin ?? 1, options?.expiryMax ?? 5);
  const cvv = generateCVV(network.id);

  return {
    pan,
    formattedPan: formatPAN(pan, network.id),
    maskedPan: maskPAN(pan),
    network: network.id,
    holder: generateHolder(),
    expiryMonth: expiry.month,
    expiryYear: expiry.year,
    expiryShort: `${expiry.month}/${expiry.year.slice(2)}`,
    expiryFull: `${expiry.month}/${expiry.year}`,
    cvv,
    bin: pan.slice(0, 6),
    last4,
    luhnValid: true,
  };
}

/* ── Negative test card generation ───────────────────────────────────────────── */

/**
 * Generate a card with specific defects for negative testing.
 */
export function generateNegativeCard(
  testType: NegativeTestType,
  networkId?: string,
): CardData {
  const network = networkId
    ? (NETWORK_MAP[networkId] ?? randomElement(CARD_NETWORKS))
    : randomElement(CARD_NETWORKS);

  const bin = getNetworkBIN(network.id);
  const lengths = getNetworkLengths(network.id);
  const normalLength = randomElement(lengths);

  switch (testType) {
    case 'invalid-luhn': {
      const pan = generateInvalidPAN(bin, normalLength);
      const last4 = pan.slice(-4);
      return {
        pan,
        formattedPan: formatPAN(pan, network.id),
        maskedPan: maskPAN(pan),
        network: network.id,
        holder: generateHolder(),
        expiryMonth: '12',
        expiryYear: '2028',
        expiryShort: '12/28',
        expiryFull: '12/2028',
        cvv: generateCVV(network.id),
        bin: pan.slice(0, 6),
        last4,
        luhnValid: false,
      };
    }
    case 'wrong-length': {
      // Generate with wrong length (too short)
      const wrongLength = network.id === 'amex' ? 14 : 15;
      const pan = wrongLength < bin.length + 2
        ? bin.padEnd(wrongLength, '5')
        : generatePAN(bin, wrongLength);
      const last4 = pan.slice(-4);
      return {
        pan,
        formattedPan: formatPAN(pan, network.id),
        maskedPan: maskPAN(pan),
        network: network.id,
        holder: generateHolder(),
        expiryMonth: '12',
        expiryYear: '2028',
        expiryShort: '12/28',
        expiryFull: '12/2028',
        cvv: generateCVV(network.id),
        bin: pan.slice(0, 6),
        last4,
        luhnValid: luhnValidate(pan),
      };
    }
    case 'expired-card': {
      const card = generateCard(networkId);
      return {
        ...card,
        expiryMonth: '01',
        expiryYear: '2020',
        expiryShort: '01/20',
        expiryFull: '01/2020',
      };
    }
    case 'invalid-expiry': {
      const card = generateCard(networkId);
      return {
        ...card,
        expiryMonth: '13',
        expiryYear: '2028',
        expiryShort: '13/28',
        expiryFull: '13/2028',
      };
    }
    case 'invalid-cvv': {
      const card = generateCard(networkId);
      const badCvv = card.network === 'amex' ? '12' : '1';
      return { ...card, cvv: badCvv };
    }
    case 'invalid-bank-code': {
      // Use a BIN that doesn't exist
      const pan = '0000000000000000';
      return {
        pan,
        formattedPan: '0000 0000 0000 0000',
        maskedPan: '000000******0000',
        network: 'unknown',
        holder: generateHolder(),
        expiryMonth: '12',
        expiryYear: '2028',
        expiryShort: '12/28',
        expiryFull: '12/2028',
        cvv: generateCVV('visa'),
        bin: '000000',
        last4: '0000',
        luhnValid: luhnValidate(pan),
      };
    }
    case 'special-chars-pan': {
      return {
        pan: 'ABCDEF1234567890',
        formattedPan: 'ABCD EF12 3456 7890',
        maskedPan: 'ABCDEF******7890',
        network: 'unknown',
        holder: generateHolder(),
        expiryMonth: '12',
        expiryYear: '2028',
        expiryShort: '12/28',
        expiryFull: '12/2028',
        cvv: generateCVV('visa'),
        bin: 'ABCDEF',
        last4: '7890',
        luhnValid: false,
      };
    }
    case 'blank-fields': {
      const card = generateCard(networkId);
      return { ...card, holder: '', cvv: '', expiryMonth: '', expiryYear: '' };
    }
  }
}

/* ── Bulk generation ─────────────────────────────────────────────────────────── */

/**
 * Generate multiple cards with progress callback.
 * Uses setTimeout to yield to the UI thread for progress updates.
 */
export async function generateBulkCards(
  quantity: number,
  networkId: string | undefined,
  onProgress?: (progress: BulkProgress) => void,
): Promise<CardData[]> {
  const cards: CardData[] = [];
  const batchSize = Math.min(50, quantity);

  for (let i = 0; i < quantity; i += batchSize) {
    const end = Math.min(i + batchSize, quantity);
    for (let j = i; j < end; j++) {
      cards.push(generateCard(networkId));
    }

    onProgress?.({
      total: quantity,
      completed: end,
      failed: 0,
      status: `Generated ${end}/${quantity} cards`,
    });

    // Yield to UI thread every batch
    if (end < quantity) {
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
  }

  return cards;
}

/* ── Full profile generation ─────────────────────────────────────────────────── */

/**
 * Generate a complete card + billing profile.
 */
export function generateFullProfile(
  profileId?: string,
  networkId?: string,
): PaymentProfile | null {
  const profileKey = profileId ?? randomElement(
    ['us-personal', 'us-business', 'eu-personal', 'uk-personal', 'br-personal'],
  );
  const netId = networkId ?? randomElement(CARD_NETWORKS).id;
  const expiry = generateExpiry(1, 5);

  return buildProfile(profileKey, netId, expiry.month, expiry.year);
}

/* ── BIN-based generation ────────────────────────────────────────────────────── */

/**
 * Generate a card from a partial BIN.
 * The BIN can be 3-8 digits; the rest is filled in to match the detected network.
 */
export function generateCardFromBIN(bin: string): CardData {
  const clean = bin.replace(/\D/g, '');
  const network = detectNetwork(clean) ?? CARD_NETWORKS[0];

  const lengths = getNetworkLengths(network.id);
  const length = randomElement(lengths);
  const pan = generatePAN(clean, length);
  const last4 = pan.slice(-4);
  const expiry = generateExpiry(1, 5);
  const cvv = generateCVV(network.id);

  return {
    pan,
    formattedPan: formatPAN(pan, network.id),
    maskedPan: maskPAN(pan),
    network: network.id,
    holder: generateHolder(),
    expiryMonth: expiry.month,
    expiryYear: expiry.year,
    expiryShort: `${expiry.month}/${expiry.year.slice(2)}`,
    expiryFull: `${expiry.month}/${expiry.year}`,
    cvv,
    bin: pan.slice(0, 6),
    last4,
    luhnValid: true,
  };
}
