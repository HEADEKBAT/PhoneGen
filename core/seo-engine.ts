/**
 * SEO Engine — generates Next.js Metadata from ToolManifest / ProductManifest.
 *
 * This replaces per-page `generateMetadata()` boilerplate. Every registered
 * tool gets canonical URLs, hreflang alternates, OpenGraph, and Twitter cards
 * automatically.
 *
 * ── Usage ─────────────────────────────────────────────────────────────────────
 *
 *   // In a page.tsx:
 *   const { generateMetadata } = createToolPage(myTool);
 *
 * ── Backward compatibility ────────────────────────────────────────────────────
 *
 * Existing `lib/config/seo.ts` remains untouched. This module re-exports the
 * same SEO_LOCALES and BASE_URL for consistency.
 */

import type { Metadata } from 'next';
import { SEO_LOCALES, BASE_URL } from '@/lib/config/seo';
import type { ToolManifest, ProductManifest, SupportedLocale } from './types';

/* ── Constants ──────────────────────────────────────────────────────────────── */

const PLATFORM_NAME = 'GenCore';
const TITLE_TEMPLATE = ` | ${PLATFORM_NAME}`;

/* ── Helpers ────────────────────────────────────────────────────────────────── */

function stripTrailingSlash(p: string): string {
  return p.endsWith('/') ? p.slice(0, -1) : p;
}

function generateHreflang(
  locale: string,
  path: string,
): { canonical: string; languages: Record<string, string> } {
  const cleanPath = stripTrailingSlash(path.startsWith('/') ? path : `/${path}`);
  const canonical = `${BASE_URL}/${locale}${cleanPath}`;

  const languages: Record<string, string> = {};
  for (const l of SEO_LOCALES) {
    languages[l] = `${BASE_URL}/${l}${cleanPath}`;
  }
  languages['x-default'] = `${BASE_URL}/en${cleanPath}`;

  return { canonical, languages };
}

/* ── Public API ─────────────────────────────────────────────────────────────── */

/**
 * Generate Metadata for a tool page.
 *
 * @param tool   — Registered ToolManifest
 * @param locale — Current page locale
 * @param slugOverride — Optional path slug override (defaults to tool.id)
 */
export function generateToolMetadata(
  tool: ToolManifest,
  locale: string,
  slugOverride?: string,
): Metadata {
  const meta = tool.seo.meta[locale as SupportedLocale] ?? tool.seo.meta.en;
  const path = slugOverride ? `/${slugOverride}` : `/${tool.id}`;
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

/**
 * Generate Metadata for a product landing page.
 *
 * @param product — Registered ProductManifest
 * @param locale  — Current page locale
 * @param overrides — Optional title/description overrides (locale-keyed)
 */
export function generateProductMetadata(
  product: ProductManifest,
  locale: string,
  overrides?: Partial<Record<string, { title?: string; description?: string }>>,
): Metadata {
  const override = overrides?.[locale];
  const title = override?.title
    ? `${override.title}${TITLE_TEMPLATE}`
    : `${product.name}${TITLE_TEMPLATE}`;
  const description = override?.description ?? product.description;
  const alternates = generateHreflang(locale, `/${product.slug}`);

  return {
    title,
    description,
    alternates,
    openGraph: {
      title,
      description,
      url: alternates.canonical,
      siteName: PLATFORM_NAME,
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
    robots: { index: true, follow: true },
  };
}

/**
 * Generate Metadata for a preset sub-page of a tool.
 */
export function generateToolPresetMetadata(
  tool: ToolManifest,
  presetKey: string,
  locale: string,
): Metadata {
  const preset = tool.routes?.[presetKey];
  if (!preset) {
    return generateToolMetadata(tool, locale);
  }

  const meta = preset.seo.meta[locale as SupportedLocale] ?? preset.seo.meta.en;
  const path = `/${tool.id}/${presetKey}`;
  const alternates = generateHreflang(locale, path);
  const title = `${meta.title}${TITLE_TEMPLATE}`;

  return {
    title,
    description: meta.description,
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

/* ── Re-export SEO constants for convenience ───────────────────────────────── */

export { SEO_LOCALES, BASE_URL } from '@/lib/config/seo';
