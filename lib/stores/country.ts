import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface CountryStore {
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
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
    },
  ),
);
