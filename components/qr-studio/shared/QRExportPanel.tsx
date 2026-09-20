'use client';

import { useMemo, useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { exportQR, EXPORT_FORMAT_LABELS, VECTOR_FORMATS } from '@/lib/qr/exporters';
import { analyseReadiness } from '@/lib/qr/readiness';
import type { ExportFormat, QROptions } from '@/lib/qr/types';
import { useTranslations } from '@/lib/i18n';

const FORMATS: ExportFormat[] = ['png', 'svg', 'webp', 'jpeg', 'pdf', 'eps'];
const PIXEL_SIZES = [256, 512, 1024, 2048];
/** Millimetre widths that cover a business card, a poster and everything between. */
const PRINT_WIDTHS = [20, 30, 50, 100];

interface QRExportPanelProps {
  options: QROptions;
  filename?: string;
}

/**
 * Download, with the one number that decides whether the print works.
 *
 * A raster export asks for pixels, which is the right question for a screen
 * and a useless one for a press. PDF and EPS ask for millimetres instead, and
 * the panel says what the smallest honest width is for this symbol: modules
 * have to survive the printer, and below roughly four printer dots per module
 * their edges break up whatever the file format says.
 */
export default function QRExportPanel({ options, filename = 'qr-code' }: QRExportPanelProps) {
  const { t } = useTranslations();
  const [format, setFormat] = useState<ExportFormat>('png');
  const [size, setSize] = useState(1024);
  const [widthMm, setWidthMm] = useState(30);
  const [exporting, setExporting] = useState(false);
  const [failed, setFailed] = useState(false);

  const isVector = VECTOR_FORMATS.includes(format);
  const readiness = useMemo(
    () => analyseReadiness(options, { widthMm }),
    [options, widthMm],
  );

  const handleExport = async () => {
    if (!options.content) return;
    setExporting(true);
    setFailed(false);
    try {
      await exportQR(options, { format, size, widthMm, filename });
    } catch {
      setFailed(true);
    } finally {
      setExporting(false);
    }
  };

  const chip = (active: boolean) =>
    `rounded-xl border py-2 text-xs font-medium transition-colors ${
      active
        ? 'border-action bg-action-soft text-action'
        : 'border-border text-muted-foreground hover:border-muted-foreground/30 hover:bg-muted/20'
    }`;

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1.5 ml-1 block text-xs font-medium text-muted-foreground">
          {t('qrStudio.export.format')}
        </label>
        <div className="grid grid-cols-3 gap-2">
          {FORMATS.map((value) => (
            <button key={value} type="button" onClick={() => setFormat(value)} className={chip(format === value)}>
              {EXPORT_FORMAT_LABELS[value]}
            </button>
          ))}
        </div>
      </div>

      {isVector ? (
        <div>
          <label className="mb-1.5 ml-1 block text-xs font-medium text-muted-foreground">
            {t('qrStudio.export.printWidth')}
          </label>
          <div className="grid grid-cols-4 gap-2">
            {PRINT_WIDTHS.map((value) => (
              <button key={value} type="button" onClick={() => setWidthMm(value)} className={chip(widthMm === value)}>
                {value} mm
              </button>
            ))}
          </div>
          <p className="mt-2 text-[0.6875rem] leading-relaxed text-muted-foreground">
            {t('qrStudio.export.minWidth', {
              min: String(Math.ceil(readiness.print.minWidthMm)),
              module: readiness.print.moduleMm.toFixed(2),
            })}
          </p>
        </div>
      ) : (
        <div>
          <label className="mb-1.5 ml-1 block text-xs font-medium text-muted-foreground">
            {t('qrStudio.export.size')}
          </label>
          <div className="grid grid-cols-4 gap-2">
            {PIXEL_SIZES.map((value) => (
              <button key={value} type="button" onClick={() => setSize(value)} className={chip(size === value)}>
                {value}
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={handleExport}
        disabled={!options.content || exporting}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-action py-2.5 text-sm font-semibold text-white transition-[filter,transform] duration-200 hover:brightness-105 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
      >
        {exporting ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
        {exporting
          ? t('qrStudio.export.working')
          : t('qrStudio.export.download', { format: EXPORT_FORMAT_LABELS[format] })}
      </button>

      {failed && (
        <p className="text-center text-[0.6875rem] text-destructive">
          {t('qrStudio.export.failed')}
        </p>
      )}

      <p className="text-[0.6875rem] leading-relaxed text-muted-foreground">
        {isVector
          ? t('qrStudio.export.vectorNote')
          : format === 'png' || format === 'webp'
            ? t('qrStudio.export.alphaNote')
            : t('qrStudio.export.rasterNote')}
      </p>
    </div>
  );
}
