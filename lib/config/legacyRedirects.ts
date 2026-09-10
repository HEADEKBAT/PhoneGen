/**
 * Legacy route redirects — single source of truth.
 *
 * When the barcode and credential tools moved under their product folders, the
 * old top-level URLs stayed alive as 308 redirects; the Payment Studio
 * sub-topics follow the same shape. Two places need to agree on that list:
 *
 *   • next.config.ts — to issue the redirects
 *   • app/sitemap.ts — to STOP advertising the old URLs
 *
 * They disagreed before this file existed, and the sitemap was listing 156 URLs
 * that answer with a redirect instead of content. Search engines treat a
 * sitemap full of redirects as a quality signal against the site, and the
 * redirect target is already in the sitemap under its real path, so the old
 * entry adds nothing.
 *
 * Pure data, no imports: next.config.ts is evaluated outside the app's module
 * graph and cannot resolve the "@/" alias.
 */

/** Barcode tools that moved to /barcode-generator/{slug}. */
export const LEGACY_BARCODE_SLUGS = [
  'ean13-generator',
  'ean8-generator',
  'upc-generator',
  'codabar-generator',
  'code128-generator',
  'code39-generator',
  'code93-generator',
  'gs1-128-generator',
  'gtin-generator',
  'isbn-generator',
  'issn-generator',
  'itf14-generator',
  'pharmacode-generator',
  'check-digit-calculator',
] as const;

/** Credential tools that moved to /credential-generator/{slug}. */
export const LEGACY_CREDENTIAL_SLUGS = [
  'password-generator',
  'passphrase-generator',
  'random-pin-generator',
  'api-key-generator',
  'jwt-secret-generator',
  'random-token-generator',
  /*
   * 'uuid-generator' is deliberately NOT in this list. It is also the product
   * slug of the UUID product (see products.ts), so redirecting it made the
   * product's landing page unreachable — every visit 308'd to the credential
   * tool. app/sitemap.ts already resolves the collision the other way, by
   * skipping credential SEO pages whose slug matches a product slug, so the
   * product page wins here too. The credential tool keeps its real URL at
   * /credential-generator/uuid-generator.
   */
  'uuid-v7-generator',
  'webhook-secret-generator',
  'session-secret-generator',
  'password-strength-checker',
] as const;

/**
 * Payment Studio sub-topics that are served under /payment-studio/{slug}.
 *
 * Unlike the two lists above these URLs were never live — they were listed in
 * the sitemap before anyone wrote the pages, and answered 404. The pages exist
 * now, under the studio folder, matching what the barcode and credential
 * families do. The bare top-level slug redirects there rather than 404ing,
 * because it is the shape a visitor is most likely to type and the shape the
 * sitemap advertised for months.
 *
 * 'credit-card-generator' is absent on purpose: it is a product slug with its
 * own landing page, and /payment-studio/credit-card-generator is its tool.
 */
export const PAYMENT_STUDIO_ALIAS_SLUGS = [
  'visa-card-generator',
  'mastercard-generator',
  'amex-card-generator',
  'discover-card-generator',
  'jcb-card-generator',
  'test-credit-card-numbers',
  'credit-card-validator',
  'bin-lookup',
  'cvv-generator',
  'bulk-credit-card-generator',
] as const;

/** One-off moves that do not follow the "{slug} → {product}/{slug}" shape. */
export const LEGACY_ONE_OFF_REDIRECTS: { from: string; to: string }[] = [
  {
    from: 'accessibility-color-checker',
    to: 'color-generator/color-contrast-checker',
  },
];

/**
 * Every top-level slug that answers with a redirect. Anything in here must be
 * kept out of the sitemap.
 */
export const REDIRECTED_TOP_LEVEL_SLUGS: ReadonlySet<string> = new Set<string>([
  ...LEGACY_BARCODE_SLUGS,
  ...LEGACY_CREDENTIAL_SLUGS,
  ...PAYMENT_STUDIO_ALIAS_SLUGS,
  ...LEGACY_ONE_OFF_REDIRECTS.map((entry) => entry.from),
]);

export function isRedirectedSlug(slug: string): boolean {
  return REDIRECTED_TOP_LEVEL_SLUGS.has(slug);
}

/** Redirect pairs, expressed as locale-parameterised paths for next.config.ts. */
export function buildLegacyRedirects(): {
  source: string;
  destination: string;
  permanent: boolean;
}[] {
  const redirects: { source: string; destination: string; permanent: boolean }[] = [];

  for (const slug of LEGACY_BARCODE_SLUGS) {
    redirects.push({
      source: `/:locale/${slug}`,
      destination: `/:locale/barcode-generator/${slug}`,
      permanent: true,
    });
  }

  for (const slug of LEGACY_CREDENTIAL_SLUGS) {
    redirects.push({
      source: `/:locale/${slug}`,
      destination: `/:locale/credential-generator/${slug}`,
      permanent: true,
    });
  }

  for (const slug of PAYMENT_STUDIO_ALIAS_SLUGS) {
    redirects.push({
      source: `/:locale/${slug}`,
      destination: `/:locale/payment-studio/${slug}`,
      permanent: true,
    });
  }

  for (const { from, to } of LEGACY_ONE_OFF_REDIRECTS) {
    redirects.push({
      source: `/:locale/${from}`,
      destination: `/:locale/${to}`,
      permanent: true,
    });
  }

  return redirects;
}
