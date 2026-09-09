/**
 * Crypto Wallet Playground — Address Format Converter.
 *
 * Converts between Legacy, SegWit, Native SegWit, and Taproot formats.
 * Mainly for Bitcoin-compatible networks.
 */

import bs58 from 'bs58';
import { bech32, bech32m } from 'bech32';
import { bytesToHex } from '@noble/hashes/utils.js';
import { sha256 } from '@noble/hashes/sha2.js';
import { ripemd160 } from '@noble/hashes/legacy.js';
import type { NetworkId, WalletFormat, ConversionResult } from './types';
import { getNetwork } from './networks';

function doubleSHA256(data: Uint8Array): Uint8Array {
  return sha256(sha256(data));
}

function base58Decode(address: string): { version: number; hash: Uint8Array } {
  const decoded = bs58.decode(address);
  const payload = decoded.slice(0, -4);
  return {
    version: payload[0] || 0,
    hash: payload.slice(1),
  };
}

function base58CheckEncode(version: number, payload: Uint8Array): string {
  const versionByte = new Uint8Array([version]);
  const combined = new Uint8Array([...versionByte, ...payload]);
  const checksum = doubleSHA256(combined).slice(0, 4);
  return bs58.encode(Buffer.from([...combined, ...checksum]));
}

function bech32DecodeToHash(address: string): { hrp: string; version: number; hash: Uint8Array } {
  try {
    const decoded = bech32.decode(address);
    const data = new Uint8Array(bech32.fromWords(decoded.words));
    return {
      hrp: decoded.prefix,
      version: data[0] || 0,
      hash: data.slice(1),
    };
  } catch {
    const decoded = bech32m.decode(address);
    const data = new Uint8Array(bech32m.fromWords(decoded.words));
    return {
      hrp: decoded.prefix,
      version: data[0] || 0,
      hash: data.slice(1),
    };
  }
}

export function convertAddress(
  address: string,
  targetFormat: WalletFormat,
  network: NetworkId = 'bitcoin',
): string | null {
  const net = getNetwork(network);
  const decoded = bech32DecodeToHash(address);
  const hash = decoded.hash;

  switch (targetFormat) {
    case 'legacy':
      return base58CheckEncode(0x00, hash);
    case 'segwit': {
      const witnessProgram = new Uint8Array([0x00, 0x14, ...hash]);
      const h160 = ripemd160(sha256(witnessProgram));
      return base58CheckEncode(0x05, h160);
    }
    case 'native-segwit': {
      const hrp = net.hrp || 'bc';
      const words = bech32.toWords(hash);
      return bech32.encode(hrp, [0, ...words]);
    }
    case 'taproot': {
      const hrp = net.hrp || 'bc';
      const words = bech32.toWords(hash);
      return bech32m.encode(hrp, [1, ...words]);
    }
    default:
      return null;
  }
}

export function convertAddressFormats(
  address: string,
  network: NetworkId = 'bitcoin',
): ConversionResult {
  const net = getNetwork(network);
  const converted: Record<string, string> = {};

  // Detect current format
  let currentFormat: WalletFormat = 'legacy';
  if (address.startsWith('bc1p')) currentFormat = 'taproot';
  else if (address.startsWith('bc1')) currentFormat = 'native-segwit';
  else if (address.startsWith('3')) currentFormat = 'segwit';
  else if (address.startsWith('1')) currentFormat = 'legacy';

  // Try to convert to each format
  for (const format of net.addressFormats) {
    if (format === currentFormat) {
      converted[format] = address;
      continue;
    }
    try {
      const result = convertAddress(address, format, network);
      if (result) converted[format] = result;
    } catch {
      // Conversion not possible for this format
    }
  }

  return {
    original: address,
    originalFormat: currentFormat,
    converted,
    network,
  };
}
