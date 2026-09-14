/**
 * SEO helpers for the GenCore platform.
 *
 * All canonical URLs and hreflang tags are generated from a single
 * source — update `BASE_URL` and `LOCALES` here to affect the entire site.
 */

import { generateHreflang } from './config/seo';

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.gencore.space';
export const BASE_URL = rawSiteUrl.startsWith('http') ? rawSiteUrl : `https://${rawSiteUrl}`;

/** Every locale the site supports — used for hreflang and sitemap. */
export const SEO_LOCALES = ['en', 'fr', 'es', 'pt', 'de', 'ru'] as const;

/**
 * Canonical + hreflang alternates for a given page.
 *
 * A thin alias for `generateHreflang` in lib/config/seo.ts. This module used to
 * have its own copy, which drifted: it never emitted `x-default`, so every page
 * that called it (About, and every phone-generator country page) shipped an
 * incomplete alternates set. Keeping one implementation is the point of the
 * alias — the name stays because two call sites use it.
 *
 * @param locale  Current page locale (e.g. "en", "fr")
 * @param path    Path without locale prefix (e.g. "/phone-generator", "/about")
 */
export function generateLocaleAlternates(
  locale: string,
  path: string,
): {
  canonical: string;
  languages: Record<string, string>;
} {
  return generateHreflang(locale, path);
}
