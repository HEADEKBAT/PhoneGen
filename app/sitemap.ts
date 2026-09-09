import type { MetadataRoute } from 'next';
import { ALL_PRODUCTS, ALL_GENERATORS, SEO_LOCALES, BASE_URL } from '@/lib/config';
import { ALL_SEO_PAGES } from '@/lib/config/credentialSEOPages';
import { ALL_BARCODE_SEO_PAGES } from '@/lib/config/barcodeSEOPages';
import { ALL_PAYMENT_SEO_PAGES } from '@/lib/config/paymentSEOPages';
import { COLOR_TOOL_ROUTES } from '@/lib/config/colorRoutes';
import { IMAGE_TOOL_ROUTES } from '@/lib/config/imageRoutes';
import { QR_TOOL_ROUTES } from '@/lib/config/qrRoutes';
import { CRYPTO_TOOL_ROUTES } from '@/lib/config/cryptoRoutes';
import { ALL_CRYPTO_SEO_PAGES } from '@/lib/config/cryptoSEOPages';
import { MEDIA_TOOL_ROUTES } from '@/lib/config/mediaRoutes';
import { ALL_MEDIA_SEO_PAGES } from '@/lib/config/mediaSEOPages';
import { isRedirectedSlug } from '@/lib/config/legacyRedirects';
import { TOOL_PAGE_PRODUCT_IDS, STANDALONE_SEO_ROUTES } from '@/lib/config/staticRoutes';
import { getAllRegionCodes } from '@/lib/countryRegistry';

