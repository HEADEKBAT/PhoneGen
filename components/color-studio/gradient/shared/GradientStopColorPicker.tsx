'use client';

import type { GradientStop } from '@/lib/color-studio/types';

interface GradientStopColorPickerProps {
  stop: GradientStop;
  index: number;
  onChange: (index: number, stop: Partial<GradientStop>) => void;
}

export function GradientStopColorPicker({ stop, index, onChange }: GradientStopColorPickerProps) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/20 border border-border/30">
      {/* Color picker */}
      <div className="relative shrink-0">
        <input
          type="color"
          value={stop.color}
          onChange={(e) => onChange(index, { color: e.target.value })}
          className="absolute inset-0 size-10 cursor-pointer opacity-0"
          aria-label={`Stop ${index + 1} color`}
        />
        <div
          className="size-10 rounded-lg border border-border/50 cursor-pointer shadow-sm"
          style={{ backgroundColor: stop.color }}
        />
      </div>

      {/* Hex input */}
      <div className="flex-1 space-y-1">
        <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
          Color
        </label>
        <input
          type="text"
          value={stop.color}
          onChange={(e) => {
            const val = e.target.value;
            if (/^#[0-9a-fA-F]{0,6}$/.test(val)) {
              onChange(index, { color: val });
            }
          }}
          className="w-full h-8 px-2 text-xs font-mono bg-background border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-ring"
          maxLength={7}
        />
      </div>

      {/* Offset */}
      <div className="w-20 space-y-1">
        <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
          Offset
        </label>
        <div className="flex items-center gap-1">
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round(stop.offset * 100)}
            onChange={(e) => onChange(index, { offset: parseInt(e.target.value) / 100 })}
            className="w-12 h-1 accent-primary"
          />
          <span className="text-[10px] font-mono text-muted-foreground w-8 text-right">
            {Math.round(stop.offset * 100)}%
          </span>
        </div>
      </div>

      {/* Opacity */}
      <div className="w-20 space-y-1">
        <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
          Opacity
        </label>
        <div className="flex items-center gap-1">
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round((stop.opacity ?? 1) * 100)}
            onChange={(e) => onChange(index, { opacity: parseInt(e.target.value) / 100 })}
            className="w-12 h-1 accent-primary"
          />
          <span className="text-[10px] font-mono text-muted-foreground w-8 text-right">
            {Math.round((stop.opacity ?? 1) * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
}
