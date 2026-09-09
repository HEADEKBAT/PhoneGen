/**
 * Crypto Wallet Playground — Security Education Content.
 *
 * Educational texts explaining cryptographic concepts.
 * Used by the Security Education module.
 */

export interface SecurityTopic {
  id: string;
  title: string;
  summary: string;
  content: string;
  relatedTopics: string[];
}

export const SECURITY_TOPICS: Record<string, SecurityTopic> = {
  'private-key': {
    id: 'private-key',
    title: 'Private Key',
    summary: 'A secret number that allows you to spend your cryptocurrencies.',
    content: `A private key is a large random number (256 bits for most cryptocurrencies) that serves as the fundamental secret in a wallet. It is used to sign transactions, proving ownership of funds.

Key properties:
• 256-bit random integer (for Bitcoin/Ethereum)
• Must be kept secret — anyone with your private key controls your funds
• Used to derive the public key via elliptic curve multiplication
• Usually represented as 64 hex characters or 52 Base58 characters
• Lost private key = lost funds (no recovery possible)`,
    relatedTopics: ['public-key', 'hd-wallet', 'mnemonic'],
  },
  'public-key': {
    id: 'public-key',
    title: 'Public Key',
    summary: 'Derived from the private key, used to generate wallet addresses.',
    content: `A public key is derived from a private key using elliptic curve cryptography (ECC). It can be shared freely without compromising security.

Key properties:
• Derived from private key (one-way — cannot reverse)
• Used to generate wallet addresses
• Can be compressed (33 bytes) or uncompressed (65 bytes)
• In ECC: public_key = private_key × G (generator point)
• Bitcoin uses secp256k1 curve; Ethereum uses the same`,
    relatedTopics: ['private-key', 'address-generation'],
  },
  'seed-phrase': {
    id: 'seed-phrase',
    title: 'Seed Phrase (Mnemonic)',
    summary: 'A human-readable backup of your wallet, typically 12-24 words.',
    content: `A seed phrase (mnemonic) is a sequence of words that encodes the entropy used to generate your wallet's master key. It follows the BIP39 standard.

Key properties:
• Typically 12, 15, 18, 21, or 24 words
• Each word comes from a 2048-word dictionary
• Represents 128-256 bits of entropy
• Used to deterministically derive all wallet keys
• Compatible across different wallet software (BIP39 standard)
• With the same seed phrase + passphrase, you always get the same wallet`,
    relatedTopics: ['bip39', 'hd-wallet', 'derivation-path'],
  },
  'hd-wallet': {
    id: 'hd-wallet',
    title: 'HD Wallet (Hierarchical Deterministic)',
    summary: 'A wallet system that derives all keys from a single seed.',
    content: `A Hierarchical Deterministic (HD) wallet uses a single seed to derive an entire tree of key pairs. This means you only need to back up the seed phrase.

Key properties:
• BIP32 standard defines HD wallet structure
• Master key derived from seed using HMAC-SHA512
• Child keys derived using CKD (Child Key Derivation)
• Hardened derivation prevents parent key compromise from affecting children
• Extended public keys (xpub) can derive children without private keys`,
    relatedTopics: ['bip32', 'bip44', 'derivation-path'],
  },
  'checksum': {
    id: 'checksum',
    title: 'Address Checksum',
    summary: 'A validation mechanism that detects typos in addresses.',
    content: `Address checksums provide error detection for cryptocurrency addresses.

Types of checksums:

1. Base58Check (Bitcoin Legacy): Double-SHA256 hash, last 4 bytes appended to payload
2. bech32 (SegWit): BCH codes for error detection and correction
3. EIP-55 (Ethereum): Mixed-case checksum using Keccak-256 hash

Checksums can detect:
• Single character typos
• Character transpositions
• Most common copy-paste errors`,
    relatedTopics: ['address-validation', 'base58', 'bech32'],
  },
  'derivation-path': {
    id: 'derivation-path',
    title: 'Derivation Path (BIP44)',
    summary: 'A standardized path for deriving wallet keys in an HD wallet.',
    content: `A derivation path defines how to navigate the HD wallet tree to reach a specific key. BIP44 defines the standard structure:

m / purpose' / coin_type' / account' / change / address_index

Example: m/44'/0'/0'/0/0

• m = master node
• 44' = BIP44 purpose (hardened)
• 0' = Bitcoin coin type (hardened) — 60 for Ethereum
• 0' = Account 0 (hardened)
• 0 = External chain (0 = receiving, 1 = change)
• 0 = First address index

The apostrophe (') denotes hardened derivation — it prevents exposure of child keys if the parent public key is leaked.`,
    relatedTopics: ['bip44', 'hd-wallet', 'bip32'],
  },
  'bip32': {
    id: 'bip32',
    title: 'BIP32 — HD Wallets',
    summary: 'The standard for hierarchical deterministic wallets.',
    content: 'BIP32 (Bitcoin Improvement Proposal 32) introduced hierarchical deterministic wallets, allowing all keys in a wallet to be derived from a single seed phrase. This eliminated the need to back up every individual key.',
    relatedTopics: ['hd-wallet', 'bip44', 'bip39'],
  },
  'bip39': {
    id: 'bip39',
    title: 'BIP39 — Mnemonic Phrases',
    summary: 'The standard for human-readable wallet backups.',
    content: 'BIP39 defines how to encode wallet entropy into a sequence of words. The wordlist contains 2048 carefully chosen words, providing error-checking through the checksum included in the mnemonic.',
    relatedTopics: ['seed-phrase', 'bip32', 'bip44'],
  },
  'bip44': {
    id: 'bip44',
    title: 'BIP44 — Multi-Account Hierarchy',
    summary: 'Standardized derivation paths for multiple cryptocurrencies.',
    content: 'BIP44 extends BIP32 with a standardized tree structure that supports multiple coin types, accounts, and address types from a single seed phrase. It defines the m/purpose/coin_type/account/change/address_index path convention.',
    relatedTopics: ['derivation-path', 'bip32', 'hd-wallet'],
  },
};

export function getSecurityTopic(id: string): SecurityTopic | undefined {
  return SECURITY_TOPICS[id];
}

export function getAllSecurityTopics(): SecurityTopic[] {
  return Object.values(SECURITY_TOPICS);
}
