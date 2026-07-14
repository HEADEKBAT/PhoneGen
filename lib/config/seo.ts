/**
 * SEO Registry — centralized metadata generation for all GenCore pages.
 *
 * Every page's `generateMetadata()` should call these helpers.
 * This ensures canonical URLs, hreflang, OpenGraph, Twitter, and JSON-LD
 * are consistent across the entire platform.
 */

import { type Metadata } from 'next';
import { PLATFORM_CONFIG } from './platform';
import { getProduct } from './products';
import type { Product } from './products';
import type { Generator } from './generators';

/* ── Locales ──────────────────────────────────────────────────────────────── */

export const SEO_LOCALES = ['en', 'fr', 'es', 'pt', 'de', 'ru'] as const;

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || `https://${PLATFORM_CONFIG.domain}`;
export const BASE_URL = rawSiteUrl.startsWith('http') ? rawSiteUrl : `https://${rawSiteUrl}`;

/* ── Page type helpers ─────────────────────────────────────────────────────── */

export interface SEOProductPage {
  type: 'product';
  product: Product;
  locale: string;
  /** Override title (defaults to product.title) */
  title?: string;
  /** Override description (defaults to product.description) */
  description?: string;
}

export interface SEOGeneratorPage {
  type: 'generator';
  generator: Generator;
  locale: string;
  country?: string;
  title?: string;
  description?: string;
}

export interface SEOHomePage {
  type: 'home';
  locale: string;
}

export interface SEOAboutPage {
  type: 'about';
  locale: string;
}

export interface SEOCustomPage {
  type: 'custom';
  locale: string;
  path: string;
  title: string;
  description: string;
  /** Custom title template suffix */
  template?: string;
}

export type SEOPage = SEOProductPage | SEOGeneratorPage | SEOHomePage | SEOAboutPage | SEOCustomPage;

/* ── Title helpers ──────────────────────────────────────────────────────────── */

const ALL_LOCALES = SEO_LOCALES as readonly string[];

const PLATFORM_SUFFIX = ` | ${PLATFORM_CONFIG.name}`;
const PLATFORM_SUFFIX_MAP: Record<string, string> = {
  en: ` | ${PLATFORM_CONFIG.name}`,
  ru: ` | ${PLATFORM_CONFIG.name}`,
  de: ` | ${PLATFORM_CONFIG.name}`,
  es: ` | ${PLATFORM_CONFIG.name}`,
  fr: ` | ${PLATFORM_CONFIG.name}`,
  pt: ` | ${PLATFORM_CONFIG.name}`,
};

function titleSuffix(locale: string): string {
  return PLATFORM_SUFFIX_MAP[locale] || PLATFORM_SUFFIX;
}

/* ── Hreflang alternates ───────────────────────────────────────────────────── */

function stripTrailingSlash(p: string): string {
  return p.endsWith('/') ? p.slice(0, -1) : p;
}

function generateHreflang(
  locale: string,
  path: string,
): { canonical: string; languages: Record<string, string> } {
  const cleanPath = stripTrailingSlash(path.startsWith('/') ? path : `/${path}`);
  const canonical = `${BASE_URL}/${locale}${cleanPath}`;

  const languages: Record<string, string> = {};
  for (const l of ALL_LOCALES) {
    languages[l] = `${BASE_URL}/${l}${cleanPath}`;
  }
  // 'x-default' points to English as the fallback
  languages['x-default'] = `${BASE_URL}/en${cleanPath}`;

  return { canonical, languages };
}

/* ── OpenGraph helper ──────────────────────────────────────────────────────── */

function generateOpenGraph(title: string, description: string, url: string) {
  return {
    title,
    description,
    url,
    siteName: PLATFORM_CONFIG.seo.openGraph.siteName,
    locale: 'en_US',
    type: 'website' as const,
  };
}

/* ── Public API ──────────────────────────────────────────────────────────────── */

/**
 * Generate Next.js Metadata for any page type.
 *
 * Usage in a page's `generateMetadata`:
 * ```ts
 * export async function generateMetadata({ params }): Promise<Metadata> {
 *   const { locale } = await params;
 *   return seo.generateMetadata({ type: 'home', locale });
 * }
 * ```
 */
export function generateMetadata(page: SEOPage): Metadata {
  switch (page.type) {
    case 'home': {
      const { locale } = page;
      const title = PLATFORM_CONFIG.seo.defaultTitle;
      const description = PLATFORM_CONFIG.seo.defaultDescription;
      const alternates = generateHreflang(locale, '');

      return {
        title,
        description,
        alternates,
        openGraph: generateOpenGraph(title, description, alternates.canonical),
        twitter: { ...PLATFORM_CONFIG.seo.twitter, card: 'summary' },
        robots: { index: true, follow: true },
      };
    }

    case 'product': {
      const { locale, product, title: overrideTitle, description: overrideDesc } = page;
      const title = (overrideTitle || product.title) + titleSuffix(locale);
      const description = overrideDesc || product.description;
      const path = `/${product.slug}`;
      const alternates = generateHreflang(locale, path);

      return {
        title,
        description,
        alternates,
        openGraph: generateOpenGraph(title, description, alternates.canonical),
        twitter: { ...PLATFORM_CONFIG.seo.twitter, card: 'summary' },
        robots: { index: true, follow: true },
      };
    }

    case 'generator': {
      const { locale, generator, title: overrideTitle, description: overrideDesc, country } = page;
      const title = (overrideTitle || generator.title) + titleSuffix(locale);
      const description = overrideDesc || generator.description;
      const product = getProduct(generator.productId);
      const productSlug = product?.slug ?? generator.productId;
      const path = country
        ? `/${productSlug}/${country}`
        : `/${productSlug}/${generator.slug}`;
      const alternates = generateHreflang(locale, path);

      return {
        title,
        description,
        alternates,
        openGraph: generateOpenGraph(title, description, alternates.canonical),
        twitter: { ...PLATFORM_CONFIG.seo.twitter, card: 'summary' },
        robots: { index: true, follow: true },
      };
    }

    case 'about': {
      const { locale } = page;
      const title = `About ${PLATFORM_CONFIG.name}${titleSuffix(locale)}`;
      const description = PLATFORM_CONFIG.description;
      const alternates = generateHreflang(locale, '/about');

      return {
        title,
        description,
        alternates,
        openGraph: generateOpenGraph(title, description, alternates.canonical),
        twitter: { ...PLATFORM_CONFIG.seo.twitter, card: 'summary' },
        robots: { index: true, follow: true },
      };
    }

    case 'custom': {
      const { locale, title: t, description, path } = page;
      const title = t + titleSuffix(locale);
      const alternates = generateHreflang(locale, path);

      return {
        title,
        description,
        alternates,
        openGraph: generateOpenGraph(title, description, alternates.canonical),
        twitter: { ...PLATFORM_CONFIG.seo.twitter, card: 'summary' },
        robots: { index: true, follow: true },
      };
    }

    default:
      return {};
  }
}
