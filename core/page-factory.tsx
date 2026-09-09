/**
 * Page Factory — создаёт `generateMetadata` и `Page` компонент из ToolManifest.
 *
 * ЕДИНСТВЕННЫЙ шаблон для всех tool-страниц платформы.
 *
 * ── Использование ─────────────────────────────────────────────────────────────
 *
 *   // app/[locale]/credential-generator/password-generator/page.tsx
 *   import { createToolPage } from '@/core/page-factory';
 *   import { passwordGenerator } from '@/tools/credential/password-generator/manifest';
 *
 *   const page = createToolPage(passwordGenerator);
 *   export const generateMetadata = page.generateMetadata;
 *   export default page.Page;
 *
 * ── Что делает ────────────────────────────────────────────────────────────────
 *
 *   1. generateMetadata() — автоматически строит Metadata из ToolManifest:
 *      - title, description, keywords
 *      - canonical URL
 *      - hreflang alternates (все 6 языков + x-default)
 *      - OpenGraph
 *      - Twitter card
 *
 *   2. Page — рендерит ToolShell с компонентом инструмента
 *
 * ── Preset sub-routes ─────────────────────────────────────────────────────────
 *
 *   const page = createToolPage(myTool, { preset: 'secure' });
 *
 *   Использует meta из tool.routes[preset].seo.meta
 *   URL: /{locale}/{product-slug}/{tool-id}/{preset}
 */

import { type Metadata } from 'next';
import { Suspense } from 'react';
import type { ToolManifest } from './types';
import ToolShell from './tool-shell';
import { registry } from './registry';
import { SEO_LOCALES, BASE_URL } from './seo-engine';

/* ── Constants ──────────────────────────────────────────────────────────────── */

const PLATFORM_NAME = 'GenCore';
const TITLE_TEMPLATE = ` | ${PLATFORM_NAME}`;

/* ── Types ──────────────────────────────────────────────────────────────────── */

interface CreateToolPageOptions {
  /** Preset key for sub-routes (e.g. "secure", "material"). */
  preset?: string;
  /** Override slug in URL path. Defaults to tool.id. */
  slugOverride?: string;
  /** Override product slug. Defaults to registry lookup. */
  productSlugOverride?: string;
}

interface PageProps {
  params: Promise<{ locale: string }>;
}

/* ── Helpers ────────────────────────────────────────────────────────────────── */

function stripTrailingSlash(p: string): string {
  return p.endsWith('/') ? p.slice(0, -1) : p;
}

function generateHreflang(locale: string, path: string) {
  const cleanPath = stripTrailingSlash(path.startsWith('/') ? path : `/${path}`);
  const canonical = `${BASE_URL}/${locale}${cleanPath}`;
  const languages: Record<string, string> = {};
  for (const l of SEO_LOCALES) languages[l] = `${BASE_URL}/${l}${cleanPath}`;
  languages['x-default'] = `${BASE_URL}/en${cleanPath}`;
  return { canonical, languages };
}

/* ── Factory ─────────────────────────────────────────────────────────────────── */

export function createToolPage(
  tool: ToolManifest,
  options?: CreateToolPageOptions,
) {
  const preset = options?.preset;
  const slugOverride = options?.slugOverride ?? tool.id;
  const productSlugOverride = options?.productSlugOverride;

  /* ── Resolve product slug ────────────────────────────────────────────── */
  function resolveProductSlug(): string {
    if (productSlugOverride) return productSlugOverride;
    const product = registry.getProduct(tool.product);
    return product?.slug ?? tool.id;
  }

  /* ── Resolve SEO meta (locale-aware, respects presets) ──────────────── */
  function resolveMeta(locale: string): { title: string; description: string; keywords?: string[] } {
    const l = locale as keyof typeof tool.seo.meta;

    // Preset sub-page overrides
    if (preset && tool.routes?.[preset]) {
      const presetMeta = tool.routes[preset].seo.meta;
      const m = presetMeta[l] ?? presetMeta.en!;
      return { title: m.title, description: m.description };
    }

    // Default meta
    return tool.seo.meta[l] ?? tool.seo.meta.en;
  }

  /* ── Build path ─────────────────────────────────────────────────────── */
  function buildPath(locale: string): string {
    const productSlug = resolveProductSlug();
    const parts = [productSlug, slugOverride];
    if (preset) parts.push(preset);
    return `/${parts.join('/')}`;
  }

  /* ── generateMetadata ───────────────────────────────────────────────── */
  async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { locale } = await params;
    const meta = resolveMeta(locale);
    const path = buildPath(locale);
    const alternates = generateHreflang(locale, path);
    const title = `${meta.title}${TITLE_TEMPLATE}`;

    return {
      title,
      description: meta.description,
      keywords: meta.keywords,
      alternates,
      openGraph: {
        title,
        description: meta.description,
        url: alternates.canonical,
        siteName: PLATFORM_NAME,
        locale: 'en_US',
        type: 'website',
      },
      twitter: {
        card: 'summary',
        title,
        description: meta.description,
      },
      robots: { index: true, follow: true },
    };
  }

  /* ── Page component ─────────────────────────────────────────────────── */
  async function Page({ params }: PageProps) {
    const { locale } = await params;
    const productSlug = resolveProductSlug();

    return (
      <ToolShell
        tool={tool}
        locale={locale}
        preset={preset}
        productSlug={productSlug}
      />
    );
  }

  return { generateMetadata, Page };
}

/**
 * Simplified factory for preset sub-pages.
 *
 * Usage:
 *   const page = createPresetPage(tool, 'secure');
 *   // Options: preset is already set.
 */
export function createPresetPage(tool: ToolManifest, preset: string) {
  return createToolPage(tool, { preset });
}
