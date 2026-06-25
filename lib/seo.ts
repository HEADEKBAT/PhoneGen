/**
 * SEO helpers for the GenCore platform.
 *
 * All canonical URLs and hreflang tags are generated from a single
 * source — update `BASE_URL` and `LOCALES` here to affect the entire site.
 */

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.gencore.space';
export const BASE_URL = rawSiteUrl.startsWith('http') ? rawSiteUrl : `https://${rawSiteUrl}`;

/** Every locale the site supports — used for hreflang and sitemap. */
export const SEO_LOCALES = ['en', 'fr', 'es', 'pt', 'de', 'ru'] as const;

/**
 * Generate canonical + hreflang alternates for a given page.
 *
 * @param locale  Current page locale (e.g. "en", "fr")
 * @param path    Path without locale prefix (e.g. "/phone-generator", "/about")
 *
 * Usage inside `generateMetadata`:
 * ```ts
 * const alternates = generateLocaleAlternates(locale, '/phone-generator');
 * return { title: '...', alternates };
 * ```
 */
export function generateLocaleAlternates(
  locale: string,
  path: string,
): {
  canonical: string;
  languages: Record<string, string>;
} {
  const canonical = `${BASE_URL}/${locale}${path}`;

  const languages = Object.fromEntries(
    SEO_LOCALES.map((l) => [l, `${BASE_URL}/${l}${path}`]),
  ) as Record<string, string>;

  return { canonical, languages };
}
