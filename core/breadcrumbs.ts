/**
 * Breadcrumb Engine — builds breadcrumb trails from URL segments + registry.
 *
 * Every page gets consistent breadcrumbs without manual configuration.
 * The engine reads path segments and resolves them against the registry.
 *
 * ── URL convention ────────────────────────────────────────────────────────────
 *
 *   /{locale}                           → Home
 *   /{locale}/{product-slug}             → Home > Product
 *   /{locale}/{product-slug}/{tool-slug} → Home > Product > Tool
 *   /{locale}/{product-slug}/{tool-slug}/{preset} → Home > Product > Tool > Preset
 *
 * ── Usage ─────────────────────────────────────────────────────────────────────
 *
 *   const crumbs = buildBreadcrumbs(locale, segments);
 */

import type { BreadcrumbItem } from './types';
import { registry } from './registry';
import { getT } from '@/lib/i18n/server';

/* ── Known fixed pages (that don't come from the registry) ──────────────────── */

const KNOWN_PAGES: Record<string, Record<string, string>> = {
  en: { about: 'About' },
  ru: { about: 'О проекте' },
  de: { about: 'Über uns' },
  es: { about: 'Acerca de' },
  fr: { about: 'À propos' },
  pt: { about: 'Sobre' },
};

function getKnownLabel(locale: string, slug: string): string | undefined {
  return KNOWN_PAGES[locale]?.[slug] ?? KNOWN_PAGES.en?.[slug];
}

/* ── Public API ─────────────────────────────────────────────────────────────── */

/**
 * Build breadcrumb items from URL path segments.
 *
 * @param locale   — Current locale (e.g. "en")
 * @param segments — URL path segments WITHOUT locale prefix (e.g. ["phone-generator", "US"])
 *                    OR the full pathname split (e.g. ["en", "phone-generator", "US"])
 * @returns Array of { label, href } breadcrumb items
 */
export function buildBreadcrumbs(
  locale: string,
  segments: string[],
): BreadcrumbItem[] {
  const crumbs: BreadcrumbItem[] = [];

  // Remove locale segment if present (first segment)
  const cleanSegments =
    segments.length > 0 && segments[0] === locale
      ? segments.slice(1)
      : segments;

  // Root / home. This read "Home" in every language until now.
  crumbs.push({ label: getT(locale)('nav.home'), href: `/${locale}` });

  if (cleanSegments.length === 0) return crumbs;

  let accumulated = `/${locale}`;

  for (let i = 0; i < cleanSegments.length; i++) {
    const segment = cleanSegments[i];
    accumulated += `/${segment}`;

    // Try to resolve label from registry
    const label = resolveLabel(segment, locale);
    crumbs.push({ label, href: accumulated });
  }

  return crumbs;
}

/**
 * Build breadcrumbs for a tool page (product slug + tool slug).
 */
export function buildToolBreadcrumbs(
  locale: string,
  productSlug: string,
  toolSlug: string,
  preset?: string,
): BreadcrumbItem[] {
  return buildBreadcrumbs(locale, [productSlug, toolSlug, preset].filter(Boolean) as string[]);
}

/**
 * Build breadcrumbs for a product landing page.
 */
export function buildProductBreadcrumbs(
  locale: string,
  productSlug: string,
): BreadcrumbItem[] {
  return buildBreadcrumbs(locale, [productSlug]);
}

/* ── Internal ───────────────────────────────────────────────────────────────── */

/**
 * The first clause of a page title, for use as a crumb.
 *
 * Tool titles are written for a search result — "Генератор Code 128 —
 * Создание штрихкодов Code 128" — and a breadcrumb has room for the name, not
 * the sales line. Everything from the first dash or pipe is the sales line.
 */
function firstClause(title: string): string {
  return title.split(/\s[—–|-]\s/)[0].trim();
}

function resolveLabel(segment: string, locale: string): string {
  // 1. Try known pages (about, etc.)
  const known = getKnownLabel(locale, segment);
  if (known) return known;

  /*
   * 2 and 3 used to return `product.name` and `tool.name`, which the manifest
   * documents as unlocalized. Every crumb on every /ru, /de, /es, /fr and /pt
   * page was therefore English, directly above a translated h1.
   */
  const product = registry.getProductBySlug(segment);
  if (product) {
    const title = getT(locale)(`products.${product.id}.title`);
    return title.startsWith('products.') ? product.name : title;
  }

  for (const tool of registry.getAllTools()) {
    if (tool.id === segment || tool.id.endsWith(`/${segment}`)) {
      const meta = tool.seo.meta[locale as keyof typeof tool.seo.meta] ?? tool.seo.meta.en;
      return meta?.title ? firstClause(meta.title) : tool.name;
    }
  }

  // 4. Fallback — pretty-print the slug
  return segment
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
