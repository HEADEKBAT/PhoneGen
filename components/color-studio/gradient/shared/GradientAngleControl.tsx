'use client';

interface GradientAngleControlProps {
  angle: number;
  onChange: (angle: number) => void;
  onCommit?: (angle: number) => void;
}

export function GradientAngleControl({ angle, onChange, onCommit }: GradientAngleControlProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground">Angle: {angle}°</label>
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={0}
          max={360}
          value={angle}
          onChange={(e) => onChange(parseInt(e.target.value))}
          onMouseUp={() => onCommit?.(angle)}
          onTouchEnd={() => onCommit?.(angle)}
          onKeyUp={(e) => { if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') onCommit?.(angle); }}
          className="flex-1 h-1.5 accent-primary"
        />
        <input
          type="number"
          min={0}
          max={360}
          value={angle}
          onChange={(e) => {
            const val = parseInt(e.target.value);
            if (!isNaN(val)) onChange(Math.max(0, Math.min(360, val)));
          }}
          onBlur={() => onCommit?.(angle)}
          className="w-16 h-8 px-2 text-xs font-mono text-center bg-background border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-ring"
        />
      </div>
    </div>
  );
}
