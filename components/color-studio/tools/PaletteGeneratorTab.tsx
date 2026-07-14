'use client';

import { useState } from 'react';
import { useColorStudioStore } from '@/lib/stores/colorStudio';
import {
  hexToRgb,
  rgbToHsl,
  rgbToHsv,
  rgbToCmyk,
  rgbToHex,
  rgbToOklch,
  formatRgb,
  formatHsl,
} from '@/lib/color-studio';
import type { HarmonyType } from '@/lib/color-studio';
import { generateHarmony, HARMONY_LABELS, shadePalette, tintPalette } from '@/lib/color-studio';
import { ColorPicker } from '../shared/ColorPicker';
import { CopyButton } from '../shared/CopyButton';

const HARMONY_TYPES: HarmonyType[] = [
  'complementary',
  'split-complementary',
  'analogous',
  'triadic',
  'tetradic',
  'square',
  'monochromatic',
];

type PaletteMode = 'harmony' | 'shades' | 'tints';

export default function PaletteGeneratorTab() {
  const [seedHex, setSeedHex] = useState('#4ade80');
  const [paletteMode, setPaletteMode] = useState<PaletteMode>('harmony');
  const [harmonyType, setHarmonyType] = useState<HarmonyType>('complementary');

  const palette = (() => {
    switch (paletteMode) {
      case 'harmony': {
        const rgb = hexToRgb(seedHex);
        if (!rgb) return [seedHex];
        return generateHarmony(rgbToHsl(rgb), harmonyType);
      }
      case 'shades':
        return shadePalette(seedHex).colors;
      case 'tints':
        return tintPalette(seedHex).colors;
    }
  })();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-foreground">Palette Generator</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Generate harmonies, shades, and tints from a seed color.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <ColorPicker hex={seedHex} onChange={setSeedHex} label="Seed color" />
        <div className="text-xs font-mono text-muted-foreground">{seedHex}</div>
      </div>

      {/* Mode selector */}
      <div className="flex gap-1 bg-muted rounded-lg p-1">
        {(['harmony', 'shades', 'tints'] as PaletteMode[]).map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => setPaletteMode(mode)}
            className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors capitalize ${
              paletteMode === mode
                ? 'bg-card text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {mode}
          </button>
        ))}
      </div>

      {/* Harmony type selector (only in harmony mode) */}
      {paletteMode === 'harmony' && (
        <div className="flex flex-wrap gap-1">
          {HARMONY_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setHarmonyType(type)}
              className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors ${
                harmonyType === type
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : 'bg-muted text-muted-foreground hover:text-foreground border border-transparent'
              }`}
            >
              {HARMONY_LABELS[type]}
            </button>
          ))}
        </div>
      )}

      {/* Palette display */}
      <div className="space-y-3">
        <div className="flex rounded-xl overflow-hidden border border-border/50 h-12">
          {palette.map((hex, i) => (
            <div
              key={i}
              className="flex-1 relative group cursor-pointer"
              style={{ backgroundColor: hex }}
              title={hex}
              onClick={() => navigator.clipboard.writeText(hex)}
            >
              <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-mono bg-black/30 text-white">
                {hex}
              </span>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {palette.map((hex, i) => (
            <CopyButton key={i} text={hex} label={hex} />
          ))}
        </div>
      </div>

      {/* Color info */}
      <div className="rounded-xl border border-border bg-card p-4">
        <h4 className="text-xs font-semibold text-foreground mb-3">Seed Color Values</h4>
        <ColorInfo hex={seedHex} />
      </div>
    </div>
  );
}

function ColorInfo({ hex }: { hex: string }) {
  const rgb = hexToRgb(hex);
  if (!rgb) return <p className="text-xs text-muted-foreground">Invalid color</p>;

  const hsl = rgbToHsl(rgb);
  const hsv = rgbToHsv(rgb);
  const cmyk = rgbToCmyk(rgb);
  const oklch = rgbToOklch(rgb);

  const rows = [
    { label: 'HEX', value: hex },
    { label: 'RGB', value: formatRgb(rgb) },
    { label: 'HSL', value: formatHsl(hsl) },
    { label: 'HSV', value: `hsv(${Math.round(hsv.h * 360)}, ${Math.round(hsv.s * 100)}%, ${Math.round(hsv.v * 100)}%)` },
    { label: 'CMYK', value: `cmyk(${Math.round(cmyk.c * 100)}%, ${Math.round(cmyk.m * 100)}%, ${Math.round(cmyk.y * 100)}%, ${Math.round(cmyk.k * 100)}%)` },
    { label: 'OKLCH', value: `oklch(${(oklch.l * 100).toFixed(1)}%, ${oklch.c.toFixed(3)}, ${oklch.h.toFixed(1)}°)` },
  ];

  return (
    <div className="grid grid-cols-2 gap-2">
      {rows.map((row) => (
        <div key={row.label} className="flex items-center justify-between py-1 border-b border-border/50 last:border-0">
          <span className="text-[11px] font-medium text-muted-foreground">{row.label}</span>
          <span className="text-[11px] font-mono text-foreground">{row.value}</span>
        </div>
      ))}
    </div>
  );
}
