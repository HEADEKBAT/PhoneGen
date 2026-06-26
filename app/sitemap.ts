import type { MetadataRoute } from 'next';
import { BASE_URL } from '@/lib/seo';

/**
 * Every supported locale — must match the locale layout's generateStaticParams.
 * Duplicated here to keep sitemap.ts a stand-alone module.
 */
const LOCALES = ['en', 'fr', 'es', 'pt', 'de', 'ru'] as const;

/**
 * Products that are enabled and have locale-prefixed pages.
 * Derived inline so the sitemap stays accurate without importing heavy modules.
 */
const PRODUCT_SLUGS = [
  'phone-generator',
  'user-generator',
  'credential-generator',
  'password-generator',
  'human-password-generator',
  'passphrase-generator',
  'pin-generator',
  'wifi-password-generator',
  'api-key-generator',
  'uuid-generator',
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  /*
   * ── Locale-prefixed homepages ─────────────────────────────────────
   * Canonical landing page for each locale.
   */
  for (const locale of LOCALES) {
    entries.push({
      url: `${BASE_URL}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    });
  }

  /*
   * ── Locale-prefixed product pages ──────────────────────────────────
   * Each locale gets its own canonical URL for every product.
   */
  for (const locale of LOCALES) {
    for (const slug of PRODUCT_SLUGS) {
      entries.push({
        url: `${BASE_URL}/${locale}/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
      });
    }
  }

  /*
   * ── Locale-prefixed about pages ────────────────────────────────────────
   */
  for (const locale of LOCALES) {
    entries.push({
      url: `${BASE_URL}/${locale}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    });
  }

  return entries;
}
