#!/usr/bin/env node
/**
 * Keeps page titles inside what a search result actually shows.
 *
 * Google renders roughly 600 pixels of title — about 60 characters — and
 * rewrites or truncates the rest. The registries had drifted well past that:
 * 166 of 431 titles were over the limit once ` | GenCore` was appended, the
 * worst at 115 characters, so the half that distinguished one page from
 * another was the half being cut.
 *
 * The limit counts the brand, because the locale layout's `title.template`
 * appends it to every page. The home page appends it itself — a template only
 * applies to child segments, and the home page shares a segment with the
 * layout — so the total is the same either way.
 *
 * ── Only an upper bound ─────────────────────────────────────────────────────
 *
 * A lower bound would be useful too (a two-word title carries no query), but
 * it cannot be enforced from here: `title:` in these files is sometimes a
 * page's <title> and sometimes a card label — "Retail", "QA Engineers",
 * "Developers" are audience chips in barcode.ts, and products.ts `title` is
 * the product's NAME, which pages extend rather than use verbatim. A regex
 * cannot tell those apart, and a check that cries wolf gets switched off.
 * Too long is unambiguous; too short is not.
 */

import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

/* Titles live in three places, and every one of them had drifted past the
   limit: the registries under lib/config, one manifest per interactive tool
   under tools/, and a `TITLES` map inside the page file for each product
   landing. Checking only the first found 166 of 285. */
const SOURCES = [join(ROOT, 'lib', 'config'), join(ROOT, 'tools'), join(ROOT, 'app')];

function walk(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx')) out.push(full);
  }
  return out;
}

const BRAND_SUFFIX = ' | GenCore';
const MAX = 60;

/** Titles allowed past the limit, each with the reason. */
const ALLOWED = new Map([
  // ['some exact title', 'why it has to be this long'],
]);

const problems = [];
let checked = 0;

for (const file of SOURCES.flatMap((dir) => walk(dir))) {
  const src = readFileSync(file, 'utf8');
  const where = file.slice(ROOT.length + 1).split('\\').join('/');

  /* Two shapes:
       • `title: '…'` — a registry or manifest field. `(?<![A-Za-z])` so this
         matches `title:` but not `heroTitle:` or `defaultTitle:`, which are
         headings and fallbacks rather than <title>.
       • the entries of a `const TITLES: Record<string, string>` map, keyed by
         locale, in a product landing page. */
  const titlesMap = src.match(/const TITLES: Record<string, string> = \{([\s\S]*?)\n\};/);
  const candidates = [
    ...[...src.matchAll(/(?<![A-Za-z])title:\s*'((?:[^'\\]|\\.)*)'/g)].map((m) => m[1]),
    ...(titlesMap
      /* The locale key is quoted in some of these files and bare in others. */
      ? [...titlesMap[1].matchAll(/\n  '?[a-z]{2}'?: '((?:[^'\\]|\\.)*)'/g)].map((m) => m[1])
      : []),
  ];

  for (const raw of candidates) {
    const text = raw.replace(/\\'/g, "'").replace(/\\\\/g, '\\');
    checked++;

    if (ALLOWED.has(text)) continue;

    const full = text.length + BRAND_SUFFIX.length;
    if (full > MAX) problems.push(`${where}: ${full} chars — "${text}"`);
  }
}

if (problems.length) {
  console.error(`✗ ${problems.length} of ${checked} title(s) longer than ${MAX} characters:\n`);
  for (const p of problems) console.error(`    ${p}`);
  console.error(
    '\n  Lead with the words someone would search; the studio name and the ' +
      'longer explanation belong in the h1 and the description.',
  );
  process.exit(1);
}

console.log(`✓ ${checked} registry titles fit a search result (≤ ${MAX} chars with the brand)`);
