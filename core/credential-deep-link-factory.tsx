/**
 * Credential Deep-Link Factory — pages that open the credential studio in one
 * particular mode.
 *
 * /wifi-password-generator, /human-password-generator and /pin-generator are
 * not landing pages and not separate tools: each one is the credential studio
 * with a tab and a mode pre-selected, given its own URL because that is what
 * people search for.
 *
 * ── Why it exists ───────────────────────────────────────────────────────────
 *
 * All three hand-rolled their metadata object instead of going through
 * `seoGenerateMetadata`, and so were the only three pages in the app shipping
 * without openGraph tags, twitter card, a robots directive or the platform
 * title suffix. Nothing about these pages called for that — they simply did
 * not go through the one function that knows what a page's metadata contains.
 * Their per-locale copy was the part worth keeping, and it is now data.
 *
 * They also had no breadcrumb, so a visitor landing from a search had no way
 * back to the studio the page is a view of. The factory adds one.
 *
 * ── Not /uuid-generator/tool ────────────────────────────────────────────────
 *
 * That page is the same shape but belongs to the UUID product rather than the
 * credential one, and it renders through the lazy `CredentialClientLoader`.
 * These three render the client directly, which is what they have always done:
 * the tool is the whole content of the page, so it is server-rendered rather
 * than replaced by a skeleton on first paint. Folding the two together would
 * mean changing one of them to match, and that is a rendering decision, not a
 * refactor.
 */

import { type Metadata } from 'next';
import {
  getProduct,
  generateMetadata as seoGenerateMetadata,
  type SEOProductPage,
} from '@/lib/config';
import { getT } from '@/lib/i18n/server';
import Breadcrumb from '@/components/Breadcrumb';
import CredentialGeneratorClient, {
  type CredentialClientProps,
} from '@/app/[locale]/credential-generator/client';

/* ── Manifest ───────────────────────────────────────────────────────────────── */

export interface DeepLinkLocaleCopy {
  title: string;
  description: string;
}

export interface CredentialDeepLinkManifest {
  /** Top-level slug. Also the canonical path, so the two cannot drift. */
  slug: string;
  /** Product id supplying the SEO record and the parent breadcrumb. */
  product: string;
  /** Parent breadcrumb label. Not translated, matching the pages it replaces. */
  parentLabel: string;
  /** This page's breadcrumb label. */
  label: string;
  /** Per-locale title and description. `en` is the fallback. */
  copy: Record<string, DeepLinkLocaleCopy>;
  /** Which tab and mode the studio opens in. */
  initialMode: CredentialClientProps['initialMode'];
}

/* ── Factory ────────────────────────────────────────────────────────────────── */

type PageProps = {
  params: Promise<{ locale: string }>;
};

export function createCredentialDeepLinkPage(manifest: CredentialDeepLinkManifest) {
  async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { locale } = await params;
    const copy = manifest.copy[locale] ?? manifest.copy.en;
    const product = getProduct(manifest.product);

    if (!product) {
      throw new Error(
        `Credential deep-link page "${manifest.slug}" names unknown product "${manifest.product}".`,
      );
    }

    return seoGenerateMetadata({
      type: 'product',
      locale,
      product,
      title: copy.title,
      description: copy.description,
      /* This page is a view of the studio, not the studio's landing page, so
         it claims its own URL rather than inheriting the product slug. */
      path: `/${manifest.slug}`,
    } satisfies SEOProductPage);
  }

  async function Page({ params }: PageProps) {
    const { locale } = await params;
    const t = getT(locale);
    const product = getProduct(manifest.product);

    return (
      <div className="flex min-h-screen flex-col">
        <Breadcrumb
          items={[
            { label: t('nav.home'), href: `/${locale}` },
            { label: manifest.parentLabel, href: `/${locale}/${product?.slug ?? ''}` },
            { label: manifest.label, href: `/${locale}/${manifest.slug}` },
          ]}
        />

        <CredentialGeneratorClient initialMode={manifest.initialMode} />
      </div>
    );
  }

  return { generateMetadata, Page };
}
