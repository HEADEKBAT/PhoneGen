import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface FavoritesStore {
  favorites: string[];
  toggleFavorite: (code: string) => void;
  isFavorite: (code: string) => boolean;
}

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
    },
  ),
);
