/**
 * Color Studio — main Zustand store.
 *
 * Manages current mode, active colors, lock state, and undo/redo history.
 */

import { create } from 'zustand';
import type { HarmonyType, ColorBlindnessType } from '@/lib/color-studio';
import { hexToRgb, rgbToHex } from '@/lib/color-studio';
import type { DesignSystem } from '@/lib/color-studio/themeBuilder';

/* ── Types ───────────────────────────────────────────────────────────────── */

export type ColorMode =
  | 'random'
  | 'palette'
  | 'theme'
  | 'gradient'
  | 'converter'
  | 'contrast'
  | 'extractor'
  | 'brands'
  | 'tokens'
  | 'preview'
  | 'history'
  | 'favorites'
  | 'names';

interface ColorStudioState {
  /* ── Mode ── */
  mode: ColorMode;
  setMode: (mode: ColorMode) => void;

  /* ── Colors ── */
  /** Currently active hex colors (up to 10). */
  colors: string[];
  setColors: (colors: string[]) => void;
  addColor: (hex: string) => void;
  removeColor: (index: number) => void;
  updateColor: (index: number, hex: string) => void;
  replaceColor: (index: number, hex: string) => void;

  /* ── Locked colors ── */
  locked: Set<number>;
  toggleLock: (index: number) => void;

  /* ── Harmony type ── */
  harmonyType: HarmonyType;
  setHarmonyType: (type: HarmonyType) => void;

  /* ── Color blindness simulation ── */
  blindnessType: ColorBlindnessType | null;
  setBlindnessType: (type: ColorBlindnessType | null) => void;

  /* ── Input hex for converter ── */
  inputHex: string;
  setInputHex: (hex: string) => void;

  /* ── Foreground / background for contrast checker ── */
  fgColor: string;
  bgColor: string;
  setFgColor: (hex: string) => void;
  setBgColor: (hex: string) => void;

  /* ── Undo / Redo ── */
  history: string[][];
  historyIndex: number;
  pushHistory: (colors: string[]) => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;

  /* ── Theme Builder ── */
  themePrimary: string;
  themeStyle: string;
  themeProject: string;
  themePersonality: string;
  themeMode: 'light' | 'dark';
  designSystem: DesignSystem | null;
  setThemePrimary: (hex: string) => void;
  setThemeStyle: (style: string) => void;
  setThemeProject: (project: string) => void;
  setThemePersonality: (personality: string) => void;
  setThemeMode: (mode: 'light' | 'dark') => void;
  setDesignSystem: (ds: DesignSystem | null) => void;
}

/* ── Helpers ─────────────────────────────────────────────────────────────── */

const DEFAULT_COLORS = ['#4ade80', '#3b82f6', '#ef4444', '#f59e0b', '#a855f7'];

/* ── Store ───────────────────────────────────────────────────────────────── */

export const useColorStudioStore = create<ColorStudioState>((set, get) => ({
  /* ── Mode ── */
  mode: 'random',
  setMode: (mode) => set({ mode }),

  /* ── Colors ── */
  colors: DEFAULT_COLORS,
  setColors: (colors) => set({ colors }),
  addColor: (hex) =>
    set((state) => ({
      colors: [...state.colors, hex],
    })),
  removeColor: (index) =>
    set((state) => ({
      colors: state.colors.filter((_, i) => i !== index),
    })),
  updateColor: (index, hex) =>
    set((state) => {
      const updated = [...state.colors];
      updated[index] = hex;
      return { colors: updated };
    }),
  replaceColor: (index, hex) => {
    const state = get();
    const updated = [...state.colors];
    updated[index] = hex;
    state.pushHistory(state.colors);
    set({ colors: updated });
  },

  /* ── Locked ── */
  locked: new Set<number>(),
  toggleLock: (index) =>
    set((state) => {
      const next = new Set(state.locked);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return { locked: next };
    }),

  /* ── Harmony ── */
  harmonyType: 'complementary',
  setHarmonyType: (type) => set({ harmonyType: type }),

  /* ── Blindness ── */
  blindnessType: null,
  setBlindnessType: (type) => set({ blindnessType: type }),

  /* ── Input hex ── */
  inputHex: '#4ade80',
  setInputHex: (hex) => set({ inputHex: hex }),

  /* ── Fg / Bg ── */
  fgColor: '#000000',
  bgColor: '#ffffff',
  setFgColor: (hex) => set({ fgColor: hex }),
  setBgColor: (hex) => set({ bgColor: hex }),

  /* ── Theme Builder ── */
  themePrimary: '#4F46E5',
  themeStyle: 'modern',
  themeProject: 'saas',
  themePersonality: 'professional',
  themeMode: 'light',
  designSystem: null,
  setThemePrimary: (hex) => set({ themePrimary: hex }),
  setThemeStyle: (style) => set({ themeStyle: style }),
  setThemeProject: (project) => set({ themeProject: project }),
  setThemePersonality: (personality) => set({ themePersonality: personality }),
  setThemeMode: (mode) => set({ themeMode: mode }),
  setDesignSystem: (ds) => set({ designSystem: ds }),

  /* ── History ── */
  history: [DEFAULT_COLORS],
  historyIndex: 0,
  pushHistory: (colors) =>
    set((state) => {
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push(colors);
      // Keep max 50 entries
      if (newHistory.length > 50) newHistory.shift();
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
        colors: state.history[newIndex],
      };
    }),
  redo: () =>
    set((state) => {
      if (state.historyIndex >= state.history.length - 1) return state;
      const newIndex = state.historyIndex + 1;
      return {
        historyIndex: newIndex,
        colors: state.history[newIndex],
      };
    }),
  canUndo: () => get().historyIndex > 0,
  canRedo: () => get().historyIndex < get().history.length - 1,
}));
