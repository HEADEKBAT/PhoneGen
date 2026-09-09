/**
 * Image Studio — Zustand Store
 *
 * Manages the current image, processing state, tool mode, the batch queue and
 * export preferences. Images are NOT persisted: multi-megabyte blobs in
 * localStorage would blow the quota and stall every page load. Session-only.
 *
 * Object URLs are owned by this store. Anything that replaces or clears an
 * entry revokes the URLs it is dropping, so "Start over" no longer leaks a
 * full-resolution bitmap per image.
 */

import { create } from 'zustand';
import type {
  BackgroundOption,
  EdgeRefinementSettings,
  ImageExportFormat,
  ImageStudioMode,
  ProcessQuality,
  RenderSettings,
  ShadowSettings,
} from '@/lib/image-studio/types';
import { PRODUCT_PRESETS, SOCIAL_PRESETS } from '@/lib/image-studio/presets';

/* ── Types ────────────────────────────────────────────────────────────────── */

export type ControlMode = 'standard' | 'product' | 'social' | 'batch';

export interface ImageEntry {
  id: string;
  name: string;
  originalUrl: string;
  /** Alpha-carrying mask PNG produced by the remover. */
  maskUrl?: string;
  /** Raw cutout preview (before background / shadow / resize). */
  resultUrl?: string;
  processingTimeMs?: number;
}

export type BatchItemStatus = 'waiting' | 'processing' | 'done' | 'error';

export interface BatchEntry {
  id: string;
  name: string;
  file: File;
  status: BatchItemStatus;
  progress: number;
  /** Object URL for the thumbnail — created once, revoked on removal. */
  previewUrl: string;
  /** Object URL of the finished, composited, encoded output. */
  resultUrl?: string;
  resultExtension?: string;
  bytes?: number;
  error?: string;
  processingTimeMs?: number;
}

interface ProcessingState {
  status: 'idle' | 'uploading' | 'processing' | 'done' | 'error';
  progress: number; // 0–100
  error?: string;
}

export interface ImageStudioState {
  /* ── Tool mode ─────────────────────── */
  mode: ImageStudioMode;

  /* ── Control mode (sub-mode within a tool) ─── */
  controlMode: ControlMode;

  /* ── Current image ─────────────────── */
  currentImage: ImageEntry | null;
  processingState: ProcessingState;

  /* ── Batch queue ───────────────────── */
  batchQueue: BatchEntry[];

  /* ── Edit settings ─────────────────── */
  background: BackgroundOption;
  edgeRefinement: EdgeRefinementSettings;
  shadow: ShadowSettings | null;

  /* ── Presets ────────────────────────── */
  selectedProductPreset: string | null;
  selectedSocialPreset: string | null;

  /* ── Export preferences ────────────── */
  exportFormat: ImageExportFormat;
  exportQuality: number; // 1–100

  /* ── Processing quality ────────────── */
  processQuality: ProcessQuality;
  tolerance: number; // 5–90, controls canvas algorithm aggressiveness

  /* ── Actions ───────────────────────── */
  setMode: (mode: ImageStudioMode) => void;
  setControlMode: (mode: ControlMode) => void;
  setCurrentImage: (image: ImageEntry | null) => void;
  patchCurrentImage: (patch: Partial<ImageEntry>) => void;
  setProcessingState: (state: Partial<ProcessingState>) => void;
  addBatchFiles: (files: File[]) => BatchEntry[];
  updateBatchEntry: (id: string, patch: Partial<BatchEntry>) => void;
  removeBatchEntry: (id: string) => void;
  clearBatchQueue: () => void;
  setBackground: (option: BackgroundOption) => void;
  setEdgeRefinement: (settings: Partial<EdgeRefinementSettings>) => void;
  setShadow: (shadow: ShadowSettings | null) => void;
  setSelectedProductPreset: (id: string | null) => void;
  setSelectedSocialPreset: (id: string | null) => void;
  setExportFormat: (format: ImageExportFormat) => void;
  setExportQuality: (quality: number) => void;
  setProcessQuality: (quality: ProcessQuality) => void;
  setTolerance: (tolerance: number) => void;
  reset: () => void;
}

/* ── Object URL helpers ───────────────────────────────────────────────────── */

function revoke(...urls: (string | undefined)[]): void {
  for (const url of urls) {
    if (url && url.startsWith('blob:')) {
      try {
        URL.revokeObjectURL(url);
      } catch {
        /* Already revoked, or a non-blob URL slipped through — harmless. */
      }
    }
  }
}

/** Revoke every URL an image entry owns that the replacement does not reuse. */
function revokeEntry(previous: ImageEntry | null, next: ImageEntry | null): void {
  if (!previous) return;
  const kept = new Set(
    [next?.originalUrl, next?.maskUrl, next?.resultUrl].filter(Boolean) as string[],
  );
  revoke(
    ...[previous.originalUrl, previous.maskUrl, previous.resultUrl].filter(
      (url): url is string => Boolean(url) && !kept.has(url as string),
    ),
  );
}

function revokeBatchEntry(entry: BatchEntry): void {
  revoke(entry.previewUrl, entry.resultUrl);
}

/* ── Defaults ─────────────────────────────────────────────────────────────── */

const DEFAULT_BACKGROUND: BackgroundOption = { type: 'transparent' };
const DEFAULT_EDGE_REFINEMENT: EdgeRefinementSettings = {
  smooth: 0,
  feather: 0,
  expand: 0,
  hairDetail: false,
};

