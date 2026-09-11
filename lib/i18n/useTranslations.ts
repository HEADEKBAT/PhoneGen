'use client';

import { useTranslationsContext } from '@/components/i18n/TranslationsProvider';
import { DEFAULT_LANGUAGE } from './locales';
import en from './en.json';

/**
 * Translations for the current page, in the language its URL says.
 *
 * ── What this used to be ────────────────────────────────────────────────────
 *
 * A zustand store held the language, filled after hydration from localStorage,
 * then a cookie, then `navigator.language`; the five non-English dictionaries
 * arrived through a dynamic `import()`. The `[locale]` segment never entered
 * into it. So the server — which has no localStorage and cannot await an
 * import mid-render — emitted English for all six locales, and the browser
 * then swapped in whatever language the *visitor* preferred, so /en could
 * show Russian.
 *
 * Now the locale layout resolves the dictionary on the server from the URL and
 * passes it down. English stays statically imported as the per-key fallback:
 * a key missing from a translation renders the English string rather than the
 * key itself, which is what a half-translated page should do.
 *
 * There is no loading state left. A language change is a navigation, and the
 * new page arrives with its own dictionary.
 */

function getValue(obj: Record<string, unknown> | undefined, path: string): string | undefined {
  if (!obj) return undefined;
  let current: unknown = obj;
  for (const key of path.split('.')) {
    if (current == null || typeof current !== 'object') return undefined;
    current = (current as Record<string, unknown>)[key];
    if (current === undefined) return undefined;
  }
  return typeof current === 'string' ? current : undefined;
}

export function useTranslations() {
  const context = useTranslationsContext();

  /* Outside the locale tree there is no provider. English is the honest
     answer there — those routes have no locale to speak of. */
  const dictionary = context?.dictionary ?? en;
  const locale = context?.locale ?? DEFAULT_LANGUAGE;

  const t = (key: string, params?: Record<string, string | number>): string => {
    const text = getValue(dictionary, key) ?? getValue(en, key) ?? key;

    if (params) {
      return Object.entries(params).reduce(
        (acc, [name, value]) => acc.replace(`{${name}}`, String(value)),
        text,
      );
    }
    return text;
  };

  return { t, language: locale };
}
