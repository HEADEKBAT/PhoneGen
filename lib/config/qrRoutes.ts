/**
 * QR Studio — Route configuration for sitemap & SEO.
 *
 * Each entry corresponds to a dedicated tool page at /qr-generator/{slug}.
 * Entries derive from tools/qr/ manifests.
 */

export interface QRRouteEntry {
  slug: string;
}

export const QR_TOOL_ROUTES: QRRouteEntry[] = [
  { slug: 'qr-code-generator' },
  // Future tools:
  // { slug: 'qr-designer' },
  // { slug: 'qr-validator' },
  // { slug: 'qr-scanner' },
  // { slug: 'bulk-qr-generator' },
  // { slug: 'qr-templates' },
];
