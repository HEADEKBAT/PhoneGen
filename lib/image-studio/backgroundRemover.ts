/**
 * Background Remover — Service Layer
 *
 * Abstract interface that can be swapped (canvas → ONNX RMBG-2.0 / BiRefNet →
 * self-hosted API) without touching any UI. `getBackgroundRemoverService()` is
 * the only construction point; `setBackgroundRemoverService()` replaces it at
 * runtime, e.g. once a model finishes downloading.
 *
 * The current implementation is a connected-component chroma key:
 *
 *   1. Sample the image border and cluster it into up to four background
 *      colours (handles two-tone backdrops and light vignetting).
 *   2. Flood-fill inward from every border pixel that matches a cluster.
 *   3. Everything the fill never reaches stays opaque.
 *
 * Step 2 is what separates this from a plain global colour threshold: a white
 * shirt on a white backdrop keeps its pixels, because they are not *connected*
 * to the border. A threshold-only pass punches holes straight through it.
 *
 * The mask — not the cutout — is the primary output. Edge refinement,
 * background replacement and shadows are applied downstream by `compositor.ts`,
 * so moving those sliders never re-runs segmentation.
 */

import type { RemovalResult, ProcessOptions, ProcessQuality } from './types';
import {
  canvasToBlob,
  closeImage,
  createCanvas,
  decodeImage,
  fitScale,
  imageSize,
  releaseCanvas,
  throwIfAborted,
  yieldToBrowser,
} from './canvas';

/* ── Service interface ────────────────────────────────────────────────────── */

export interface BackgroundRemoverService {
  process(image: Blob, options?: ProcessOptions): Promise<RemovalResult>;
  dispose(): void;
}

/* ── Tuning constants ─────────────────────────────────────────────────────── */

/**
 * Distance (in redmean units, where black↔white ≈ 765) that a tolerance of
 * 100% maps to. Deliberately well below the theoretical maximum: past this
 * point the fill starts eating saturated subjects.
 */
const MAX_TOLERANCE_DISTANCE = 220;

/** Width of the soft alpha band beyond the hard threshold, as a multiplier. */
const SOFT_BAND_FACTOR = 1.6;

/** Border strip sampled for background colours, as a fraction of the short side. */
const BORDER_FRACTION = 0.02;

/** A colour cluster must cover at least this share of border samples to count. */
const MIN_CLUSTER_SHARE = 0.04;

/** Cap on distinct background colours tracked. */
const MAX_CLUSTERS = 4;

/** Pixels visited between yields to the browser. */
const YIELD_INTERVAL = 200_000;

/* ── Quality profiles ─────────────────────────────────────────────────────── */

interface QualityProfile {
  /** Longest side the mask is computed at; upscaled to full res afterwards. */
  maskMaxSide: number;
  /** Emit partial alpha in the transition band instead of a hard cut. */
  softBand: boolean;
  /** Run a 3×3 majority filter to knock out single-pixel speckle. */
  despeckle: boolean;
}

const QUALITY_PROFILES: Record<ProcessQuality, QualityProfile> = {
  fast: { maskMaxSide: 900, softBand: false, despeckle: false },
  balanced: { maskMaxSide: 1600, softBand: true, despeckle: false },
  'high-quality': { maskMaxSide: 2200, softBand: true, despeckle: true },
};

/* ── Colour distance ──────────────────────────────────────────────────────── */

/**
 * "Redmean" colour difference — a cheap approximation of perceptual distance
 * that is dramatically better than summing raw RGB deltas, because it weights
 * green heavily and adapts the red/blue weights to overall brightness.
 *
 * Range: 0 (identical) to ~765 (black vs. white).
 */
export function colorDistance(
  r1: number, g1: number, b1: number,
  r2: number, g2: number, b2: number,
): number {
  const rmean = (r1 + r2) >> 1;
  const dr = r1 - r2;
  const dg = g1 - g2;
  const db = b1 - b2;
  return Math.sqrt(
    (((512 + rmean) * dr * dr) >> 8) + 4 * dg * dg + (((767 - rmean) * db * db) >> 8),
  );
}

/* ── Background sampling ──────────────────────────────────────────────────── */

export interface ColorCluster {
  r: number;
  g: number;
  b: number;
}

