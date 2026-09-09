/**
 * Crypto Wallet Playground — Address Validation.
 *
 * Validates cryptocurrency addresses across 22+ networks.
 */

import bs58 from 'bs58';
import { bech32, bech32m } from 'bech32';
import { bytesToHex } from '@noble/hashes/utils.js';
import { keccak_256 } from '@noble/hashes/sha3.js';
import { sha256 } from '@noble/hashes/sha2.js';
import type { NetworkId, ValidationResult, WalletFormat } from './types';
import { NETWORKS, ALL_NETWORKS } from './networks';

function doubleSHA256(data: Uint8Array): Uint8Array {
  return sha256(sha256(data));
}

function verifyBase58Check(address: string): { valid: boolean; payload: Uint8Array; version: number } {
  try {
    const decoded = bs58.decode(address);
    if (decoded.length < 5) return { valid: false, payload: new Uint8Array(), version: 0 };

    const payload = decoded.slice(0, -4);
    const checksum = decoded.slice(-4);
    const hash = doubleSHA256(payload);

    const checksumHex = bytesToHex(hash.slice(0, 4));
    const givenHex = bytesToHex(checksum);

    return {
      valid: checksumHex === givenHex,
      payload,
      version: payload[0] || 0,
    };
  } catch {
    return { valid: false, payload: new Uint8Array(), version: 0 };
  }
}

function verifyEIP55(address: string): boolean {
  const clean = address.replace('0x', '');
  if (!/^[0-9a-fA-F]{40}$/.test(clean)) return false;
  if (!/[A-F]/.test(clean)) return true; // all lowercase — valid but not checksummed
  if (!/[a-f]/.test(clean)) return true; // all uppercase — valid but not checksummed

  const hash = bytesToHex(keccak_256(new TextEncoder().encode(clean.toLowerCase())));
  for (let i = 0; i < 40; i++) {
    const char = clean[i]!;
    const hashNibble = parseInt(hash[i]!, 16);
    if ((hashNibble >= 8 && char.toLowerCase() === char) ||
        (hashNibble < 8 && char.toUpperCase() === char)) {
      return false;
    }
  }
  return true;
}

function verifyBech32(address: string, hrp?: string): boolean {
  try {
    const decoded = bech32.decode(address);
    if (hrp && decoded.prefix !== hrp) return false;
    return true;
  } catch {
    return false;
  }
}

function verifyBech32m(address: string, hrp?: string): boolean {
  try {
    const decoded = bech32m.decode(address);
    if (hrp && decoded.prefix !== hrp) return false;
    return true;
  } catch {
    return false;
  }
}

export function validateAddress(
  address: string,
  network?: NetworkId,
): ValidationResult {
  const warnings: string[] = [];
  const trimmed = address.trim();

  if (!trimmed) {
    return { valid: false, address: trimmed, warnings: ['Address is empty'] };
  }

  // Detect format
  let format: WalletFormat | undefined;
  let detectedNetwork: NetworkId | undefined;

  // Check EIP-55 (0x-prefixed, 42 chars)
  if (/^0x[a-fA-F0-9]{40}$/.test(trimmed)) {
    format = 'eip55';
    const checksumOk = verifyEIP55(trimmed);
    if (!checksumOk) warnings.push('EIP-55 checksum mismatch');

    // Determine network
    for (const net of ALL_NETWORKS) {
      if (net.addressFormats.includes('eip55')) {
        detectedNetwork = net.id;
        break;
      }
    }
    detectedNetwork = detectedNetwork || 'ethereum';

    return {
      valid: checksumOk,
      address: trimmed,
      network: network || detectedNetwork,
      format,
      checksumValid: checksumOk,
      lengthValid: trimmed.length === 42,
      prefixValid: trimmed.startsWith('0x'),
      encoding: 'hex',
      warnings,
    };
  }

  // Check bech32m (Taproot — bc1p)
  if (trimmed.startsWith('bc1p')) {
    const ok = verifyBech32m(trimmed, 'bc');
    if (!ok) warnings.push('Invalid bech32m (Taproot) encoding');
    return {
      valid: ok,
      address: trimmed,
      network: network || 'bitcoin',
      format: 'taproot',
      checksumValid: ok,
      lengthValid: true,
      prefixValid: trimmed.startsWith('bc1p'),
      encoding: 'bech32m',
      warnings,
    };
  }

  // Check bech32 (Native SegWit — bc1, ltc1, addr, cosmos, etc.)
  if (/^[a-z]+1[a-z0-9]+$/.test(trimmed)) {
    let ok = false;
    let netId: NetworkId = 'bitcoin';

    if (trimmed.startsWith('bc1')) {
      ok = verifyBech32(trimmed, 'bc');
      netId = 'bitcoin';
      format = 'native-segwit';
    } else if (trimmed.startsWith('ltc1')) {
      ok = verifyBech32(trimmed, 'ltc');
      netId = 'litecoin';
      format = 'native-segwit';
    } else if (trimmed.startsWith('addr')) {
      ok = verifyBech32(trimmed, 'addr');
      netId = 'cardano';
      format = 'bech32';
    } else if (trimmed.startsWith('cosmos')) {
      ok = verifyBech32(trimmed, 'cosmos');
      netId = 'cosmos';
      format = 'bech32';
    } else {
      ok = verifyBech32(trimmed);
      format = 'bech32';
    }

    if (!ok) warnings.push('Invalid bech32 encoding');
    return {
      valid: ok,
      address: trimmed,
      network: network || netId,
      format,
      checksumValid: ok,
      lengthValid: true,
      prefixValid: true,
      encoding: 'bech32',
      warnings,
    };
  }

  // Check Base58 (Legacy, SegWit, LTC, DOGE, etc.)
  if (/^[1-9A-HJ-NP-Za-km-z]+$/.test(trimmed)) {
    const { valid, version } = verifyBase58Check(trimmed);

    if (!valid) {
      warnings.push('Base58 checksum mismatch');
    }

    // Detect network by prefix/version
    if (trimmed.startsWith('1') || trimmed.startsWith('3')) {
      detectedNetwork = 'bitcoin';
      format = trimmed.startsWith('1') ? 'legacy' : 'segwit';
    } else if (trimmed.startsWith('L') || trimmed.startsWith('M')) {
      detectedNetwork = 'litecoin';
      format = trimmed.startsWith('L') ? 'legacy' : 'segwit';
    } else if (trimmed.startsWith('D')) {
      detectedNetwork = 'dogecoin';
      format = 'legacy';
    } else if (trimmed.startsWith('r')) {
      detectedNetwork = 'ripple';
      format = 'base58';
    } else if (trimmed.startsWith('T')) {
      detectedNetwork = 'tron';
      format = 'base58';
    }

    return {
      valid: valid && !!detectedNetwork,
      address: trimmed,
      network: network || detectedNetwork || 'bitcoin',
      format: format || 'legacy',
      checksumValid: valid,
      lengthValid: trimmed.length >= 26 && trimmed.length <= 35,
      prefixValid: !!detectedNetwork,
      encoding: 'base58',
      warnings,
    };
  }

  warnings.push('Unknown address format');
  return {
    valid: false,
    address: trimmed,
    warnings,
  };
}

export function validateMultiple(
  addresses: string[],
  network?: NetworkId,
): ValidationResult[] {
  return addresses.map((a) => validateAddress(a, network));
}
