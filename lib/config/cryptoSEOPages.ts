/**
 * Crypto Wallet Playground — SEO Landing Pages Config.
 *
 * Defines metadata, hero content, and FAQ for each SEO landing page.
 * Each page is a thin server component that reads its config from here.
 * Follows the same pattern as credentialSEOPages.ts and paymentSEOPages.ts.
 */

export interface SEOFaq {
  q: string;
  a: string;
}

export interface CryptoSEOPageConfig {
  id: string;
  slug: string;
  title: string;
  description: string;
  heroTitle: string;
  heroSubtitle: string;
  ctaLabel?: string;
  faqs: SEOFaq[];
}

/* ── Shared FAQ pools ────────────────────────────────────────────────────────── */

const WALLET_FAQS: SEOFaq[] = [
  { q: 'Are generated wallets real?', a: 'No. Generated wallets are structurally valid but should never be used for real funds. They are intended for development, testing, and educational purposes only.' },
  { q: 'Where is my data processed?', a: 'All generation happens entirely in your browser. No data is sent to any server. Generated private keys and mnemonics never leave your device.' },
  { q: 'How are wallet addresses generated?', a: 'We use the Web Crypto API for cryptographically secure random number generation, combined with elliptic curve cryptography (secp256k1) for public key derivation.' },
];

const BITCOIN_FAQS: SEOFaq[] = [
  { q: 'What Bitcoin address formats are supported?', a: 'We support all four Bitcoin address formats: Legacy (P2PKH, starting with 1), SegWit (P2SH, starting with 3), Native SegWit (bech32, bc1), and Taproot (bech32m, bc1p).' },
  { q: 'Can I generate testnet Bitcoin addresses?', a: 'Yes. You can generate both mainnet and testnet Bitcoin addresses. Testnet addresses work with Bitcoin testnet faucets for development.' },
  { q: 'Are generated Bitcoin keys secure?', a: 'Keys are generated using the Web Crypto API\'s cryptographically secure random number generator. However, they are intended for testing — never use generated wallets for real Bitcoin.' },
];

const ETHEREUM_FAQS: SEOFaq[] = [
  { q: 'What is an Ethereum address?', a: 'An Ethereum address is a 20-byte (40 hex character) identifier derived from the last 20 bytes of the Keccak-256 hash of the public key, prefixed with 0x.' },
  { q: 'What is EIP-55?', a: 'EIP-55 is a standard for mixed-case checksummed Ethereum addresses. It uses the Keccak-256 hash to determine which characters should be uppercase, providing error detection.' },
  { q: 'Can I generate testnet Ethereum addresses?', a: 'Yes. Generate addresses for Sepolia and Holesky testnets. These work with public faucets for development testing.' },
];

const VALIDATOR_FAQS: SEOFaq[] = [
  { q: 'How does address validation work?', a: 'The validator checks multiple criteria: format detection (Base58, bech32, EIP-55), checksum verification, length validation, and network prefix matching.' },
  { q: 'What networks does the validator support?', a: 'All 22+ supported networks: Bitcoin, Ethereum, Litecoin, Dogecoin, Solana, Tron, Ripple, Cosmos, Cardano, and more.' },
  { q: 'Can I validate multiple addresses at once?', a: 'Yes. You can paste multiple addresses and validate them all at once, seeing results for each one.' },
];

const MNEMONIC_FAQS: SEOFaq[] = [
  { q: 'What is a BIP39 mnemonic?', a: 'A BIP39 mnemonic is a sequence of words that encodes the entropy used to generate a wallet\'s master key. It\'s the standard for wallet backups across all major cryptocurrency wallets.' },
  { q: 'How many words should I use?', a: '12 words (128-bit security) is sufficient for most purposes. 24 words (256-bit security) provides extra security margin. We support 12, 15, 18, 21, and 24 words.' },
  { q: 'Are generated mnemonics secure?', a: 'Yes. They are generated using cryptographically secure randomness. However, they are intended for testing — never use generated mnemonics for real wallets.' },
];

