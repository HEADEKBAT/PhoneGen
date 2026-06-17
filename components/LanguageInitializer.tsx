'use client';

import { useEffect } from 'react';
import { useLanguageStore } from '@/lib/store';

/**
 * Syncs the persisted language to <html lang="..."> on every change.
 * Must be rendered inside <body> — ideally early in the tree.
 */
export default function LanguageInitializer() {
  const language = useLanguageStore((state) => state.language);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return null;
}
