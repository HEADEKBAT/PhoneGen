'use client';

import { useEffect } from 'react';
import type { SupportedLanguage } from '@/lib/i18n';

/**
 * Records the language of the page being viewed, for the next visit to `/`.
 *
 * This replaces LanguageInitializer, which did the opposite: after hydration
 * it read localStorage, then a cookie, then `navigator.language`, pushed the
 * result into a store that drove every translation, and finally overwrote
 * `document.documentElement.lang`. The URL's own locale was never consulted,
 * so /en rendered Russian for a Russian browser and the server's `lang`
 * attribute was undone a moment after it arrived.
 *
 * The URL decides the language now. All that is left worth keeping is the
 * breadcrumb for a bare-domain visit — a cookie saying which language this
 * visitor was last reading, for whatever redirects `/` to a locale.
 */
export default function LanguageCookie({ locale }: { locale: SupportedLanguage }) {
  useEffect(() => {
    try {
      document.cookie = `language=${locale};path=/;max-age=${365 * 24 * 60 * 60}`;
      localStorage.setItem('language', locale);
    } catch {
      /* Private mode, or storage disabled. Nothing here is load-bearing. */
    }
  }, [locale]);

  return null;
}
