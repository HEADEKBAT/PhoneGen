'use client';

import type { EyeStyle } from '@/lib/qr/types';
import { Check } from 'lucide-react';

const EYE_STYLES: { value: EyeStyle; label: string }[] = [
  { value: 'classic', label: 'Classic' },
  { value: 'rounded', label: 'Rounded' },
  { value: 'circle', label: 'Circle' },
  { value: 'frame', label: 'Frame' },
  { value: 'diamond', label: 'Diamond' },
  { value: 'modern', label: 'Modern' },
];

interface EyeStyleSelectorProps {
  value: EyeStyle;
  onChange: (style: EyeStyle) => void;
}

export default function EyeStyleSelector({ value, onChange }: EyeStyleSelectorProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {EYE_STYLES.map((style) => (
        <button
          key={style.value}
          onClick={() => onChange(style.value)}
          className={`relative flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all ${
            value === style.value
              ? 'border-primary bg-primary/5 shadow-sm'
              : 'border-border hover:border-muted-foreground/30 hover:bg-muted/20'
          }`}
        >
          {value === style.value && (
            <span className="absolute top-1 right-1 text-primary">
              <Check className="h-3 w-3" />
            </span>
          )}
          <svg width="32" height="32" viewBox="0 0 32 32" className="text-foreground">
            <rect x="0" y="0" width="7" height="7" rx={style.value === 'rounded' ? 1 : style.value === 'circle' ? 3.5 : 0} fill="currentColor" />
            <rect x="25" y="0" width="7" height="7" rx={style.value === 'rounded' ? 1 : style.value === 'circle' ? 3.5 : 0} fill="currentColor" />
            <rect x="0" y="25" width="7" height="7" rx={style.value === 'rounded' ? 1 : style.value === 'circle' ? 3.5 : 0} fill="currentColor" />
          </svg>
          <span className="text-[10px] text-muted-foreground">{style.label}</span>
        </button>
      ))}
    </div>
  );
}
