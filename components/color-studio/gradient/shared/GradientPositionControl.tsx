'use client';

interface GradientPositionControlProps {
  x: number;
  y: number;
  onChangeX: (x: number) => void;
  onChangeY: (y: number) => void;
}

export function GradientPositionControl({ x, y, onChangeX, onChangeY }: GradientPositionControlProps) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-muted-foreground">Position</label>

      {/* 2D position grid */}
      <div
        className="relative w-full h-24 rounded-lg border border-border/50 bg-muted/20 cursor-crosshair overflow-hidden"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          onChangeX((e.clientX - rect.left) / rect.width);
          onChangeY((e.clientY - rect.top) / rect.height);
        }}
      >
        {/* Crosshair */}
        <div
          className="absolute size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-md bg-primary/50 pointer-events-none"
          style={{ left: `${x * 100}%`, top: `${y * 100}%` }}
        />
      </div>

      {/* X/Y sliders */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-[10px] font-medium text-muted-foreground">X: {Math.round(x * 100)}%</label>
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round(x * 100)}
            onChange={(e) => onChangeX(parseInt(e.target.value) / 100)}
            className="w-full h-1 accent-primary"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-medium text-muted-foreground">Y: {Math.round(y * 100)}%</label>
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round(y * 100)}
            onChange={(e) => onChangeY(parseInt(e.target.value) / 100)}
            className="w-full h-1 accent-primary"
          />
        </div>
      </div>
    </div>
  );
}
