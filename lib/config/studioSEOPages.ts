/**
 * Studio SEO landing pages — manifests for `createStudioSEOPage`.
 *
 * Three registries already hold the copy for these pages:
 *
 *   • cryptoSEOPages.ts   — 14 pages beside the Crypto Wallet Playground
 *   • mediaSEOPages.ts    —  5 pages beside the Media Studio
 *   • paymentSEOPages.ts  — 11 pages beside the Payment Studio
 *
 * What they never carried is where each page lives, which studio it belongs to
 * and where its buttons point. That is what a manifest adds, and it is the
 * whole difference between a registry entry and a page.
 *
 * ── The two payment entries that are not here ───────────────────────────────
 *
 * PAYMENT_SEO_PAGES has eleven records; nine of them get a page from this file.
 * 'credit-card-generator' is skipped because it is a product in its own right
 * (products.ts) with a landing page of its own and an interactive tool at
 * /payment-studio/credit-card-generator — a third page describing the same tool
 * would compete with both. Every other payment record is a sub-topic with
 * nowhere else to live.
 *
 * ── Where each family is served ─────────────────────────────────────────────
 *
 * Crypto and media pages sit at the top level: they read as standalone answers
 * to a search ("convert mp4 to webm"), not as parts of a studio, and the
 * sitemap has always listed them there.
 *
 * Payment pages sit under /payment-studio/, matching what the barcode and
 * credential families do, with the bare top-level slug 308ing to them
 * (see legacyRedirects.ts). One URL per page, one canonical, no duplicate.
 */

import { ALL_CRYPTO_SEO_PAGES } from './cryptoSEOPages';
import { ALL_MEDIA_SEO_PAGES } from './mediaSEOPages';
import { ALL_PAYMENT_SEO_PAGES } from './paymentSEOPages';
import type { StudioSEOPageManifest } from '@/core/studio-seo-factory';

/* ── Studios ────────────────────────────────────────────────────────────────── */

interface StudioBinding {
  /** Product id — the breadcrumb reads its translated name. */
  product: string;
  parentHref: string;
  ctaHref: string;
  /** Path prefix for this family's pages, '' for top level. */
  prefix: string;
}

const CRYPTO: StudioBinding = {
  product: 'cryptoWallet',
  parentHref: 'crypto-wallet-playground',
  ctaHref: 'crypto-wallet-playground/tool',
  prefix: '',
};

const MEDIA: StudioBinding = {
  product: 'media',
  parentHref: 'media-studio',
  ctaHref: 'media-studio/tool',
  prefix: '',
};

const PAYMENT: StudioBinding = {
  product: 'payment',
  parentHref: 'payment-studio',
  ctaHref: 'payment-studio/credit-card-generator',
  prefix: 'payment-studio/',
};

/** Payment records that already have a page elsewhere. See the note above. */
const PAYMENT_EXCLUDED = new Set(['credit-card-generator']);

/* ── Manifests ──────────────────────────────────────────────────────────────── */

function build(): Record<string, StudioSEOPageManifest> {
  const pages: Record<string, StudioSEOPageManifest> = {};

  const families: [StudioBinding, { slug: string }[]][] = [
    [CRYPTO, ALL_CRYPTO_SEO_PAGES],
    [MEDIA, ALL_MEDIA_SEO_PAGES],
    [PAYMENT, ALL_PAYMENT_SEO_PAGES.filter((page) => !PAYMENT_EXCLUDED.has(page.slug))],
  ];

  for (const [studio, records] of families) {
    for (const record of records) {
      const path = `${studio.prefix}${record.slug}`;
      pages[path] = {
        path,
        product: studio.product,
        parentHref: studio.parentHref,
        ctaHref: studio.ctaHref,
        config: record as StudioSEOPageManifest['config'],
      };
    }
  }

  return pages;
}

export const STUDIO_SEO_PAGES: Record<string, StudioSEOPageManifest> = build();

/**
 * Look up a manifest by path. Throws rather than returning undefined: the
 * caller is a page file that cannot render without one, and a build-time crash
 * naming the missing path beats a runtime page of empty sections.
 */
export function getStudioSEOPage(path: string): StudioSEOPageManifest {
  const page = STUDIO_SEO_PAGES[path];
  if (!page) {
    throw new Error(
      `No studio SEO manifest for "${path}". Known paths: ${Object.keys(STUDIO_SEO_PAGES).join(', ')}`,
    );
  }
  return page;
}
