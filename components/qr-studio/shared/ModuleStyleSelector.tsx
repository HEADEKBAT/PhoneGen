'use client';

import type { ModuleStyle } from '@/lib/qr/types';
import { Check } from 'lucide-react';

const MODULE_STYLES: { value: ModuleStyle; label: string; preview: string }[] = [
  { value: 'square', label: 'Square', preview: '▣' },
  { value: 'rounded', label: 'Rounded', preview: '▢' },
  { value: 'dots', label: 'Dots', preview: '⬤' },
  { value: 'circle', label: 'Circle', preview: '●' },
  { value: 'diamond', label: 'Diamond', preview: '◆' },
  { value: 'pixel', label: 'Pixel', preview: '⬛' },
  { value: 'hexagon', label: 'Hexagon', preview: '⬡' },
  { value: 'minimal', label: 'Minimal', preview: '◻' },
];

interface ModuleStyleSelectorProps {
  value: ModuleStyle;
  onChange: (style: ModuleStyle) => void;
}

export default function ModuleStyleSelector({ value, onChange }: ModuleStyleSelectorProps) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {MODULE_STYLES.map((style) => (
        <button
          key={style.value}
          onClick={() => onChange(style.value)}
          className={`relative flex flex-col items-center gap-1 p-2 rounded-xl border transition-all ${
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
          <span className="text-lg leading-none">{style.preview}</span>
          <span className="text-[10px] text-muted-foreground">{style.label}</span>
        </button>
      ))}
    </div>
  );
}
