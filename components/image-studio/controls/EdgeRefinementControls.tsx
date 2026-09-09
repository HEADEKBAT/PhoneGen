'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useImageStudioStore } from '@/lib/stores/imageStudio';
import { useTranslations } from '@/lib/i18n/useTranslations';

/* ─── Collapsible Section ──────────────────────────────────────────────────── */

function CollapsibleSection({
  title,
  defaultOpen = true,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  // Fixed id: the title is translated, so deriving the id from it would give a
  // different aria-controls target in every locale.
  const contentId = 'edge-refinement-content';

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3" role="region" aria-label={title}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={contentId}
        className="flex items-center justify-between w-full"
      >
        <h4 className="text-xs font-semibold text-foreground">{title}</h4>
        {open ? (
          <ChevronUp size={14} className="text-muted-foreground shrink-0" />
        ) : (
          <ChevronDown size={14} className="text-muted-foreground shrink-0" />
        )}
      </button>
      {open && <div id={contentId}>{children}</div>}
    </div>
  );
}

/* ─── Slider Row ──────────────────────────────────────────────────────────────── */

function SliderRow({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  suffix = '',
  onChange,
}: {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
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
        step={step}
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

export default function EdgeRefinementControls() {
  const { t } = useTranslations();
  const { edgeRefinement, setEdgeRefinement } = useImageStudioStore();

  return (
    <CollapsibleSection title={t('imageStudio.edgeTitle')}>
      <div className="space-y-3">
        <SliderRow
          label={t('imageStudio.edgeSmooth')}
          value={edgeRefinement.smooth}
          max={100}
          onChange={(smooth) => setEdgeRefinement({ smooth })}
        />

        <SliderRow
          label={t('imageStudio.edgeFeather')}
          value={edgeRefinement.feather}
          max={50}
          onChange={(feather) => setEdgeRefinement({ feather })}
        />

        <SliderRow
          label={t('imageStudio.edgeExpand')}
          value={edgeRefinement.expand}
          min={-50}
          max={50}
          onChange={(expand) => setEdgeRefinement({ expand })}
        />

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={edgeRefinement.hairDetail}
            onChange={(e) => setEdgeRefinement({ hairDetail: e.target.checked })}
            className="size-3.5 rounded border-border accent-primary"
          />
          <span className="text-xs text-muted-foreground">{t('imageStudio.edgeHairDetail')}</span>
        </label>
      </div>
    </CollapsibleSection>
  );
}
