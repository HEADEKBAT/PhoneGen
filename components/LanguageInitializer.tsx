'use client';

import { useEffect } from 'react';
import { useLanguageStore } from '@/lib/store';
import { type SupportedLanguage, detectBrowserLanguage } from '@/lib/i18n/locales';

/**
 * Restores the previously saved language from localStorage after hydration,
 * and syncs the current language to <html lang="..."> on every change.
 *
 * Must be rendered inside <body> — ideally early in the tree.
 *
 * Why this runs in an effect instead of zustand persist:
 * Persist reads localStorage synchronously during module init, which causes
 * a hydration mismatch (SSR returns DEFAULT_LANGUAGE, client gets saved locale).
 * By deferring the restore to useEffect, SSR and first client render always
 * agree, and the saved language takes effect immediately after hydration
 * with no visible flash (single re-render).
 */
export default function LanguageInitializer() {
  const language = useLanguageStore((state) => state.language);
  const setLanguage = useLanguageStore((state) => state.setLanguage);

  /* Restore saved language after hydration */
  useEffect(() => {
    let saved: SupportedLanguage | null = null;

    try {
      const raw = localStorage.getItem('language');
      if (raw && (raw === 'en' || raw === 'ru' || raw === 'de' || raw === 'es' || raw === 'fr' || raw === 'pt')) {
        saved = raw as SupportedLanguage;
      }
    } catch {
      // localStorage unavailable
    }

    if (!saved) {
      saved = detectBrowserLanguage();
    }

    if (saved !== language) {
      setLanguage(saved);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* Sync <html lang> to current language */
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return null;
}
