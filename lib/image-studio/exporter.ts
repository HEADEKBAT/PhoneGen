/**
 * Image Studio — Exporter
 *
 * Encodes a rendered canvas into the format the user actually picked.
 *
 * The three things this file exists to get right:
 *
 *  1. **Real re-encoding.** Renaming a PNG to `.webp` produces a file that
 *     every image pipeline downstream will reject. Everything goes through
 *     `canvas.toBlob(type, quality)`.
 *
 *  2. **Alpha safety.** JPEG has no alpha channel. Handing a transparent
 *     cutout to a JPEG encoder yields black or white fringing depending on the
 *     browser, so transparency is flattened onto an explicit matte first and
 *     the UI is told it happened.
 *
 *  3. **Format support is not universal.** AVIF encoding is missing in Safari
 *     and older Firefox; WebP is missing on very old Safari. Support is probed
 *     once and the export falls back rather than failing.
 */

import type { ImageExportFormat } from './types';
import { canvasToBlob, createCanvas, releaseCanvas } from './canvas';

/* ── Format metadata ──────────────────────────────────────────────────────── */

interface FormatSpec {
  mime: string;
  extension: string;
  /** Whether the encoder preserves an alpha channel. */
  supportsAlpha: boolean;
  /** Whether the `quality` argument is meaningful. */
  lossy: boolean;
}

export const FORMAT_SPECS: Record<ImageExportFormat, FormatSpec> = {
  png: { mime: 'image/png', extension: 'png', supportsAlpha: true, lossy: false },
  webp: { mime: 'image/webp', extension: 'webp', supportsAlpha: true, lossy: true },
  jpeg: { mime: 'image/jpeg', extension: 'jpg', supportsAlpha: false, lossy: true },
  avif: { mime: 'image/avif', extension: 'avif', supportsAlpha: true, lossy: true },
};

/** Order tried when the requested format is unavailable. */
const FALLBACK_CHAIN: Record<ImageExportFormat, ImageExportFormat[]> = {
  png: [],
  webp: ['png'],
  jpeg: ['png'],
  avif: ['webp', 'png'],
};

/* ── Support detection ────────────────────────────────────────────────────── */

const supportCache = new Map<ImageExportFormat, boolean>();

/**
 * Probe whether this browser can *encode* the format.
 *
 * `toDataURL` silently falls back to PNG for unsupported types, so the check is
 * whether the returned data URL actually carries the requested MIME type.
 */
export function canEncode(format: ImageExportFormat): boolean {
  const cached = supportCache.get(format);
  if (cached !== undefined) return cached;

  let supported = false;
  try {
    const { canvas } = createCanvas(1, 1);
    supported = canvas.toDataURL(FORMAT_SPECS[format].mime).startsWith(
      `data:${FORMAT_SPECS[format].mime}`,
    );
    releaseCanvas(canvas);
  } catch {
    supported = false;
  }

  supportCache.set(format, supported);
  return supported;
}

/** The format that will actually be used, after falling back if necessary. */
export function resolveFormat(format: ImageExportFormat): ImageExportFormat {
  if (canEncode(format)) return format;
  for (const candidate of FALLBACK_CHAIN[format]) {
    if (canEncode(candidate)) return candidate;
  }
  return 'png';
}

/* ── Encoding ─────────────────────────────────────────────────────────────── */

export interface EncodeOptions {
  format: ImageExportFormat;
  /** 1–100; ignored for PNG. */
  quality: number;
  /**
   * Colour painted behind the image when the target format has no alpha.
   * Defaults to white, which is what every marketplace expects.
   */
  matte?: string;
}

export interface EncodeResult {
  blob: Blob;
  /** The format actually used — may differ from the request. */
  format: ImageExportFormat;
  extension: string;
  /** True when the request was downgraded because the browser said no. */
  fellBack: boolean;
  /** True when transparency had to be flattened onto the matte. */
  flattened: boolean;
  bytes: number;
}

/**
 * Encode a canvas, flattening alpha and falling back on format support as
 * needed. The input canvas is not modified.
 */
export async function encodeCanvas(
  canvas: HTMLCanvasElement,
  options: EncodeOptions,
): Promise<EncodeResult> {
  const requested = options.format;
  const format = resolveFormat(requested);
  const spec = FORMAT_SPECS[format];

  const quality = spec.lossy
    ? Math.min(1, Math.max(0.01, options.quality / 100))
    : undefined;

  let target = canvas;
  let flattened = false;

  if (!spec.supportsAlpha) {
    const flat = createCanvas(canvas.width, canvas.height);
    flat.ctx.fillStyle = options.matte ?? '#ffffff';
    flat.ctx.fillRect(0, 0, canvas.width, canvas.height);
    flat.ctx.drawImage(canvas, 0, 0);
    target = flat.canvas;
    flattened = true;
  }

  try {
    const blob = await canvasToBlob(target, spec.mime, quality);
    return {
      blob,
      format,
      extension: spec.extension,
      fellBack: format !== requested,
      flattened,
      bytes: blob.size,
    };
  } finally {
    if (target !== canvas) releaseCanvas(target);
  }
}

/* ── Download ─────────────────────────────────────────────────────────────── */

/**
 * Trigger a browser download for a blob, cleaning up the object URL once the
 * download has been handed off.
 */
export function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  anchor.rel = 'noopener';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);

  // Revoking immediately cancels the download in Firefox; one turn of the
  // event loop is enough for the browser to take ownership of the blob.
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

/* ── Formatting helpers ───────────────────────────────────────────────────── */

/** Human-readable byte size, e.g. "1.4 MB". */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Strip an existing extension so we can append our own. */
export function baseName(fileName: string): string {
  return fileName.replace(/\.[^./\\]+$/, '') || 'image';
}