/**
 * Cluster the image border into the dominant background colours.
 *
 * Colours are bucketed on a coarse 5-bit-per-channel grid so that noise and
 * JPEG ringing collapse into one bucket, then the heaviest buckets are kept
 * and refined to the mean colour of their members.
 */
export function sampleBackgroundClusters(
  data: Uint8ClampedArray,
  w: number,
  h: number,
): ColorCluster[] {
  const band = Math.max(1, Math.round(Math.min(w, h) * BORDER_FRACTION));
  const buckets = new Map<number, { r: number; g: number; b: number; n: number }>();
  let total = 0;

  const add = (x: number, y: number) => {
    const i = (y * w + x) * 4;
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    // 5 bits per channel → 32³ buckets.
    const key = ((r >> 3) << 10) | ((g >> 3) << 5) | (b >> 3);
    const bucket = buckets.get(key);
    if (bucket) {
      bucket.r += r; bucket.g += g; bucket.b += b; bucket.n++;
    } else {
      buckets.set(key, { r, g, b, n: 1 });
    }
    total++;
  };

  for (let y = 0; y < band; y++) {
    for (let x = 0; x < w; x++) {
      add(x, y);
      add(x, h - 1 - y);
    }
  }
  for (let x = 0; x < band; x++) {
    for (let y = band; y < h - band; y++) {
      add(x, y);
      add(w - 1 - x, y);
    }
  }

  const ranked = [...buckets.values()].sort((a, b) => b.n - a.n);
  const clusters: ColorCluster[] = [];

  for (const bucket of ranked) {
    if (clusters.length >= MAX_CLUSTERS) break;
    if (clusters.length > 0 && bucket.n / total < MIN_CLUSTER_SHARE) break;
    clusters.push({
      r: bucket.r / bucket.n,
      g: bucket.g / bucket.n,
      b: bucket.b / bucket.n,
    });
  }

  // Degenerate images (1×1, fully uniform) still need a seed.
  return clusters.length > 0 ? clusters : [{ r: 255, g: 255, b: 255 }];
}

/** Distance from a pixel to the nearest background cluster. */
function distanceToBackground(
  data: Uint8ClampedArray,
  idx: number,
  clusters: ColorCluster[],
): number {
  const i = idx * 4;
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];

  let best = Infinity;
  for (let c = 0; c < clusters.length; c++) {
    const cluster = clusters[c];
    const d = colorDistance(r, g, b, cluster.r, cluster.g, cluster.b);
    if (d < best) best = d;
  }
  return best;
}

/* ── Mask post-processing ─────────────────────────────────────────────────── */

/**
 * 3×3 majority filter over the binary part of the mask. Removes isolated
 * speckle left behind by sensor noise without softening real edges, because
 * pixels already in the partial-alpha band are left untouched.
 */
function despeckleMask(alpha: Uint8Array, w: number, h: number): Uint8Array {
  const out = new Uint8Array(alpha);

  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const idx = y * w + x;
      const value = alpha[idx];
      if (value !== 0 && value !== 255) continue; // keep the soft band intact

      let opaque = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          if (alpha[idx + dy * w + dx] > 127) opaque++;
        }
      }

      if (value === 255 && opaque <= 2) out[idx] = 0;
      else if (value === 0 && opaque >= 6) out[idx] = 255;
    }
  }

  return out;
}

/* ── Mask computation (pure, canvas-free) ─────────────────────────────────── */

export interface AlphaMaskOptions {
  /** 5–90. Mapped onto MAX_TOLERANCE_DISTANCE. */
  tolerance: number;
  /** Emit partial alpha in the transition band instead of a hard cut. */
  softBand: boolean;
  /** Run a 3×3 majority filter to knock out single-pixel speckle. */
  despeckle: boolean;
  /** Progress within the fill, 0–1. */
  onProgress?: (fraction: number) => void;
  signal?: AbortSignal;
}

/**
 * Turn raw RGBA pixels into an alpha mask: 0 is background, 255 is subject,
 * values between are the soft transition band.
 *
 * Takes and returns plain typed arrays — no canvas, no DOM — so the algorithm
 * can be exercised directly by tests on synthetic images.
 *
 * The fill is 4-connected and starts from the border. That connectivity is the
 * whole point: a global colour threshold removes every pixel that merely
 * resembles the backdrop, which punches holes through a white shirt on a white
 * background. Pixels the fill cannot reach stay opaque no matter their colour.
 */
