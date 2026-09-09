/**
 * i18n audit — `node scripts/i18n/check.mjs [--json] [--fix-report]`
 *
 * Cross-checks every translation key the code actually asks for against what
 * each locale file provides, and reports the reverse too (keys nobody reads).
 *
 * Why this exists: `useTranslations` falls back to English and then to the raw
 * key string, so a key missing from en.json renders as `productLanding.image.heroTitle`
 * on the page — visible to users, invisible to the type checker, and silent in
 * the build. Nothing else in the project catches that.
 *
 * Key sources it understands:
 *   t('a.b')                      — the runtime hook and the server getT()
 *   titleKey: 'a.b'  (and *Key:)  — config-driven landing pages
 *   qKey / aKey / descKey / …     — the same pattern, any identifier ending in "Key"
 *
 * Exit code is 1 when the reference locale is missing a used key, or when a
 * non-reference locale is missing one.
 *
 * The "never read" list is INFORMATIONAL and never fails the run. Do not treat
 * it as a delete list: keys composed at runtime are invisible to a static scan.
 * `t('countries.' + country.code)` and `t('countryAdjectives.' + code)` alone
 * account for over 200 entries that are very much in use. Confirm a key is
 * really dead — grep for its parent section as a string fragment — before
 * removing anything it names.
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../..', import.meta.url));
const LOCALES_DIR = join(ROOT, 'lib/i18n');
const REFERENCE = 'en';
const SCAN_DIRS = ['app', 'components', 'lib', 'core', 'tools'];
const SCAN_EXTENSIONS = new Set(['.ts', '.tsx']);
const SKIP_DIRS = new Set(['node_modules', '.next', '.git', 'i18n']);

const args = new Set(process.argv.slice(2));
const asJson = args.has('--json');

/* ── Collect source files ─────────────────────────────────────────────────── */

function walk(dir, out = []) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const entry of entries) {
    if (SKIP_DIRS.has(entry)) continue;
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) walk(full, out);
    else if (SCAN_EXTENSIONS.has(extname(entry))) out.push(full);
  }
  return out;
}

/* ── Extract keys ─────────────────────────────────────────────────────────── */

