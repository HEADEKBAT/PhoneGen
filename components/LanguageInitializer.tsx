'use client';

import { useEffect } from 'react';
import { useLanguageStore } from '@/lib/store';
import { type SupportedLanguage, detectBrowserLanguage } from '@/lib/i18n/locales';

const SUPPORTED = new Set(['en', 'ru', 'de', 'es', 'fr', 'pt']);

/**
 * Restores the previously saved language after hydration.
 *
 * Priority:
 *   1. localStorage (manual user selection)
 *   2. Cookie (set by LanguageSwitcher)
 *   3. Browser language (navigator.language / Accept-Language)
 *   4. Default (English)
 *
 * Once a manual selection is saved, browser detection stops applying
 * (the cookie persists the user's choice).
 */
export default function LanguageInitializer() {
  const language = useLanguageStore((state) => state.language);
  const setLanguage = useLanguageStore((state) => state.setLanguage);

  useEffect(() => {
    let saved: SupportedLanguage | null = null;

    // 1. Check localStorage (user's manual selection)
    try {
      const raw = localStorage.getItem('language');
      if (raw && SUPPORTED.has(raw)) {
        saved = raw as SupportedLanguage;
      }
    } catch {
      // localStorage unavailable
    }

    // 2. Check cookie (set by LanguageSwitcher)
    if (!saved) {
      try {
        const match = document.cookie.match(/language=([^;]+)/);
        if (match && SUPPORTED.has(match[1])) {
          saved = match[1] as SupportedLanguage;
        }
      } catch {
        // cookie unavailable
      }
    }

    // 3. Fall back to browser detection
    if (!saved) {
      saved = detectBrowserLanguage();
    }

    if (saved && saved !== language) {
      setLanguage(saved);
    }

    // Sync cookie
    if (saved) {
      try {
        document.cookie = `language=${saved};path=/;max-age=${365 * 24 * 60 * 60}`;
      } catch {
        /* noop */
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* Sync <html lang> to current language */
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return null;
}
