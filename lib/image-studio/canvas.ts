/**
 * Image Studio — Canvas helpers
 *
 * Small browser-only utilities shared by the segmentation engine, the
 * compositor and the exporter. Kept dependency-free and side-effect-free so
 * every consumer can be lazily imported.
 */

/* ── Canvas creation ──────────────────────────────────────────────────────── */

export interface Canvas2D {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
}

/**
 * Create a detached canvas of the given size with a 2D context.
 *
 * `willReadFrequently` is opt-in: it selects a CPU-backed surface, which is
 * much faster for `getImageData` loops but slower for `drawImage` compositing.
 */
export function createCanvas(
  width: number,
  height: number,
  willReadFrequently = false,
): Canvas2D {
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));
  const ctx = canvas.getContext('2d', { willReadFrequently });
  if (!ctx) throw new Error('Canvas 2D context is not available in this browser.');
  return { canvas, ctx };
}

/** Release a canvas's backing store. Safari in particular holds onto these. */
export function releaseCanvas(canvas: HTMLCanvasElement): void {
  canvas.width = 0;
  canvas.height = 0;
}

/* ── Decoding ─────────────────────────────────────────────────────────────── */

/**
 * Decode a blob into an ImageBitmap, falling back to an <img> element on
 * browsers where `createImageBitmap` rejects a given format (older Safari
 * with AVIF, for instance).
 */
export async function decodeImage(blob: Blob): Promise<ImageBitmap | HTMLImageElement> {
  if (typeof createImageBitmap === 'function') {
    try {
      return await createImageBitmap(blob);
    } catch {
      /* fall through to the <img> path */
    }
  }

  const url = URL.createObjectURL(blob);
  try {
    return await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Could not decode this image.'));
      img.src = url;
    });
  } finally {
    // The decoded element keeps its own copy of the pixels.
    URL.revokeObjectURL(url);
  }
}

/** Natural pixel size of either decoded representation. */
export function imageSize(source: ImageBitmap | HTMLImageElement): {
  width: number;
  height: number;
} {
  return source instanceof HTMLImageElement
    ? { width: source.naturalWidth, height: source.naturalHeight }
    : { width: source.width, height: source.height };
}

/** Close an ImageBitmap if that is what we are holding. */
export function closeImage(source: ImageBitmap | HTMLImageElement): void {
  if (typeof ImageBitmap !== 'undefined' && source instanceof ImageBitmap) {
    source.close();
  }
}

/* ── Encoding ─────────────────────────────────────────────────────────────── */

/**
 * Promise wrapper around `canvas.toBlob`.
 *
 * `toBlob` yields `null` when the browser cannot encode the requested type;
 * callers are expected to have checked support first (see `exporter.ts`).
 */
export function canvasToBlob(
  canvas: HTMLCanvasElement,
  type = 'image/png',
  quality?: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error(`Browser could not encode the image as ${type}.`));
      },
      type,
      quality,
    );
  });
}

/* ── Scheduling ───────────────────────────────────────────────────────────── */

/**
 * Hand control back to the browser so long pixel loops do not freeze the tab.
 *
 * Uses a macrotask (not `requestAnimationFrame`) so work keeps progressing in
 * a background tab, where rAF is throttled to a standstill.
 */
export function yieldToBrowser(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

/* ── Geometry ─────────────────────────────────────────────────────────────── */

/** Scale factor that fits `width`×`height` inside a square of `maxSide`. */
export function fitScale(width: number, height: number, maxSide: number): number {
  const longest = Math.max(width, height);
  return longest > maxSide ? maxSide / longest : 1;
}

/** Throw if the caller's abort signal has fired. */
export function throwIfAborted(signal?: AbortSignal): void {
  if (signal?.aborted) throw new DOMException('Processing cancelled.', 'AbortError');
}
