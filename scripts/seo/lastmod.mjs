#!/usr/bin/env node
/**
 * Generates lib/config/lastmod.generated.json — the honest `<lastmod>` source
 * for app/sitemap.ts.
 *
 * Why this exists
 * ---------------
 * The sitemap used to stamp `new Date()` on all 2172 URLs, so every build told
 * Google that every page on the site had changed. Google's documentation is
 * explicit that it uses `lastmod` only "if it is consistently and verifiably
 * accurate"; a file whose dates move on every deploy is exactly the case it
 * calls untrustworthy, and the field is then ignored for the whole site.
 *
 * What a page's date actually is
 * ------------------------------
 * A page's copy has two sources, and its date is the newer of them:
 *
 *   1. the registry and component that define it — `GROUPS` below; and
 *   2. the parts of `lib/i18n/<locale>.json` it renders — `SECTIONS` below.
 *
 * The dictionary is read per top-level section rather than per file, because
 * a file-level date would move all 362 URLs of a locale whenever any string in
 * it changed. Sections no group claims (nav, header, footer, breadcrumb …) are
 * treated as shared and do move every page — which is true, they are on every
 * page. That inversion is deliberate: a section added later and never mapped
 * errs toward reporting a change, never toward hiding one.
 *
 * Staying honest
 * --------------
 * The result is committed, so the build never needs git history (Vercel's
 * clone is shallow). `--check` re-runs every query and fails when the
 * committed dates are behind, which is what wires this into `npm run check`.
 *
 * Usage:
 *   node scripts/seo/lastmod.mjs           # write the file
 *   node scripts/seo/lastmod.mjs --check   # fail if it is stale
 */

import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const OUT = join(ROOT, 'lib', 'config', 'lastmod.generated.json');

const LOCALES = ['en', 'fr', 'es', 'pt', 'de', 'ru'];

/**
 * Content group → the source paths whose history determines its pages' dates.
 * Keys must match the group names `app/sitemap.ts` passes to `add()`.
 */
const GROUPS = {
  home: [
    'app/[locale]/page.tsx',
    'app/[locale]/home-client.tsx',
    'components/home',
    'lib/config/homeCatalogue.ts',
  ],
  about: ['app/[locale]/about'],
  'product-landing': [
    'lib/config/products.ts',
    'lib/config/landingPages.ts',
    'lib/config/productLanding.ts',
    'core/landing-factory.tsx',
  ],
  'generator-tool': ['lib/config/generators.ts', 'core/page-factory.tsx', 'core/seo-engine.ts'],
  'studio-tool': ['lib/config/studioToolPages.ts', 'core/studio-tool-factory.tsx'],
  credential: [
    'lib/config/credentialSEOPages.ts',
    'lib/config/credentialLanding.ts',
    'lib/config/credentialDeepLinks.ts',
    'lib/config/credentialPresets.ts',
  ],
  barcode: ['lib/config/barcodeSEOPages.ts', 'lib/config/barcode.ts'],
  payment: ['lib/config/paymentSEOPages.ts'],
  color: ['lib/config/colorRoutes.ts', 'lib/color-studio'],
  image: ['lib/config/imageRoutes.ts'],
  qr: ['lib/config/qrRoutes.ts', 'lib/qr'],
  crypto: ['lib/config/cryptoSEOPages.ts', 'lib/config/cryptoRoutes.ts'],
  media: ['lib/config/mediaSEOPages.ts', 'lib/config/mediaRoutes.ts'],
  standalone: ['lib/config/staticRoutes.ts'],
  'phone-country': [
    'lib/countryRegistry.ts',
    'lib/generatePhoneMetadata.ts',
    'app/[locale]/phone-generator',
    'components/MainContent.tsx',
  ],
};

/**
 * Content group → the dictionary sections its pages render, beyond the shared
 * ones. Anything not listed anywhere here counts as shared.
 */
const SECTIONS = {
  home: ['platformHome', 'products'],
  about: ['about'],
  'product-landing': ['productLanding', 'products'],
  'generator-tool': [
    'generator',
    'mainContent',
    'phoneList',
    'infoCard',
    'home',
    'addressGenerator',
    'emailGenerator',
    'usernameGenerator',
    'companyGenerator',
    'phoneGenerator',
  ],
  'studio-tool': ['imageStudio'],
  credential: ['credential', 'credentialLanding'],
  barcode: ['barcodeLanding'],
  payment: [],
  color: [],
  image: ['imageStudio'],
  qr: [],
  crypto: [],
  media: [],
  standalone: [],
  'phone-country': ['countries', 'countryAdjectives', 'phoneGenerator', 'generator', 'home'],
};

const git = (args) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' });

