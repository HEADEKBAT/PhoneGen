'use client';

import type { MaskConfig } from '@/lib/color-studio/types';

interface GradientMaskControlProps {
  mask: MaskConfig | null;
  onChange: (mask: MaskConfig | null) => void;
}

const MASK_TYPES: { value: MaskConfig['type']; label: string }[] = [
  { value: 'top-fade', label: 'Top Fade' },
  { value: 'bottom-fade', label: 'Bottom Fade' },
  { value: 'left-fade', label: 'Left Fade' },
  { value: 'right-fade', label: 'Right Fade' },
  { value: 'circle', label: 'Circle' },
  { value: 'ellipse', label: 'Ellipse' },
  { value: 'spotlight', label: 'Spotlight' },
  { value: 'text', label: 'Text' },
];

export function GradientMaskControl({ mask, onChange }: GradientMaskControlProps) {
  const active = mask?.type ?? null;

  const selectType = (type: MaskConfig['type']) => {
    if (active === type) {
      onChange(null);
    } else {
      onChange({ type, size: 50, softness: 50 });
    }
  };

  const update = (partial: Partial<MaskConfig>) => {
    if (!mask) return;
    onChange({ ...mask, ...partial });
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-muted-foreground">Mask</label>
      <div className="grid grid-cols-4 gap-1">
        {MASK_TYPES.map(({ value: type, label }) => (
          <button
            key={type}
            type="button"
            onClick={() => selectType(type)}
            className={`px-1 py-1.5 text-[10px] font-medium rounded-md border transition-colors ${
              active === type
                ? 'bg-primary/10 border-primary text-primary'
                : 'bg-card border-border/50 text-muted-foreground hover:border-border hover:text-foreground'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {mask && (
        <div className="space-y-2 pl-2 border-l-2 border-border/30">
          <div className="space-y-1">
            <label className="text-[10px] font-medium text-muted-foreground">
              Size: {mask.size}%
            </label>
            <input
              type="range"
              min={0}
              max={100}
              value={mask.size}
              onChange={(e) => update({ size: parseInt(e.target.value) })}
              className="w-full h-1 accent-primary"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-medium text-muted-foreground">
              Softness: {mask.softness}%
            </label>
            <input
              type="range"
              min={0}
              max={100}
              value={mask.softness}
              onChange={(e) => update({ softness: parseInt(e.target.value) })}
              className="w-full h-1 accent-primary"
            />
          </div>
        </div>
      )}
    </div>
  );
}
