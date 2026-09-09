/**
 * Crypto Wallet Playground — Crypto URI QR Generator.
 *
 * Generates QR codes for cryptocurrency payment URIs.
 * Uses the existing QR engine from lib/qr/.
 */

import type { NetworkId } from './types';
import { getNetwork } from './networks';

export interface CryptoURI {
  scheme: string;
  address: string;
  amount?: string;
  label?: string;
  message?: string;
  parameters: Record<string, string>;
}

export function buildCryptoURI(
  network: NetworkId,
  address: string,
  options?: {
    amount?: string;
    label?: string;
    message?: string;
  },
): string {
  const net = getNetwork(network);
  const symbol = net.symbol.toLowerCase();

  let uri = `${symbol}:${address}`;
  const params: string[] = [];

  if (options?.amount) {
    params.push(`amount=${options.amount}`);
  }
  if (options?.label) {
    params.push(`label=${encodeURIComponent(options.label)}`);
  }
  if (options?.message) {
    params.push(`message=${encodeURIComponent(options.message)}`);
  }

  if (params.length > 0) {
    uri += '?' + params.join('&');
  }

  return uri;
}

export function parseCryptoURI(uri: string): CryptoURI | null {
  try {
    const match = uri.match(/^([a-z]+):(\S+?)(\?.*)?$/);
    if (!match) return null;

    const scheme = match[1]!;
    const address = match[2]!;
    const params: Record<string, string> = {};

    if (match[3]) {
      const searchParams = new URLSearchParams(match[3]);
      for (const [key, value] of searchParams.entries()) {
        params[key] = value;
      }
    }

    return {
      scheme,
      address,
      amount: params.amount,
      label: params.label,
      message: params.message,
      parameters: params,
    };
  } catch {
    return null;
  }
}

export function getURISchemes(): Record<string, NetworkId> {
  return {
    bitcoin: 'bitcoin',
    ethereum: 'ethereum',
    litecoin: 'litecoin',
    dogecoin: 'dogecoin',
    solana: 'solana',
    tron: 'tron',
    ripple: 'ripple',
    monero: 'monero',
    polkadot: 'polkadot',
    cardano: 'cardano',
    cosmos: 'cosmos',
    near: 'near',
    ton: 'ton',
  };
}
