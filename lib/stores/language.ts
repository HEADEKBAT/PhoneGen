import { create } from 'zustand';
import { DEFAULT_LANGUAGE } from '@/lib/i18n/locales';
import type { SupportedLanguage } from '@/lib/i18n/locales';

interface LanguageStore {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
}

export const useLanguageStore = create<LanguageStore>()((set) => ({
  language: DEFAULT_LANGUAGE,
  setLanguage: (lang: SupportedLanguage) => set({ language: lang }),
}));