export async function computeAlphaMask(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  options: AlphaMaskOptions,
): Promise<Uint8Array> {
  const { softBand, despeckle, onProgress, signal } = options;

  const tolerance = Math.min(90, Math.max(5, options.tolerance));
  const threshold = (tolerance / 100) * MAX_TOLERANCE_DISTANCE;
  const softThreshold = softBand ? threshold * SOFT_BAND_FACTOR : threshold;

  const clusters = sampleBackgroundClusters(data, width, height);

  const pixelCount = width * height;
  let alpha: Uint8Array = new Uint8Array(pixelCount).fill(255);
  const visited = new Uint8Array(pixelCount);
  const queue = new Int32Array(pixelCount);
  let head = 0;
  let tail = 0;

  const seed = (idx: number) => {
    if (visited[idx]) return;
    if (distanceToBackground(data, idx, clusters) <= threshold) {
      visited[idx] = 1;
      alpha[idx] = 0;
      queue[tail++] = idx;
    }
  };

  for (let x = 0; x < width; x++) {
    seed(x);
    seed((height - 1) * width + x);
  }
  for (let y = 0; y < height; y++) {
    seed(y * width);
    seed(y * width + width - 1);
  }

  let visits = 0;
  while (head < tail) {
    const idx = queue[head++];
    const x = idx % width;
    const y = (idx / width) | 0;

    // 4-connected neighbours; 8-connectivity leaks through diagonal gaps.
    for (let n = 0; n < 4; n++) {
      const nx = x + (n === 0 ? -1 : n === 1 ? 1 : 0);
      const ny = y + (n === 2 ? -1 : n === 3 ? 1 : 0);
      if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;

      const nIdx = ny * width + nx;
      if (visited[nIdx]) continue;

      const d = distanceToBackground(data, nIdx, clusters);

      if (d <= threshold) {
        visited[nIdx] = 1;
        alpha[nIdx] = 0;
        queue[tail++] = nIdx;
      } else if (d <= softThreshold) {
        // Transition band: partially transparent, but the fill stops here so
        // it cannot creep along a gradient into the subject.
        visited[nIdx] = 1;
        alpha[nIdx] = Math.round(((d - threshold) / (softThreshold - threshold)) * 255);
      }
    }

    if (++visits % YIELD_INTERVAL === 0) {
      onProgress?.(head / Math.max(1, tail));
      await yieldToBrowser();
      throwIfAborted(signal);
    }
  }

  if (despeckle) {
    alpha = despeckleMask(alpha, width, height);
    throwIfAborted(signal);
  }

  onProgress?.(1);
  return alpha;
}

/* ── Canvas-based background remover ──────────────────────────────────────── */

