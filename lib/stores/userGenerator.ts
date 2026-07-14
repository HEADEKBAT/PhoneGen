import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { GeneratedUser } from '@/lib/userGenerator/types';

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

const DEFAULTS = {
  selectedCountry: 'US',
  quantity: 5,
  gender: 'any' as const,
  ageMin: 18,
  ageMax: 65,
};

export const useUserGeneratorStore = create<UserGeneratorStore>()(
  persist(
    (set) => ({
      users: [],
      selectedCountry: DEFAULTS.selectedCountry,
      quantity: DEFAULTS.quantity,
      gender: DEFAULTS.gender,
      ageMin: DEFAULTS.ageMin,
      ageMax: DEFAULTS.ageMax,
      filterQuery: '',
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
      partialize: (state) => ({
        selectedCountry: state.selectedCountry,
        quantity: state.quantity,
        gender: state.gender,
        ageMin: state.ageMin,
        ageMax: state.ageMax,
      }),
    },
  ),
);
