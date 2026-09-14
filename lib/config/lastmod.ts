/**
 * Resolves a sitemap `<lastmod>` from the dates recorded in
 * `lastmod.generated.json`.
 *
 * The JSON is produced by `scripts/seo/lastmod.mjs` from git history and is
 * committed, so the build never depends on the clone having history — Vercel's
 * is shallow. `npm run check` fails when the committed dates fall behind git,
 * which is what keeps the field honest: Google uses `lastmod` only while it is
 * consistently accurate, and ignores it for the whole site otherwise.
 */

import raw from './lastmod.generated.json';

const dates = (raw as { dates: Record<string, string> }).dates;

/** Content group names — kept in step with `GROUPS` in scripts/seo/lastmod.mjs. */
export type LastmodGroup =
  | 'home'
  | 'about'
  | 'product-landing'
  | 'generator-tool'
  | 'studio-tool'
  | 'credential'
  | 'barcode'
  | 'payment'
  | 'color'
  | 'image'
  | 'qr'
  | 'crypto'
  | 'media'
  | 'standalone'
  | 'phone-country';

/**
 * The recorded date for one group in one locale, or `undefined` when the
 * generator found no history for it — the sitemap then omits the field rather
 * than inventing one.
 */
export function lastmodFor(group: LastmodGroup, locale: string): Date | undefined {
  const iso = dates[`${group}|${locale}`];
  return iso ? new Date(iso) : undefined;
}
