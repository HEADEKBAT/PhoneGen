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
  /**
   * The page's own path, without the locale prefix, when it is not the
   * product's landing page — for example '/linear-gradient-generator'.
   *
   * Without this the canonical URL defaults to `/{product.slug}`, which told
   * search engines that every standalone landing page was a duplicate of its
   * product page. Twenty of them declared themselves duplicates of
   * /color-generator and so could never be indexed on their own.
   */
  path?: string;
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
  /** Translated by the caller; falls back to the platform defaults. */
  title?: string;
  description?: string;
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

/*
 * The brand is appended in exactly one place: `title.template` in the locale
 * layout. It used to be appended here as well, so every product, generator and
 * custom page shipped it twice —
 *
 *   "Генератор номеров телефона — Валидные номера | GenCore | GenCore — Free
 *    Online Generator Suite"
 *
 * — 94 characters where a search result shows about 60, spending the visible
 * half on a name repeated once and then padded. Five of seven page types
 * measured had it.
 */

/* ── Hreflang alternates ───────────────────────────────────────────────────── */

function stripTrailingSlash(p: string): string {
  return p.endsWith('/') ? p.slice(0, -1) : p;
}

/**
 * Canonical + hreflang alternates for one page.
 *
 * Exported because `lib/seo.ts` used to carry a second, slightly different
 * implementation: it emitted the six locales but no `x-default`, so the About
 * page and all ~1470 phone-generator country pages told Google nothing about
 * which version to serve a visitor whose language matches none of the six.
 * There is one implementation now.
 */
export function generateHreflang(
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

/** `ru` → `ru_RU`, `en` → `en_US` — the form Open Graph expects. */
const OG_LOCALES: Record<string, string> = {
  en: 'en_US',
  fr: 'fr_FR',
  es: 'es_ES',
  pt: 'pt_BR',
  de: 'de_DE',
  ru: 'ru_RU',
};

/**
 * `locale` is a parameter because this used to hardcode 'en_US', and page
 * metadata overrides the layout's: every page on the site announced itself to
 * Facebook, LinkedIn and every other Open Graph consumer as American English,
 * Russian and German pages included.
 */
function generateOpenGraph(title: string, description: string, url: string, locale: string) {
  return {
    title,
    description,
    url,
    siteName: PLATFORM_CONFIG.seo.openGraph.siteName,
    locale: OG_LOCALES[locale] ?? OG_LOCALES.en,
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
      /* The home page served one English title to all six locales. Its own
         headline and standfirst are translated, so the page passes them in —
         resolved by the caller, because this module is re-exported to client
         components and must not import the server dictionary. */
      const headline = page.title ?? PLATFORM_CONFIG.seo.defaultTitle;
      const description = page.description ?? PLATFORM_CONFIG.seo.defaultDescription;
      /* The brand is appended here rather than by the layout's `title.template`:
         a template only applies to CHILD segments, and the home page lives in
         the same segment as the layout that declares it. Every other page gets
         its `| GenCore` from that template, so none of them add it themselves. */
      const title = `${headline} | ${PLATFORM_CONFIG.name}`;
      const alternates = generateHreflang(locale, '');

      return {
        title,
        description,
        alternates,
        openGraph: generateOpenGraph(title, description, alternates.canonical, locale),
        twitter: { ...PLATFORM_CONFIG.seo.twitter, card: 'summary' },
        robots: { index: true, follow: true },
      };
    }

    case 'product': {
      const { locale, product, title: overrideTitle, description: overrideDesc } = page;
      /*
       * The registry's English `title`/`description` are the last resort, not
       * the translation path. Callers that want a translated title resolve it
       * themselves and pass it in — see core/studio-tool-factory.tsx.
       *
       * This module deliberately does NOT import lib/i18n/server. It is
       * re-exported from lib/config/index.ts, which client components import
       * (the header and footer among them), and lib/i18n/server statically
       * pulls all six locale JSON files — roughly half a megabyte that would
       * then ride along in every page's client bundle, duplicating what
       * `useTranslations` already loads on demand.
       */
      const title = (overrideTitle || product.title);
      const description = overrideDesc || product.description;
      // A page that lives somewhere other than the product root must say so,
      // or it declares itself a duplicate of the product landing page.
      const path = page.path ?? `/${product.slug}`;
      const alternates = generateHreflang(locale, path);

      return {
        title,
        description,
        alternates,
        openGraph: generateOpenGraph(title, description, alternates.canonical, locale),
        twitter: { ...PLATFORM_CONFIG.seo.twitter, card: 'summary' },
        robots: { index: true, follow: true },
      };
    }

    case 'generator': {
      const { locale, generator, title: overrideTitle, description: overrideDesc, country } = page;
      const title = (overrideTitle || generator.title);
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
        openGraph: generateOpenGraph(title, description, alternates.canonical, locale),
        twitter: { ...PLATFORM_CONFIG.seo.twitter, card: 'summary' },
        robots: { index: true, follow: true },
      };
    }

    case 'about': {
      const { locale } = page;
      const title = `About ${PLATFORM_CONFIG.name}`;
      const description = PLATFORM_CONFIG.description;
      const alternates = generateHreflang(locale, '/about');

      return {
        title,
        description,
        alternates,
        openGraph: generateOpenGraph(title, description, alternates.canonical, locale),
        twitter: { ...PLATFORM_CONFIG.seo.twitter, card: 'summary' },
        robots: { index: true, follow: true },
      };
    }

    case 'custom': {
      const { locale, title: t, description, path } = page;
      const title = t;
      const alternates = generateHreflang(locale, path);

      return {
        title,
        description,
        alternates,
        openGraph: generateOpenGraph(title, description, alternates.canonical, locale),
        twitter: { ...PLATFORM_CONFIG.seo.twitter, card: 'summary' },
        robots: { index: true, follow: true },
      };
    }

    default:
      return {};
  }
}
