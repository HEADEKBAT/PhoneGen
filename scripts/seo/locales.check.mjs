#!/usr/bin/env node
/**
 * Checks the raw HTML every locale actually serves.
 *
 * For most of this project's life the site rendered English for all six
 * locales: translations were loaded on the client, after hydration, so the
 * document a crawler reads was English whatever the URL said. That class of
 * bug is invisible in the browser — you see the translated page a moment
 * later — and invisible to `tsc`, `eslint` and the i18n key check, which only
 * prove the strings exist. The only way to catch it is to read the HTML.
 *
 * Per URL it asserts:
 *   • the response is 200 (no redirect, no 404);
 *   • <html lang> matches the locale in the path;
 *   • the canonical points at this URL, not another locale's;
 *   • there are alternates for all six locales plus x-default;
 *   • <title> and <h1> are present.
 *
 * Across locales it asserts the page is actually translated: a route whose
 * title is byte-identical in every locale is serving one language to all six.
 * Routes that are legitimately identical everywhere (a proper noun on its own)
 * belong in IDENTICAL_OK below, with a reason.
 *
 * Needs a running server:
 *   npm run dev            # in one terminal
 *   npm run check:locales  # in another
 *
 * Override the target with BASE_URL=https://www.gencore.space.
 */

import { readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const BASE = process.env.BASE_URL ?? 'http://localhost:3000';
const LOCALES = ['en', 'fr', 'es', 'pt', 'de', 'ru'];

/** Route shapes, without the locale prefix. One representative per family. */
const ROUTES = [
  '',
  '/about',
  '/phone-generator',
  '/phone-generator/US',
  '/barcode-generator',
  '/barcode-generator/ean13-generator',
  '/credential-generator',
  '/credential-generator/password-generator',
  '/color-generator',
  '/color-generator/tool',
  '/image-studio/tool',
  '/qr-generator/tool',
  '/payment-studio/credit-card-generator',
  '/crypto-wallet-playground/tool',
  '/media-studio/tool',
  '/bitcoin-address-generator',
  '/video-converter',
  '/linear-gradient-generator',
  '/uuid-generator',
];

/**
 * Routes known to serve one language to all six, with the reason.
 *
 * These are a content debt, not a bug in the rendering: the Crypto Wallet and
 * Media Studio SEO pages were written in English only, so their registries
 * hold a single string per page instead of six. Listing them keeps the check
 * green on what is already known while still failing on anything new — and the
 * check fails if a listed route *has* been translated, so the list can only
 * shrink.
 */
const UNTRANSLATED = new Map([
  ['/bitcoin-address-generator', 'lib/config/cryptoSEOPages.ts holds English copy only'],
  ['/video-converter', 'lib/config/mediaSEOPages.ts holds English copy only'],
]);

const grab = (html, re) => {
  const m = html.match(re);
  return m ? m[1].trim() : null;
};

async function inspect(url) {
  const res = await fetch(url, { redirect: 'manual' });
  const html = res.status === 200 ? await res.text() : '';
  return {
    status: res.status,
    lang: grab(html, /<html[^>]*\slang="([^"]*)"/),
    title: grab(html, /<title[^>]*>([\s\S]*?)<\/title>/),
    h1: grab(html, /<h1[^>]*>([\s\S]*?)<\/h1>/)?.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '),
    canonical: grab(html, /<link[^>]+rel="canonical"[^>]+href="([^"]+)"/),
    /* React serialises the JSX prop as `hrefLang`, so this has to be
       case-insensitive — matching only the lowercase HTML spelling reports
       every page as missing all seven alternates. */
    alternates: [...html.matchAll(/hreflang="([^"]+)"/gi)].map((m) => m[1]),
  };
}

const problems = [];
const knownGaps = [];
const note = (route, message) => problems.push(`${route}: ${message}`);

for (const route of ROUTES) {
  const seen = new Map();

  for (const locale of LOCALES) {
    const path = `/${locale}${route}`;
    const page = await inspect(`${BASE}${path}`);

    if (page.status !== 200) {
      note(path, `HTTP ${page.status}`);
      continue;
    }
    if (page.lang !== locale) note(path, `<html lang> is "${page.lang}", expected "${locale}"`);
    if (!page.title) note(path, 'no <title>');
    if (!page.h1) note(path, 'no <h1>');

    if (page.canonical && !page.canonical.endsWith(path)) {
      note(path, `canonical points elsewhere: ${page.canonical}`);
    } else if (!page.canonical) {
      note(path, 'no canonical');
    }

    for (const expected of [...LOCALES, 'x-default']) {
      if (!page.alternates.includes(expected)) note(path, `no hreflang="${expected}"`);
    }

    seen.set(locale, page.title ?? '');
  }

  const titles = new Set(seen.values());
  const identical = seen.size === LOCALES.length && titles.size === 1;
  const known = UNTRANSLATED.get(route);

  if (identical && !known) {
    note(route || '/', `same <title> in all six locales — "${[...titles][0]}"`);
  } else if (!identical && known) {
    note(route || '/', `now translated — drop it from UNTRANSLATED (was: ${known})`);
  } else if (identical && known) {
    knownGaps.push(`${route} — ${known}`);
  }
}

/* A locale added to lib/i18n but not listed here would go unchecked. */
const shipped = readdirSync(join(ROOT, 'lib', 'i18n'))
  .filter((f) => f.endsWith('.json'))
  .map((f) => f.replace('.json', ''))
  .sort();
const unchecked = shipped.filter((l) => !LOCALES.includes(l));
if (unchecked.length) {
  problems.push(`lib/i18n ships ${unchecked.join(', ')}, which this script does not check`);
}

if (problems.length) {
  console.error(`✗ ${problems.length} problem(s) in the HTML the locales serve:\n`);
  for (const p of problems) console.error(`    ${p}`);
  process.exit(1);
}

console.log(
  `✓ ${ROUTES.length} route(s) × ${LOCALES.length} locales — lang, canonical, hreflang and translation all sound`,
);
for (const gap of knownGaps) console.log(`  · known translation gap: ${gap}`);
