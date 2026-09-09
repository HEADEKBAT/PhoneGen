/**
 * Image Studio — Route configuration for sitemap & SEO.
 *
 * Each entry corresponds to a dedicated tool page at /image-studio/{slug}.
 * Entries derive from tools/image/ manifests.
 */

export interface ImageRouteEntry {
  slug: string;
}

export const IMAGE_TOOL_ROUTES: ImageRouteEntry[] = [
  { slug: 'background-remover' },
];
