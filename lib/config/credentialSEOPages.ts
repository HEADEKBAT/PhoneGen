/**
 * The eleven credential tool pages, by slug.
 *
 * ── What this file used to be ───────────────────────────────────────────────
 *
 * A full content config — hero headline, subtitle and three or four FAQ pairs
 * for each of eleven pages — rendered by eleven files under
 * `app/[locale]/{slug}/page.tsx`. Two things were wrong with that.
 *
 * Those eleven routes were unreachable. `lib/config/legacyRedirects.ts` sends
 * `/{locale}/{slug}` to `/{locale}/credential-generator/{slug}` with a 308, and
 * a redirect is answered before routing, so the pages behind it never rendered
 * for anybody. Ten of them had been dead for as long as the redirect existed;
 * the eleventh, uuid-generator, was excluded from the redirect list and was the
 * only one a visitor could reach.
 *
 * And every string in it was English. The site serves six languages, the page
 * files localized `<title>` and `<meta description>` through their own maps,
 * and then rendered an English headline, an English subtitle and English FAQ
 * answers underneath — a Russian tab title over an English page.
 *
 * The real pages are `tools/credential/*\/manifest.ts`, built by
 * `createToolPage`, which carry localized metadata, a FAQ, and links to their
 * ten siblings. What survives here is the slug list, because `app/sitemap.ts`
 * enumerates those pages from it.
 */

export interface CredentialToolPage {
  /** Also the tool manifest's id. */
  id: string;
  /** The path segment under /credential-generator/. */
  slug: string;
  /** The mode the studio opens in, for `?mode=` deep links. */
  mode: string;
}

export const CREDENTIAL_TOOL_PAGES: CredentialToolPage[] = [
  { id: 'password-generator', slug: 'password-generator', mode: 'random' },
  { id: 'passphrase-generator', slug: 'passphrase-generator', mode: 'passphrase' },
  { id: 'random-pin-generator', slug: 'random-pin-generator', mode: 'pin' },
  { id: 'api-key-generator', slug: 'api-key-generator', mode: 'api-key' },
  { id: 'jwt-secret-generator', slug: 'jwt-secret-generator', mode: 'jwt' },
  { id: 'random-token-generator', slug: 'random-token-generator', mode: 'token' },
  { id: 'uuid-generator', slug: 'uuid-generator', mode: 'uuid' },
  { id: 'uuid-v7-generator', slug: 'uuid-v7-generator', mode: 'uuid-v7' },
  { id: 'webhook-secret-generator', slug: 'webhook-secret-generator', mode: 'webhook' },
  { id: 'session-secret-generator', slug: 'session-secret-generator', mode: 'session' },
  { id: 'password-strength-checker', slug: 'password-strength-checker', mode: 'strength' },
];

/** Kept under the old name so `app/sitemap.ts` reads unchanged. */
export const ALL_SEO_PAGES = CREDENTIAL_TOOL_PAGES;
