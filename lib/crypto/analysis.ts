/**
 * Crypto Wallet Playground — Address Analysis.
 *
 * Analyzes the structure of a wallet address: encoding, prefix,
 * version byte, hash length, checksum.
 */

import bs58 from 'bs58';
import { bech32, bech32m } from 'bech32';
import { bytesToHex } from '@noble/hashes/utils.js';
import { sha256 } from '@noble/hashes/sha2.js';
import { keccak_256 } from '@noble/hashes/sha3.js';
import type { NetworkId, WalletFormat, AnalysisResult } from './types';
import { ALL_NETWORKS } from './networks';

function doubleSHA256(data: Uint8Array): Uint8Array {
  return sha256(sha256(data));
}

export function analyzeAddress(address: string): AnalysisResult | null {
  const trimmed = address.trim();

  if (!trimmed) return null;

  // Ethereum / EVM (EIP-55)
  if (/^0x[a-fA-F0-9]{40}$/.test(trimmed)) {
    const clean = trimmed.replace('0x', '');
    const bytes = new Uint8Array(clean.length / 2);
    for (let i = 0; i < clean.length; i += 2) {
      bytes[i / 2] = parseInt(clean.substring(i, i + 2), 16);
    }

    const hash = bytesToHex(keccak_256(new TextEncoder().encode(clean.toLowerCase())));

    return {
      network: 'ethereum',
      format: 'eip55',
      address: trimmed,
      byteLength: 20,
      prefix: '0x',
      hashLength: 20,
      checksum: hash.slice(0, 8),
      checksumValid: true,
      encoding: 'hex (EIP-55)',
      humanInterpretation: '20-byte Keccak-256 hash of public key, EIP-55 mixed-case checksum',
    };
  }

  // bech32m (Taproot — bc1p)
  if (trimmed.startsWith('bc1p')) {
    try {
      const decoded = bech32m.decode(trimmed);
      const data = bech32m.fromWords(decoded.words);
      return {
        network: 'bitcoin',
        format: 'taproot',
        address: trimmed,
        byteLength: data.length,
        prefix: 'bc1p',
        version: data[0] || 0,
        hashLength: data.length - 1,
        encoding: 'bech32m',
        checksumValid: true,
        humanInterpretation: `bc1p (BIP-341 Taproot), version ${data[0]}, ${data.length - 1} byte witness program`,
      };
    } catch {
      return null;
    }
  }

  // bech32 (Native SegWit — bc1)
  if (trimmed.startsWith('bc1')) {
    try {
      const decoded = bech32.decode(trimmed);
      const data = bech32.fromWords(decoded.words);
      return {
        network: 'bitcoin',
        format: 'native-segwit',
        address: trimmed,
        byteLength: data.length,
        prefix: 'bc1',
        version: data[0] || 0,
        hashLength: data.length - 1,
        encoding: 'bech32',
        checksumValid: true,
        humanInterpretation: `bc1 (BIP-173 Native SegWit), version ${data[0]}, ${data.length - 1} byte witness program`,
      };
    } catch {
      return null;
    }
  }

  // Base58 (Legacy, SegWit, etc.)
  if (/^[1-9A-HJ-NP-Za-km-z]+$/.test(trimmed)) {
    try {
      const decoded = bs58.decode(trimmed);
      if (decoded.length < 5) return null;

      const payload = decoded.slice(0, -4);
      const checksum = decoded.slice(-4);
      const hash = doubleSHA256(payload);
      const checksumOk = bytesToHex(hash.slice(0, 4)) === bytesToHex(checksum);

      const version = payload[0] || 0;
      const hashPart = payload.slice(1);

      let network: NetworkId = 'bitcoin';
      let format: WalletFormat = 'legacy';

      if (trimmed.startsWith('1')) { network = 'bitcoin'; format = 'legacy'; }
      else if (trimmed.startsWith('3')) { network = 'bitcoin'; format = 'segwit'; }
      else if (trimmed.startsWith('L')) { network = 'litecoin'; format = 'legacy'; }
      else if (trimmed.startsWith('M')) { network = 'litecoin'; format = 'segwit'; }
      else if (trimmed.startsWith('D')) { network = 'dogecoin'; format = 'legacy'; }
      else if (trimmed.startsWith('r')) { network = 'ripple'; format = 'base58'; }

      return {
        network,
        format,
        address: trimmed,
        byteLength: payload.length,
        prefix: `0x${version.toString(16).padStart(2, '0')}`,
        version,
        hashLength: hashPart.length,
        checksum: bytesToHex(checksum),
        checksumValid: checksumOk,
        encoding: 'base58check',
        humanInterpretation: `${version.toString(16)}-byte version, ${hashPart.length}-byte pubkey hash, 4-byte checksum`,
      };
    } catch {
      return null;
    }
  }

  return null;
}
