'use client';

/**
 * SemanticColorGrid — displays semantic colors and theme tokens
 * with WCAG AA/AAA contrast badges against the background.
 */

import { hexToRgb, contrastRatio } from '@/lib/color-studio';
import type { DesignSystem } from '@/lib/color-studio/themeBuilder';

interface SemanticColorGridProps {
  ds: DesignSystem;
}

function getWCAGBadge(fg: string, bg: string) {
  const fgRgb = hexToRgb(fg);
  const bgRgb = hexToRgb(bg);
  if (!fgRgb || !bgRgb) return null;
  const ratio = contrastRatio(fgRgb, bgRgb);
  if (ratio >= 7) return { level: 'AAA', ratio: ratio.toFixed(1) };
  if (ratio >= 4.5) return { level: 'AA', ratio: ratio.toFixed(1) };
  if (ratio >= 3) return { level: 'AA-lg', ratio: ratio.toFixed(1) };
  return { level: 'FAIL', ratio: ratio.toFixed(1) };
}

export function SemanticColorGrid({ ds }: SemanticColorGridProps) {
  const semanticColors = [
    { label: 'Success', hex: ds.success },
    { label: 'Warning', hex: ds.warning },
    { label: 'Danger', hex: ds.danger },
    { label: 'Info', hex: ds.info },
  ];

  const themeTokens = [
    { label: 'Background', hex: ds.light.background },
    { label: 'Surface', hex: ds.light.surface },
    { label: 'Card', hex: ds.light.card },
    { label: 'Border', hex: ds.light.border },
    { label: 'Text', hex: ds.light.text },
    { label: 'Muted', hex: ds.light.muted },
    { label: 'Foreground', hex: ds.light.foreground },
    { label: 'Placeholder', hex: ds.light.placeholder },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-xs font-semibold text-foreground mb-2">Semantic Colors</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {semanticColors.map(({ label, hex }) => (
            <div
              key={label}
              className="flex items-center gap-2 p-2 rounded-lg border border-border"
            >
              <div
                className="size-6 rounded-md cursor-pointer shrink-0"
                style={{ backgroundColor: hex }}
                onClick={() => navigator.clipboard.writeText(hex)}
                title={hex}
              />
              <div className="min-w-0">
                <div className="text-xs font-medium text-foreground truncate">{label}</div>
                <div className="text-[10px] font-mono text-muted-foreground truncate">{hex}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-foreground mb-2">Theme Tokens</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {themeTokens.map(({ label, hex }) => {
            const badge = getWCAGBadge(ds.light.text, hex);
            return (
              <div
                key={label}
                className="flex items-center gap-2 p-2 rounded-lg border border-border"
              >
                <div
                  className="size-6 rounded-md cursor-pointer shrink-0"
                  style={{ backgroundColor: hex }}
                  onClick={() => navigator.clipboard.writeText(hex)}
                  title={hex}
                />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-medium text-foreground truncate">{label}</div>
                  <div className="flex items-center gap-1">
                    <span className="text-[9px] font-mono text-muted-foreground truncate">{hex}</span>
                    {badge && (
                      <span className={`text-[9px] font-semibold px-1 py-0.5 rounded ${
                        badge.level === 'AAA' ? 'bg-green-500/10 text-green-600' :
                        badge.level === 'AA' ? 'bg-green-500/10 text-green-600' :
                        badge.level === 'FAIL' ? 'bg-red-500/10 text-red-600' :
                        'bg-amber-500/10 text-amber-600'
                      }`}>
                        {badge.level}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
