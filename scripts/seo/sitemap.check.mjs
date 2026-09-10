/**
 * Sitemap coverage audit — `node scripts/seo/sitemap.check.mjs [--json]`
 *
 * Checks both directions between the pages that exist and the URLs the sitemap
 * advertises:
 *
 *   1. Pages with no sitemap entry — invisible to crawlers that do not stumble
 *      onto an internal link.
 *   2. Sitemap entries that answer with a redirect — the legacy top-level slugs
 *      in lib/config/legacyRedirects.ts. Their real URLs are already listed
 *      under the product folder, so the old entry only dilutes the file.
 *
 *   3. Pages whose canonical URL points at a different page. A page that builds
 *      its metadata from a product record inherits that product's slug as its
 *      canonical unless it passes an explicit `path`. Twenty-six pages did
 *      exactly that and told search engines they were duplicates of their
 *      product landing page, which keeps them out of the index no matter how
 *      well they are linked.
 *
 *   4. Sitemap entries with no page behind them. A slug added to a registry is
 *      advertised immediately, whether or not anyone wrote the page; three
 *      hundred and fifty-four URLs in this sitemap answered with a 404 for
 *      that reason. A registry slug is a promise, and this check holds it:
 *      list the slug when the page exists, not before.
 *
 * It reconstructs the sitemap's URL set by reading the same registries
 * app/sitemap.ts imports, rather than executing it — the sitemap is TypeScript
 * with Next.js imports, so running it needs the whole toolchain. The PREFIXES
 * table below mirrors sitemap.ts; if you add a loop there, add its entry here.
 *
 * Dynamic segments ([country], [slug]) are listed, not judged: the filesystem
 * cannot say how many URLs they expand to.
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../..', import.meta.url));
const APP_DIR = join(ROOT, 'app/[locale]');
const CONFIG_DIR = join(ROOT, 'lib/config');

const args = new Set(process.argv.slice(2));
const asJson = args.has('--json');

/* ── Registries → the URL prefix sitemap.ts pairs them with ───────────────── */
/* Mirrors app/sitemap.ts. Each entry: [config file, list of path prefixes]. */
const PREFIXES = [
  ['credentialSEOPages.ts', ['', 'credential-generator']],
  ['barcodeSEOPages.ts', ['', 'barcode-generator']],
  ['paymentSEOPages.ts', ['', 'payment-studio']],
  ['cryptoSEOPages.ts', ['']],
  ['mediaSEOPages.ts', ['']],
  ['colorRoutes.ts', ['color-generator']],
  ['imageRoutes.ts', ['image-studio']],
  ['qrRoutes.ts', ['qr-generator']],
  ['cryptoRoutes.ts', ['crypto-wallet-playground']],
  ['mediaRoutes.ts', ['media-studio']],
];

/* Routes sitemap.ts emits without going through a registry. */
const EXPLICIT = ['', 'about'];

/* ── Helpers ──────────────────────────────────────────────────────────────── */

/**
 * Read a config module with comments stripped.
 *
 * The slug extractors below match single-quoted strings, and prose in a comment
 * ("the page 308'd to the tool") contains apostrophes that pair up into
 * convincing-looking fake matches. Removing comments first is cheaper than
 * teaching the extractors to skip them.
 */
function read(file) {
  const path = join(CONFIG_DIR, file);
  if (!existsSync(path)) return '';
  return readFileSync(path, 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '');
}

const SLUG = /\bslug:\s*'([^']+)'/g;

/* Page files that delegate to a factory in core/. Listed so the canonical
   check can say how much of the app it actually inspected, rather than
   reporting a clean pass over pages it never looked at. */
const FACTORY_CALL =
  /create(?:ToolPage|PresetPage|LandingPage|StudioSEOPage|StudioToolPage|CredentialDeepLinkPage)\(/;

function slugsIn(file) {
  const text = read(file);
  const found = new Set();
  SLUG.lastIndex = 0;
  let match;
  while ((match = SLUG.exec(text)) !== null) found.add(match[1]);
  return [...found];
}

/** Pull a string-array literal out of a TS module by its exported name. */
function stringArray(file, name) {
  const text = read(file);
  const match = text.match(new RegExp(`${name}[^=]*=\\s*\\[([\\s\\S]*?)\\]`));
  if (!match) return [];
  return [...match[1].matchAll(/'([^']+)'/g)].map((m) => m[1]);
}

/* ── Filesystem routes ────────────────────────────────────────────────────── */

function walkRoutes(dir, prefix = '', out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (!statSync(full).isDirectory()) continue;
    const route = `${prefix}/${entry}`;
    if (existsSync(join(full, 'page.tsx')) || existsSync(join(full, 'page.ts'))) {
      out.push(route.slice(1));
    }
    walkRoutes(full, route, out);
  }
  return out;
}

