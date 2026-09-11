/**
 * SEO Registry — centralized metadata generation for all GenCore pages.
 *
 * Every page's `generateMetadata()` should call these helpers.
 * This ensures canonical URLs, hreflang, OpenGraph, Twitter, and JSON-LD
 * are consistent across the entire platform.
 */
import { PLATFORM_CONFIG } from './platform';
import { getProduct } from './products';
import { getT } from '@/lib/i18n/server';
/* ── Locales ──────────────────────────────────────────────────────────────── */
export const SEO_LOCALES = ['en', 'fr', 'es', 'pt', 'de', 'ru'];
const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || `https://${PLATFORM_CONFIG.domain}`;
export const BASE_URL = rawSiteUrl.startsWith('http') ? rawSiteUrl : `https://${rawSiteUrl}`;
/* ── Title helpers ──────────────────────────────────────────────────────────── */
const ALL_LOCALES = SEO_LOCALES;
const PLATFORM_SUFFIX = ` | ${PLATFORM_CONFIG.name}`;
const PLATFORM_SUFFIX_MAP = {
    en: ` | ${PLATFORM_CONFIG.name}`,
    ru: ` | ${PLATFORM_CONFIG.name}`,
    de: ` | ${PLATFORM_CONFIG.name}`,
    es: ` | ${PLATFORM_CONFIG.name}`,
    fr: ` | ${PLATFORM_CONFIG.name}`,
    pt: ` | ${PLATFORM_CONFIG.name}`,
};
function titleSuffix(locale) {
    return PLATFORM_SUFFIX_MAP[locale] || PLATFORM_SUFFIX;
}
/* ── Hreflang alternates ───────────────────────────────────────────────────── */
function stripTrailingSlash(p) {
    return p.endsWith('/') ? p.slice(0, -1) : p;
}
function generateHreflang(locale, path) {
    const cleanPath = stripTrailingSlash(path.startsWith('/') ? path : `/${path}`);
    const canonical = `${BASE_URL}/${locale}${cleanPath}`;
    const languages = {};
    for (const l of ALL_LOCALES) {
        languages[l] = `${BASE_URL}/${l}${cleanPath}`;
    }
    // 'x-default' points to English as the fallback
    languages['x-default'] = `${BASE_URL}/en${cleanPath}`;
    return { canonical, languages };
}
/* ── OpenGraph helper ──────────────────────────────────────────────────────── */
function generateOpenGraph(title, description, url) {
    return {
        title,
        description,
        url,
        siteName: PLATFORM_CONFIG.seo.openGraph.siteName,
        locale: 'en_US',
        type: 'website',
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
export function generateMetadata(page) {
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
            /*
             * The registry's own `title` and `description` are English. They are the
             * fallback, not the answer: `products.<id>.*` carries the translation, so
             * a page that passes no override still gets metadata in the reader's
             * language instead of English on /ru and /de.
             *
             * `getT` falls back to English itself when a key is missing, so a product
             * added to PRODUCTS before its translation lands still gets a title.
             */
            const t = getT(locale);
            const title = (overrideTitle || t(`products.${product.id}.title`)) + titleSuffix(locale);
            const description = overrideDesc || t(`products.${product.id}.description`);
            // A page that lives somewhere other than the product root must say so,
            // or it declares itself a duplicate of the product landing page.
            const path = page.path ?? `/${product.slug}`;
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