/** Newest commit date touching any of `paths`, or null when git knows none. */
function lastCommit(paths) {
  const tracked = paths.filter((p) => {
    try {
      execFileSync('git', ['ls-files', '--error-unmatch', '--', p], { cwd: ROOT, stdio: 'ignore' });
      return true;
    } catch {
      return false;
    }
  });
  if (tracked.length === 0) return null;
  return git(['log', '-1', '--format=%cI', '--', ...tracked]).trim() || null;
}

/**
 * For one dictionary: section name → date of the newest commit that changed
 * that section's contents. Walks the file's history newest-first and stops
 * recording a section once it has been seen to change.
 */
function sectionDates(file) {
  const commits = git(['log', '--format=%H%x09%cI', '--', file])
    .trim()
    .split('\n')
    .filter(Boolean)
    .map((line) => line.split('\t'));

  const contentAt = (sha) => {
    try {
      return JSON.parse(git(['show', `${sha}:${file}`]));
    } catch {
      return {};
    }
  };

  const dates = new Map();

  /* Walk newest-first, comparing each commit with the one before it: a section
     that differs across the pair last changed at the newer of the two. */
  for (let i = 0; i < commits.length - 1; i++) {
    const [sha, date] = commits[i];
    const after = contentAt(sha);
    const before = contentAt(commits[i + 1][0]);

    for (const section of new Set([...Object.keys(after), ...Object.keys(before)])) {
      if (dates.has(section)) continue;
      if (JSON.stringify(after[section]) !== JSON.stringify(before[section])) {
        dates.set(section, date);
      }
    }
  }

  /* Whatever never changed was introduced by the oldest commit. */
  const oldest = commits.at(-1);
  if (oldest) {
    for (const section of Object.keys(contentAt(oldest[0]))) {
      if (!dates.has(section)) dates.set(section, oldest[1]);
    }
  }

  return dates;
}

function build() {
  const missing = [];

  const groupDate = {};
  for (const [name, paths] of Object.entries(GROUPS)) {
    const date = lastCommit(paths);
    if (date) groupDate[name] = date;
    else missing.push(`group:${name}`);
  }

  const claimed = new Set(Object.values(SECTIONS).flat());
  const dates = {};

  for (const locale of LOCALES) {
    const file = `lib/i18n/${locale}.json`;
    let perSection;
    try {
      perSection = sectionDates(file);
    } catch {
      missing.push(`i18n:${locale}`);
      perSection = new Map();
    }

    const shared = [...perSection]
      .filter(([section]) => !claimed.has(section))
      .map(([, date]) => date)
      .sort()
      .at(-1);

    for (const group of Object.keys(GROUPS)) {
      const own = (SECTIONS[group] ?? [])
        .map((section) => perSection.get(section))
        .filter(Boolean)
        .sort()
        .at(-1);

      const newest = [groupDate[group], shared, own].filter(Boolean).sort().at(-1);
      if (newest) dates[`${group}|${locale}`] = newest;
    }
  }

  const unmapped = [...new Set(Object.keys(SECTIONS).flatMap((g) => SECTIONS[g]))].filter(
    (s) => !claimed.has(s),
  );
  return { data: { dates }, missing, unmapped };
}

const { data, missing } = build();
const serialized = JSON.stringify(data, null, 2) + '\n';

if (process.argv.includes('--check')) {
  let current;
  try {
    current = readFileSync(OUT, 'utf8');
  } catch {
    console.error('✗ lib/config/lastmod.generated.json is missing.\n  Run: npm run seo:lastmod');
    process.exit(1);
  }

  if (current !== serialized) {
    const old = JSON.parse(current).dates ?? {};
    console.error('✗ sitemap lastmod dates no longer match git history.\n');
    for (const [k, v] of Object.entries(data.dates)) {
      if (old[k] !== v) console.error(`    ${k.padEnd(24)} ${old[k] ?? '(absent)'} → ${v}`);
    }
    for (const k of Object.keys(old)) {
      if (!(k in data.dates)) console.error(`    ${k.padEnd(24)} ${old[k]} → (absent)`);
    }
    console.error('\n  Run: npm run seo:lastmod');
    process.exit(1);
  }

  const distinct = new Set(Object.values(data.dates)).size;
  console.log(
    `✓ sitemap lastmod matches git — ${Object.keys(data.dates).length} group×locale pairs, ${distinct} distinct dates`,
  );
  if (missing.length) console.log(`  (no history for: ${missing.join(', ')})`);
  process.exit(0);
}

writeFileSync(OUT, serialized);
const distinct = [...new Set(Object.values(data.dates))].sort();
console.log(
  `✓ wrote lib/config/lastmod.generated.json — ${Object.keys(data.dates).length} pairs, ${distinct.length} distinct dates`,
);
for (const d of distinct) {
  const n = Object.values(data.dates).filter((x) => x === d).length;
  console.log(`    ${d}  ×${n}`);
}
if (missing.length) console.log(`  (no history for: ${missing.join(', ')})`);
