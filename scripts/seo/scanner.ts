/**
 * SEO Health Check — Page Scanner
 *
 * Auto-discovers every routable page using the project's existing
 * registries (products, generators, SEO pages, barcode SEO pages)
 * plus static pages and country-specific phone pages.
 *
 * No hardcoded page lists — every source is data-driven.
 */

import { ALL_PRODUCTS } from '@/lib/config/products';
import { ALL_GENERATORS } from '@/lib/config/generators';
import { ALL_SEO_PAGES } from '@/lib/config/credentialSEOPages';
import { ALL_BARCODE_SEO_PAGES } from '@/lib/config/barcodeSEOPages';
import { PLATFORM_CONFIG, LOCALES, BASE_URL } from '@/lib/config';
import { getAllRegionCodes } from '@/lib/countryRegistry';
import type { Product } from '@/lib/config/products';
import type { Generator } from '@/lib/config/generators';
import type { SEOPageConfig } from '@/lib/config/credentialSEOPages';
import type { BarcodeSEOPageConfig } from '@/lib/config/barcodeSEOPages';
import type { ScannedPage } from './config';

/* ── Utilities ─────────────────────────────────────────────────────── */

function stripTrailingSlash(p: string): string {
  return p.endsWith('/') ? p.slice(0, -1) : p;
}

function buildFullUrl(locale: string, path: string): string {
  const clean = stripTrailingSlash(path.startsWith('/') ? path : `/${path}`);
  return `${BASE_URL}/${locale}${clean}`;
}

/* ── Page Sources ───────────────────────────────────────────────────── */

export interface ScannerResult {
  pages: ScannedPage[];
  products: Product[];
  generators: Generator[];
  seoPages: SEOPageConfig[];
  barcodeSeoPages: BarcodeSEOPageConfig[];
  locales: string[];
}

/**
 * Discover every routable page by enumerating all registries.
 */
export function scanAllPages(): ScannerResult {
  const pages: ScannedPage[] = [];
  const locales = [...LOCALES] as string[];

  /* ── 1. Home pages ────────────────────────────────────────── */
  for (const locale of locales) {
    pages.push({
      locale,
      path: `/${locale}`,
      fullUrl: buildFullUrl(locale, ''),
      source: 'home',
    });
  }

  /* ── 2. About pages ───────────────────────────────────────── */
  for (const locale of locales) {
    pages.push({
      locale,
      path: `/${locale}/about`,
      fullUrl: buildFullUrl(locale, '/about'),
      source: 'about',
    });
  }

  /* ── 3. Product landing pages ─────────────────────────────── */
  for (const product of ALL_PRODUCTS) {
    for (const locale of locales) {
      pages.push({
        locale,
        path: `/${locale}/${product.slug}`,
        fullUrl: buildFullUrl(locale, `/${product.slug}`),
        source: 'product',
        productId: product.id,
      });
    }
  }

  /* ── 4. Generator / tool pages ────────────────────────────── */
  for (const generator of ALL_GENERATORS) {
    const product = findProduct(generator.productId);
    if (!product) continue;

    const productSlug = product.slug;
    for (const locale of locales) {
      pages.push({
        locale,
        path: `/${locale}/${productSlug}/${generator.slug}`,
        fullUrl: buildFullUrl(locale, `/${productSlug}/${generator.slug}`),
        source: 'generator',
        productId: generator.productId,
        generatorId: generator.id,
      });
    }
  }

  /* ── 5. Credential SEO pages ──────────────────────────────── */
  for (const seoPage of ALL_SEO_PAGES) {
    for (const locale of locales) {
      pages.push({
        locale,
        path: `/${locale}/${seoPage.slug}`,
        fullUrl: buildFullUrl(locale, `/${seoPage.slug}`),
        source: 'seo-page',
      });
    }
  }

  /* ── 6. Barcode SEO pages ─────────────────────────────────── */
  for (const barcodePage of ALL_BARCODE_SEO_PAGES) {
    for (const locale of locales) {
      pages.push({
        locale,
        path: `/${locale}/${barcodePage.slug}`,
        fullUrl: buildFullUrl(locale, `/${barcodePage.slug}`),
        source: 'barcode-seo-page',
      });
    }
  }

  /* ── 7. Country-specific phone pages ──────────────────────── */
  const phoneProduct = ALL_PRODUCTS.find((p) => p.id === 'phone');
  if (phoneProduct) {
    const regions = getAllRegionCodes();
    for (const region of regions) {
      for (const locale of locales) {
        pages.push({
          locale,
          path: `/${locale}/${phoneProduct.slug}/${region}`,
          fullUrl: buildFullUrl(locale, `/${phoneProduct.slug}/${region}`),
          source: 'country',
          productId: 'phone',
        });
      }
    }
  }

  return {
    pages,
    products: ALL_PRODUCTS,
    generators: ALL_GENERATORS,
    seoPages: ALL_SEO_PAGES,
    barcodeSeoPages: ALL_BARCODE_SEO_PAGES,
    locales,
  };
}

/**
 * Count unique pages across sources, for reporting.
 */
export function summarizeScan(result: ScannerResult): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const page of result.pages) {
    counts[page.source] = (counts[page.source] || 0) + 1;
  }
  return counts;
}

/* ── Internal helpers ────────────────────────────────────────────────── */

const productCache = new Map<string, Product>();
for (const p of ALL_PRODUCTS) {
  productCache.set(p.id, p);
}

function findProduct(id: string): Product | undefined {
  return productCache.get(id);
}
