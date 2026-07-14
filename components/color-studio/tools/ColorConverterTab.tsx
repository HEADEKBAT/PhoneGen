'use client';

import { useState } from 'react';
import {
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  rgbToHsv,
  rgbToCmyk,
  rgbToLab,
  rgbToOklab,
  rgbToOklch,
  formatRgb,
  formatHsl,
  hslToRgb,
  hsvToRgb,
  cmykToRgb,
  labToRgb,
  oklabToRgb,
  oklchToRgb,
} from '@/lib/color-studio';
import type { ColorStringFormat } from '@/lib/color-studio';
import { ColorPicker } from '../shared/ColorPicker';
import { CopyButton } from '../shared/CopyButton';

interface FormatValue {
  format: string;
  value: string;
}

export default function ColorConverterTab() {
  const [hex, setHex] = useState('#4ade80');

  const rgb = hexToRgb(hex);

  const formats: FormatValue[] = [
    { format: 'HEX', value: rgb ? rgbToHex(rgb) : '—' },
    { format: 'RGB', value: rgb ? formatRgb(rgb) : '—' },
    { format: 'RGBA', value: rgb ? formatRgb({ ...rgb, a: 1 }) : '—' },
    { format: 'HSL', value: rgb ? formatHsl(rgbToHsl(rgb)) : '—' },
    { format: 'HSLA', value: (() => {
      if (!rgb) return '—';
      const hsl = rgbToHsl(rgb);
      return `hsla(${Math.round(hsl.h * 360)}, ${Math.round(hsl.s * 100)}%, ${Math.round(hsl.l * 100)}%, 1)`;
    })() },
    { format: 'HSV', value: (() => {
      if (!rgb) return '—';
      const hsv = rgbToHsv(rgb);
      return `hsv(${Math.round(hsv.h * 360)}, ${Math.round(hsv.s * 100)}%, ${Math.round(hsv.v * 100)}%)`;
    })() },
    { format: 'CMYK', value: (() => {
      if (!rgb) return '—';
      const c = rgbToCmyk(rgb);
      return `${Math.round(c.c * 100)}% ${Math.round(c.m * 100)}% ${Math.round(c.y * 100)}% ${Math.round(c.k * 100)}%`;
    })() },
    { format: 'CIE Lab', value: (() => {
      if (!rgb) return '—';
      const lab = rgbToLab(rgb);
      return `lab(${lab.l.toFixed(2)}, ${lab.a.toFixed(2)}, ${lab.b.toFixed(2)})`;
    })() },
    { format: 'OKLab', value: (() => {
      if (!rgb) return '—';
      const oklab = rgbToOklab(rgb);
      return `oklab(${oklab.l.toFixed(4)}, ${oklab.a.toFixed(4)}, ${oklab.b.toFixed(4)})`;
    })() },
    { format: 'OKLCH', value: (() => {
      if (!rgb) return '—';
      const oklch = rgbToOklch(rgb);
      return `oklch(${(oklch.l * 100).toFixed(1)}%, ${oklch.c.toFixed(3)}, ${oklch.h.toFixed(1)}°)`;
    })() },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-foreground">Color Converter</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Convert colors between HEX, RGB, HSL, HSV, CMYK, CIE Lab, OKLab, and OKLCH.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <ColorPicker hex={hex} onChange={setHex} label="Color to convert" />
        {rgb && (
          <div
            className="size-10 rounded-lg border border-border/50 shrink-0"
            style={{ backgroundColor: rgbToHex(rgb) }}
          />
        )}
      </div>

      <div className="space-y-1 rounded-xl border border-border bg-card overflow-hidden">
        {formats.map((f) => (
          <div
            key={f.format}
            className="flex items-center justify-between px-4 py-2.5 border-b border-border/50 last:border-0 hover:bg-muted/50 transition-colors"
          >
            <span className="text-[11px] font-semibold text-muted-foreground w-20 shrink-0">
              {f.format}
            </span>
            <code className="text-xs font-mono text-foreground flex-1 text-right truncate ml-2">
              {f.value}
            </code>
            <CopyButton text={f.value} className="ml-2 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
