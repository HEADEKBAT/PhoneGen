/**
 * Studio Tool Page Factory — the `/{product}/tool` pages.
 *
 * Thirteen products serve an interactive editor at /{slug}/tool. They split
 * into two groups, and both groups were wrong in a different way.
 *
 * ── Six pages, one page written six times ───────────────────────────────────
 *
 * barcode, color, crypto-wallet, image, media and qr each had a 72-line file
 * that was the same file: a breadcrumb, an h1, a paragraph, the lazy loader,
 * and two `Record<string, string>` maps of per-locale copy. The only lines that
 * differed were the copy, the product id and which loader was imported.
 *
 * ── Six pages with no metadata at all ───────────────────────────────────────
 *
 * address, company, credential, email, user and username had five lines each
 * and no `generateMetadata`. A page without one inherits the layout's, so all
 * six shipped with no canonical URL, no hreflang set, no description and no
 * title of their own — 36 URLs the sitemap advertises and search engines see
 * as the same untitled page. They were short because they were unfinished,
 * and the brevity hid it.
 *
 * A manifest cannot be unfinished in that way: `generateMetadata` comes from
 * the factory, so the canonical is derived from the path whether or not anyone
 * remembered to write copy. A manifest with no `copy` falls back to the
 * product's own title and description from PRODUCTS — the registry's words,
 * not invented ones — which is what `createToolPage` already does for tools
 * that have no entry for a locale.
 *
 * /uuid-generator/tool is not here: it passes an `initialMode` into the
 * credential client, which makes it a deep link rather than a studio root.
 * See core/credential-deep-link-factory.tsx for that shape.
 */

import { type Metadata } from 'next';
import type { ComponentType } from 'react';
import {
  getProduct,
  generateMetadata as seoGenerateMetadata,
  type SEOProductPage,
} from '@/lib/config';
import { getT } from '@/lib/i18n/server';
import Breadcrumb from '@/components/Breadcrumb';

/* ── Manifest ───────────────────────────────────────────────────────────────── */

export interface StudioToolLocaleCopy {
  title: string;
  description: string;
}

export interface StudioToolPageManifest {
  /** Product id. Supplies the slug, the breadcrumb parent and the fallback copy. */
  product: string;
  /** Parent breadcrumb label, i.e. the studio's own name. */
  parentLabel: string;
  /** This page's breadcrumb label — 'Tool', 'Video Converter', and so on. */
  label: string;
  /**
   * Per-locale title and description, `en` as the fallback. Optional: without
   * it the page uses the product's title and description from PRODUCTS.
   */
  copy?: Record<string, StudioToolLocaleCopy>;
  /**
   * Heading and lead paragraph above the tool. Omit for a page that should
   * render the editor alone, which is what the six five-line pages did.
   */
  heading?: string;
  /** The lazily-loaded client from components/dynamic. */
  Tool: ComponentType;
}

/* ── Factory ────────────────────────────────────────────────────────────────── */

type PageProps = {
  params: Promise<{ locale: string }>;
};

export function createStudioToolPage(manifest: StudioToolPageManifest) {
  function resolveProduct() {
    const product = getProduct(manifest.product);
    if (!product) {
      throw new Error(
        `Studio tool page names unknown product "${manifest.product}".`,
      );
    }
    return product;
  }

  function resolveCopy(locale: string): StudioToolLocaleCopy | undefined {
    if (!manifest.copy) return undefined;
    return manifest.copy[locale] ?? manifest.copy.en;
  }

  async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { locale } = await params;
    const product = resolveProduct();
    const copy = resolveCopy(locale);

    return seoGenerateMetadata({
      type: 'product',
      locale,
      product,
      title: copy?.title,
      description: copy?.description,
      /* The editor is not the product's landing page, so it claims its own
         URL. Deriving it from the product slug is what keeps the canonical
         and the route from drifting apart. */
      path: `/${product.slug}/tool`,
    } satisfies SEOProductPage);
  }

  async function Page({ params }: PageProps) {
    const { locale } = await params;
    const t = getT(locale);
    const product = resolveProduct();
    const copy = resolveCopy(locale);
    const { Tool } = manifest;

    return (
      <div className="flex min-h-screen flex-col">
        <Breadcrumb
          items={[
            { label: t('nav.home'), href: `/${locale}` },
            { label: manifest.parentLabel, href: `/${locale}/${product.slug}` },
            { label: manifest.label, href: `/${locale}/${product.slug}/tool` },
          ]}
        />

        <main className="flex-1">
          {manifest.heading && (
            <div className="mx-auto max-w-5xl px-4 sm:px-6 pt-6 pb-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                {manifest.heading}
              </h1>
              {copy && (
                <p className="mt-1 text-sm text-muted-foreground">{copy.description}</p>
              )}
            </div>
          )}

          <Tool />
        </main>
      </div>
    );
  }

  return { generateMetadata, Page };
}
