'use client';

import { useGradientStudioStore } from '@/lib/stores/gradientStudio';
import { gradientToCSS } from '@/lib/color-studio/gradients';
import { GradientPreviewCard } from './shared/GradientPreviewCard';
import { GradientTypeSelector } from './shared/GradientTypeSelector';
import { GradientStopBar } from './shared/GradientStopBar';
import { GradientAngleControl } from './shared/GradientAngleControl';
import { GradientPositionControl } from './shared/GradientPositionControl';
import { GradientBlendModePicker } from './shared/GradientBlendModePicker';
import { GradientNoiseControl } from './shared/GradientNoiseControl';
import { GradientMaskControl } from './shared/GradientMaskControl';
import { GradientFavButton } from './shared/GradientFavButton';
import { CopyButton } from '../shared/CopyButton';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { useState } from 'react';

export function GradientClassicTab() {
  const gradient = useGradientStudioStore((s) => s.currentGradient);
  const updateGradient = useGradientStudioStore((s) => s.updateCurrentGradient);
  const pushHistory = useGradientStudioStore((s) => s.pushHistory);

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showStops, setShowStops] = useState(true);

  const handleChange = (partial: Partial<typeof gradient>) => {
    pushHistory(gradient);
    updateGradient(partial);
  };

  const cssCode = gradientToCSS(gradient);
  const isRadialOrConic =
    gradient.type === 'radial' || gradient.type === 'conic' ||
    gradient.type === 'repeating-radial';

  return (
    <div className="space-y-5">
      {/* Preview */}
      <div className="relative">
        <GradientPreviewCard gradient={gradient} height={200} showInfo />
        <div className="absolute top-3 right-3 flex gap-1.5">
          <GradientFavButton gradient={gradient} />
          <CopyButton text={cssCode} label="Copy CSS" />
          <button
            type="button"
            onClick={() => handleChange({
              stops: gradient.stops.map((s, i) => ({
                ...s,
                color: i % 2 === 0 ? '#667eea' : '#764ba2',
              })),
            })}
            className="p-1.5 rounded-lg bg-card border border-border/50 text-muted-foreground hover:text-foreground transition-colors"
            title="Reset to default"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {/* Type selector */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-foreground">Gradient Type</label>
        <GradientTypeSelector
          value={gradient.type}
          onChange={(type) => handleChange({ type })}
        />
      </div>

      {/* Angle (for linear/conic/repeating) */}
      {gradient.type !== 'radial' && gradient.type !== 'repeating-radial' && (
        <GradientAngleControl
          angle={gradient.angle}
          onChange={(angle) => handleChange({ angle })}
        />
      )}

      {/* Position (for radial/conic) */}
      {isRadialOrConic && (
        <GradientPositionControl
          x={gradient.position?.x ?? 0.5}
          y={gradient.position?.y ?? 0.5}
          onChangeX={(x) => handleChange({ position: { x, y: gradient.position?.y ?? 0.5 } })}
          onChangeY={(y) => handleChange({ position: { x: gradient.position?.x ?? 0.5, y } })}
        />
      )}

      {/* Color stops */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => setShowStops(!showStops)}
          className="flex items-center justify-between w-full"
        >
          <label className="text-xs font-semibold text-foreground">Color Stops ({gradient.stops.length})</label>
          {showStops ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {showStops && (
          <GradientStopBar
            stops={gradient.stops}
            onChange={(stops) => handleChange({ stops })}
          />
        )}
      </div>

      {/* Advanced toggle */}
      <button
        type="button"
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        {showAdvanced ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        {showAdvanced ? 'Hide Advanced' : 'Show Advanced'}
      </button>

      {showAdvanced && (
        <div className="space-y-4 pl-2 border-l-2 border-border/30">
          <GradientBlendModePicker
            value={gradient.blendMode ?? 'normal'}
            onChange={(blendMode) => handleChange({ blendMode })}
          />

          <GradientNoiseControl
            noise={gradient.noise ?? null}
            onChange={(noise) => handleChange({ noise })}
          />

          <GradientMaskControl
            mask={gradient.mask ?? null}
            onChange={(mask) => handleChange({ mask })}
          />
        </div>
      )}
    </div>
  );
}
