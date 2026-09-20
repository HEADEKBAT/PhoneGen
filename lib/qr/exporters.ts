/**
 * QR Studio — downloads.
 *
 * Raster and SVG come from the drawing library; PDF and EPS are written from
 * the module matrix by `./vector`, which is the only way either of them can be
 * what its extension says. Before this, both were PNG bytes with the extension
 * changed on the way out.
 */

import { buildMatrix } from './matrix';
import { effectiveErrorCorrection } from './readiness';
import { buildEPS, buildPDF } from './vector';
import { exportQRToFormat } from './generator';
import type { ExportFormat, QROptions } from './types';

export const EXPORT_FORMATS: ExportFormat[] = ['png', 'svg', 'pdf', 'eps', 'webp', 'jpeg'];

/** The two that carry a physical size and drop the logo. */
export const VECTOR_FORMATS: ExportFormat[] = ['pdf', 'eps'];

export const EXPORT_FORMAT_LABELS: Record<ExportFormat, string> = {
  png: 'PNG',
  svg: 'SVG',
  pdf: 'PDF',
  eps: 'EPS',
  webp: 'WEBP',
  jpeg: 'JPEG',
};

export const EXPORT_FORMAT_MIME: Record<ExportFormat, string> = {
  png: 'image/png',
  svg: 'image/svg+xml',
  pdf: 'application/pdf',
  eps: 'application/postscript',
  webp: 'image/webp',
  jpeg: 'image/jpeg',
};

export const EXPORT_FORMAT_EXTENSIONS: Record<ExportFormat, string> = {
  png: 'png',
  svg: 'svg',
  pdf: 'pdf',
  eps: 'eps',
  webp: 'webp',
  jpeg: 'jpg',
};

export interface ExportRequest {
  format: ExportFormat;
  /** Pixels per side, for the raster formats. */
  size?: number;
  /** Millimetres per side, for PDF and EPS. */
  widthMm?: number;
  /** Without an extension — this function adds it. */
  filename?: string;
}

export async function buildExportBlob(
  options: QROptions,
  request: ExportRequest,
): Promise<Blob> {
  const { format, size = 1024, widthMm = 30 } = request;

  if (format === 'pdf' || format === 'eps') {
    const ec = effectiveErrorCorrection(options);
    const matrix = buildMatrix(options.content, ec);
    if (!matrix) throw new Error('Nothing to export: the payload does not encode');

    const vectorOptions = {
      widthMm,
      quietZone: options.quietZone,
      foreground: options.colors.pattern,
      background:
        options.background.type === 'transparent'
          ? null
          : options.background.type === 'solid'
            ? options.background.value
            : options.colors.background,
    };

    if (format === 'eps') {
      return new Blob([buildEPS(matrix, vectorOptions)], { type: EXPORT_FORMAT_MIME.eps });
    }

    const bytes = buildPDF(matrix, vectorOptions);
    return new Blob([bytes as unknown as BlobPart], { type: EXPORT_FORMAT_MIME.pdf });
  }

  return exportQRToFormat(options, format, size);
}

export async function exportQR(options: QROptions, request: ExportRequest): Promise<void> {
  const blob = await buildExportBlob(options, request);
  /* The caller used to pass `${filename}.${format}` and this function appended
     the extension again, so every download arrived as `qr-code-url.png.png`. */
  const name = (request.filename || 'qr-code').replace(/\.[a-z0-9]+$/i, '');
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `${name}.${EXPORT_FORMAT_EXTENSIONS[request.format]}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