const DEFAULT_STATE = {
  mode: 'background-remover' as ImageStudioMode,
  controlMode: 'standard' as ControlMode,
  currentImage: null as ImageEntry | null,
  processingState: { status: 'idle' as const, progress: 0 },
  batchQueue: [] as BatchEntry[],
  background: DEFAULT_BACKGROUND,
  edgeRefinement: DEFAULT_EDGE_REFINEMENT,
  shadow: null as ShadowSettings | null,
  selectedProductPreset: null as string | null,
  selectedSocialPreset: null as string | null,
  exportFormat: 'png' as ImageExportFormat,
  exportQuality: 90,
  processQuality: 'balanced' as ProcessQuality,
  tolerance: 40,
};

/* ── Store ────────────────────────────────────────────────────────────────── */

export const useImageStudioStore = create<ImageStudioState>()((set, get) => ({
  ...DEFAULT_STATE,

  setMode: (mode) => set({ mode }),

  setControlMode: (controlMode) => set({ controlMode }),

  setCurrentImage: (image) => {
    revokeEntry(get().currentImage, image);
    set({
      currentImage: image,
      processingState: { status: 'idle', progress: 0 },
    });
  },

  /** Merge fields into the current entry without touching its object URLs. */
  patchCurrentImage: (patch) =>
    set((state) =>
      state.currentImage
        ? { currentImage: { ...state.currentImage, ...patch } }
        : state,
    ),

  setProcessingState: (partial) =>
    set((state) => ({
      processingState: { ...state.processingState, ...partial },
    })),

  addBatchFiles: (files) => {
    const entries: BatchEntry[] = files
      .filter((file) => file.type.startsWith('image/'))
      .map((file) => ({
        id: crypto.randomUUID(),
        name: file.name,
        file,
        status: 'waiting' as const,
        progress: 0,
        previewUrl: URL.createObjectURL(file),
      }));

    if (entries.length > 0) {
      set((state) => ({ batchQueue: [...state.batchQueue, ...entries] }));
    }
    return entries;
  },

  updateBatchEntry: (id, patch) =>
    set((state) => ({
      batchQueue: state.batchQueue.map((entry) => {
        if (entry.id !== id) return entry;
        // A new result supersedes the old one; drop the URL we are replacing.
        if (patch.resultUrl && entry.resultUrl && patch.resultUrl !== entry.resultUrl) {
          revoke(entry.resultUrl);
        }
        return { ...entry, ...patch };
      }),
    })),

  removeBatchEntry: (id) =>
    set((state) => {
      const entry = state.batchQueue.find((item) => item.id === id);
      if (entry) revokeBatchEntry(entry);
      return { batchQueue: state.batchQueue.filter((item) => item.id !== id) };
    }),

  clearBatchQueue: () =>
    set((state) => {
      state.batchQueue.forEach(revokeBatchEntry);
      return { batchQueue: [] };
    }),

  setBackground: (option) => set({ background: option }),

  setEdgeRefinement: (partial) =>
    set((state) => ({
      edgeRefinement: { ...state.edgeRefinement, ...partial },
    })),

  setShadow: (shadow) => set({ shadow }),

  setSelectedProductPreset: (id) => set({ selectedProductPreset: id }),

  setSelectedSocialPreset: (id) => set({ selectedSocialPreset: id }),

  setExportFormat: (format) => set({ exportFormat: format }),

  setExportQuality: (quality) => set({ exportQuality: quality }),

  setProcessQuality: (processQuality) => set({ processQuality }),

  setTolerance: (tolerance) => set({ tolerance }),

  reset: () => {
    const state = get();
    revokeEntry(state.currentImage, null);
    state.batchQueue.forEach(revokeBatchEntry);
    set({ ...DEFAULT_STATE, batchQueue: [] });
  },
}));

/* ── Selectors ────────────────────────────────────────────────────────────── */

/**
 * Collapse the scattered store fields into the single object the compositor
 * takes. Product and Social modes contribute an output size and padding; the
 * other modes keep the source dimensions.
 */
export function selectRenderSettings(state: ImageStudioState): RenderSettings {
  let outputSize: RenderSettings['outputSize'] = null;
  let padding = 0;

  if (state.controlMode === 'product' && state.selectedProductPreset) {
    const preset = PRODUCT_PRESETS.find((p) => p.id === state.selectedProductPreset);
    if (preset) {
      outputSize = preset.size;
      padding = preset.padding;
    }
  } else if (state.controlMode === 'social' && state.selectedSocialPreset) {
    const preset = SOCIAL_PRESETS.find((p) => p.id === state.selectedSocialPreset);
    if (preset) outputSize = preset.size;
  }

  return {
    background: state.background,
    edge: state.edgeRefinement,
    shadow: state.shadow,
    outputSize,
    padding,
  };
}

/**
 * Colour to flatten transparency onto when exporting to a format without an
 * alpha channel (JPEG). Uses the chosen background when there is one, so a
 * JPEG export matches what the user is looking at.
 */
export function selectExportMatte(state: ImageStudioState): string {
  const { background } = state;
  if (background.type === 'transparent') return '#ffffff';
  if (background.type === 'black') return background.color ?? '#000000';
  return background.color ?? '#ffffff';
}