const HD_FAQS: SEOFaq[] = [
  { q: 'What is an HD wallet?', a: 'A Hierarchical Deterministic (HD) wallet derives all keys from a single seed phrase using the BIP32 standard. This means you only need to back up one seed phrase.' },
  { q: 'What is BIP44?', a: 'BIP44 defines a standardized derivation path structure: m/purpose\'/coin_type\'/account\'/change/address_index. This ensures compatibility across different wallet software.' },
  { q: 'What is a derivation path?', a: 'A derivation path navigates the HD wallet tree to reach a specific key. For example, m/44\'/0\'/0\'/0/0 points to the first receiving address of the first Bitcoin account.' },
];

const QR_FAQS: SEOFaq[] = [
  { q: 'What is a crypto payment URI?', a: 'A crypto payment URI encodes a payment request in a format like bitcoin:address?amount=0.01. It can be scanned by wallet apps to auto-fill payment details.' },
  { q: 'Which URI schemes are supported?', a: 'We support bitcoin:, ethereum:, litecoin:, dogecoin:, solana:, tron:, ripple:, monero:, polkadot:, cardano:, cosmos:, near:, and ton: URI schemes.' },
  { q: 'Can I scan the QR code?', a: 'Yes. The QR code can be scanned by any cryptocurrency wallet app that supports the respective URI scheme.' },
];

const PLAYGROUND_FAQS: SEOFaq[] = [
  { q: 'What is the Crypto Wallet Playground?', a: 'An educational and professional tool for developers, QA engineers, and Web3 enthusiasts. It generates, validates, analyzes, and explores cryptocurrency wallet addresses for 22+ blockchains. It is NOT a real crypto wallet.' },
  { q: 'Is this tool safe?', a: 'Yes. All operations happen locally in your browser using the Web Crypto API. No data is ever sent to any server. The tool explicitly warns users not to use generated data for real funds.' },
  { q: 'What can I do with this tool?', a: 'Generate wallet addresses, create BIP39 mnemonics, validate and analyze addresses, convert between formats, explore HD wallet derivation trees, generate payment QR codes, and learn about blockchain security.' },
];

/* ── SEO Pages ───────────────────────────────────────────────────────────────── */

const WALLET_GENERATOR_PAGE: CryptoSEOPageConfig = {
  id: 'crypto-wallet-generator',
  slug: 'crypto-wallet-generator',
  title: 'Crypto Wallet Generator — Generate Test Wallet Addresses for 22+ Blockchains',
  description: 'Generate test cryptocurrency wallet addresses for Bitcoin, Ethereum, Solana, and 20+ other blockchains. Free online wallet address generator for development and testing.',
  heroTitle: 'Crypto Wallet Address Generator',
  heroSubtitle: 'Generate test wallet addresses for 22+ blockchains. All formats, all networks — 100% client-side.',
  ctaLabel: 'Generate Wallets',
  faqs: WALLET_FAQS,
};

const BITCOIN_GENERATOR_PAGE: CryptoSEOPageConfig = {
  id: 'bitcoin-address-generator',
  slug: 'bitcoin-address-generator',
  title: 'Bitcoin Address Generator — Generate Test BTC Wallet Addresses',
  description: 'Generate test Bitcoin wallet addresses in Legacy, SegWit, Native SegWit, and Taproot formats. Free online Bitcoin address generator for development.',
  heroTitle: 'Bitcoin Address Generator',
  heroSubtitle: 'Generate test Bitcoin addresses in all four formats: Legacy (1...), SegWit (3...), Native SegWit (bc1), and Taproot (bc1p).',
  ctaLabel: 'Generate Bitcoin Addresses',
  faqs: BITCOIN_FAQS,
};

const ETHEREUM_GENERATOR_PAGE: CryptoSEOPageConfig = {
  id: 'ethereum-address-generator',
  slug: 'ethereum-address-generator',
  title: 'Ethereum Address Generator — Generate Test ETH Wallet Addresses',
  description: 'Generate test Ethereum wallet addresses with EIP-55 checksum. Supports EVM-compatible networks. Free online Ethereum address generator.',
  heroTitle: 'Ethereum Address Generator',
  heroSubtitle: 'Generate test Ethereum addresses with EIP-55 mixed-case checksum. Also compatible with BNB Chain, Polygon, Avalanche, and more.',
  ctaLabel: 'Generate Ethereum Addresses',
  faqs: ETHEREUM_FAQS,
};

