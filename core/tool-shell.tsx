/**
 * ToolShell — универсальный серверный компонент-обёртка для страниц инструментов.
 *
 * Автоматически рендерит:
 *   Breadcrumb → Hero → Generator (dynamic) → FAQ → Related Tools → CTA
 *
 * Все данные читаются из ToolManifest. Никакого ручного дублирования.
 */

import { Suspense, type ReactNode } from 'react';
import type { ToolManifest } from './types';
import { registry } from './registry';
import { buildToolBreadcrumbs } from './breadcrumbs';
import Breadcrumb from '@/components/Breadcrumb';

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

export default function ToolShell({
  tool,
  locale,
  preset,
  children,
  productSlug,
}: ToolShellProps) {
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
      {/* Breadcrumb */}
      <Breadcrumb
        items={breadcrumbs.map((b) => ({
          label: b.label,
          href: b.href,
        }))}
      />

      <main className="flex-1">
        {/* ── Hero Section ──────────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-linear-to-b from-primary/5 via-primary/[0.02] to-background">
          <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 pt-16 sm:pt-20 pb-20 sm:pb-28 text-center">
            <div className="inline-flex items-center justify-center size-14 rounded-2xl bg-primary/10 text-primary mb-6 mx-auto">
              <Icon size={24} />
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
              {displayMeta.title}
            </h1>
            <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {displayMeta.description}
            </p>
          </div>
          <div
            className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-background to-transparent pointer-events-none z-1"
            aria-hidden="true"
          />
        </section>

        {/* ── Generator ──────────────────────────────────────────────── */}
        <section className="mx-auto max-w-4xl px-4 sm:px-6 py-8 sm:py-12">
          {children ?? (
            <Suspense
              fallback={
                <div className="flex items-center justify-center h-64">
                  <div className="size-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
                </div>
              }
            >
              <ToolComponent locale={locale} />
            </Suspense>
          )}
        </section>

        {/* ── FAQ ───────────────────────────────────────────────────── */}
        {faqs.length > 0 && (
          <section className="border-t border-border bg-muted/20">
            <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16 sm:py-20">
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground tracking-tight text-center mb-10">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {faqs.map((faq, i) => (
                  <details
                    key={i}
                    className="group rounded-xl border border-border bg-card overflow-hidden"
                  >
                    <summary className="flex items-center justify-between px-5 py-4 text-sm font-medium text-foreground cursor-pointer hover:bg-muted/50 transition-colors">
                      {faq.q}
                      <svg
                        className="size-4 text-muted-foreground shrink-0 transition-transform group-open:rotate-180"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </summary>
                    <div className="px-5 pb-4">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Related Tools ─────────────────────────────────────────── */}
        {relatedTools.length > 0 && (
          <section className="border-t border-border">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 py-16 sm:py-20">
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground tracking-tight text-center mb-10">
                Related Tools
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {relatedTools.map((rt) => {
                  const rtMeta =
                    rt.seo.meta[locale as keyof typeof rt.seo.meta] ?? rt.seo.meta.en;
                  const RtIcon = rt.ui.icon;
                  const rtProduct = registry.getProduct(rt.product);
                  const rtSlug = rtProduct
                    ? `/${locale}/${rtProduct.slug}/${rt.id}`
                    : `/${locale}/${rt.id}`;

                  return (
                    <a
                      key={rt.id}
                      href={rtSlug}
                      className="group flex items-start gap-4 rounded-xl border border-border bg-card p-5 hover:border-primary/20 hover:shadow-elevated transition-all duration-200"
                    >
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <RtIcon size={18} />
                      </span>
                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                          {rtMeta.title}
                        </h3>
                        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                          {rtMeta.description}
                        </p>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