/**
 * Dynamic sitemap — builds every URL from the Products and Generators registries.
 *
 * Adding a new product or generator automatically adds it to the sitemap.
 * No manual updates needed.
 *
 * Two invariants this file has to hold, both of which it violated before:
 *
 *   • Never list a URL that answers with a redirect. The legacy top-level
 *     barcode and credential slugs are 308s (see lib/config/legacyRedirects.ts);
 *     their real URLs are already listed under the product folder.
 *
 *   • Never list the same URL twice. Several registries overlap — a product's
 *     tool page can be described both as a generator and in TOOL_PAGE_PRODUCT_IDS
 *     — so every push goes through `add()`, which de-duplicates.
 *
 * `node scripts/seo/sitemap.check.mjs` verifies the other direction: that every
 * page which exists is actually reachable from here.
 */

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  const seen = new Set<string>();
  const now = new Date();

  const add = (
    path: string,
    priority: number,
    changeFrequency: 'weekly' | 'monthly' = 'weekly',
  ) => {
    const url = `${BASE_URL}${path}`;
    if (seen.has(url)) return;
    seen.add(url);
    entries.push({ url, lastModified: now, changeFrequency, priority });
  };

  /* ── Homepages per locale ───────────────────────────────────────── */
  for (const locale of SEO_LOCALES) {
    add(`/${locale}`, 1.0);
  }

  /* ── Product landing pages per locale ────────────────────────────── */
  for (const locale of SEO_LOCALES) {
    for (const product of ALL_PRODUCTS) {
      add(`/${locale}/${product.slug}`, product.seoPriority);
    }
  }

  /* ── Generator / tool pages per locale ───────────────────────────── */
  /* ── Phone generators are served by the dynamic [country] route ── */
  const generatorProductsWithCountryRoutes = new Set(
    ALL_PRODUCTS.filter((p) => p.hasCountries).map((p) => p.id),
  );

  const productById = new Map<string, (typeof ALL_PRODUCTS)[number]>();
  for (const p of ALL_PRODUCTS) productById.set(p.id, p);

  for (const locale of SEO_LOCALES) {
    for (const generator of ALL_GENERATORS) {
      const product = productById.get(generator.productId);
      if (!product) continue;

      /* Skip generators for products using a dynamic [country] route
         (phone, address, etc.) — their tool pages are served by the
         parent product's country-specific page, not individual endpoints.
         The country loop below already covers these. */
      if (generatorProductsWithCountryRoutes.has(generator.productId)) continue;

      add(`/${locale}/${product.slug}/${generator.slug}`, generator.seoPriority);
    }
  }

  /* ── Interactive /{product}/tool pages ───────────────────────────── */
  /* Studios added after the GENERATORS registry was written have a tool
     page but no generator entry, so they were missing from the sitemap
     entirely. TOOL_PAGE_PRODUCT_IDS names all of them; `add()` absorbs
     the overlap with the loop above. */
  for (const locale of SEO_LOCALES) {
    for (const productId of TOOL_PAGE_PRODUCT_IDS) {
      const product = productById.get(productId);
      if (!product) continue;
      add(`/${locale}/${product.slug}/tool`, 0.8);
    }
  }

  /* ── Credential SEO landing pages per locale ─────────────────────── */
  const productSlugs = new Set(ALL_PRODUCTS.map((p) => p.slug));
  for (const locale of SEO_LOCALES) {
    for (const page of ALL_SEO_PAGES) {
      if (productSlugs.has(page.slug)) continue; // skip SEO pages that share a slug with a product page
      if (isRedirectedSlug(page.slug)) continue; // 308 → /credential-generator/{slug}
      add(`/${locale}/${page.slug}`, 0.9);
    }
  }

  /* ── Credential tool pages under /credential-generator/{slug} ────── */
  for (const locale of SEO_LOCALES) {
    for (const page of ALL_SEO_PAGES) {
      add(`/${locale}/credential-generator/${page.slug}`, 0.9);
    }
  }

  /* ── Barcode tool pages under /barcode-generator/{slug} ──────────── */
  for (const locale of SEO_LOCALES) {
    for (const page of ALL_BARCODE_SEO_PAGES) {
      add(`/${locale}/barcode-generator/${page.slug}`, 0.9);
    }
  }

  /* ── Barcode SEO landing pages per locale ────────────────────────── */
  for (const locale of SEO_LOCALES) {
    for (const page of ALL_BARCODE_SEO_PAGES) {
      if (isRedirectedSlug(page.slug)) continue; // 308 → /barcode-generator/{slug}
      add(`/${locale}/${page.slug}`, 0.9);
    }
  }

  /* ── Color tool pages under /color-generator/{slug} ──────────────── */
  for (const locale of SEO_LOCALES) {
    for (const page of COLOR_TOOL_ROUTES) {
      add(`/${locale}/color-generator/${page.slug}`, 0.9);
    }
  }

  /* ── Payment SEO landing pages per locale ────────────────────────── */
  for (const locale of SEO_LOCALES) {
    for (const page of ALL_PAYMENT_SEO_PAGES) {
      if (isRedirectedSlug(page.slug)) continue;
      add(`/${locale}/${page.slug}`, 0.9);
    }
  }

  /* ── Payment tool pages under /payment-studio/{slug} ─────────────── */
  for (const locale of SEO_LOCALES) {
    for (const page of ALL_PAYMENT_SEO_PAGES) {
      add(`/${locale}/payment-studio/${page.slug}`, 0.9);
    }
  }

  /* ── Image tool pages under /image-studio/{slug} ─────────────────── */
  for (const locale of SEO_LOCALES) {
    for (const page of IMAGE_TOOL_ROUTES) {
      add(`/${locale}/image-studio/${page.slug}`, 0.9);
    }
  }

  /* ── QR tool pages under /qr-generator/{slug} ────────────────────── */
  for (const locale of SEO_LOCALES) {
    for (const page of QR_TOOL_ROUTES) {
      add(`/${locale}/qr-generator/${page.slug}`, 0.9);
    }
  }

  /* ── Crypto Wallet SEO landing pages per locale ──────────────────── */
  for (const locale of SEO_LOCALES) {
    for (const page of ALL_CRYPTO_SEO_PAGES) {
      if (isRedirectedSlug(page.slug)) continue;
      add(`/${locale}/${page.slug}`, 0.9);
    }
  }

  /* ── Crypto Wallet tool pages under /crypto-wallet-playground/{slug} ── */
  for (const locale of SEO_LOCALES) {
    for (const page of CRYPTO_TOOL_ROUTES) {
      add(`/${locale}/crypto-wallet-playground/${page.slug}`, 0.9);
    }
  }

  /* ── Media Studio SEO landing pages per locale ───────────────────── */
  for (const locale of SEO_LOCALES) {
    for (const page of ALL_MEDIA_SEO_PAGES) {
      if (isRedirectedSlug(page.slug)) continue;
      add(`/${locale}/${page.slug}`, 0.9);
    }
  }

  /* ── Media Studio tool pages under /media-studio/{slug} ──────────── */
  for (const locale of SEO_LOCALES) {
    for (const page of MEDIA_TOOL_ROUTES) {
      add(`/${locale}/media-studio/${page.slug}`, 0.9);
    }
  }

  /* ── Standalone SEO landing pages ────────────────────────────────── */
  /* Gradient, theme and password pages that belong to no product folder
     and appear in no registry. See lib/config/staticRoutes.ts. */
  for (const locale of SEO_LOCALES) {
    for (const route of STANDALONE_SEO_ROUTES) {
      if (isRedirectedSlug(route.slug)) continue;
      add(`/${locale}/${route.slug}`, route.priority);
    }
  }

  /* ── About pages per locale ──────────────────────────────────────── */
  for (const locale of SEO_LOCALES) {
    add(`/${locale}/about`, 0.8, 'monthly');
  }

  /* ── Country-specific phone generator pages ──────────────────────── */
  const regions = getAllRegionCodes();
  const phoneProduct = ALL_PRODUCTS.find((p) => p.id === 'phone');
  if (phoneProduct) {
    for (const locale of SEO_LOCALES) {
      for (const region of regions) {
        add(`/${locale}/${phoneProduct.slug}/${region}`, 0.7);
      }
    }
  }

  return entries;
}
