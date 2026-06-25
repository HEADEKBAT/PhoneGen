export const LANGUAGES = {
  en: { name: 'English', nativeName: 'English', flag: '🇬🇧' },
  ru: { name: 'Русский', nativeName: 'Русский', flag: '🇷🇺' },
  de: { name: 'Deutsch', nativeName: 'Deutsch', flag: '🇩🇪' },
  es: { name: 'Español', nativeName: 'Español', flag: '🇪🇸' },
  fr: { name: 'Français', nativeName: 'Français', flag: '🇫🇷' },
  pt: { name: 'Português', nativeName: 'Português', flag: '🇧🇷' },
} as const;

export type SupportedLanguage = keyof typeof LANGUAGES;
export const SUPPORTED_LANGUAGES = Object.keys(LANGUAGES) as SupportedLanguage[];

export const DEFAULT_LANGUAGE: SupportedLanguage = 'en';

export function detectBrowserLanguage(): SupportedLanguage {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;

  try {
    const lang = navigator.language?.split('-')[0]?.toLowerCase();
    if (SUPPORTED_LANGUAGES.includes(lang as SupportedLanguage)) {
      return lang as SupportedLanguage;
    }
  } catch {
    // ignore
  }
  return DEFAULT_LANGUAGE;
}
