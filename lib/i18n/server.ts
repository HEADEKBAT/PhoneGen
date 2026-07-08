/**
 * Server-safe translation helper.
 *
 * Unlike `useTranslations()` (which is `'use client'` and reads from zustand),
 * this module can be imported in Server Components to resolve translation keys
 * without any client-side state.
 *
 * Usage:
 *   const t = getT(locale);
 *   t('productLanding.credential.heroTitle')
 */

import ru from './ru.json';
import en from './en.json';
import de from './de.json';
import es from './es.json';
import fr from './fr.json';
import pt from './pt.json';

const translations: Record<string, Record<string, unknown>> = { ru, en, de, es, fr, pt };

function getValue(obj: Record<string, unknown>, path: string): string | undefined {
  const keys = path.split('.');
  let current: unknown = obj;
  for (const key of keys) {
    if (current == null || typeof current !== 'object') return undefined;
    current = (current as Record<string, unknown>)[key];
    if (current === undefined) return undefined;
  }
  return typeof current === 'string' ? current : undefined;
}

/**
 * Returns a `t(key)` function bound to the given locale.
 * Falls back to English, then to the raw key.
 */
export function getT(locale: string): (key: string, params?: Record<string, string | number>) => string {
  return (key: string, params?: Record<string, string | number>): string => {
    let text =
      getValue(translations[locale], key) ??
      getValue(translations.en, key) ??
      key;

    if (params) {
      return Object.entries(params).reduce(
        (acc, [k, v]) => acc.replace(`{${k}}`, String(v)),
        text,
      );
    }
    return text;
  };
}
