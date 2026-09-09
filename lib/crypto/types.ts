/**
 * Crypto Wallet Playground — Shared Types.
 *
 * All engine types live here; UI components import from lib/crypto.
 */

/** Supported blockchain networks */
export type NetworkId =
  | 'bitcoin'
  | 'ethereum'
  | 'bnb-chain'
  | 'polygon'
  | 'avalanche'
  | 'arbitrum'
  | 'optimism'
  | 'base'
  | 'solana'
  | 'tron'
  | 'litecoin'
  | 'dogecoin'
  | 'bitcoin-cash'
  | 'monero'
  | 'ripple'
  | 'cardano'
  | 'polkadot'
  | 'cosmos'
  | 'near'
  | 'ton';

/** Wallet address formats */
export type WalletFormat =
  | 'legacy'     // P2PKH (Bitcoin)
  | 'segwit'     // P2SH-P2WPKH
  | 'native-segwit' // bech32 (bc1)
  | 'taproot'    // bech32m (bc1p)
  | 'eip55'      // Ethereum checksummed
  | 'base58'     // Litecoin/Dogecoin
  | 'base32'     // Ripple
  | 'bech32'     // Cosmos, etc.

/** Error correction levels for QR codes */
export type ErrorCorrection = 'L' | 'M' | 'Q' | 'H';

/** Network configuration */
export interface Network {
  id: NetworkId;
  name: string;
  symbol: string;
  coinType: number; // BIP44 coin type
  addressFormats: WalletFormat[];
  hrp?: string;    // Human-readable part for bech32
  prefixes?: string[]; // Base58 version prefixes
  explorerUrl: string;
  testnetExplorerUrl?: string;
  nativeToken: string;
  decimals: number;
  chainId?: number;
  consensus?: string;
  description: string;
}

/** HD Node in derivation tree */
export interface HDNode {
  path: string;
  depth: number;
  index: number;
  hardened: boolean;
  extendedPublicKey?: string;
  address?: string;
  network?: NetworkId;
  children: HDNode[];
}

/** Mnemonic configuration */
export interface MnemonicConfig {
  wordCount: 12 | 15 | 18 | 21 | 24;
  language: MnemonicLanguage;
}

export type MnemonicLanguage =
  | 'english'
  | 'chinese_simplified'
  | 'chinese_traditional'
  | 'french'
  | 'italian'
  | 'japanese'
  | 'korean'
  | 'spanish'
  | 'portuguese'
  | 'czech';

/** Validation result */
export interface ValidationResult {
  valid: boolean;
  network?: NetworkId;
  format?: WalletFormat;
  address: string;
  checksumValid?: boolean;
  lengthValid?: boolean;
  prefixValid?: boolean;
  encoding?: string;
  warnings: string[];
}

/** Analysis result */
export interface AnalysisResult {
  network: NetworkId;
  format: WalletFormat;
  address: string;
  byteLength: number;
  prefix?: string;
  version?: number;
  hashLength?: number;
  checksum?: string;
  checksumValid: boolean;
  encoding: string;
  humanInterpretation: string;
}

/** Generated wallet result */
export interface WalletResult {
  address: string;
  format: WalletFormat;
  network: NetworkId;
  privateKey?: string;
  publicKey?: string;
  mnemonic?: string;
  derivationPath?: string;
}

/** Conversion result */
export interface ConversionResult {
  original: string;
  originalFormat: WalletFormat;
  converted: Record<string, string>; // format -> address
  network: NetworkId;
}

/** Scan test result */
export interface ScanTestResult {
  readable: boolean;
  errorCorrection: ErrorCorrection;
  version: number;
  encoding: string;
  size: number;
  estimatedScanQuality: 'excellent' | 'good' | 'fair' | 'poor';
  warnings: string[];
}

/** History entry */
export interface HistoryEntry {
  id: string;
  type: 'generated' | 'validated' | 'converted' | 'mnemonic';
  network: NetworkId;
  address: string;
  timestamp: number;
  label?: string;
}

/** Crypto URI */
export interface CryptoURI {
  uri: string;
  scheme: string;
  address: string;
  amount?: string;
  label?: string;
  message?: string;
  parameters: Record<string, string>;
}

/** Export template */
export interface ExportTemplate {
  language: string;
  code: string;
}
