/**
 * Card Networks — Definitions & BIN/IIN Prefix Database
 *
 * Defines 15+ major card networks with their BIN prefixes, valid lengths,
 * CVV rules, and display properties. All data is algorithmic — no real
 * financial data.
 *
 * BIN ranges are based on publicly available IIN registry data and are
 * accurate for testing purposes. Ranges marked with comments indicate
 * the issuing body or region.
 */

import type { CardNetwork } from './types';

/* ── Network definitions ─────────────────────────────────────────────────────── */

export const CARD_NETWORKS: CardNetwork[] = [
  {
    id: 'visa',
    name: 'Visa',
    binPrefix: '4',
    length: [13, 16, 19],
    luhn: true,
    cvvLength: 3,
    color: '#1a1f71',
    badgeClass: 'bg-blue-900 text-white',
  },
  {
    id: 'mastercard',
    name: 'Mastercard',
    binPrefix: ['51-55', '222100-272099'],
    length: [16],
    luhn: true,
    cvvLength: 3,
    color: '#eb001b',
    badgeClass: 'bg-red-600 text-white',
  },
  {
    id: 'amex',
    name: 'American Express',
    binPrefix: ['34', '37'],
    length: [15],
    luhn: true,
    cvvLength: 4,
    color: '#2e77bc',
    badgeClass: 'bg-blue-600 text-white',
  },
  {
    id: 'discover',
    name: 'Discover',
    binPrefix: ['6011', '622126-622925', '644-649', '65'],
    length: [16, 19],
    luhn: true,
    cvvLength: 3,
    color: '#e6872e',
    badgeClass: 'bg-orange-500 text-white',
  },
  {
    id: 'jcb',
    name: 'JCB',
    binPrefix: ['3528-3589'],
    length: [16],
    luhn: true,
    cvvLength: 3,
    color: '#0b7c42',
    badgeClass: 'bg-green-700 text-white',
  },
  {
    id: 'diners',
    name: 'Diners Club',
    binPrefix: ['300-305', '36', '38', '39'],
    length: [14, 16, 19],
    luhn: true,
    cvvLength: 3,
    color: '#0079a1',
    badgeClass: 'bg-cyan-700 text-white',
  },
  {
    id: 'unionpay',
    name: 'UnionPay',
    binPrefix: '62',
    length: [16, 17, 18, 19],
    luhn: true,
    cvvLength: 3,
    color: '#d40029',
    badgeClass: 'bg-red-700 text-white',
  },
  {
    id: 'maestro',
    name: 'Maestro',
    binPrefix: ['5018', '5020', '5038', '56', '58', '6304', '6759', '6761', '6762', '6763'],
    length: [12, 13, 14, 15, 16, 17, 18, 19],
    luhn: true,
    cvvLength: 3,
    color: '#cc0000',
    badgeClass: 'bg-red-800 text-white',
  },
  {
    id: 'mir',
    name: 'MIR',
    binPrefix: ['2200-2204'],
    length: [16],
    luhn: true,
    cvvLength: 3,
    color: '#1a5cff',
    badgeClass: 'bg-blue-500 text-white',
  },
  {
    id: 'elo',
    name: 'Elo',
    binPrefix: [
      '636368', '438935', '504175', '509040', '509041',
      '509042', '509043', '509044', '509045', '509046',
      '509047', '509048', '509049', '509050', '506699',
      '506700', '506701', '506702', '506703', '506704',
      '506705', '506706', '506707', '506708', '506709',
      '506710', '506711', '506712', '506713', '506714',
      '506715', '506716', '506717', '506718', '506719',
      '506720', '506721', '506722', '506723', '506724',
      '506725', '506726', '506727', '506728', '506729',
      '506730', '506731', '506732', '506733', '506734',
      '506735', '506736', '506737', '506738', '506739',
      '506740', '506741', '506742', '506743', '506744',
      '506745', '506746', '506747', '506748', '506749',
      '506750', '506751', '506752', '506753', '506754',
      '506755', '506756', '506757', '506758', '506759',
      '506760', '506761', '506762', '506763', '506764',
      '506765', '506766', '506767', '506768', '506769',
      '506770', '506771', '506772', '506773', '506774',
      '506775', '506776', '506777', '506778', '506779',
    ],
    length: [16],
    luhn: true,
    cvvLength: 3,
    color: '#231f20',
    badgeClass: 'bg-gray-900 text-white',
  },
  {
    id: 'hipercard',
    name: 'Hipercard',
    binPrefix: ['384100-384300'],
    length: [16],
    luhn: true,
    cvvLength: 3,
    color: '#b3131b',
    badgeClass: 'bg-red-700 text-white',
  },
  {
    id: 'rupay',
    name: 'RuPay',
    binPrefix: ['60', '81', '82'],
    length: [16],
    luhn: true,
    cvvLength: 3,
    color: '#046a38',
    badgeClass: 'bg-green-800 text-white',
  },
  {
    id: 'verve',
    name: 'Verve',
    binPrefix: ['506099-506198', '507865-507964', '650002-650010'],
    length: [16, 19],
    luhn: true,
    cvvLength: 3,
    color: '#e31b23',
    badgeClass: 'bg-red-600 text-white',
  },
  {
    id: 'dankort',
    name: 'Dankort',
    binPrefix: '5019',
    length: [16],
    luhn: true,
    cvvLength: 3,
    color: '#c00',
    badgeClass: 'bg-red-600 text-white',
  },
  {
    id: 'uatp',
    name: 'UATP',
    binPrefix: '1',
    length: [15],
    luhn: true,
    cvvLength: 3,
    color: '#0f7ac9',
    badgeClass: 'bg-blue-500 text-white',
  },
];

