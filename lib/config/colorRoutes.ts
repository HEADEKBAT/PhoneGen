/**
 * Color Generator — Route configuration for sitemap & SEO.
 *
 * Each entry corresponds to a dedicated tool page at /color-generator/{slug}.
 * Entries derive from tools/color/ manifests.
 */

export interface ColorRouteEntry {
  slug: string;
}

export const COLOR_TOOL_ROUTES: ColorRouteEntry[] = [
  { slug: 'random-color-generator' },
  { slug: 'palette-generator' },
  { slug: 'theme-builder' },
  { slug: 'color-converter' },
  { slug: 'color-contrast-checker' },
  { slug: 'color-names' },
  { slug: 'brand-colors' },
  { slug: 'design-tokens' },
  { slug: 'gradient-generator' },
];
