/**
 * Static routes the registries do not describe.
 *
 * Most sitemap URLs come from PRODUCTS, GENERATORS and the per-product route
 * configs. Two groups fall outside all of them and were silently absent from
 * the sitemap:
 *
 *  1. Interactive `/{product}/tool` pages. Some are declared as generators with
 *     `slug: 'tool'`; the studios added later never were.
 *  2. Standalone SEO landing pages that live at the top level and belong to no
 *     product folder — the gradient family, the theme/colour family and the
 *     password variants.
 *
 * `node scripts/seo/sitemap.check.mjs` compares this file plus the registries
 * against the pages that actually exist, and fails when they drift.
 */

/* ── Interactive tool pages ───────────────────────────────────────────────── */

/**
 * Product ids that serve an interactive editor at `/{product.slug}/tool`.
 *
 * Listing every one of them (not just the four the registries miss) keeps the
 * rule readable: "these products have a tool page". The sitemap de-duplicates,
 * so overlap with GENERATORS entries is harmless.
 */
export const TOOL_PAGE_PRODUCT_IDS: string[] = [
  'address',
  'barcode',
  'color',
  'company',
  'credential',
  'cryptoWallet',
  'email',
  'image',
  'media',
  'qr',
  'user',
  'username',
  'uuid',
];

/* ── Standalone SEO landing pages ─────────────────────────────────────────── */

export interface StandaloneRouteEntry {
  slug: string;
  /** Loose grouping, for reading this file — not used at runtime. */
  family: 'gradient' | 'theme' | 'password';
  priority: number;
}

/**
 * Top-level pages with no product folder. Each one has a real
 * `app/[locale]/{slug}/page.tsx`; add an entry only alongside the page, or the
 * sitemap starts advertising 404s — worse than advertising nothing.
 */
export const STANDALONE_SEO_ROUTES: StandaloneRouteEntry[] = [
  /* Gradient family */
  { slug: 'gradient-generator', family: 'gradient', priority: 0.9 },
  { slug: 'linear-gradient-generator', family: 'gradient', priority: 0.8 },
  { slug: 'radial-gradient-generator', family: 'gradient', priority: 0.8 },
  { slug: 'conic-gradient-generator', family: 'gradient', priority: 0.8 },
  { slug: 'mesh-gradient-generator', family: 'gradient', priority: 0.8 },
  { slug: 'aurora-gradient-generator', family: 'gradient', priority: 0.8 },
  { slug: 'css-gradient-generator', family: 'gradient', priority: 0.8 },
  { slug: 'smart-gradient-generator', family: 'gradient', priority: 0.7 },
  { slug: 'gradient-animation-generator', family: 'gradient', priority: 0.7 },
  { slug: 'gradient-background-generator', family: 'gradient', priority: 0.7 },
  { slug: 'gradient-palette-library', family: 'gradient', priority: 0.7 },
  { slug: 'gradient-export-tool', family: 'gradient', priority: 0.7 },

  /* Theme and colour family */
  { slug: 'theme-generator', family: 'theme', priority: 0.8 },
  { slug: 'tailwind-theme-generator', family: 'theme', priority: 0.8 },
  { slug: 'design-system-generator', family: 'theme', priority: 0.8 },
  { slug: 'brand-palette-generator', family: 'theme', priority: 0.8 },
  { slug: 'ui-color-generator', family: 'theme', priority: 0.7 },

  /* Password family */
  { slug: 'wifi-password-generator', family: 'password', priority: 0.8 },
  { slug: 'human-password-generator', family: 'password', priority: 0.7 },
  { slug: 'pin-generator', family: 'password', priority: 0.7 },
];
