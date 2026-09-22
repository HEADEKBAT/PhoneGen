/**
 * ToolShell — серверная обёртка для страниц инструментов.
 *
 * Рендерит: Breadcrumb → Hero → Generator → FAQ → Related Tools.
 * Все данные читаются из ToolManifest.
 */

import { Suspense, type ReactNode } from 'react';
import type { ToolManifest } from './types';
import { registry } from './registry';
import { buildToolBreadcrumbs } from './breadcrumbs';
import Breadcrumb from '@/components/Breadcrumb';
import { getT } from '@/lib/i18n/server';
import {
  LandingCards,
  LandingFaq,
  LandingHero,
  LandingSection,
} from '@/components/product-landing';

/* ── Props ──────────────────────────────────────────────────────────────────── */

interface ToolShellProps {
  /** Registered tool manifest */
  tool: ToolManifest;
  /** Current locale */
  locale: string;
  /** Optional preset key (for sub-routes) */
  preset?: string;
  /** Override children (defaults to rendering tool.ui.component) */
  children?: ReactNode;
  /** Override product slug (defaults to registry lookup or tool.id) */
  productSlug?: string;
}

/* ── Component ──────────────────────────────────────────────────────────────── */

/**
 * The template behind 36 routes — every barcode, credential and colour tool.
 *
 * Two things were wrong with what stood here. It carried its own hero: a
 * centred icon badge over a gradient wash, the shape the whole site has been
 * moving off, and one nobody would have thought to update because it is a page
 * nobody opens by name. And two of its headings — "Frequently Asked Questions"
 * and "Related Tools" — were English literals, on 36 pages in six languages:
 * 216 URLs, each promising a translated page and delivering two English
 * headings in the middle of it.
 */
export default function ToolShell({
  tool,
  locale,
  preset,
  children,
  productSlug,
}: ToolShellProps) {
  const t = getT(locale);
  const meta = tool.seo.meta[locale as keyof typeof tool.seo.meta] ?? tool.seo.meta.en;
  const product = registry.getProduct(tool.product);
  const slug = productSlug ?? product?.slug ?? tool.id;

  // Build breadcrumbs
  const breadcrumbs = buildToolBreadcrumbs(locale, slug, tool.id, preset);

  // Resolve SEO for preset
  let displayMeta: { title: string; description: string; keywords?: string[] } = meta;
  if (preset && tool.routes?.[preset]) {
    const presetLocaleMeta = tool.routes[preset].seo.meta[locale as keyof typeof tool.seo.meta];
    const presetEnMeta = tool.routes[preset].seo.meta.en;
    if (presetLocaleMeta) {
      displayMeta = {
        title: presetLocaleMeta.title,
        description: presetLocaleMeta.description,
      };
    } else if (presetEnMeta) {
      displayMeta = {
        title: presetEnMeta.title,
        description: presetEnMeta.description,
      };
    }
  }

  // Get the tool's component
  const ToolComponent = tool.ui.component;
  const Icon = tool.ui.icon;

  // Related tools (same product, excluding self)
  const relatedTools = registry.getRelatedTools(tool.id);

  // FAQ
  const faqs = tool.seo.faqs ?? [];

  return (
    <div className="flex min-h-screen flex-col">
      <Breadcrumb
        items={breadcrumbs.map((b) => ({
          label: b.label,
          href: b.href,
        }))}
      />

      <main className="flex-1">
        <LandingHero
          compact
          icon={<Icon size={22} aria-hidden="true" />}
          title={displayMeta.title}
          titleWidth="max-w-[20ch]"
          lede={displayMeta.description}
        />

        {/* The tool itself, directly under the hero — which is why the hero is
            compact. Everything below is for the reader who scrolled past it. */}
        <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          {children ?? (
            <Suspense
              fallback={
                <div className="flex h-64 items-center justify-center">
                  <div className="size-8 animate-spin rounded-full border-2 border-action/30 border-t-action" />
                </div>
              }
            >
              <ToolComponent />
            </Suspense>
          )}
        </section>

        <LandingFaq
          title={t('productLanding.faqTitle')}
          items={faqs.map((faq) => ({ question: faq.q, answer: faq.a }))}
        />

        {relatedTools.length > 0 && (
          <LandingSection
            tone="muted"
            title={t('toolPage.related')}
            note={t('toolPage.relatedNote')}
          >
            <LandingCards
              columns={3}
              items={relatedTools.map((rt) => {
                const rtMeta = rt.seo.meta[locale as keyof typeof rt.seo.meta] ?? rt.seo.meta.en;
                const RtIcon = rt.ui.icon;
                const rtProduct = registry.getProduct(rt.product);

                return {
                  id: rt.id,
                  icon: <RtIcon size={15} aria-hidden="true" />,
                  title: rtMeta.title,
                  desc: rtMeta.description,
                  href: rtProduct
                    ? `/${locale}/${rtProduct.slug}/${rt.id}`
                    : `/${locale}/${rt.id}`,
                };
              })}
            />
          </LandingSection>
        )}
      </main>
    </div>
  );
}
