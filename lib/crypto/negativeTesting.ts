/**
 * Crypto Wallet Playground — Negative Testing Module.
 *
 * Generates intentionally invalid addresses for QA testing.
 */

import type { NetworkId, WalletFormat, ValidationResult } from './types';
import { validateAddress } from './validation';

export interface InvalidAddressTemplate {
  description: string;
  category: 'checksum' | 'prefix' | 'length' | 'encoding' | 'character';
  generate: () => string;
}

function generateInvalidChecksum(address: string): string {
  // Flip the last character
  const chars = address.split('');
  const last = chars[chars.length - 1]!;
  const flipped = last === 'a' ? 'b' : 'a';
  chars[chars.length - 1] = flipped;
  return chars.join('');
}

function generateInvalidPrefix(address: string): string {
  if (address.startsWith('0x')) return '0y' + address.slice(2);
  if (address.startsWith('1')) return '2' + address.slice(1);
  if (address.startsWith('3')) return '4' + address.slice(1);
  if (address.startsWith('bc1')) return 'bd1' + address.slice(3);
  return 'x' + address;
}

function generateInvalidLength(address: string): string {
  if (address.startsWith('0x') && address.length === 42) {
    return address + 'ab'; // Too long
  }
  return address.slice(0, -2); // Too short
}

function generateInvalidEncoding(address: string): string {
  if (address.startsWith('0x')) {
    // Replace hex chars with invalid ones
    return '0x' + address.slice(2).replace(/[a-f]/gi, 'z');
  }
  return address.replace(/[a-z]/gi, '!');
}

export function generateInvalidAddress(
  baseAddress: string,
  category: InvalidAddressTemplate['category'],
): string {
  switch (category) {
    case 'checksum':
      return generateInvalidChecksum(baseAddress);
    case 'prefix':
      return generateInvalidPrefix(baseAddress);
    case 'length':
      return generateInvalidLength(baseAddress);
    case 'encoding':
      return generateInvalidEncoding(baseAddress);
    case 'character':
      return baseAddress.slice(0, -1) + String.fromCharCode(baseAddress.charCodeAt(baseAddress.length - 1)! + 1);
  }
}

export const INVALID_ADDRESS_TEMPLATES: InvalidAddressTemplate[] = [
  {
    description: 'Broken checksum (last char flipped)',
    category: 'checksum',
    generate: () => generateInvalidChecksum('0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18'),
  },
  {
    description: 'Wrong prefix (1→2 for Bitcoin)',
    category: 'prefix',
    generate: () => generateInvalidPrefix('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'),
  },
  {
    description: 'Truncated address (missing 2 chars)',
    category: 'length',
    generate: () => generateInvalidLength('0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18'),
  },
  {
    description: 'Invalid encoding (non-hex chars in hex address)',
    category: 'encoding',
    generate: () => generateInvalidEncoding('0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18'),
  },
  {
    description: 'Invalid character substitution',
    category: 'character',
    generate: () => generateInvalidCharacter('0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18'),
  },
];

function generateInvalidCharacter(address: string): string {
  const chars = address.split('');
  const pos = Math.min(10, chars.length - 1);
  chars[pos] = String.fromCharCode(chars[pos]!.charCodeAt(0) + 1);
  return chars.join('');
}

export function getNegativeTestCases(
  network: NetworkId,
  count: number = 5,
): string[] {
  const cases: string[] = [];
  const templates = INVALID_ADDRESS_TEMPLATES;
  for (let i = 0; i < count; i++) {
    const template = templates[i % templates.length]!;
    cases.push(template.generate());
  }
  return cases;
}

export function validateNegativeCases(
  addresses: string[],
): { address: string; result: ValidationResult }[] {
  return addresses.map((addr) => ({
    address: addr,
    result: validateAddress(addr),
  }));
}
