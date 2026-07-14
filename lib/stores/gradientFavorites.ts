/**
 * Gradient Favorites — Zustand store persisted to localStorage.
 *
 * Follows the same pattern as colorFavorites.ts but for gradients.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GradientConfig } from '@/lib/color-studio/gradientTypes';

interface FavoriteGradient {
  id: string;
  name: string;
  gradient: GradientConfig;
  createdAt: number;
}

interface GradientFavoritesState {
  favorites: FavoriteGradient[];
  addFavorite: (gradient: GradientConfig) => void;
  removeFavorite: (id: string) => void;
  renameFavorite: (id: string, name: string) => void;
  clearAll: () => void;
  isFavorite: (id: string) => boolean;
  count: () => number;
}

export const useGradientFavoritesStore = create<GradientFavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],

      addFavorite: (gradient) =>
        set((state) => {
          // Don't duplicate
          if (state.favorites.some((f) => f.id === gradient.id)) return state;
          return {
            favorites: [
              ...state.favorites,
              {
                id: gradient.id,
                name: gradient.name,
                gradient: { ...gradient },
                createdAt: Date.now(),
              },
            ],
          };
        }),

      removeFavorite: (id) =>
        set((state) => ({
          favorites: state.favorites.filter((f) => f.id !== id),
        })),

      renameFavorite: (id, name) =>
        set((state) => ({
          favorites: state.favorites.map((f) =>
            f.id === id ? { ...f, name } : f,
          ),
        })),

      clearAll: () => set({ favorites: [] }),

      isFavorite: (id) => get().favorites.some((f) => f.id === id),

      count: () => get().favorites.length,
    }),
    {
      name: 'gradient-studio-favorites',
    },
  ),
);
