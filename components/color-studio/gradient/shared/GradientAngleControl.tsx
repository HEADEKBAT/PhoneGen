'use client';

interface GradientAngleControlProps {
  angle: number;
  onChange: (angle: number) => void;
}

export function GradientAngleControl({ angle, onChange }: GradientAngleControlProps) {
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
          className="w-16 h-8 px-2 text-xs font-mono text-center bg-background border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-ring"
        />
      </div>
    </div>
  );
}
