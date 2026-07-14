'use client';

import type { NoiseConfig } from '@/lib/color-studio/types';

interface GradientNoiseControlProps {
  noise: NoiseConfig | null;
  onChange: (noise: NoiseConfig | null) => void;
}

export function GradientNoiseControl({ noise, onChange }: GradientNoiseControlProps) {
  const enabled = noise?.enabled ?? false;

  const update = (partial: Partial<NoiseConfig>) => {
    if (!noise) {
      onChange({
        enabled: true,
        intensity: 30,
        size: 2,
        contrast: 50,
        type: 'svg',
        ...partial,
      });
    } else {
      onChange({ ...noise, ...partial });
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-muted-foreground">Noise Overlay</label>
        <button
          type="button"
          onClick={() => onChange(enabled ? null : { enabled: true, intensity: 30, size: 2, contrast: 50, type: 'svg' })}
          className={`px-2.5 py-1 text-[10px] font-semibold rounded-full border transition-colors ${
            enabled
              ? 'bg-primary/10 border-primary text-primary'
              : 'bg-card border-border/50 text-muted-foreground'
          }`}
        >
          {enabled ? 'ON' : 'OFF'}
        </button>
      </div>

      {enabled && noise && (
        <div className="space-y-2 pl-2 border-l-2 border-border/30">
          <div className="space-y-1">
            <label className="text-[10px] font-medium text-muted-foreground">
              Intensity: {noise.intensity}%
            </label>
            <input
              type="range"
              min={0}
              max={100}
              value={noise.intensity}
              onChange={(e) => update({ intensity: parseInt(e.target.value) })}
              className="w-full h-1 accent-primary"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-medium text-muted-foreground">
              Size: {noise.size}px
            </label>
            <input
              type="range"
              min={1}
              max={10}
              value={noise.size}
              onChange={(e) => update({ size: parseInt(e.target.value) })}
              className="w-full h-1 accent-primary"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-medium text-muted-foreground">
              Contrast: {noise.contrast}%
            </label>
            <input
              type="range"
              min={0}
              max={100}
              value={noise.contrast}
              onChange={(e) => update({ contrast: parseInt(e.target.value) })}
              className="w-full h-1 accent-primary"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-medium text-muted-foreground">Type</label>
            <div className="flex gap-1">
              {(['svg', 'css', 'canvas'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => update({ type })}
                  className={`flex-1 px-2 py-1 text-[10px] font-medium rounded-md border transition-colors ${
                    noise.type === type
                      ? 'bg-primary/10 border-primary text-primary'
                      : 'bg-card border-border/50 text-muted-foreground'
                  }`}
                >
                  {type.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
