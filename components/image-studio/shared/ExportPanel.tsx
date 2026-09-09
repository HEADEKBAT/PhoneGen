'use client';

import { useMemo, useState } from 'react';
import { AlertTriangle, Download, Loader2 } from 'lucide-react';
import { useImageStudioStore } from '@/lib/stores/imageStudio';
import { useTranslations } from '@/lib/i18n/useTranslations';
import type { ImageExportFormat } from '@/lib/image-studio/types';
import {
  canEncode,
  downloadBlob,
  formatBytes,
  FORMAT_SPECS,
  type EncodeResult,
} from '@/lib/image-studio/exporter';
import { cn } from '@/lib/utils';

const FORMATS: { value: ImageExportFormat; label: string }[] = [
  { value: 'png', label: 'PNG' },
  { value: 'webp', label: 'WEBP' },
  { value: 'jpeg', label: 'JPEG' },
  { value: 'avif', label: 'AVIF' },
];

interface ExportPanelProps {
  /** Name without extension. */
  fileName?: string;
  /**
   * Renders and encodes the current composite. Returning null means there is
   * nothing to export yet (no processed image).
   */
  onExport: (format: ImageExportFormat, quality: number) => Promise<EncodeResult | null>;
  disabled?: boolean;
  className?: string;
}

export function ExportPanel({
  fileName = 'image',
  onExport,
  disabled = false,
  className = '',
}: ExportPanelProps) {
  const { t } = useTranslations();
  const { exportFormat, exportQuality, setExportFormat, setExportQuality, background } =
    useImageStudioStore();

  const [busy, setBusy] = useState(false);
  const [lastResult, setLastResult] = useState<EncodeResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Probed once per browser; unsupported encoders are disabled rather than
  // silently producing a PNG with the wrong extension.
  const availability = useMemo(
    () => Object.fromEntries(FORMATS.map((f) => [f.value, canEncode(f.value)])) as
      Record<ImageExportFormat, boolean>,
    [],
  );

  const spec = FORMAT_SPECS[exportFormat];
  const willFlatten = !spec.supportsAlpha && background.type === 'transparent';

  const handleDownload = async () => {
    if (disabled || busy) return;
    setBusy(true);
    setError(null);
    try {
      const result = await onExport(exportFormat, exportQuality);
      if (!result) {
        setError(t('imageStudio.exportNothing'));
        return;
      }
      setLastResult(result);
      downloadBlob(result.blob, `${fileName}.${result.extension}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('imageStudio.exportFailed'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Format selector */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-foreground">{t('imageStudio.exportFormat')}</p>
        <div
          className="flex gap-1 p-1 rounded-lg bg-muted/50 border border-border"
          role="radiogroup"
          aria-label={t('imageStudio.exportFormatAria')}
        >
          {FORMATS.map((fmt) => {
            const supported = availability[fmt.value];
            return (
              <button
                key={fmt.value}
                type="button"
                role="radio"
                aria-checked={exportFormat === fmt.value}
                aria-label={
                  supported
                    ? fmt.label
                    : t('imageStudio.exportUnsupported', { format: fmt.label })
                }
                disabled={!supported}
                title={
                  supported
                    ? undefined
                    : t('imageStudio.exportUnsupported', { format: fmt.label })
                }
                onClick={() => setExportFormat(fmt.value)}
                className={cn(
                  'flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-all',
                  !supported && 'opacity-40 cursor-not-allowed',
                  exportFormat === fmt.value
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {fmt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quality slider — meaningless for PNG, so it is hidden there */}
      {spec.lossy && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-foreground">{t('imageStudio.exportQuality')}</p>
            <span className="text-xs text-muted-foreground tabular-nums">
              {exportQuality}%
            </span>
          </div>
          <input
            type="range"
            aria-label={t('imageStudio.exportQualityAria')}
            aria-valuenow={exportQuality}
            aria-valuemin={1}
            aria-valuemax={100}
            min={1}
            max={100}
            value={exportQuality}
            onChange={(e) => setExportQuality(Number(e.target.value))}
            className="w-full h-1.5 bg-muted rounded-full appearance-none cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:size-4
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-primary
              [&::-webkit-slider-thumb]:shadow-sm
              [&::-webkit-slider-thumb]:cursor-pointer
              [&::-moz-range-thumb]:size-4
              [&::-moz-range-thumb]:rounded-full
              [&::-moz-range-thumb]:bg-primary
              [&::-moz-range-thumb]:border-0
              [&::-moz-range-thumb]:shadow-sm
              [&::-moz-range-thumb]:cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>{t('imageStudio.exportSmaller')}</span>
            <span>{t('imageStudio.exportBetter')}</span>
          </div>
        </div>
      )}

      {/* Alpha warning — JPEG cannot carry the transparent background */}
      {willFlatten && (
        <p className="flex items-start gap-1.5 text-[11px] text-amber-600 dark:text-amber-400">
          <AlertTriangle size={12} className="mt-0.5 shrink-0" />
          <span>{t('imageStudio.exportJpegWarning')}</span>
        </p>
      )}

      {/* Download button */}
      <button
        type="button"
        onClick={handleDownload}
        disabled={disabled || busy}
        className={cn(
          'w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all',
          disabled || busy
            ? 'bg-muted text-muted-foreground cursor-not-allowed'
            : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm',
        )}
      >
        {busy ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
        {busy
          ? t('imageStudio.exportEncoding')
          : t('imageStudio.exportButton', { format: spec.extension.toUpperCase() })}
      </button>

      {/* Result / error line */}
      {error ? (
        <p className="text-[11px] text-destructive text-center">{error}</p>
      ) : lastResult ? (
        <p className="text-[10px] text-muted-foreground text-center">
          {fileName}.{lastResult.extension} · {formatBytes(lastResult.bytes)}
          {lastResult.fellBack &&
            ` · ${t('imageStudio.exportFellBack', {
              format: lastResult.format.toUpperCase(),
              requested: exportFormat.toUpperCase(),
            })}`}
        </p>
      ) : (
        <p className="text-[10px] text-muted-foreground text-center">
          {fileName}.{spec.extension}
        </p>
      )}
    </div>
  );
}
