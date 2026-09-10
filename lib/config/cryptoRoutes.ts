/**
 * Crypto Wallet Playground — Route configuration for sitemap & SEO.
 *
 * Each entry corresponds to a dedicated tool page at /crypto-wallet-playground/{slug}.
 */

export interface CryptoRouteEntry {
  slug: string;
}

/**
 * NOTE — emptied deliberately.
 *
 * These slugs were listed before their pages were written, so app/sitemap.ts
 * advertised 11 URLs per locale that answer 404. A sitemap full of missing
 * pages is a quality signal against the whole site, and Search Console reports
 * every one of them.
 *
 * Unlike the SEO landing pages, these entries carry no content — just a slug —
 * so there is nothing to generate a page from. Restore an entry at the same
 * time as its app/[locale]/crypto-wallet-playground/{{slug}}/page.tsx, not before;
 * `node scripts/seo/sitemap.check.mjs` now fails when a listed slug has no page.
 *
 * The previous list is preserved below, commented out, so the intended tool
 * set is not lost.
 */
export const CRYPTO_TOOL_ROUTES: CryptoRouteEntry[] = [
  // { slug: 'wallet-generator' },
  // { slug: 'mnemonic-generator' },
  // { slug: 'address-validator' },
  // { slug: 'address-converter' },
  // { slug: 'hd-wallet-explorer' },
  // { slug: 'wallet-qr-generator' },
  // { slug: 'network-explorer' },
  // { slug: 'developer-playground' },
  // { slug: 'security-education' },
  // { slug: 'negative-testing' },
  // { slug: 'interactive-wallet-explorer' },
];
