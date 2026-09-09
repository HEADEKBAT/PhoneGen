/**
 * QR Studio — Export utilities.
 *
 * Handles exporting QR codes in multiple formats: PNG, SVG, PDF, EPS, WEBP, JPEG.
 */

import type { ExportFormat, QROptions } from './types';
import { exportQRToFormat, exportQRToSVG } from './generator';

export const EXPORT_FORMATS: ExportFormat[] = ['png', 'svg', 'pdf', 'eps', 'webp', 'jpeg'];

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

export async function exportQR(
  options: QROptions,
  format: ExportFormat,
  filename: string = 'qrcode',
  size: number = 400,
): Promise<void> {
  const blob = await exportQRToFormat(options, format, size);
  const ext = EXPORT_FORMAT_EXTENSIONS[format];
  const mime = EXPORT_FORMAT_MIME[format];

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.${ext}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function exportQRToBlob(
  options: QROptions,
  format: ExportFormat,
  size: number = 400,
): Promise<Blob> {
  return exportQRToFormat(options, format, size);
}

export function getExportMimeType(format: ExportFormat): string {
  return EXPORT_FORMAT_MIME[format];
}

export function getExportExtension(format: ExportFormat): string {
  return EXPORT_FORMAT_EXTENSIONS[format];
}
