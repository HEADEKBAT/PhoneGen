'use client';

import { useReducer, useEffect } from 'react';
import { useLanguageStore } from '@/lib/stores/language';

/**
 * English is statically imported — it's the universal fallback and
 * always needed for SSR hydration.
 */
import en from './en.json';

/**
 * Non-English locales are loaded on demand via dynamic import().
 * The bundler creates a separate chunk per locale, keeping the
 * initial client bundle lean (~40KB vs ~250KB).
 */
const LOADERS: Record<string, () => Promise<{ default: Record<string, unknown> }>> = {
  ru: () => import('./ru.json'),
  de: () => import('./de.json'),
  es: () => import('./es.json'),
  fr: () => import('./fr.json'),
  pt: () => import('./pt.json'),
};

/* ── Module-level cache ─────────────────────────────────────────────────── */

const cache: Record<string, Record<string, unknown> | undefined> = { en };
const pending = new Map<string, Promise<void>>();

function ensureLoaded(locale: string): Promise<void> | undefined {
  if (cache[locale]) return undefined;
  if (pending.has(locale)) return pending.get(locale);

  const loader = LOADERS[locale];
  if (!loader) return undefined;

  const promise = loader()
    .then((mod) => {
      cache[locale] = mod.default;
      pending.delete(locale);
    })
    .catch(() => {
      /* On load error, mark as unavailable so we don't retry */
      pending.delete(locale);
      cache[locale] = undefined;
    });

  pending.set(locale, promise);
  return promise;
}

/* ── Translation value resolver (same logic as before) ──────────────────── */

function getValue(
  obj: Record<string, unknown> | undefined,
  path: string,
): string | undefined {
  if (!obj) return undefined;
  const keys = path.split('.');
  let current: unknown = obj;
  for (const key of keys) {
    if (current == null || typeof current !== 'object') return undefined;
    current = (current as Record<string, unknown>)[key];
    if (current === undefined) return undefined;
  }
  return typeof current === 'string' ? current : undefined;
}

/* ── Hook ───────────────────────────────────────────────────────────────── */

export function useTranslations() {
  const language = useLanguageStore((state) => state.language);

  // Force re-render when a lazy locale finishes loading
  const [, forceUpdate] = useReducer((x: number) => x + 1, 0);

  useEffect(() => {
    const promise = ensureLoaded(language);
    if (promise) {
      promise.then(() => forceUpdate());
    }
  }, [language]);

  const t = (
    key: string,
    params?: Record<string, string | number>,
  ): string => {
    const data = cache[language] ?? cache.en;
    const text =
      getValue(data, key) ?? getValue(cache.en, key) ?? key;

    if (params) {
      return Object.entries(params).reduce(
        (acc, [k, v]) => acc.replace(`{${k}}`, String(v)),
        text,
      );
    }

    return text;
  };

  return { t, language };
}
