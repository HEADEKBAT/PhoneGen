/**
 * Crypto Wallet Playground — Route configuration for sitemap & SEO.
 *
 * Each entry corresponds to a dedicated tool page at /crypto-wallet-playground/{slug}.
 */

export interface CryptoRouteEntry {
  slug: string;
}

export const CRYPTO_TOOL_ROUTES: CryptoRouteEntry[] = [
  { slug: 'wallet-generator' },
  { slug: 'mnemonic-generator' },
  { slug: 'address-validator' },
  { slug: 'address-converter' },
  { slug: 'hd-wallet-explorer' },
  { slug: 'wallet-qr-generator' },
  { slug: 'network-explorer' },
  { slug: 'developer-playground' },
  { slug: 'security-education' },
  { slug: 'negative-testing' },
  { slug: 'interactive-wallet-explorer' },
];
