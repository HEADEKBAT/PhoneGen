#!/usr/bin/env node
/**
 * Keeps server-only modules out of client bundles.
 *
 * `lib/i18n/server.ts` statically imports all six locale dictionaries — about
 * half a megabyte of JSON. It is meant for Server Components, where that is
 * free. Once, a single convenience import pulled it into `lib/config/seo.ts`,
 * which is re-exported by `lib/config/index.ts`, which client components
 * import: every page in the site then shipped all six dictionaries to the
 * browser. Nothing failed. `tsc` was happy, the pages rendered, and the only
 * symptom was the bundle.
 *
 * So this walks the import graph from every `'use client'` file and fails if
 * any of them can reach a module listed in SERVER_ONLY.
 *
 * Type-only imports are ignored — they disappear at compile time.
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve, relative } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

/** Modules that must never end up in a client bundle, and why. */
const SERVER_ONLY = new Map([
  ['lib/i18n/server.ts', 'statically imports all six locale dictionaries'],
]);

const SEARCH_DIRS = ['app', 'components', 'core', 'lib', 'hooks'];
const EXTENSIONS = ['.tsx', '.ts', '.jsx', '.js'];
const SKIP_DIRS = new Set(['node_modules', '.next', 'dist', 'build', '.git']);

function walk(dir, out = []) {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (EXTENSIONS.some((e) => entry.name.endsWith(e))) out.push(full);
  }
  return out;
}

const FILES = SEARCH_DIRS.flatMap((d) => walk(join(ROOT, d)));

/** Resolve an import specifier to a file on disk, or null for a package. */
function resolveImport(specifier, fromFile) {
  let base;
  if (specifier.startsWith('@/')) base = join(ROOT, specifier.slice(2));
  else if (specifier.startsWith('.')) base = resolve(dirname(fromFile), specifier);
  else return null;

  const candidates = [
    base,
    ...EXTENSIONS.map((e) => base + e),
    ...EXTENSIONS.map((e) => join(base, 'index' + e)),
    base + '.json',
  ];
  for (const candidate of candidates) {
    try {
      if (statSync(candidate).isFile()) return candidate;
    } catch {
      /* keep looking */
    }
  }
  return null;
}

const sourceCache = new Map();
const read = (file) => {
  if (!sourceCache.has(file)) sourceCache.set(file, readFileSync(file, 'utf8'));
  return sourceCache.get(file);
};

/** Value imports only — `import type` and `import { type X }` are erased. */
function importsOf(file) {
  if (file.endsWith('.json')) return [];
  const src = read(file);
  const specifiers = [];

  for (const m of src.matchAll(/import\s+([\s\S]*?)\s*from\s*['"]([^'"]+)['"]/g)) {
    if (/^type\s/.test(m[1].trim())) continue;
    specifiers.push(m[2]);
  }
  for (const m of src.matchAll(/import\s*['"]([^'"]+)['"]/g)) specifiers.push(m[1]);
  for (const m of src.matchAll(/export\s+[\s\S]*?from\s*['"]([^'"]+)['"]/g)) specifiers.push(m[1]);
  for (const m of src.matchAll(/\bimport\(\s*['"]([^'"]+)['"]\s*\)/g)) specifiers.push(m[1]);

  return specifiers.map((s) => resolveImport(s, file)).filter(Boolean);
}

const isClientEntry = (file) => /^\s*(['"])use client\1/.test(read(file));
const banned = new Map([...SERVER_ONLY].map(([p, why]) => [join(ROOT, p), why]));

const problems = [];

for (const entry of FILES) {
  if (entry.endsWith('.json') || !isClientEntry(entry)) continue;

  /* Breadth-first so the reported path is the shortest one. */
  const queue = [[entry]];
  const seen = new Set([entry]);

  while (queue.length) {
    const path = queue.shift();
    const file = path.at(-1);

    for (const next of importsOf(file)) {
      if (seen.has(next)) continue;
      seen.add(next);
      const chain = [...path, next];

      if (banned.has(next)) {
        problems.push({
          chain: chain.map((f) => relative(ROOT, f).replace(/\\/g, '/')),
          why: banned.get(next),
        });
        queue.length = 0;
        break;
      }
      queue.push(chain);
    }
  }
}

if (problems.length) {
  console.error(`✗ ${problems.length} client component(s) reach a server-only module:\n`);
  for (const { chain, why } of problems) {
    console.error(`    ${chain[0]}`);
    for (const step of chain.slice(1)) console.error(`      → ${step}`);
    console.error(`      (${why})\n`);
  }
  process.exit(1);
}

const clientEntries = FILES.filter((f) => !f.endsWith('.json') && isClientEntry(f)).length;
console.log(
  `✓ no client bundle reaches a server-only module — ${clientEntries} 'use client' entries, ${SERVER_ONLY.size} guarded module(s)`,
);