const fsRoutes = [];
if (existsSync(join(APP_DIR, 'page.tsx'))) fsRoutes.push('');
walkRoutes(APP_DIR, '', fsRoutes);
fsRoutes.sort();

const dynamicRoutes = fsRoutes.filter((r) => r.includes('['));
const staticRoutes = fsRoutes.filter((r) => !r.includes('['));

/* ── Redirected slugs ─────────────────────────────────────────────────────── */

const redirected = new Set([
  ...stringArray('legacyRedirects.ts', 'LEGACY_BARCODE_SLUGS'),
  ...stringArray('legacyRedirects.ts', 'LEGACY_CREDENTIAL_SLUGS'),
  ...stringArray('legacyRedirects.ts', 'PAYMENT_STUDIO_ALIAS_SLUGS'),
  ...[...read('legacyRedirects.ts').matchAll(/from:\s*'([^']+)'/g)].map((m) => m[1]),
]);

/* ── Sitemap's reachable set ──────────────────────────────────────────────── */

const covered = new Set(EXPLICIT);

/* Product landing pages, plus the id → slug map the sitemap uses to nest
   generators and tool pages under their own product. */
const productSlugById = new Map();
{
  const text = readFileSync(join(CONFIG_DIR, 'products.ts'), 'utf8');
  /* Captures the status too: sitemap.ts lists only shipped products, because
     'planned' entries are roadmap cards with no route. */
  const ENTRY =
    /\bid:\s*'([^']+)',\s*\n\s*slug:\s*'([^']+)'[\s\S]{0,400}?\bstatus:\s*'([^']+)'/g;
  let match;
  while ((match = ENTRY.exec(text)) !== null) {
    const [, id, slug, status] = match;
    productSlugById.set(id, slug);
    if (status === 'active' || status === 'beta') covered.add(slug);
  }
}

