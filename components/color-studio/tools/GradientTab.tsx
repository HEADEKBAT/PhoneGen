'use client';

import { useState } from 'react';
import {
  GRADIENT_PRESETS,
  evenlySpacedStops,
  createGradient,
  gradientToCSS,
  generateGradientPalette,
} from '@/lib/color-studio';
import type { GradientDefinition } from '@/lib/color-studio';
import { GradientPreview } from '../shared/GradientPreview';
import { CopyButton } from '../shared/CopyButton';
import { ColorPicker } from '../shared/ColorPicker';

export default function GradientTab() {
  const [activeGradient, setActiveGradient] = useState<GradientDefinition>(GRADIENT_PRESETS[0]);
  const [angle, setAngle] = useState(135);
  const [color1, setColor1] = useState('#667eea');
  const [color2, setColor2] = useState('#764ba2');
  const [mode, setMode] = useState<'presets' | 'custom'>('presets');

  const customGradient: GradientDefinition = createGradient(
    evenlySpacedStops([color1, color2]),
    'linear',
    angle,
  );

  const displayGradient = mode === 'presets' ? activeGradient : customGradient;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-foreground">Gradient Generator</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Browse presets or create custom linear gradients.
        </p>
      </div>

      {/* Mode toggle */}
      <div className="flex gap-1 bg-muted rounded-lg p-1 w-fit">
        {(['presets', 'custom'] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors capitalize ${
              mode === m
                ? 'bg-card text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Preview */}
      <GradientPreview gradient={displayGradient} height={160} />

      {/* CSS output */}
      <div className="flex items-center gap-2">
        <code className="flex-1 text-[11px] font-mono text-foreground bg-muted rounded-lg px-3 py-2 truncate">
          {gradientToCSS(displayGradient)}
        </code>
        <CopyButton text={gradientToCSS(displayGradient)} label="Copy CSS" />
      </div>

      {/* Presets */}
      {mode === 'presets' && (
        <div>
          <h4 className="text-xs font-semibold text-foreground mb-2">Presets</h4>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {GRADIENT_PRESETS.map((grad, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveGradient(grad)}
                className={`h-14 rounded-lg border-2 transition-all ${
                  activeGradient === grad ? 'border-primary scale-105' : 'border-border hover:border-muted-foreground'
                }`}
                style={{ background: gradientToCSS(grad) }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Custom controls */}
      {mode === 'custom' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <ColorPicker hex={color1} onChange={setColor1} label="Color 1" />
            <ColorPicker hex={color2} onChange={setColor2} label="Color 2" />
          </div>
          <div className="flex items-center gap-3">
            <label className="text-xs font-medium text-muted-foreground">Angle: {angle}°</label>
            <input
              type="range"
              min={0}
              max={360}
              value={angle}
              onChange={(e) => setAngle(Number(e.target.value))}
              className="flex-1 h-1.5 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
            />
          </div>
        </div>
      )}
    </div>
  );
}
