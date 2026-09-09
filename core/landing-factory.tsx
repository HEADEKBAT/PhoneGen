/**
 * Landing Page Factory — builds `generateMetadata` and `Page` from a manifest.
 *
 * The sibling of `createToolPage`. That one produces the interactive tool
 * pages nested under a product; this one produces the standalone SEO landing
 * pages that sit at the top level and share a single shape: breadcrumb, hero,
 * feature grid, FAQ, closing call to action.
 *
 * ── Why it exists ───────────────────────────────────────────────────────────
 *
 * Seventeen of these pages were written out by hand at 76 lines apiece and
 * differed only in their titles, descriptions, breadcrumb label and the query
 * string on the call to action — 44 lines of copy inside 1 292 lines of file.
 * Worse, each one built its metadata from `getProduct('color')` alone, so all
 * seventeen declared `/color-generator` as their canonical URL and told search
 * engines they were duplicates of it.
 *
 * Both problems come from the same cause: the page was code instead of data.
 * A manifest cannot forget to set its own canonical, because the factory
 * derives it from the slug.
 *
 * ── Usage ───────────────────────────────────────────────────────────────────
 *
 *   // app/[locale]/linear-gradient-generator/page.tsx
 *   import { createLandingPage } from '@/core';
 *   import { getLandingPage } from '@/lib/config/landingPages';
 *
 *   const { generateMetadata, Page } = createLandingPage(
 *     getLandingPage('linear-gradient-generator'),
 *   );
 *   export { generateMetadata };
 *   export default Page;
 */

import { type Metadata } from 'next';
import {
  getProduct,
  getProductLandingConfig,
  generateMetadata as seoGenerateMetadata,
  type SEOProductPage,
} from '@/lib/config';
import { getT } from '@/lib/i18n/server';
import Breadcrumb from '@/components/Breadcrumb';
import { ProductHero, FeatureGrid, FAQSection, CTASection } from '@/components/product-landing';

/* ── Manifest ───────────────────────────────────────────────────────────────── */

export interface LandingLocaleCopy {
  title: string;
  description: string;
}

export interface LandingPageManifest {
  /** Top-level slug, e.g. 'linear-gradient-generator'. Also the canonical path. */
  slug: string;
  /** Product supplying the hero, features and FAQ — and the SEO product record. */
  product: string;
  /** Breadcrumb label. Not translated today, matching the pages this replaces. */
  label: string;
  /**
   * Where both calls to action point, relative to the locale root — usually a
   * studio route with the query string that preselects the relevant mode.
   */
  cta: string;
  /** Per-locale title and description. `en` is required and used as fallback. */
  copy: Record<string, LandingLocaleCopy> & { en: LandingLocaleCopy };
}

interface PageProps {
  params: Promise<{ locale: string }>;
}

/* ── Factory ────────────────────────────────────────────────────────────────── */

export function createLandingPage(manifest: LandingPageManifest) {
  const { slug, product: productId, label, cta, copy } = manifest;

  function resolveCopy(locale: string): LandingLocaleCopy {
    return copy[locale] ?? copy.en;
  }

  async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { locale } = await params;
    const product = getProduct(productId);
    if (!product) return {};

    const { title, description } = resolveCopy(locale);

    return seoGenerateMetadata({
      type: 'product',
      locale,
      product,
      title,
      description,
      // The page's own URL. Without it the canonical would point at the
      // product landing page and this page would never be indexed.
      path: `/${slug}`,
    } satisfies SEOProductPage);
  }

  async function Page({ params }: PageProps) {
    const { locale } = await params;
    const t = getT(locale);
    const config = getProductLandingConfig(productId);
    const href = `/${locale}/${cta}`;

    return (
      <div className="flex min-h-screen flex-col">
        <Breadcrumb
          items={[
            { label: t('nav.home'), href: `/${locale}` },
            { label, href: `/${locale}/${slug}` },
          ]}
        />

        <main className="flex-1">
          <ProductHero
            titleKey={config.heroTitleKey}
            descKey={config.heroDescKey}
            ctaLabelKey={config.ctaLabelKey}
            ctaHref={href}
          />

          <FeatureGrid features={config.features} />

          <FAQSection faqs={config.faqs} />

          <CTASection labelKey={config.ctaLabelKey} href={href} />
        </main>
      </div>
    );
  }

  return { generateMetadata, Page };
}