export class CanvasBackgroundRemover implements BackgroundRemoverService {
  async process(image: Blob, options?: ProcessOptions): Promise<RemovalResult> {
    const startTime = performance.now();

    const quality = options?.quality ?? 'balanced';
    const profile = QUALITY_PROFILES[quality] ?? QUALITY_PROFILES.balanced;
    const onProgress = options?.onProgress;
    const signal = options?.signal;

    const tolerance = Math.min(90, Math.max(5, options?.tolerance ?? 40));
    const threshold = (tolerance / 100) * MAX_TOLERANCE_DISTANCE;
    const softThreshold = profile.softBand ? threshold * SOFT_BAND_FACTOR : threshold;

    throwIfAborted(signal);
    onProgress?.(0);

    /* ── 1. Decode ──────────────────────────────────────────────────────── */
    const source = await decodeImage(image);
    const { width: fullW, height: fullH } = imageSize(source);

    if (fullW === 0 || fullH === 0) {
      closeImage(source);
      throw new Error('This image appears to be empty.');
    }

    /* ── 2. Downscale for segmentation ──────────────────────────────────── */
    // Mask detail beyond ~2K adds nothing a bilinear upscale cannot recover,
    // and it is the difference between 2M and 24M pixel visits.
    const scale = fitScale(fullW, fullH, profile.maskMaxSide);
    const workW = Math.max(1, Math.round(fullW * scale));
    const workH = Math.max(1, Math.round(fullH * scale));

    const work = createCanvas(workW, workH, true);
    work.ctx.drawImage(source, 0, 0, workW, workH);

    const workData = work.ctx.getImageData(0, 0, workW, workH).data;
    onProgress?.(8);
    await yieldToBrowser();
    throwIfAborted(signal);

    /* ── 3–5. Cluster, flood fill, despeckle ────────────────────────────── */
    // The whole pixel-level part of the algorithm lives in computeAlphaMask,
    // which takes raw RGBA and returns an alpha mask. Keeping it free of any
    // canvas means it can be tested directly — see lib/image-studio/__tests__.
    const pixelCount = workW * workH;
    const alpha = await computeAlphaMask(workData, workW, workH, {
      tolerance,
      softBand: profile.softBand,
      despeckle: profile.despeckle,
      signal,
      onProgress: (fraction) => onProgress?.(12 + Math.round(fraction * 68)),
    });

    /* ── 6. Build the mask at working size ──────────────────────────────── */
    // Alpha-carrying variant: RGB is white, alpha is the mask. Drawing this
    // with `destination-in` is a GPU composite, not a pixel loop.
    const maskWork = createCanvas(workW, workH);
    const maskImage = maskWork.ctx.createImageData(workW, workH);
    const mp = maskImage.data;
    for (let i = 0, p = 0; i < pixelCount; i++, p += 4) {
      mp[p] = 255;
      mp[p + 1] = 255;
      mp[p + 2] = 255;
      mp[p + 3] = alpha[i];
    }
    maskWork.ctx.putImageData(maskImage, 0, 0);

    /* ── 7. Upscale the mask to full resolution ─────────────────────────── */
    const maskFull = createCanvas(fullW, fullH);
    maskFull.ctx.imageSmoothingEnabled = true;
    maskFull.ctx.imageSmoothingQuality = 'high';
    maskFull.ctx.drawImage(maskWork.canvas, 0, 0, fullW, fullH);

    onProgress?.(86);
    await yieldToBrowser();
    throwIfAborted(signal);

    /* ── 8. Cutout preview ──────────────────────────────────────────────── */
    const cutout = createCanvas(fullW, fullH);
    cutout.ctx.drawImage(source, 0, 0, fullW, fullH);
    cutout.ctx.globalCompositeOperation = 'destination-in';
    cutout.ctx.drawImage(maskFull.canvas, 0, 0);
    cutout.ctx.globalCompositeOperation = 'source-over';

    const resultBlob = await canvasToBlob(cutout.canvas, 'image/png');
    onProgress?.(93);
    throwIfAborted(signal);

    /* ── 9. Mask blob for downstream re-rendering ───────────────────────── */
    // Stored alpha-carrying (white RGB, mask in the alpha channel) rather than
    // as visible grayscale: decoding it gives the compositor a mask it can
    // apply with `destination-in` directly, with no pixel loop on every
    // slider change.
    const maskBlob = await canvasToBlob(maskFull.canvas, 'image/png');
    onProgress?.(100);

    /* ── 10. Release backing stores ─────────────────────────────────────── */
    closeImage(source);
    releaseCanvas(work.canvas);
    releaseCanvas(maskWork.canvas);
    releaseCanvas(maskFull.canvas);
    releaseCanvas(cutout.canvas);

    return {
      originalBlob: image,
      maskBlob,
      resultBlob,
      width: fullW,
      height: fullH,
      processingTimeMs: performance.now() - startTime,
    };
  }

  dispose(): void {
    /* Canvases are released per-process; nothing is retained between runs. */
  }
}

/* ── Factory ──────────────────────────────────────────────────────────────── */

let _instance: BackgroundRemoverService | null = null;

/**
 * Get the singleton background remover service.
 *
 * Swap the implementation by changing which class is instantiated here.
 * No UI changes required.
 */
export function getBackgroundRemoverService(): BackgroundRemoverService {
  if (!_instance) {
    _instance = new CanvasBackgroundRemover();
  }
  return _instance;
}

/**
 * Allow replacing the service at runtime (e.g., after model download).
 */
export function setBackgroundRemoverService(service: BackgroundRemoverService): void {
  _instance?.dispose();
  _instance = service;
}
