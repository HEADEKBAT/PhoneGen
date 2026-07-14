'use client';

import { GripVertical, X } from 'lucide-react';
import type { GradientStop } from '@/lib/color-studio/types';

interface GradientStopBarProps {
  stops: GradientStop[];
  onChange: (stops: GradientStop[]) => void;
}

const PRESET_COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
  '#22c55e', '#14b8a6', '#06b6d4', '#3b82f6', '#6366f1',
  '#8b5cf6', '#a855f7', '#ec4899', '#f43f5e', '#64748b',
  '#000000', '#ffffff', '#667eea', '#764ba2',
];

export function GradientStopBar({ stops, onChange }: GradientStopBarProps) {
  const handleRemove = (index: number) => {
    if (stops.length <= 2) return;
    onChange(stops.filter((_, i) => i !== index));
  };

  const handleColorChange = (index: number, color: string) => {
    const updated = stops.map((s, i) => (i === index ? { ...s, color } : s));
    onChange(updated);
  };

  const handleOffsetChange = (index: number, offset: number) => {
    const updated = stops.map((s, i) => (i === index ? { ...s, offset: Math.max(0, Math.min(1, offset)) } : s));
    onChange(updated.sort((a, b) => a.offset - b.offset));
  };

  const handleAdd = () => {
    if (stops.length >= 10) return;
    const lastStop = stops[stops.length - 1];
    const newOffset = Math.min(1, (lastStop?.offset ?? 0.5) + 0.1);
    onChange([...stops, { offset: newOffset, color: '#6366f1', opacity: 1 }]);
  };

  return (
    <div className="space-y-3">
      {/* Gradient strip preview */}
      <div
        className="h-8 rounded-lg border border-border/50"
        style={{
          background: `linear-gradient(90deg, ${stops
            .sort((a, b) => a.offset - b.offset)
            .map((s) => `${s.color} ${Math.round(s.offset * 100)}%`)
            .join(', ')})`,
        }}
      />

      {/* Stop controls */}
      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
        {stops.sort((a, b) => a.offset - b.offset).map((stop, index) => (
          <div
            key={`${stop.offset}-${stop.color}-${index}`}
            className="flex items-center gap-2 p-2 rounded-lg bg-muted/30"
          >
            <GripVertical size={14} className="text-muted-foreground shrink-0" />

            {/* Color swatch + native picker */}
            <div className="relative shrink-0">
              <input
                type="color"
                value={stop.color}
                onChange={(e) => handleColorChange(index, e.target.value)}
                className="absolute inset-0 size-7 cursor-pointer opacity-0"
                aria-label={`Stop ${index + 1} color`}
              />
              <div
                className="size-7 rounded-md border border-border/50 cursor-pointer"
                style={{ backgroundColor: stop.color }}
              />
            </div>

            {/* Quick color dots */}
            <div className="flex gap-0.5 flex-wrap flex-1">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => handleColorChange(index, c)}
                  className={`size-3.5 rounded-full border border-border/30 transition-transform hover:scale-125 ${stop.color === c ? 'ring-1 ring-ring scale-125' : ''}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>

            {/* Offset slider */}
            <input
              type="range"
              min={0}
              max={100}
              value={Math.round(stop.offset * 100)}
              onChange={(e) => handleOffsetChange(index, parseInt(e.target.value) / 100)}
              className="w-16 h-1.5 accent-primary"
              aria-label={`Stop ${index + 1} position`}
            />
            <span className="text-[10px] font-mono text-muted-foreground w-8 text-right">
              {Math.round(stop.offset * 100)}%
            </span>

            {/* Remove */}
            {stops.length > 2 && (
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="p-0.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
              >
                <X size={12} />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Add stop button */}
      {stops.length < 10 && (
        <button
          type="button"
          onClick={handleAdd}
          className="w-full py-1.5 text-xs font-medium text-muted-foreground border border-dashed border-border/50 rounded-lg hover:border-primary/50 hover:text-primary transition-colors"
        >
          + Add Stop
        </button>
      )}
    </div>
  );
}