const WALLET_VALIDATOR_PAGE: CryptoSEOPageConfig = {
  id: 'wallet-validator',
  slug: 'wallet-validator',
  title: 'Crypto Wallet Validator — Validate Bitcoin, Ethereum & Crypto Addresses',
  description: 'Validate cryptocurrency wallet addresses for 22+ blockchains. Check address format, checksum, prefix, and length. Free online crypto address validator.',
  heroTitle: 'Crypto Wallet Address Validator',
  heroSubtitle: 'Validate addresses across 22+ blockchains. Detects format, checksum validity, network, and encoding.',
  ctaLabel: 'Validate Addresses',
  faqs: VALIDATOR_FAQS,
};

const BITCOIN_VALIDATOR_PAGE: CryptoSEOPageConfig = {
  id: 'bitcoin-validator',
  slug: 'bitcoin-validator',
  title: 'Bitcoin Address Validator — Check BTC Address Validity',
  description: 'Validate Bitcoin addresses in Legacy, SegWit, Native SegWit, and Taproot formats. Check Base58Check and bech32 encoding.',
  heroTitle: 'Bitcoin Address Validator',
  heroSubtitle: 'Validate any Bitcoin address format — Legacy, SegWit, Native SegWit, or Taproot — with full checksum verification.',
  ctaLabel: 'Validate Bitcoin Address',
  faqs: BITCOIN_FAQS.concat(VALIDATOR_FAQS),
};

const ETHEREUM_VALIDATOR_PAGE: CryptoSEOPageConfig = {
  id: 'ethereum-validator',
  slug: 'ethereum-validator',
  title: 'Ethereum Address Validator — Check ETH Address Validity & EIP-55',
  description: 'Validate Ethereum addresses with EIP-55 checksum verification. Supports all EVM-compatible networks.',
  heroTitle: 'Ethereum Address Validator',
  heroSubtitle: 'Validate Ethereum addresses with EIP-55 mixed-case checksum. Detects common copy-paste errors.',
  ctaLabel: 'Validate Ethereum Address',
  faqs: ETHEREUM_FAQS.concat(VALIDATOR_FAQS),
};

const MNEMONIC_GENERATOR_PAGE: CryptoSEOPageConfig = {
  id: 'mnemonic-generator',
  slug: 'mnemonic-generator',
  title: 'BIP39 Mnemonic Generator — Generate Seed Phrases for Testing',
  description: 'Generate BIP39 mnemonic phrases for testing. Supports 12-24 words, 10 languages. Free online seed phrase generator for development.',
  heroTitle: 'BIP39 Mnemonic Generator',
  heroSubtitle: 'Generate BIP39-compliant mnemonic phrases in 10 languages. 12, 15, 18, 21, or 24 words.',
  ctaLabel: 'Generate Mnemonics',
  faqs: MNEMONIC_FAQS,
};

const BIP39_GENERATOR_PAGE: CryptoSEOPageConfig = {
  id: 'bip39-generator',
  slug: 'bip39-generator',
  title: 'BIP39 Seed Phrase Generator — 12-24 Word Mnemonics',
  description: 'Generate BIP39 seed phrases for testing. Multiple word counts and language support. Free online BIP39 mnemonic generator.',
  heroTitle: 'BIP39 Seed Phrase Generator',
  heroSubtitle: 'BIP39-compliant mnemonic generation. Multiple word counts, multiple languages.',
  ctaLabel: 'Generate Seed Phrase',
  faqs: MNEMONIC_FAQS,
};

const HD_WALLET_PAGE: CryptoSEOPageConfig = {
  id: 'hd-wallet-explorer',
  slug: 'hd-wallet-explorer',
  title: 'HD Wallet Explorer — Interactive BIP32/BIP44 Derivation Tree',
  description: 'Explore HD wallet derivation trees interactively. Visualize BIP32/BIP44 key derivation paths. Free online HD wallet explorer.',
  heroTitle: 'HD Wallet Explorer',
  heroSubtitle: 'Interactive exploration of BIP32/BIP44 hierarchical deterministic wallet derivation trees.',
  ctaLabel: 'Explore HD Wallet',
  faqs: HD_FAQS,
};

