/**
 * Studio SEO Page Factory — builds `generateMetadata` and `Page` from a manifest.
 *
 * The third member of the family, after `createToolPage` (interactive editors)
 * and `createLandingPage` (product landings). This one produces the SEO landing
 * pages that sit beside a studio: one topic each, prose and an FAQ, and a
 * button into the studio itself.
 *
 * ── Why it exists ───────────────────────────────────────────────────────────
 *
 * Twenty-eight of these pages were listed in the sitemap and none of them had
 * ever been written. Their copy — title, description, hero, FAQ — was sitting
 * complete in lib/config/{crypto,media,payment}SEOPages.ts, so the sitemap was
 * advertising 354 URLs that answered 404 while the content they promised was
 * already in the repository, unrendered.
 *
 * The registries were written to be read by a page that did not exist. This is
 * that page, once, instead of twenty-eight times.
 *
 * ── Usage ───────────────────────────────────────────────────────────────────
 *
 *   // app/[locale]/bitcoin-address-generator/page.tsx
 *   import { createStudioSEOPage } from '@/core';
 *   import { getStudioSEOPage } from '@/lib/config/studioSEOPages';
 *
 *   const { generateMetadata, Page } = createStudioSEOPage(
 *     getStudioSEOPage('bitcoin-address-generator'),
 *   );
 *   export { generateMetadata };
 *   export default Page;
 */

import { type Metadata } from 'next';
import { generateMetadata as seoGenerateMetadata, type SEOCustomPage } from '@/lib/config';
import StudioSEOPage, { type StudioSEOConfig } from '@/components/seo-landing/StudioSEOPage';

/* ── Manifest ───────────────────────────────────────────────────────────────── */

export interface StudioSEOPageManifest {
  /**
   * The page's path without the locale prefix — 'bitcoin-address-generator',
   * or 'payment-studio/visa-card-generator'. It is both where the file lives
   * and the page's canonical URL, so the two cannot drift apart.
   */
  path: string;
  /** Breadcrumb label for the studio this page belongs to. */
  parentLabel: string;
  /** Studio landing path, without the locale prefix. */
  parentHref: string;
  /** Where the calls to action point, without the locale prefix. */
  ctaHref: string;
  /** The registry record supplying every piece of copy on the page. */
  config: StudioSEOConfig;
}

/* ── Factory ────────────────────────────────────────────────────────────────── */

type PageProps = {
  params: Promise<{ locale: string }>;
};

export function createStudioSEOPage(manifest: StudioSEOPageManifest) {
  /*
   * The registries hold English copy only, exactly as the barcode pages this
   * mirrors do. Repeating one English string across six locale keys would be
   * the same value with more ceremony, so the title and description are passed
   * straight through; `seoGenerateMetadata` still emits the full hreflang set.
   */
  async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { locale } = await params;

    return seoGenerateMetadata({
      type: 'custom',
      locale,
      path: `/${manifest.path}`,
      title: manifest.config.title,
      description: manifest.config.description,
    } satisfies SEOCustomPage);
  }

  async function Page({ params }: PageProps) {
    const { locale } = await params;

    return (
      <StudioSEOPage
        locale={locale}
        config={manifest.config}
        parentLabel={manifest.parentLabel}
        parentHref={manifest.parentHref}
        ctaHref={manifest.ctaHref}
        path={manifest.path}
      />
    );
  }

  return { generateMetadata, Page };
}
