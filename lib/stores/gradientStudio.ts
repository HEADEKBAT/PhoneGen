/**
 * Gradient Studio — main Zustand store.
 *
 * Manages gradient state, sub-tab navigation, recipes, undo/redo history,
 * and export preferences. Recipes are persisted to localStorage.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  GradientConfig,
  GradientRecipe,
  GradientExportFormat,
  ExportOptions,
  BackgroundContext,
  BackgroundMood,
} from '@/lib/color-studio/gradientTypes';
import {
  createDefaultGradientConfig,
  generateGradientId,
} from '@/lib/color-studio/gradientTypes';

/* ── Types ─────────────────────────────────────────────────────────────────── */

export type GradientSubTab =
  | 'classic'
  | 'mesh'
  | 'aurora'
  | 'background'
  | 'animation'
  | 'collections'
  | 'recipes'
  | 'export';

interface GradientStudioState {
  /* ── Navigation ── */
  activeSubTab: GradientSubTab;
  setActiveSubTab: (tab: GradientSubTab) => void;

  /* ── Active gradient ── */
  currentGradient: GradientConfig;
  setCurrentGradient: (gradient: GradientConfig) => void;
  updateCurrentGradient: (partial: Partial<GradientConfig>) => void;

  /* ── Background Builder ── */
  bgContext: BackgroundContext;
  bgMood: BackgroundMood;
  setBgContext: (context: BackgroundContext) => void;
  setBgMood: (mood: BackgroundMood) => void;

  /* ── Collection browsing ── */
  collectionCategory: string | null;
  collectionSearchQuery: string;
  setCollectionCategory: (category: string | null) => void;
  setCollectionSearchQuery: (query: string) => void;

  /* ── Recipes (persisted) ── */
  recipes: GradientRecipe[];
  addRecipe: (recipe: GradientRecipe) => void;
  updateRecipe: (id: string, updates: Partial<GradientRecipe>) => void;
  removeRecipe: (id: string) => void;
  loadRecipe: (id: string) => boolean;

  /* ── Undo / Redo history ── */
  history: GradientConfig[];
  historyIndex: number;
  pushHistory: (gradient: GradientConfig) => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;

  /* ── Smart Gen ── */
  smartPrompt: string;
  isGenerating: boolean;
  setSmartPrompt: (prompt: string) => void;
  setIsGenerating: (generating: boolean) => void;

  /* ── Export (persisted) ── */
  exportFormat: GradientExportFormat;
  exportOptions: ExportOptions;
  setExportFormat: (format: GradientExportFormat) => void;
  setExportOptions: (opts: Partial<ExportOptions>) => void;
}

/* ── Defaults ──────────────────────────────────────────────────────────────── */

const DEFAULT_EXPORT_OPTIONS: ExportOptions = {
  format: 'css',
  includeVariables: true,
  includeMeta: false,
  includeAnimation: false,
  includeNoise: false,
  includeMasks: false,
};

/* ── Store ─────────────────────────────────────────────────────────────────── */

export const useGradientStudioStore = create<GradientStudioState>()(
  persist(
    (set, get) => ({
      /* ── Navigation ── */
      activeSubTab: 'classic',
      setActiveSubTab: (tab) => set({ activeSubTab: tab }),

      /* ── Active gradient ── */
      currentGradient: createDefaultGradientConfig(),
      setCurrentGradient: (gradient) => set({ currentGradient: gradient }),
      updateCurrentGradient: (partial) =>
        set((state) => ({
          currentGradient: { ...state.currentGradient, ...partial, updatedAt: Date.now() },
        })),

      /* ── Background Builder ── */
      bgContext: 'landing',
      bgMood: 'professional',
      setBgContext: (context) => set({ bgContext: context }),
      setBgMood: (mood) => set({ bgMood: mood }),

      /* ── Collection browsing ── */
      collectionCategory: null,
      collectionSearchQuery: '',
      setCollectionCategory: (category) => set({ collectionCategory: category }),
      setCollectionSearchQuery: (query) => set({ collectionSearchQuery: query }),

      /* ── Recipes ── */
      recipes: [],
      addRecipe: (recipe) =>
        set((state) => ({
          recipes: [recipe, ...state.recipes],
        })),
      updateRecipe: (id, updates) =>
        set((state) => ({
          recipes: state.recipes.map((r) =>
            r.id === id ? { ...r, ...updates, updatedAt: Date.now() } : r,
          ),
        })),
      removeRecipe: (id) =>
        set((state) => ({
          recipes: state.recipes.filter((r) => r.id !== id),
        })),
      loadRecipe: (id) => {
        const recipe = get().recipes.find((r) => r.id === id);
        if (recipe) {
          set({ currentGradient: { ...recipe.gradient } });
          return true;
        }
        return false;
      },

      /* ── History ── */
      history: [createDefaultGradientConfig()],
      historyIndex: 0,
      pushHistory: (gradient) =>
        set((state) => {
          const newHistory = state.history.slice(0, state.historyIndex + 1);
          newHistory.push({ ...gradient });
          // Keep max 100 entries
          if (newHistory.length > 100) newHistory.shift();
          return {
            history: newHistory,
            historyIndex: newHistory.length - 1,
          };
        }),
      undo: () =>
        set((state) => {
          if (state.historyIndex <= 0) return state;
          const newIndex = state.historyIndex - 1;
          return {
            historyIndex: newIndex,
            currentGradient: { ...state.history[newIndex] },
          };
        }),
      redo: () =>
        set((state) => {
          if (state.historyIndex >= state.history.length - 1) return state;
          const newIndex = state.historyIndex + 1;
          return {
            historyIndex: newIndex,
            currentGradient: { ...state.history[newIndex] },
          };
        }),
      canUndo: () => get().historyIndex > 0,
      canRedo: () => get().historyIndex < get().history.length - 1,

      /* ── Smart Gen ── */
      smartPrompt: '',
      isGenerating: false,
      setSmartPrompt: (prompt) => set({ smartPrompt: prompt }),
      setIsGenerating: (generating) => set({ isGenerating: generating }),

      /* ── Export ── */
      exportFormat: 'css',
      exportOptions: DEFAULT_EXPORT_OPTIONS,
      setExportFormat: (format) =>
        set({ exportFormat: format, exportOptions: { ...get().exportOptions, format } }),
      setExportOptions: (opts) =>
        set((state) => ({
          exportOptions: { ...state.exportOptions, ...opts },
        })),
    }),
    {
      name: 'gradient-studio-store',
      partialize: (state) => ({
        // Only persist these slices
        recipes: state.recipes,
        exportFormat: state.exportFormat,
        exportOptions: state.exportOptions,
        bgContext: state.bgContext,
        bgMood: state.bgMood,
      }),
    },
  ),
);
