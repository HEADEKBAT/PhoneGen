/**
 * Color Favorites — Zustand store persisted to localStorage.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FavoritePalette {
  name: string;
  colors: string[];
  createdAt: number;
}

interface ColorFavoritesState {
  favorites: FavoritePalette[];
  addFavorite: (name: string, colors: string[]) => void;
  removeFavorite: (index: number) => void;
  renameFavorite: (index: number, name: string) => void;
  clearAll: () => void;
  /** Total number of favorites. */
  count: () => number;
}

export const useColorFavoritesStore = create<ColorFavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],

      addFavorite: (name, colors) =>
        set((state) => ({
          favorites: [
            ...state.favorites,
            { name, colors, createdAt: Date.now() },
          ],
        })),

      removeFavorite: (index) =>
        set((state) => ({
          favorites: state.favorites.filter((_, i) => i !== index),
        })),

      renameFavorite: (index, name) =>
        set((state) => {
          const updated = [...state.favorites];
          updated[index] = { ...updated[index], name };
          return { favorites: updated };
        }),

      clearAll: () => set({ favorites: [] }),

      count: () => get().favorites.length,
    }),
    {
      name: 'color-studio-favorites',
    },
  ),
);
