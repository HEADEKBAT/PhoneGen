'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useImageStudioStore } from '@/lib/stores/imageStudio';
import { PRODUCT_PRESETS } from '@/lib/image-studio/presets';
import { trackStudioEvent } from '@/lib/image-studio/analytics';
import { useTranslations } from '@/lib/i18n/useTranslations';
import type { ProductPreset } from '@/lib/image-studio/types';
import { cn } from '@/lib/utils';

const VISIBLE_COUNT = 4;

export default function ProductPresetsGrid() {
  const { t } = useTranslations();
  const { selectedProductPreset, setSelectedProductPreset, setBackground, setExportFormat, setExportQuality } =
    useImageStudioStore();
  const [open, setOpen] = useState(true);
  const [showAll, setShowAll] = useState(false);

  const displayed = showAll ? PRODUCT_PRESETS : PRODUCT_PRESETS.slice(0, VISIBLE_COUNT);
  const selected = PRODUCT_PRESETS.find((p) => p.id === selectedProductPreset);

  const handleSelect = (preset: ProductPreset) => {
    if (selectedProductPreset === preset.id) {
      // Deselect — back to the source dimensions.
      setSelectedProductPreset(null);
      return;
    }
    setSelectedProductPreset(preset.id);
    setBackground(preset.background);
    setExportFormat(preset.format);
    setExportQuality(preset.quality);

    trackStudioEvent({
      type: 'preset_applied',
      payload: { presetId: preset.id, type: 'product' },
    });
  };

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full"
      >
        <h4 className="text-xs font-semibold text-foreground">{t('imageStudio.productPresets')}</h4>
        {open ? (
          <ChevronUp size={14} className="text-muted-foreground shrink-0" />
        ) : (
          <ChevronDown size={14} className="text-muted-foreground shrink-0" />
        )}
      </button>

      {open && (
        <div className="space-y-3">
          {/* Preset grid */}
          <div className="flex flex-wrap gap-1.5">
            {displayed.map((preset) => (
              <button
                key={preset.id}
                type="button"
                aria-pressed={selectedProductPreset === preset.id}
                onClick={() => handleSelect(preset)}
                className={cn(
                  'px-2.5 py-1.5 text-[11px] font-medium rounded-lg border transition-colors',
                  selectedProductPreset === preset.id
                    ? 'bg-primary/10 text-primary border-primary/30'
                    : 'bg-card text-muted-foreground border-border hover:text-foreground hover:border-muted-foreground/30',
                )}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Show more / less */}
          {PRODUCT_PRESETS.length > VISIBLE_COUNT && (
            <button
              type="button"
              onClick={() => setShowAll(!showAll)}
              className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
            >
              {showAll
                ? t('imageStudio.presetsShowLess')
                : t('imageStudio.presetsShowAll', { count: PRODUCT_PRESETS.length })}
              {showAll ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>
          )}

          {/* Selected preset details */}
          {selected && (
            <div className="text-[11px] text-muted-foreground border-t border-border pt-2">
              {selected.size.width}×{selected.size.height} &middot;{' '}
              {selected.format.toUpperCase()} &middot;{' '}
              {t('imageStudio.presetQuality', { quality: selected.quality })}
              {selected.padding > 0 &&
                ` · ${t('imageStudio.presetPadding', { padding: selected.padding })}`}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
