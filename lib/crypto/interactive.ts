/**
 * Crypto Wallet Playground — Interactive Wallet Explorer.
 *
 * Combines address breakdown, format comparison, BIP44 tree,
 * and crypto URI builder for the Interactive Wallet Explorer module.
 */

import type { NetworkId, WalletFormat, CryptoURI } from './types';
import { getNetwork } from './networks';
import { analyzeAddress } from './analysis';
import { buildCryptoURI } from './qrCodeGenerator';

export interface InteractiveBreakdown {
  address: string;
  network: NetworkId;
  byteStructure: ByteSegment[];
  formats: Record<string, string>;
  derivationPath: string;
  cryptoURI: string;
}

export interface ByteSegment {
  label: string;
  hex: string;
  bytes: number;
  description: string;
}

export function getAddressBreakdown(address: string): InteractiveBreakdown | null {
  const analysis = analyzeAddress(address);
  if (!analysis) return null;

  const net = getNetwork(analysis.network);
  const segments: ByteSegment[] = [];

  if (analysis.prefix) {
    segments.push({
      label: 'Prefix',
      hex: analysis.prefix,
      bytes: analysis.prefix.startsWith('0x') ? 1 : 1,
      description: 'Identifies the address type or network',
    });
  }

  if (analysis.hashLength) {
    segments.push({
      label: 'Hash / Payload',
      hex: address.slice(-2 * (analysis.hashLength || 20)),
      bytes: analysis.hashLength || 20,
      description: `The public key hash (${analysis.hashLength} bytes)`,
    });
  }

  return {
    address,
    network: analysis.network,
    byteStructure: segments,
    formats: {},
    derivationPath: `m/44'/${net.coinType}'/0'/0/0`,
    cryptoURI: buildCryptoURI(analysis.network, address),
  };
}

export function compareFormats(
  network: NetworkId,
  address: string,
): Record<string, string> {
  const result: Record<string, string> = {};
  const net = getNetwork(network);

  for (const format of net.addressFormats) {
    result[format] = `[${format.toUpperCase()} representation of ${address}]`;
  }

  return result;
}

export function buildExplorerURI(network: NetworkId, address: string): string {
  const net = getNetwork(network);
  return `${net.explorerUrl}/address/${address}`;
}
