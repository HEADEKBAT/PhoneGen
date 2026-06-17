import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import {
  type SupportedLanguage,
  DEFAULT_LANGUAGE,
  detectBrowserLanguage,
} from './i18n/locales';

interface CountryStore {
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
}

interface LanguageStore {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
}

/**
 * On first visit (no saved language in localStorage), detect from browser.
 * On subsequent visits, use the saved language.
 */
function getInitialLanguage(): SupportedLanguage {
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem('language-store');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.state?.language) return parsed.state.language;
      }
    } catch {
      // ignore
    }
    return detectBrowserLanguage();
  }
  return DEFAULT_LANGUAGE;
}

export const useCountryStore = create<CountryStore>()(
  persist(
    (set) => ({
      selectedCountry: 'NG',
      setSelectedCountry: (country: string) => set({ selectedCountry: country }),
    }),
    {
      name: 'country-store',
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') {
          return localStorage;
        }
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
    }
  )
);

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set) => ({
      language: getInitialLanguage(),
      setLanguage: (lang: SupportedLanguage) => set({ language: lang }),
    }),
    {
      name: 'language-store',
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') {
          return localStorage;
        }
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
    }
  )
);