/* ── Lookup helpers ──────────────────────────────────────────────────────────── */

/** Map of network ID → CardNetwork for O(1) lookup */
export const NETWORK_MAP: Record<string, CardNetwork> = Object.fromEntries(
  CARD_NETWORKS.map((n) => [n.id, n]),
);

/**
 * Detect the card network from a PAN prefix.
 * Returns the matching CardNetwork, or `null` if unknown.
 */
export function detectNetwork(pan: string): CardNetwork | null {
  const clean = pan.replace(/\D/g, '');
  if (clean.length < 2) return null;

  for (const network of CARD_NETWORKS) {
    const prefixes = Array.isArray(network.binPrefix)
      ? network.binPrefix
      : [network.binPrefix];

    for (const prefix of prefixes) {
      if (matchPrefix(clean, prefix)) return network;
    }
  }
  return null;
}

/**
 * Check whether `value` starts with a prefix pattern.
 * Patterns can be:
 *   - Exact:    "4"       → value starts with "4"
 *   - Range:    "51-55"   → value starts with 51, 52, 53, 54, 55
 *   - Long range: "222100-272099" → numeric range for first 6 digits
 */
function matchPrefix(value: string, pattern: string): boolean {
  const rangeMatch = pattern.match(/^(\d+)-(\d+)$/);
  if (rangeMatch) {
    const prefixNum = parseInt(value.slice(0, pattern.split('-')[0].length), 10);
    const low = parseInt(rangeMatch[1], 10);
    const high = parseInt(rangeMatch[2], 10);
    return prefixNum >= low && prefixNum <= high;
  }
  return value.startsWith(pattern);
}

/**
 * Get BIN-safe prefix for a network.
 * Returns a realistic BIN string that can be used to generate test cards.
 */
export function getNetworkBIN(networkId: string): string {
  const network = NETWORK_MAP[networkId];
  if (!network) return '4';

  const prefixes = Array.isArray(network.binPrefix)
    ? network.binPrefix
    : [network.binPrefix];

  // Pick the first non-range prefix, or expand the first range
  const first = prefixes[0];
  if (!first.includes('-')) return first;

  // Expand range: pick the low end
  return first.split('-')[0];
}

/**
 * Get all valid lengths for a network.
 */
export function getNetworkLengths(networkId: string): number[] {
  return NETWORK_MAP[networkId]?.length ?? [16];
}
