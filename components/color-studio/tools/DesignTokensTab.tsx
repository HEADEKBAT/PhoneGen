'use client';

import { useState, useMemo } from 'react';
import { generateTokens } from '@/lib/color-studio';
import type { TokenFormat } from '@/lib/color-studio';
import { TOKEN_FORMAT_LABELS } from '@/lib/color-studio';
import { useColorStudioStore } from '@/lib/stores/colorStudio';
import { CopyButton } from '../shared/CopyButton';
import { FormatMenu } from '../shared/FormatMenu';

const FORMAT_OPTIONS: Record<string, string> = Object.fromEntries(
  Object.entries(TOKEN_FORMAT_LABELS).map(([k, v]) => [k, v]),
);

export default function DesignTokensTab() {
  const { colors } = useColorStudioStore();
  const [format, setFormat] = useState<TokenFormat>('css');
  const [prefix, setPrefix] = useState('color');

  // Build named color map from current palette
  const colorMap = useMemo(() => {
    const map: Record<string, string> = {};
    colors.forEach((hex, i) => {
      map[`${prefix}-${i + 1}`] = hex;
    });
    map[`${prefix}-primary`] = colors[0] || '#000000';
    if (colors[1]) map[`${prefix}-secondary`] = colors[1];
    return map;
  }, [colors, prefix]);

  const tokenOutput = useMemo(
    () => generateTokens(colorMap, format),
    [colorMap, format],
  );

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-foreground">Design Tokens</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Export your colors as design tokens in various formats.
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <label className="text-xs font-medium text-muted-foreground mb-1 block">
            Prefix
          </label>
          <input
            type="text"
            value={prefix}
            onChange={(e) => setPrefix(e.target.value)}
            className="w-full h-9 px-3 text-xs font-mono bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="color"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">
            Format
          </label>
          <FormatMenu
            formats={FORMAT_OPTIONS}
            value={format}
            onSelect={(key) => setFormat(key as TokenFormat)}
          />
        </div>
      </div>

      {/* Color source */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Using:</span>
        {colors.map((hex, i) => (
          <div
            key={i}
            className="size-5 rounded border border-border/50"
            style={{ backgroundColor: hex }}
            title={hex}
          />
        ))}
      </div>

      {/* Output */}
      <div className="relative">
        <pre className="text-[11px] font-mono leading-relaxed bg-muted rounded-xl p-4 overflow-x-auto max-h-64 overflow-y-auto text-foreground">
          {tokenOutput}
        </pre>
        <div className="absolute top-2 right-2">
          <CopyButton text={tokenOutput} label="Copy tokens" />
        </div>
      </div>
    </div>
  );
}
