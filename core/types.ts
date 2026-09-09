/**
 * Core Platform Types — ToolManifest, ProductManifest, and supporting types.
 *
 * These types define the contract for every product and tool on the GenCore
 * platform. Any module that registers a product or tool must conform to these
 * interfaces.
 *
 * ── Design principles ─────────────────────────────────────────────────────────
 * 1. A Tool Manifest is the SINGLE source of truth for a tool.
 * 2. Every tool belongs to exactly one product.
 * 3. SEO metadata is locale-keyed; English is always required as fallback.
 * 4. Capabilities tell the platform what UX to auto-generate (history, export…).
 */

import type { ComponentType, ReactNode } from 'react';

/* ── Locale system ──────────────────────────────────────────────────────────── */

export type SupportedLocale = 'en' | 'ru' | 'de' | 'es' | 'fr' | 'pt';

/** Map keyed by locale — English is always required as the hard fallback. */
export type LocaleMap<T> = { en: T } & Partial<Record<SupportedLocale, T>>;

/* ── Export formats ─────────────────────────────────────────────────────────── */

export type ExportFormat =
  | 'json'
  | 'csv'
  | 'txt'
  | 'css'
  | 'tailwind'
  | 'scss'
  | 'less'
  | 'svg'
  | 'png'
  | 'react'
  | 'vue'
  | 'styledictionary';

/* ── Tool capabilities ──────────────────────────────────────────────────────── */

/**
 * Describes WHAT a tool can do — the platform auto-generates UI for these.
 *
 * Example:      `{ history: true, export: ['json','csv'], favorites: true }`
 * Platform:     Adds history panel, export dropdown, and favorite button.
 */
export interface ToolCapabilities {
  /** Whether the tool persists generation history in localStorage. */
  history?: boolean;

  /** Export formats the generated output supports. */
  export?: ExportFormat[];

  /** Whether users can share results via URL. */
  share?: boolean;

  /** Whether users can favourite a configuration. */
  favorites?: boolean;

  /** Named presets / quick-start configurations. Each maps to a sub-route. */
  presets?: string[];

  /** Whether two configurations can be compared side-by-side. */
  compare?: boolean;

  /** Whether the tool supports bulk generation (100+ items). */
  bulk?: boolean;
}

/* ── FAQ ────────────────────────────────────────────────────────────────────── */

export interface ToolFAQ {
  q: string;
  a: string;
}

/* ── Seeded FAQ ──────────────────────────────────────────────────────────────── */

export interface SeededFAQ {
  qKey: string;
  aKey: string;
}

/* ── Tool Manifest ──────────────────────────────────────────────────────────── */

/**
 * Complete definition of a single generator tool on the GenCore platform.
 *
 * Once registered via `registry.registerTool()`, the platform automatically
 * provides: routing, SEO metadata, breadcrumbs, sitemap, navigation, search,
 * related-tool recommendations, export UI, history, and favorites.
 */
export interface ToolManifest {
  /* ── Identity ────────────────────────────────────────────────────────── */

  /** Unique identifier (e.g. "password-generator", "ean13-generator"). */
  id: string;

  /** ID of the parent product (must match a registered ProductManifest.id). */
  product: string;

  /** Human-readable display name (unlocalized — use seo.meta for locales). */
  name: string;

  /* ── UI ──────────────────────────────────────────────────────────────── */

  ui: {
    /** The main generator component. Rendered inside ToolShell. */
    component: ComponentType<any>;

    /** Lucide icon component. */
    icon: ComponentType<{ size?: number; className?: string }>;

    /** Optional lightweight preview shown on product landing pages. */
    previewComponent?: ComponentType<any>;
  };

  /* ── SEO ─────────────────────────────────────────────────────────────── */

  seo: {
    /**
     * Locale-keyed title + description + keywords.
     * English is always required as the hard fallback.
     */
    meta: LocaleMap<{
      title: string;
      description: string;
      keywords?: string[];
    }>;

    /** FAQ entries displayed at the bottom of the tool page. */
    faqs?: ToolFAQ[];
  };

  /* ── Capabilities ─────────────────────────────────────────────────────── */

  capabilities: ToolCapabilities;

  /* ── Sub-routes (preset pages) ────────────────────────────────────────── */

  /**
   * Optional preset sub-routes. Each preset gets its own SEO page.
   *
   * Example: password-generator has presets ["secure", "pin", "memorable"].
   * Each generates a page at:
   *   /{locale}/credential-generator/password-generator/secure
   */
  routes?: Record<
    string,
    {
      seo: {
        meta: LocaleMap<{ title: string; description: string }>;
      };
    }
  >;
}

/* ── Product Manifest ───────────────────────────────────────────────────────── */

/**
 * Definition of a GenCore product — a logical grouping of tools.
 *
 * Roughly mirrors the existing `Product` interface in `lib/config/products.ts`
 * for backward compatibility, but lives in the Core registry.
 */
export interface ProductManifest {
  /* ── Identity ────────────────────────────────────────────────────────── */
  id: string;
  slug: string;
  name: string;
  description: string;

  /* ── Display ─────────────────────────────────────────────────────────── */
  icon: string;
  category: string;
  status: 'active' | 'beta' | 'coming-soon' | 'planned';
  featured: boolean;

  /* ── Locale / SEO ────────────────────────────────────────────────────── */
  supportedLocales: string[];
  hasCountries: boolean;
  seoPriority: number;

  /* ── Branding ────────────────────────────────────────────────────────── */
  themeColor?: string;
}

/* ── Breadcrumb ─────────────────────────────────────────────────────────────── */

export interface BreadcrumbItem {
  label: string;
  href: string;
}

/* ── Page factory helpers ────────────────────────────────────────────────────── */

export interface ToolPageBundle {
  generateMetadata: (props: {
    params: Promise<{ locale: string }>;
  }) => Promise<Record<string, unknown>>;
  Page: ComponentType<{ params: Promise<{ locale: string }> }>;
}
