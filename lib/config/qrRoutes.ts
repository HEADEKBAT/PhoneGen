/**
 * QR Studio — the tool pages the sitemap lists.
 *
 * Empty, and deliberately. The one entry here was `qr-code-generator`, a
 * second URL for the studio that /qr-generator/tool already serves: the same
 * component, two sets of SEO copy, and no link to it from anywhere on the
 * site. It is a 308 to the studio now (lib/config/legacyRedirects.ts), and the
 * studio's own URL is listed by the studio-tool loop above it.
 *
 * Five more slugs sat here commented out — qr-designer, qr-validator,
 * qr-scanner, bulk-qr-generator, qr-templates — none of which exist. A list of
 * pages someone might write is not route configuration; when one of them is
 * written it goes here with the page.
 */

export interface QRRouteEntry {
  slug: string;
}

export const QR_TOOL_ROUTES: QRRouteEntry[] = [];
