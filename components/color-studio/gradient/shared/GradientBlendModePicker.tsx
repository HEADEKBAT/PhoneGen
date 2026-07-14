'use client';

import type { BlendMode } from '@/lib/color-studio/types';

interface GradientBlendModePickerProps {
  value: BlendMode;
  onChange: (mode: BlendMode) => void;
}

const BLEND_MODES: { value: BlendMode; label: string }[] = [
  { value: 'normal', label: 'Normal' },
  { value: 'multiply', label: 'Multiply' },
  { value: 'overlay', label: 'Overlay' },
  { value: 'screen', label: 'Screen' },
  { value: 'soft-light', label: 'Soft Light' },
  { value: 'hard-light', label: 'Hard Light' },
  { value: 'difference', label: 'Difference' },
  { value: 'color-dodge', label: 'Color Dodge' },
  { value: 'color-burn', label: 'Color Burn' },
];

export function GradientBlendModePicker({ value, onChange }: GradientBlendModePickerProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground">Blend Mode</label>
      <div className="grid grid-cols-3 gap-1">
        {BLEND_MODES.map(({ value: mode, label }) => (
          <button
            key={mode}
            type="button"
            onClick={() => onChange(mode)}
            className={`px-2 py-1.5 text-[11px] font-medium rounded-md border transition-colors ${
              value === mode
                ? 'bg-primary/10 border-primary text-primary'
                : 'bg-card border-border/50 text-muted-foreground hover:border-border hover:text-foreground'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