/* Generator pages, nested under their OWN product — pairing every generator
   with every product would mark pages covered that the sitemap never emits. */
{
  const text = readFileSync(join(CONFIG_DIR, 'generators.ts'), 'utf8');
  const ENTRY = /productId:\s*'([^']+)'[\s\S]{0,300}?\bslug:\s*'([^']+)'/g;
  let match;
  while ((match = ENTRY.exec(text)) !== null) {
    const productSlug = productSlugById.get(match[1]);
    if (productSlug) covered.add(`${productSlug}/${match[2]}`);
  }
}

/* Interactive tool pages declared outside the GENERATORS registry. */
for (const productId of stringArray('staticRoutes.ts', 'TOOL_PAGE_PRODUCT_IDS')) {
  const productSlug = productSlugById.get(productId);
  if (productSlug) covered.add(`${productSlug}/tool`);
}

/* Standalone top-level SEO pages. */
for (const slug of slugsIn('staticRoutes.ts')) covered.add(slug);

/* Registry-driven pages. A redirected top-level slug is deliberately not
   covered at the top level — sitemap.ts skips it. */
for (const [file, prefixes] of PREFIXES) {
  for (const slug of slugsIn(file)) {
    for (const prefix of prefixes) {
      if (!prefix && redirected.has(slug)) continue;
      covered.add(prefix ? `${prefix}/${slug}` : slug);
    }
  }
}

/* ── Canonical URLs ───────────────────────────────────────────────────────── */

/**
 * A page using `type: 'product'` metadata must either live at the product's own
 * slug or declare `path`. Anything else is a page that calls itself a duplicate
 * of another page.
 */
function findForeignCanonicals() {
  const productSlugById = new Map();
  {
    const text = readFileSync(join(CONFIG_DIR, 'products.ts'), 'utf8');
    const ENTRY = /\bid:\s*'([^']+)',\s*\n\s*slug:\s*'([^']+)'/g;
    let match;
    while ((match = ENTRY.exec(text)) !== null) productSlugById.set(match[1], match[2]);
  }

  const offenders = [];
  let inspected = 0;
  let fromFactory = 0;
  for (const route of staticRoutes) {
    const file = join(APP_DIR, route, 'page.tsx');
    if (!existsSync(file)) continue;

    const source = readFileSync(file, 'utf8');
    /* A factory-built page has no metadata of its own to inspect: the factory
       derives the canonical from the manifest path, which is also where the
       file lives, so the two cannot disagree. Counted, not checked. */
    if (FACTORY_CALL.test(source)) {
      fromFactory++;
      continue;
    }
    if (!/type:\s*'product'/.test(source)) continue;
    inspected++;
    if (/\bpath:\s*'/.test(source)) continue; // declares its own canonical

    const product = /getProduct\('([^']+)'\)/.exec(source);
    if (!product) continue;

    const slug = productSlugById.get(product[1]);
    if (!slug || route === slug) continue;

    // A redirected page is never served, so its canonical cannot be reached.
    if (redirected.has(route)) continue;

    offenders.push({ route, canonical: slug });
  }
  return { offenders, inspected, fromFactory };
}

const { offenders: foreignCanonicals, inspected, fromFactory } = findForeignCanonicals();

/* ── Pages behind the sitemap's URLs ──────────────────────────── */

/**
 * A dynamic segment stands in for any one path segment, so
 * `phone-generator/[country]` serves `phone-generator/us`. Matching segment by
 * segment keeps the check honest about which URLs really have a file behind
 * them without expanding the dynamic route.
 */
function servedByDynamicRoute(route) {
  const parts = route.split('/');
  return dynamicRoutes.some((pattern) => {
    const shape = pattern.split('/');
    if (shape.length !== parts.length) return false;
    return shape.every((segment, i) => segment.startsWith('[') || segment === parts[i]);
  });
}

const staticRouteSet = new Set(staticRoutes);
const phantom = [...covered]
  .filter((route) => !staticRouteSet.has(route) && !servedByDynamicRoute(route))
  .sort();

/* ── Diff ─────────────────────────────────────────────────────────────────── */

/* A redirected page is expected to be absent from the sitemap, so it is not a
   miss — it is reported separately as "intentionally excluded". */
const uncovered = staticRoutes.filter((r) => !covered.has(r) && !redirected.has(r));
const excluded = staticRoutes.filter((r) => redirected.has(r));
const advertisedRedirects = [...covered].filter((r) => redirected.has(r));

const grouped = new Map();
for (const route of uncovered) {
  const bucket = route.endsWith('/tool')
    ? 'interactive tool pages (/{product}/tool)'
    : route.includes('/')
      ? 'nested pages'
      : 'standalone SEO landing pages';
  if (!grouped.has(bucket)) grouped.set(bucket, []);
  grouped.get(bucket).push(route);
}

if (asJson) {
  console.log(
    JSON.stringify(
      {
        pages: staticRoutes.length,
        covered: staticRoutes.length - uncovered.length - excluded.length,
        uncovered,
        excludedAsRedirects: excluded,
        advertisedRedirects,
        phantom,
        foreignCanonicals,
        dynamic: dynamicRoutes,
      },
      null,
      2,
    ),
  );
} else {
  console.log(
    `Pages under ${relative(ROOT, APP_DIR)}: ${staticRoutes.length} static, ${dynamicRoutes.length} dynamic`,
  );
  console.log(`In the sitemap: ${staticRoutes.length - uncovered.length - excluded.length}`);
  console.log(`Excluded on purpose (308 redirects): ${excluded.length}\n`);

  if (uncovered.length === 0) {
    console.log('✓ every page that should be in the sitemap is in the sitemap');
  } else {
    console.log(`✗ ${uncovered.length} page(s) exist but the sitemap never emits them:\n`);
    for (const [bucket, routes] of grouped) {
      console.log(`  ${bucket} — ${routes.length}`);
      for (const route of routes) console.log(`      /${route}`);
      console.log('');
    }
  }

  console.log(
    `Canonical URLs: ${fromFactory} page(s) derive theirs from a factory manifest, ${inspected} declare their own and were checked`,
  );

  if (foreignCanonicals.length) {
    console.log(`\n✗ ${foreignCanonicals.length} page(s) name another page as their canonical URL:`);
    for (const { route, canonical } of foreignCanonicals) {
      console.log(`      /${route}  →  /${canonical}`);
    }
    console.log('  Pass `path` to generateMetadata so each page claims its own URL.');
  }

  if (phantom.length) {
    console.log(`\n✗ ${phantom.length} sitemap URL(s) have no page behind them (404):`);
    for (const route of phantom) console.log(`      /${route}`);
    console.log('  Remove the slug from its registry, or write the page it promises.');
  }

  if (advertisedRedirects.length) {
    console.log(`\n✗ ${advertisedRedirects.length} sitemap URL(s) answer with a redirect:`);
    for (const route of advertisedRedirects) console.log(`      /${route}`);
  }

  if (dynamicRoutes.length) {
    console.log(
      `\n· dynamic routes (expansion not checked here): ${dynamicRoutes.map((r) => `/${r}`).join(', ')}`,
    );
  }
}

process.exit(
  uncovered.length > 0 ||
    advertisedRedirects.length > 0 ||
    foreignCanonicals.length > 0 ||
    phantom.length > 0
    ? 1
    : 0,
);