// t('a.b') / t("a.b") / t(`a.b`) — the backtick form only without interpolation.
const T_CALL = /\bt\(\s*(['"`])([A-Za-z0-9_$]+(?:\.[A-Za-z0-9_$]+)+)\1/g;
// heroTitleKey: 'a.b', qKey: "a.b", labelKey: `a.b`
const KEY_PROP = /\b[A-Za-z0-9_$]*Key\s*:\s*(['"`])([A-Za-z0-9_$]+(?:\.[A-Za-z0-9_$]+)+)\1/g;

function extractKeys(files) {
  /** key → Set of "path:line" */
  const usage = new Map();

  for (const file of files) {
    const text = readFileSync(file, 'utf8');
    const lineStarts = [0];
    for (let i = 0; i < text.length; i++) if (text[i] === '\n') lineStarts.push(i + 1);
    const lineOf = (index) => {
      let lo = 0, hi = lineStarts.length - 1;
      while (lo < hi) {
        const mid = (lo + hi + 1) >> 1;
        if (lineStarts[mid] <= index) lo = mid;
        else hi = mid - 1;
      }
      return lo + 1;
    };

    for (const pattern of [T_CALL, KEY_PROP]) {
      pattern.lastIndex = 0;
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const key = match[2];
        if (!usage.has(key)) usage.set(key, new Set());
        usage.get(key).add(`${relative(ROOT, file)}:${lineOf(match.index)}`);
      }
    }
  }

  return usage;
}

/* ── Flatten a locale file to dotted keys ─────────────────────────────────── */

function flatten(value, prefix = '', out = new Map()) {
  for (const [key, child] of Object.entries(value)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (child && typeof child === 'object' && !Array.isArray(child)) flatten(child, path, out);
    else out.set(path, child);
  }
  return out;
}

/* ── Run ──────────────────────────────────────────────────────────────────── */

const localeFiles = readdirSync(LOCALES_DIR)
  .filter((f) => f.endsWith('.json'))
  .map((f) => f.replace(/\.json$/, ''))
  .sort((a, b) => (a === REFERENCE ? -1 : b === REFERENCE ? 1 : a.localeCompare(b)));

const locales = new Map(
  localeFiles.map((locale) => [
    locale,
    flatten(JSON.parse(readFileSync(join(LOCALES_DIR, `${locale}.json`), 'utf8'))),
  ]),
);

const files = SCAN_DIRS.flatMap((dir) => walk(join(ROOT, dir)));
const usage = extractKeys(files);
const usedKeys = [...usage.keys()].sort();

const reference = locales.get(REFERENCE);
if (!reference) {
  console.error(`Reference locale "${REFERENCE}" not found in ${LOCALES_DIR}`);
  process.exit(2);
}

/* Keys the code asks for that the reference locale cannot answer. */
const missingFromReference = usedKeys.filter((key) => !reference.has(key));

/* Per-locale gaps, measured against the reference locale's key set. */
const referenceKeys = [...reference.keys()].sort();
const gaps = new Map();
for (const [locale, table] of locales) {
  if (locale === REFERENCE) continue;
  gaps.set(locale, referenceKeys.filter((key) => !table.has(key)));
}

/* Keys present in the reference locale that no source file reads. */
const unused = referenceKeys.filter((key) => !usage.has(key));

/* Sections that exist in some locales but not in the reference — dead weight,
   and a sign that copy was written against a key path that later changed. */
const orphanSections = new Map();
for (const [locale, table] of locales) {
  if (locale === REFERENCE) continue;
  const extra = [...table.keys()].filter((key) => !reference.has(key));
  if (extra.length) orphanSections.set(locale, extra);
}

if (asJson) {
  console.log(
    JSON.stringify(
      {
        usedKeys: usedKeys.length,
        missingFromReference,
        gaps: Object.fromEntries(gaps),
        orphans: Object.fromEntries(orphanSections),
        unused,
      },
      null,
      2,
    ),
  );
} else {
  console.log(`Scanned ${files.length} files · ${usedKeys.length} distinct keys referenced`);
  console.log(`Locales: ${localeFiles.join(', ')} (reference: ${REFERENCE})\n`);

  if (missingFromReference.length) {
    console.log(`✗ MISSING FROM ${REFERENCE}.json — these render as the raw key string:`);
    for (const key of missingFromReference) {
      const where = [...usage.get(key)].slice(0, 2).join(', ');
      console.log(`    ${key}\n        used at ${where}`);
    }
    console.log('');
  } else {
    console.log(`✓ ${REFERENCE}.json covers every key the code uses\n`);
  }

  let anyGap = false;
  for (const [locale, missing] of gaps) {
    if (!missing.length) continue;
    anyGap = true;
    console.log(`✗ ${locale}.json is missing ${missing.length} key(s) present in ${REFERENCE}:`);
    const grouped = new Map();
    for (const key of missing) {
      const section = key.split('.')[0];
      grouped.set(section, (grouped.get(section) ?? 0) + 1);
    }
    for (const [section, count] of [...grouped].sort((a, b) => b[1] - a[1])) {
      console.log(`    ${section}  ×${count}`);
    }
    console.log('');
  }
  if (!anyGap) console.log(`✓ every locale matches ${REFERENCE}.json\n`);

  for (const [locale, extra] of orphanSections) {
    const sections = [...new Set(extra.map((k) => k.split('.')[0]))];
    console.log(`· ${locale}.json has ${extra.length} key(s) absent from ${REFERENCE}: ${sections.join(', ')}`);
  }
  if (orphanSections.size) console.log('');

  if (unused.length) {
    const sections = new Map();
    for (const key of unused) {
      const section = key.split('.')[0];
      sections.set(section, (sections.get(section) ?? 0) + 1);
    }
    console.log(`· ${unused.length} key(s) in ${REFERENCE}.json are never read (top sections):`);
    for (const [section, count] of [...sections].sort((a, b) => b[1] - a[1]).slice(0, 8)) {
      console.log(`    ${section}  ×${count}`);
    }
    console.log('');
  }
}

const failed = missingFromReference.length > 0 || [...gaps.values()].some((g) => g.length > 0);
process.exit(failed ? 1 : 0);
