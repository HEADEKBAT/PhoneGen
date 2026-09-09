'use client';

import { RefreshCw } from 'lucide-react';
import { useImageStudioStore } from '@/lib/stores/imageStudio';
import { useTranslations } from '@/lib/i18n/useTranslations';
import type { ProcessQuality } from '@/lib/image-studio/types';
import { cn } from '@/lib/utils';

/* ─── Quality presets ─────────────────────────────────────────────────────── */

const QUALITY_OPTIONS: { value: ProcessQuality; labelKey: string; descKey: string }[] = [
  { value: 'fast', labelKey: 'imageStudio.qualityFast', descKey: 'imageStudio.qualityFastDesc' },
  { value: 'balanced', labelKey: 'imageStudio.qualityBalanced', descKey: 'imageStudio.qualityBalancedDesc' },
  { value: 'high-quality', labelKey: 'imageStudio.qualityHigh', descKey: 'imageStudio.qualityHighDesc' },
];

/* ─── Props ────────────────────────────────────────────────────────────────── */

interface QualityControlsProps {
  onReprocess: () => void;
  isProcessing?: boolean;
}

/* ─── Component ────────────────────────────────────────────────────────────── */

export default function QualityControls({ onReprocess, isProcessing }: QualityControlsProps) {
  const { t } = useTranslations();
  const { processQuality, setProcessQuality, tolerance, setTolerance } = useImageStudioStore();

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
      <h4 className="text-xs font-semibold text-foreground">{t('imageStudio.qualityTitle')}</h4>

      {/* Quality preset buttons */}
      <div className="flex gap-1 p-1 rounded-lg bg-muted/50 border border-border">
        {QUALITY_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setProcessQuality(opt.value)}
            className={cn(
              'flex-1 px-2 py-1.5 text-[11px] font-medium rounded-md transition-all',
              processQuality === opt.value
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
            title={t(opt.descKey)}
          >
            {t(opt.labelKey)}
          </button>
        ))}
      </div>

      {/* Tolerance slider */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-muted-foreground" htmlFor="tolerance-slider">
            {t('imageStudio.tolerance')}
          </label>
          <span className="text-xs text-muted-foreground tabular-nums">{tolerance}%</span>
        </div>
        <input
          id="tolerance-slider"
          type="range"
          aria-label={t('imageStudio.toleranceAria')}
          aria-valuenow={tolerance}
          aria-valuemin={5}
          aria-valuemax={90}
          min={5}
          max={90}
          value={tolerance}
          onChange={(e) => setTolerance(Number(e.target.value))}
          className="w-full h-1.5 bg-muted rounded-full appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:size-3.5
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-primary
            [&::-webkit-slider-thumb]:shadow-sm
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-moz-range-thumb]:size-3.5
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-primary
            [&::-moz-range-thumb]:border-0
            [&::-moz-range-thumb]:shadow-sm
            [&::-moz-range-thumb]:cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>{t('imageStudio.toleranceLess')}</span>
          <span>{t('imageStudio.toleranceMore')}</span>
        </div>
      </div>

      {/* Reprocess button */}
      <button
        type="button"
        onClick={onReprocess}
        disabled={isProcessing}
        className={cn(
          'w-full inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium rounded-lg transition-all',
          isProcessing
            ? 'bg-muted text-muted-foreground cursor-not-allowed'
            : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm',
        )}
      >
        <RefreshCw size={14} className={cn(isProcessing && 'animate-spin')} />
        {isProcessing ? t('imageStudio.reprocessing') : t('imageStudio.reprocess')}
      </button>
    </div>
  );
}
