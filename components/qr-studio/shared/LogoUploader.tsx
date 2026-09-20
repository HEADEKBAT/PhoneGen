'use client';

import { useRef, useState } from 'react';
import { AlertTriangle, Upload, X } from 'lucide-react';
import { MAX_LOGO_COVERAGE, maxLogoSide } from '@/lib/qr/matrix';
import type { ErrorCorrection } from '@/lib/qr/types';
import { useTranslations } from '@/lib/i18n';

interface LogoUploaderProps {
  logo?: { dataUrl: string; size: number };
  onChange: (logo: { dataUrl: string; size: number } | undefined) => void;
  /** The level the symbol will actually be built at — H whenever a logo is set. */
  errorCorrection?: ErrorCorrection;
}

const MAX_BYTES = 2 * 1024 * 1024;

/**
 * The logo, and how much of the code it is allowed to eat.
 *
 * ── The number this control reports ─────────────────────────────────────────
 *
 * `size` is the logo's side as a percentage of the symbol's width, and the
 * slider sets it. It used to be computed as `img.width / 100 × 100` — which is
 * the logo's width in pixels, wearing a percent sign. A 512-pixel logo
 * reported "~512% of QR module", and downstream `Math.min(512 / 300, 0.3)`
 * clamped every real logo to the same maximum coverage regardless of what was
 * uploaded. The user had no control at all, and the warning about oversizing
 * fired for any image wider than about 36 pixels, which is all of them.
 *
 * The ceiling is the level's, from `MAX_LOGO_COVERAGE`: area, not width, so
 * the slider's maximum is the square root of it. At H that is 20% of the
 * symbol covered, or a side of about 45%.
 */
export default function LogoUploader({ logo, onChange, errorCorrection = 'H' }: LogoUploaderProps) {
  const { t } = useTranslations();
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const maxSide = Math.round(maxLogoSide(errorCorrection) * 100);
  const coverage = logo ? Math.round((logo.size / 100) ** 2 * 100) : 0;
  const oversized = logo ? logo.size > maxSide : false;

  const handleFile = (file: File) => {
    setError(null);

    if (!file.type.startsWith('image/')) {
      setError(t('qrStudio.logo.notImage'));
      return;
    }
    if (file.size > MAX_BYTES) {
      setError(t('qrStudio.logo.tooHeavy'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      /* The image's own dimensions are irrelevant: it is scaled to whatever
         share of the symbol the slider says. Starting at two thirds of the
         allowance leaves room to grow without starting out unscannable. */
      onChange({ dataUrl, size: logo?.size ?? Math.round(maxSide * 0.66) });
    };
    reader.onerror = () => setError(t('qrStudio.logo.unreadable'));
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-3">
      {logo ? (
        <>
          <div className="flex items-center gap-3 rounded-xl border border-border bg-background p-3">
            <div className="size-12 shrink-0 overflow-hidden rounded-lg border border-border bg-white p-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logo.dataUrl} alt="" className="size-full object-contain" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-foreground">
                {t('qrStudio.logo.uploaded')}
              </p>
              <p className="font-mono text-[0.625rem] text-muted-foreground">
                {t('qrStudio.logo.coverage', {
                  side: String(logo.size),
                  coverage: String(coverage),
                })}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onChange(undefined)}
              aria-label={t('qrStudio.logo.remove')}
              className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-muted-foreground">
                {t('qrStudio.logo.size')}
              </label>
              <span className="font-mono text-xs text-muted-foreground">{logo.size}%</span>
            </div>
            <input
              type="range"
              min={5}
              max={60}
              step={1}
              value={logo.size}
              onChange={(event) => onChange({ ...logo, size: Number(event.target.value) })}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-border accent-action [&::-webkit-slider-thumb]:size-3.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-action"
            />
            <p className="text-[0.625rem] text-muted-foreground">
              {t('qrStudio.logo.budget', {
                level: errorCorrection,
                maxSide: String(maxSide),
                maxCoverage: String(Math.round(MAX_LOGO_COVERAGE[errorCorrection] * 100)),
              })}
            </p>
          </div>
        </>
      ) : (
        <div
          onDragOver={(event) => {
            event.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragOver(false);
            const file = event.dataTransfer.files[0];
            if (file) handleFile(file);
          }}
          onClick={() => inputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed p-6 transition-colors ${
            dragOver
              ? 'border-action bg-action-soft'
              : 'border-border hover:border-muted-foreground/30 hover:bg-muted/20'
          }`}
        >
          <Upload className="size-6 text-muted-foreground" />
          <p className="text-center text-xs text-muted-foreground">{t('qrStudio.logo.drop')}</p>
          <p className="text-[0.625rem] text-muted-foreground">{t('qrStudio.logo.limits')}</p>
        </div>
      )}

      {oversized && (
        <div className="flex items-start gap-2 rounded-lg border border-amber-500/20 bg-amber-500/10 p-2">
          <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-amber-500" />
          <p className="text-[0.6875rem] text-amber-600 dark:text-amber-500">
            {t('qrStudio.logo.oversized', { level: errorCorrection, maxSide: String(maxSide) })}
          </p>
        </div>
      )}

      {error && <p className="text-[0.6875rem] text-destructive">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
    </div>
  );
}
