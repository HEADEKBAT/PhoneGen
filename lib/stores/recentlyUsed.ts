import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface RecentlyUsedStore {
  recentlyUsed: string[];
  addRecentlyUsed: (code: string) => void;
}

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
    },
  ),
);
