'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useImageStudioStore } from '@/lib/stores/imageStudio';
import { useTranslations } from '@/lib/i18n/useTranslations';
import type { ShadowType, ShadowSettings } from '@/lib/image-studio/types';
import { cn } from '@/lib/utils';

/* ─── Constants ──────────────────────────────────────────────────────────────── */

const SHADOW_TYPES: { type: ShadowType; labelKey: string }[] = [
  { type: 'soft', labelKey: 'imageStudio.shadowSoft' },
  { type: 'hard', labelKey: 'imageStudio.shadowHard' },
  { type: 'floating', labelKey: 'imageStudio.shadowFloating' },
  { type: 'studio', labelKey: 'imageStudio.shadowStudio' },
  { type: 'natural', labelKey: 'imageStudio.shadowNatural' },
  { type: 'long', labelKey: 'imageStudio.shadowLong' },
];

const DEFAULT_SHADOW: ShadowSettings = {
  type: 'soft',
  distance: 10,
  angle: 45,
  blur: 15,
  opacity: 30,
};

/* ─── Slider Row ──────────────────────────────────────────────────────────────── */

function SliderRow({
  label,
  value,
  min = 0,
  max = 100,
  suffix = '',
  onChange,
}: {
  label: string;
  value: number;
  min?: number;
  max?: number;
  suffix?: string;
  onChange: (value: number) => void;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-muted-foreground">{label}</label>
        <span className="text-xs text-muted-foreground tabular-nums">
          {value}{suffix}
        </span>
      </div>
      <input
        type="range"
        aria-label={label}
        aria-valuenow={value}
        aria-valuemin={min}
        aria-valuemax={max}
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
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
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────────────── */

export default function ShadowControls() {
  const { t } = useTranslations();
  const { shadow, setShadow } = useImageStudioStore();
  const [open, setOpen] = useState(true);

  const isEnabled = shadow !== null;

  const handleToggle = () => {
    if (isEnabled) {
      setShadow(null);
    } else {
      setShadow(DEFAULT_SHADOW);
    }
  };

  const updateShadow = (partial: Partial<ShadowSettings>) => {
    if (shadow) {
      setShadow({ ...shadow, ...partial });
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3" role="region" aria-label={t('imageStudio.shadowTitle')}>
      <div className="flex items-center justify-between w-full">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="shadow-controls-content"
          className="flex items-center gap-2"
        >
          <h4 className="text-xs font-semibold text-foreground">{t('imageStudio.shadowTitle')}</h4>
          {open ? (
            <ChevronUp size={14} className="text-muted-foreground" />
          ) : (
            <ChevronDown size={14} className="text-muted-foreground" />
          )}
        </button>

        <button
          type="button"
          onClick={handleToggle}
          aria-pressed={isEnabled}
          className={cn(
            'px-2.5 py-1 text-[10px] font-semibold rounded-full border transition-colors',
            isEnabled
              ? 'bg-primary/10 border-primary text-primary'
              : 'bg-card border-border/50 text-muted-foreground',
          )}
        >
          {isEnabled ? t('imageStudio.shadowOn') : t('imageStudio.shadowOff')}
        </button>
      </div>

      {open && (
        <div id="shadow-controls-content" className={cn('space-y-3', isEnabled ? 'pl-2 border-l-2 border-border/30' : '')}>
          {isEnabled ? (
            <>
              {/* Shadow type grid */}
              <div className="grid grid-cols-3 gap-1" role="radiogroup" aria-label={t('imageStudio.shadowTypeAria')}>
                {SHADOW_TYPES.map((st) => (
                  <button
                    key={st.type}
                    type="button"
                    role="radio"
                    aria-checked={shadow.type === st.type}
                    aria-label={t(st.labelKey)}
                    onClick={() => updateShadow({ type: st.type })}
                    className={cn(
                      'text-[11px] font-medium rounded-lg border px-2 py-1.5 transition-colors',
                      shadow.type === st.type
                        ? 'bg-primary/10 border-primary text-primary'
                        : 'bg-card border-border/50 text-muted-foreground hover:text-foreground hover:border-muted-foreground/30',
                    )}
                  >
                    {t(st.labelKey)}
                  </button>
                ))}
              </div>

              {/* Shadow parameters */}
              <SliderRow
                label={t('imageStudio.shadowDistance')}
                value={shadow.distance}
                max={100}
                onChange={(distance) => updateShadow({ distance })}
              />
              <SliderRow
                label={t('imageStudio.shadowAngle')}
                value={shadow.angle}
                max={360}
                suffix="°"
                onChange={(angle) => updateShadow({ angle })}
              />
              <SliderRow
                label={t('imageStudio.shadowBlur')}
                value={shadow.blur}
                max={50}
                onChange={(blur) => updateShadow({ blur })}
              />
              <SliderRow
                label={t('imageStudio.shadowOpacity')}
                value={shadow.opacity}
                max={100}
                suffix="%"
                onChange={(opacity) => updateShadow({ opacity })}
              />
            </>
          ) : (
            <p className="text-[11px] text-muted-foreground">
              {t('imageStudio.shadowHint')}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
