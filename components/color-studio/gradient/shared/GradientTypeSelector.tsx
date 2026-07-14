'use client';

import type { GradientDefinition } from '@/lib/color-studio/types';

interface GradientTypeSelectorProps {
  value: GradientDefinition['type'];
  onChange: (type: GradientDefinition['type']) => void;
}

const TYPES: { value: GradientDefinition['type']; label: string; icon: string }[] = [
  { value: 'linear', label: 'Linear', icon: '↗' },
  { value: 'radial', label: 'Radial', icon: '◎' },
  { value: 'conic', label: 'Conic', icon: '◔' },
  { value: 'repeating-linear', label: 'Repeating Linear', icon: '≡' },
  { value: 'repeating-radial', label: 'Repeating Radial', icon: '⊚' },
];

export function GradientTypeSelector({ value, onChange }: GradientTypeSelectorProps) {
  return (
    <div className="grid grid-cols-5 gap-1.5">
      {TYPES.map(({ value: type, label, icon }) => (
        <button
          key={type}
          type="button"
          onClick={() => onChange(type)}
          className={`flex flex-col items-center gap-1 p-2 rounded-lg border text-xs font-medium transition-colors ${
            value === type
              ? 'bg-primary/10 border-primary text-primary'
              : 'bg-card border-border/50 text-muted-foreground hover:border-border hover:text-foreground'
          }`}
          title={label}
        >
          <span className="text-sm leading-none">{icon}</span>
          <span className="text-[10px] leading-tight">{label}</span>
        </button>
      ))}
    </div>
  );
}
