import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { type SupportedLanguage, DEFAULT_LANGUAGE } from './i18n/locales';
import type { GeneratedUser } from './userGenerator/types';

interface CountryStore {
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
}

interface LanguageStore {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
}

interface FavoritesStore {
  favorites: string[];
  toggleFavorite: (code: string) => void;
  isFavorite: (code: string) => boolean;
}

interface RecentlyUsedStore {
  recentlyUsed: string[];
  addRecentlyUsed: (code: string) => void;
}

/* ── UserGenerator Store ──────────────────────────────────────────────── */

interface UserGeneratorStore {
  users: GeneratedUser[];
  selectedCountry: string;
  quantity: number;
  gender: 'male' | 'female' | 'any';
  ageMin: number;
  ageMax: number;
  filterQuery: string;
  setUsers: (users: GeneratedUser[]) => void;
  setSelectedCountry: (code: string) => void;
  setQuantity: (n: number) => void;
  setGender: (g: 'male' | 'female' | 'any') => void;
  setAgeRange: (min: number, max: number) => void;
  setFilterQuery: (q: string) => void;
  clearUsers: () => void;
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

export const useLanguageStore = create<LanguageStore>()((set) => ({
  language: DEFAULT_LANGUAGE,
  setLanguage: (lang: SupportedLanguage) => set({ language: lang }),
}));

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favorites: [],
      toggleFavorite: (code: string) => {
        const current = get().favorites;
        if (current.includes(code)) {
          set({ favorites: current.filter((c) => c !== code) });
        } else {
          set({ favorites: [...current, code] });
        }
      },
      isFavorite: (code: string) => get().favorites.includes(code),
    }),
    {
      name: 'favorites-store',
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

export const useRecentlyUsedStore = create<RecentlyUsedStore>()(
  persist(
    (set, get) => ({
      recentlyUsed: [],
      addRecentlyUsed: (code: string) => {
        const current = get().recentlyUsed.filter((c) => c !== code);
        const updated = [code, ...current].slice(0, 5);
        set({ recentlyUsed: updated });
      },
    }),
    {
      name: 'recently-used-store',
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

/* ── UserGenerator ──────────────────────────────────────────────────────── */

const UG_DEFAULTS = {
  selectedCountry: 'US',
  quantity: 5,
  gender: 'any' as const,
  ageMin: 18,
  ageMax: 65,
};

export const useUserGeneratorStore = create<UserGeneratorStore>()(
  persist(
    (set) => ({
      /* ── State ──────────────────────────────────────────────────── */
      users: [],
      selectedCountry: UG_DEFAULTS.selectedCountry,
      quantity: UG_DEFAULTS.quantity,
      gender: UG_DEFAULTS.gender,
      ageMin: UG_DEFAULTS.ageMin,
      ageMax: UG_DEFAULTS.ageMax,
      filterQuery: '',

      /* ── Actions ────────────────────────────────────────────────── */
      setUsers: (users) => set({ users, filterQuery: '' }),
      setSelectedCountry: (selectedCountry) => set({ selectedCountry }),
      setQuantity: (quantity) => set({ quantity }),
      setGender: (gender) => set({ gender }),
      setAgeRange: (ageMin, ageMax) => set({ ageMin, ageMax }),
      setFilterQuery: (filterQuery) => set({ filterQuery }),
      clearUsers: () => set({ users: [], filterQuery: '' }),
    }),
    {
      name: 'user-generator-store',
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
      /* Only persist settings — users are in-memory to keep storage lean */
      partialize: (state) => ({
        selectedCountry: state.selectedCountry,
        quantity: state.quantity,
        gender: state.gender,
        ageMin: state.ageMin,
        ageMax: state.ageMax,
      }),
    }
  )
);
