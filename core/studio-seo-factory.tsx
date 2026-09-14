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
import { getT } from '@/lib/i18n/server';
import StudioSEOPage, {
  resolveStudioSEOCopy,
  type StudioSEOConfig,
} from '@/components/seo-landing/StudioSEOPage';

/* ── Manifest ───────────────────────────────────────────────────────────────── */

export interface StudioSEOPageManifest {
  /**
   * The page's path without the locale prefix — 'bitcoin-address-generator',
   * or 'payment-studio/visa-card-generator'. It is both where the file lives
   * and the page's canonical URL, so the two cannot drift apart.
   */
  path: string;
  /**
   * Product id of the studio this page belongs to. The breadcrumb shows its
   * translated name rather than a hardcoded English one.
   */
  product: string;
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
   * Title and description come from the record's `locales` map, falling back to
   * the English on the record itself. They used to be passed straight through:
   * every one of these pages served the same English <title> to all six
   * locales, so /ru/bitcoin-address-generator competed for English queries and
   * for nothing a Russian speaker would type.
   */
  async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { locale } = await params;
    const copy = resolveStudioSEOCopy(manifest.config, locale);

    return seoGenerateMetadata({
      type: 'custom',
      locale,
      path: `/${manifest.path}`,
      title: copy.title,
      description: copy.description,
    } satisfies SEOCustomPage);
  }

  async function Page({ params }: PageProps) {
    const { locale } = await params;

    return (
      <StudioSEOPage
        locale={locale}
        copy={resolveStudioSEOCopy(manifest.config, locale)}
        parentLabel={getT(locale)(`products.${manifest.product}.title`)}
        parentHref={manifest.parentHref}
        ctaHref={manifest.ctaHref}
        path={manifest.path}
      />
    );
  }

  return { generateMetadata, Page };
}
