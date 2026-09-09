/**
 * Image Studio — Core Types
 *
 * Image processing types, tool types, export formats, and preset definitions
 * for the Image Studio platform.
 */

/* ── Processing quality levels ───────────────────────────────────────────── */

export type ProcessQuality = 'fast' | 'balanced' | 'high-quality';

/* ── Background removal result ───────────────────────────────────────────── */

export interface RemovalResult {
  originalBlob: Blob;
  /**
   * Full-resolution PNG carrying the mask in its **alpha** channel (RGB is
   * white). Stored this way so the compositor can apply it with a
   * `destination-in` draw instead of a per-pixel luminance conversion.
   */
  maskBlob: Blob;
  /** RGBA cutout with transparent background (convenience preview). */
  resultBlob: Blob;
  /** Natural pixel dimensions of the source image. */
  width: number;
  height: number;
  processingTimeMs: number;
}

export interface ProcessOptions {
  quality: ProcessQuality;
  /** 5–90, canvas algorithm aggressiveness (default 40). */
  tolerance?: number;
  onProgress?: (percent: number) => void;
  /** Abort an in-flight job (used by the batch queue). */
  signal?: AbortSignal;
}

/* ── Background options ──────────────────────────────────────────────────── */

export type BackgroundType =
  | 'transparent'
  | 'white'
  | 'black'
  | 'custom'
  | 'gradient'
  | 'blur'
  | 'glass'
  | 'studio'
  | 'office'
  | 'nature'
  | 'upload';

export interface BackgroundOption {
  type: BackgroundType;
  color?: string;
  gradient?: string;
  blurRadius?: number;
  imageUrl?: string;
}

/* ── Edge refinement ─────────────────────────────────────────────────────── */

export interface EdgeRefinementSettings {
  smooth: number;   // 0–100
  feather: number;  // 0–50
  expand: number;   // -50 – +50
  hairDetail: boolean;
}

/* ── Shadow generation ───────────────────────────────────────────────────── */

export type ShadowType =
  | 'soft'
  | 'hard'
  | 'floating'
  | 'studio'
  | 'natural'
  | 'long';

export interface ShadowSettings {
  type: ShadowType;
  distance: number;
  angle: number;
  blur: number;
  opacity: number;
}

/* ── Export formats ──────────────────────────────────────────────────────── */

export type ImageExportFormat = 'png' | 'webp' | 'jpeg' | 'avif';

/* ── Render pipeline ─────────────────────────────────────────────────────── */

/**
 * Everything the compositor needs to turn (original + mask) into a final image.
 * Assembled from the store by {@link buildRenderSettings}.
 */
export interface RenderSettings {
  background: BackgroundOption;
  edge: EdgeRefinementSettings;
  shadow: ShadowSettings | null;
  /** Target canvas size from a platform preset. Null keeps the source size. */
  outputSize?: { width: number; height: number } | null;
  /** Inset (in output pixels) kept clear around the subject when resizing. */
  padding?: number;
}

/* ── Product mode presets ────────────────────────────────────────────────── */

export interface ProductPreset {
  id: string;
  label: string;
  platform: string;
  background: { type: BackgroundType; color?: string };
  size: { width: number; height: number };
  padding: number;
  format: ImageExportFormat;
  quality: number;
}

export interface SocialPreset {
  id: string;
  label: string;
  platform: string;
  size: { width: number; height: number };
  background: { type: BackgroundType; color?: string };
  format: ImageExportFormat;
}

/* ── Image processing modes ──────────────────────────────────────────────── */

export type ImageStudioMode =
  | 'background-remover'
  | 'object-remover'
  | 'image-upscaler'
  | 'image-enhancer'
  | 'image-converter';
