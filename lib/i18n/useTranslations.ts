'use client';

import { useLanguageStore } from '@/lib/store';
import ru from './ru.json';
import en from './en.json';
import de from './de.json';
import es from './es.json';
import fr from './fr.json';

const translations: Record<string, Record<string, unknown>> = { ru, en, de, es, fr };

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

export function useTranslations() {
  const language = useLanguageStore((state) => state.language);

  const t = (key: string, params?: Record<string, string | number>): string => {
    const text =
      getValue(translations[language], key) ??
      getValue(translations.ru, key) ??
      key;

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
