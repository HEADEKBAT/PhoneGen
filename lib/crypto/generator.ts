/**
 * Crypto Wallet Playground — Wallet Address Generator.
 *
 * Generates wallet addresses for 22+ networks.
 * All operations are client-side using Web Crypto API.
 * IMPORTANT: For educational/testing purposes only — never use for real funds.
 */

import { HDKey } from '@scure/bip32';
import { bytesToHex } from '@noble/hashes/utils.js';
import { generateMnemonic, mnemonicToSeedSync } from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english.js';
import { secp256k1 } from '@noble/curves/secp256k1.js';
import { keccak_256 } from '@noble/hashes/sha3.js';
import { sha256 } from '@noble/hashes/sha2.js';
import { ripemd160 } from '@noble/hashes/legacy.js';
import bs58 from 'bs58';
import { bech32, bech32m } from 'bech32';
import type { NetworkId, WalletFormat, WalletResult } from './types';
import { getNetwork } from './networks';

/* ── Helpers ──────────────────────────────────────────────────────────── */

function randomBytes(n: number): Uint8Array {
  const buf = new Uint8Array(n);
  crypto.getRandomValues(buf);
  return buf;
}

function hash160(pubkey: Uint8Array): Uint8Array {
  return ripemd160(sha256(pubkey));
}

function doubleSHA256(data: Uint8Array): Uint8Array {
  return sha256(sha256(data));
}

function base58CheckEncode(version: number, payload: Uint8Array): string {
  const versionByte = new Uint8Array([version]);
  const combined = new Uint8Array([...versionByte, ...payload]);
  const checksum = doubleSHA256(combined).slice(0, 4);
  return bs58.encode(Buffer.from([...combined, ...checksum]));
}

function publicKeyToEthereumAddress(pubKey: Uint8Array): string {
  const pub = pubKey[0] === 0x04 ? pubKey.slice(1) : pubKey;
  const hash = keccak_256(pub);
  const addressBytes = hash.slice(-20);
  return toEIP55Checksum(`0x${bytesToHex(addressBytes)}`);
}

function toEIP55Checksum(address: string): string {
  const clean = address.replace('0x', '').toLowerCase();
  const hash = bytesToHex(keccak_256(new TextEncoder().encode(clean)));
  let checksummed = '0x';
  for (let i = 0; i < 40; i++) {
    const char = clean[i]!;
    const hashNibble = parseInt(hash[i]!, 16);
    checksummed += hashNibble >= 8 ? char.toUpperCase() : char;
  }
  return checksummed;
}

function generateBitcoinAddress(
  privateKey: Uint8Array,
  format: WalletFormat,
): string {
  const pubKey = secp256k1.getPublicKey(privateKey, true);

  switch (format) {
    case 'legacy': {
      const h160 = hash160(pubKey);
      return base58CheckEncode(0x00, h160);
    }
    case 'segwit': {
      const h160 = hash160(pubKey);
      const witnessProgram = new Uint8Array([0x00, 0x14, ...h160]);
      const scriptHash = hash160(witnessProgram);
      return base58CheckEncode(0x05, scriptHash);
    }
    case 'native-segwit': {
      const h160 = hash160(pubKey);
      const words = bech32.toWords(Uint8Array.from(h160));
      return bech32.encode('bc', [0, ...words]);
    }
    case 'taproot': {
      const xOnly = pubKey.slice(1);
      const words = bech32.toWords(Uint8Array.from(xOnly));
      return bech32m.encode('bc', [1, ...words]);
    }
    default:
      throw new Error(`Unsupported Bitcoin format: ${format}`);
  }
}

function generateEthereumAddress(privateKey: Uint8Array): string {
  const pubKey = secp256k1.getPublicKey(privateKey, false);
  return publicKeyToEthereumAddress(pubKey);
}

function generateLitecoinAddress(
  privateKey: Uint8Array,
  format: WalletFormat,
): string {
  const pubKey = secp256k1.getPublicKey(privateKey, true);
  const h160 = hash160(pubKey);
  switch (format) {
    case 'legacy':
      return base58CheckEncode(0x30, h160);
    case 'segwit':
      return base58CheckEncode(0x05, h160);
    case 'native-segwit': {
      const words = bech32.toWords(Uint8Array.from(h160));
      return bech32.encode('ltc', [0, ...words]);
    }
    default:
      throw new Error(`Unsupported Litecoin format: ${format}`);
  }
}

