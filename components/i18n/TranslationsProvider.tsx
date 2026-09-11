'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { Dictionary } from '@/lib/i18n/dictionary';
import type { SupportedLanguage } from '@/lib/i18n/locales';

export interface TranslationsValue {
  locale: SupportedLanguage;
  dictionary: Dictionary;
}

/**
 * Carries the active locale and its dictionary down from the locale layout.
 *
 * ── Why this exists ─────────────────────────────────────────────────────────
 *
 * `useTranslations` used to read the language from a zustand store that was
 * filled, after hydration, from localStorage → cookie → navigator.language.
 * The `[locale]` segment of the URL was never consulted. Two things followed:
 *
 *   · Every locale served identical English HTML. The server has no
 *     localStorage and no Accept-Language, so it rendered the store's default,
 *     and the non-English dictionaries were loaded with a dynamic `import()`
 *     that resolves after the render is already sent. Google crawled /ru, /de
 *     and /fr and found English under an hreflang saying otherwise.
 *
 *   · After hydration the page switched to the *visitor's* language regardless
 *     of the URL, so /en showed Russian to a Russian browser.
 *
 * The URL is the source of truth now. The layout picks the dictionary on the
 * server, React serialises that one language into the payload, and the same
 * text renders on both sides — which also means there is no lazy loading left
 * to do: changing language is a navigation, and a navigation brings its own
 * dictionary.
 */
const TranslationsContext = createContext<TranslationsValue | null>(null);

export function TranslationsProvider({
  locale,
  dictionary,
  children,
}: TranslationsValue & { children: ReactNode }) {
  return (
    <TranslationsContext.Provider value={{ locale, dictionary }}>
      {children}
    </TranslationsContext.Provider>
  );
}

/** Null outside the locale tree — `useTranslations` handles that case. */
export function useTranslationsContext(): TranslationsValue | null {
  return useContext(TranslationsContext);
}