const WALLET_QR_PAGE: CryptoSEOPageConfig = {
  id: 'wallet-qr-generator',
  slug: 'wallet-qr-generator',
  title: 'Crypto QR Code Generator — Bitcoin, Ethereum & Crypto Payment QR Codes',
  description: 'Generate QR codes for cryptocurrency payment URIs. Supports bitcoin:, ethereum:, and 13+ other URI schemes.',
  heroTitle: 'Crypto QR Code Generator',
  heroSubtitle: 'Generate payment QR codes for any cryptocurrency. Scan-ready URIs with amount, label, and message.',
  ctaLabel: 'Generate QR Code',
  faqs: QR_FAQS,
};

const PLAYGROUND_PAGE: CryptoSEOPageConfig = {
  id: 'wallet-playground',
  slug: 'wallet-playground',
  title: 'Crypto Wallet Playground — Test Web3 Tools for Developers',
  description: 'A complete Web3 testing toolkit: generate wallets, validate addresses, create mnemonics, explore HD trees, and more. Free online crypto developer tools.',
  heroTitle: 'Crypto Wallet Playground',
  heroSubtitle: 'Your complete Web3 testing toolkit — wallet generation, validation, analysis, and education. All in your browser.',
  ctaLabel: 'Open Playground',
  faqs: PLAYGROUND_FAQS,
};

const TEST_WALLET_PAGE: CryptoSEOPageConfig = {
  id: 'test-wallet-generator',
  slug: 'test-wallet-generator',
  title: 'Test Wallet Generator — Generate Testnet Wallet Addresses',
  description: 'Generate test wallet addresses for Sepolia, Holesky, Amoy, BNB Testnet, and more. Free online testnet wallet generator.',
  heroTitle: 'Test Wallet Generator',
  heroSubtitle: 'Generate testnet wallet addresses for Sepolia, Holesky, Amoy, and other public testnets.',
  ctaLabel: 'Generate Test Wallets',
  faqs: WALLET_FAQS,
};

const BLOCKCHAIN_GENERATOR_PAGE: CryptoSEOPageConfig = {
  id: 'blockchain-address-generator',
  slug: 'blockchain-address-generator',
  title: 'Blockchain Address Generator — Multi-Network Wallet Generator',
  description: 'Generate cryptocurrency wallet addresses for Bitcoin, Ethereum, Litecoin, Dogecoin, Solana, and more. Free online blockchain address generator.',
  heroTitle: 'Blockchain Address Generator',
  heroSubtitle: 'Generate wallet addresses for any supported blockchain network. 22+ networks, all address formats.',
  ctaLabel: 'Generate Addresses',
  faqs: WALLET_FAQS,
};

const CRYPTO_VALIDATOR_PAGE: CryptoSEOPageConfig = {
  id: 'crypto-address-validator',
  slug: 'crypto-address-validator',
  title: 'Crypto Address Validator — Multi-Network Address Checker',
  description: 'Validate cryptocurrency addresses across 22+ blockchains. Check format, checksum, and network compatibility.',
  heroTitle: 'Crypto Address Validator',
  heroSubtitle: 'Validate cryptocurrency addresses across 22+ blockchains with detailed analysis.',
  ctaLabel: 'Validate Addresses',
  faqs: VALIDATOR_FAQS,
};

/* ── Registry ──────────────────────────────────────────────────────────────────── */

export const CRYPTO_SEO_PAGES: CryptoSEOPageConfig[] = [
  WALLET_GENERATOR_PAGE,
  BITCOIN_GENERATOR_PAGE,
  ETHEREUM_GENERATOR_PAGE,
  WALLET_VALIDATOR_PAGE,
  BITCOIN_VALIDATOR_PAGE,
  ETHEREUM_VALIDATOR_PAGE,
  MNEMONIC_GENERATOR_PAGE,
  BIP39_GENERATOR_PAGE,
  HD_WALLET_PAGE,
  WALLET_QR_PAGE,
  PLAYGROUND_PAGE,
  TEST_WALLET_PAGE,
  BLOCKCHAIN_GENERATOR_PAGE,
  CRYPTO_VALIDATOR_PAGE,
];

export const ALL_CRYPTO_SEO_PAGES = CRYPTO_SEO_PAGES;