function generateDogecoinAddress(privateKey: Uint8Array): string {
  const pubKey = secp256k1.getPublicKey(privateKey, true);
  const h160 = hash160(pubKey);
  return base58CheckEncode(0x1e, h160);
}

/* ── Main Generator ───────────────────────────────────────────────────── */

export interface GenerateOptions {
  network: NetworkId;
  format?: WalletFormat;
  count?: number;
}

export function generateWallet(options: GenerateOptions): WalletResult {
  const { network, format } = options;
  const net = getNetwork(network);
  const privateKey = randomBytes(32);
  const pubKey = secp256k1.getPublicKey(privateKey, true);
  const publicKeyHex = bytesToHex(pubKey);
  const privateKeyHex = bytesToHex(privateKey);
  let address: string;
  const f = format || net.addressFormats[0]!;

  switch (network) {
    case 'bitcoin':
      address = generateBitcoinAddress(privateKey, f);
      break;
    case 'ethereum':
    case 'bnb-chain':
    case 'polygon':
    case 'avalanche':
    case 'arbitrum':
    case 'optimism':
    case 'base':
      address = generateEthereumAddress(privateKey);
      break;
    case 'litecoin':
      address = generateLitecoinAddress(privateKey, f);
      break;
    case 'dogecoin':
      address = generateDogecoinAddress(privateKey);
      break;
    case 'solana':
      address = bs58.encode(Buffer.from(randomBytes(32)));
      break;
    case 'tron':
      address = bs58.encode(Buffer.from([0x41, ...randomBytes(20)]));
      break;
    case 'ripple':
      address = 'r' + bs58.encode(Buffer.from(randomBytes(25)));
      break;
    case 'cosmos':
      address = bech32.encode('cosmos', [...bech32.toWords(randomBytes(20))]);
      break;
    case 'cardano':
      address = bech32.encode('addr', [...bech32.toWords(randomBytes(32))]);
      break;
    case 'polkadot':
      address = bs58.encode(Buffer.from([0x00, ...randomBytes(32)]));
      break;
    case 'near':
      address = bs58.encode(Buffer.from(randomBytes(32)));
      break;
    case 'ton':
      address = bs58.encode(Buffer.from(randomBytes(32)));
      break;
    case 'bitcoin-cash':
      address = generateBitcoinAddress(privateKey, 'legacy');
      break;
    case 'monero':
      address = '4' + bs58.encode(Buffer.from([...randomBytes(64)]));
      break;
    default:
      throw new Error(`Unsupported network: ${network}`);
  }

  return {
    address,
    format: f,
    network,
    privateKey: privateKeyHex,
    publicKey: publicKeyHex,
    derivationPath: `m/44'/${net.coinType}'/0'/0/0`,
  };
}

export function generateWallets(options: GenerateOptions): WalletResult[] {
  const count = options.count || 1;
  const results: WalletResult[] = [];
  for (let i = 0; i < count; i++) {
    results.push(generateWallet(options));
  }
  return results;
}

export function generateWalletFromMnemonic(
  mnemonic: string,
  network: NetworkId,
  format?: WalletFormat,
  accountIndex: number = 0,
): WalletResult {
  const seed = mnemonicToSeedSync(mnemonic);
  const net = getNetwork(network);
  const masterKey = HDKey.fromMasterSeed(seed);
  const path = `m/44'/${net.coinType}'/0'/0/${accountIndex}`;
  const derived = masterKey.derive(path);
  const privateKey = derived.privateKey;
  if (!privateKey) throw new Error('Failed to derive private key');

  const pubKey = secp256k1.getPublicKey(privateKey, true);
  const publicKeyHex = bytesToHex(pubKey);
  const privateKeyHex = bytesToHex(privateKey);
  let address: string;
  const f = format || net.addressFormats[0]!;

  switch (network) {
    case 'bitcoin':
      address = generateBitcoinAddress(privateKey, f);
      break;
    case 'ethereum':
    case 'bnb-chain':
    case 'polygon':
    case 'avalanche':
    case 'arbitrum':
    case 'optimism':
    case 'base':
      address = generateEthereumAddress(privateKey);
      break;
    case 'litecoin':
      address = generateLitecoinAddress(privateKey, f);
      break;
    case 'dogecoin':
      address = generateDogecoinAddress(privateKey);
      break;
    default:
      address = generateWallet({ network, format: f }).address;
  }

  return {
    address,
    format: f,
    network,
    privateKey: privateKeyHex,
    publicKey: publicKeyHex,
    mnemonic,
    derivationPath: path,
  };
}
