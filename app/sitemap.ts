import type { MetadataRoute } from 'next';
import { ALL_PRODUCTS, ALL_GENERATORS, SEO_LOCALES, BASE_URL } from '@/lib/config';
import { ALL_SEO_PAGES } from '@/lib/config/credentialSEOPages';
import { ALL_BARCODE_SEO_PAGES } from '@/lib/config/barcodeSEOPages';
import { getAllRegionCodes } from '@/lib/countryRegistry';

/**
 * Dynamic sitemap — builds every URL from the Products and Generators registries.
 *
 * Adding a new product or generator automatically adds it to the sitemap.
 * No manual updates needed.
 */

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  /* ── Homepages per locale ───────────────────────────────────────── */
  for (const locale of SEO_LOCALES) {
    entries.push({
      url: `${BASE_URL}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    });
  }

  /* ── Product landing pages per locale ────────────────────────────── */
  for (const locale of SEO_LOCALES) {
    for (const product of ALL_PRODUCTS) {
      entries.push({
        url: `${BASE_URL}/${locale}/${product.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: product.seoPriority,
      });
    }
  }

  /* ── Generator / tool pages per locale ───────────────────────────── */
  const productBySlug = new Map<string, (typeof ALL_PRODUCTS)[number]>();
  for (const p of ALL_PRODUCTS) productBySlug.set(p.id, p);

  const seenGeneratorUrls = new Set<string>();
  for (const locale of SEO_LOCALES) {
    for (const generator of ALL_GENERATORS) {
      const product = productBySlug.get(generator.productId);
      if (!product) continue;

      const url = `${BASE_URL}/${locale}/${product.slug}/${generator.slug}`;
      if (seenGeneratorUrls.has(url)) continue;
      seenGeneratorUrls.add(url);

      entries.push({
        url,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: generator.seoPriority,
      });
    }
  }

  /* ── Credential SEO landing pages per locale ─────────────────────── */
  const productSlugs = new Set(ALL_PRODUCTS.map((p) => p.slug));
  for (const locale of SEO_LOCALES) {
    for (const page of ALL_SEO_PAGES) {
      if (productSlugs.has(page.slug)) continue; // skip SEO pages that share a slug with a product page
      entries.push({
        url: `${BASE_URL}/${locale}/${page.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
      });
    }
  }

  /* ── Barcode SEO landing pages per locale ────────────────────────── */
  for (const locale of SEO_LOCALES) {
    for (const page of ALL_BARCODE_SEO_PAGES) {
      entries.push({
        url: `${BASE_URL}/${locale}/${page.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
      });
    }
  }

  /* ── About pages per locale ──────────────────────────────────────── */
  for (const locale of SEO_LOCALES) {
    entries.push({
      url: `${BASE_URL}/${locale}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    });
  }

  /* ── Country-specific phone generator pages ──────────────────────── */
  const regions = getAllRegionCodes();
  const phoneProduct = ALL_PRODUCTS.find((p) => p.id === 'phone');
  if (phoneProduct) {
    for (const locale of SEO_LOCALES) {
      for (const region of regions) {
        entries.push({
          url: `${BASE_URL}/${locale}/${phoneProduct.slug}/${region}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.7,
        });
      }
    }
  }

  return entries;
}
