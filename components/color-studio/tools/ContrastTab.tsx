'use client';

import { useColorStudioStore } from '@/lib/stores/colorStudio';
import {
  hexToRgb,
  rgbToHex,
  contrastRatio,
  getWCAGLevel,
  accessibleTextColor,
  passesWCAG,
} from '@/lib/color-studio';
import { ColorPicker } from '../shared/ColorPicker';
import { CopyButton } from '../shared/CopyButton';

export default function ContrastTab() {
  const { fgColor, bgColor, setFgColor, setBgColor } = useColorStudioStore();

  const fgRgb = hexToRgb(fgColor);
  const bgRgb = hexToRgb(bgColor);

  const ratio = fgRgb && bgRgb ? contrastRatio(fgRgb, bgRgb) : 0;
  const level = getWCAGLevel(ratio);
  const levelLarge = getWCAGLevel(ratio, true);

  const suggestions = fgRgb
    ? [
        { label: 'White text', hex: '#ffffff' },
        { label: 'Black text', hex: '#000000' },
      ]
    : [];

  const passesAA = !!(fgRgb && bgRgb && passesWCAG(fgRgb, bgRgb, 'AA'));
  const passesAAA = !!(fgRgb && bgRgb && passesWCAG(fgRgb, bgRgb, 'AAA'));

  const ratioDisplay = ratio.toFixed(2);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-foreground">Contrast Checker</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Check WCAG 2.1 contrast ratios between two colors.
        </p>
      </div>

      {/* Color pickers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-medium text-foreground">Foreground (text)</label>
          <ColorPicker hex={fgColor} onChange={setFgColor} />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-medium text-foreground">Background</label>
          <ColorPicker hex={bgColor} onChange={setBgColor} />
        </div>
      </div>

      {/* Preview */}
      <div
        className="rounded-xl border border-border/50 p-8 text-center"
        style={{ backgroundColor: bgColor, color: fgColor }}
      >
        <p className="text-2xl font-bold">Aa</p>
        <p className="text-sm mt-1">The quick brown fox jumps over the lazy dog.</p>
        <p className="text-xs mt-2 text-muted-foreground opacity-60" style={{ color: fgColor }}>
          {fgColor} on {bgColor}
        </p>
      </div>

      {/* Results */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">Contrast Ratio</span>
          <span className="text-lg font-bold font-mono text-foreground">
            {ratioDisplay}:1
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <WCAGBadge label="AA (normal text)" passes={passesAA} ratio={4.5} />
          <WCAGBadge label="AA (large text)" passes={passesAA} ratio={3.0} />
          <WCAGBadge label="AAA (normal text)" passes={passesAAA} ratio={7.0} />
          <WCAGBadge label="AAA (large text)" passes={passesAAA} ratio={4.5} />
        </div>
      </div>

      {/* Suggestions */}
      {fgRgb && bgRgb && !passesAA && (
        <div className="rounded-xl border border-border bg-card p-4">
          <h4 className="text-xs font-semibold text-foreground mb-2">Suggested Text Colors</h4>
          <p className="text-xs text-muted-foreground mb-3">
            The current combo does not meet AA. Try these:
          </p>
          <div className="flex gap-2">
            {suggestions.map((s) => {
              const sRgb = hexToRgb(s.hex)!;
              const r = contrastRatio(sRgb, bgRgb!);
              return (
                <button
                  key={s.hex}
                  type="button"
                  onClick={() => setFgColor(s.hex)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
                >
                  <div className="size-5 rounded" style={{ backgroundColor: s.hex }} />
                  <div className="text-left">
                    <div className="text-xs font-medium text-foreground">{s.label}</div>
                    <div className="text-[10px] text-muted-foreground font-mono">
                      {r.toFixed(2)}:1
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function WCAGBadge({
  label,
  passes,
  ratio,
}: {
  label: string;
  passes: boolean;
  ratio: number;
}) {
  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs ${
        passes
          ? 'border-green-500/30 bg-green-500/5 text-green-600'
          : 'border-red-500/30 bg-red-500/5 text-red-600'
      }`}
    >
      <span className="font-medium">{passes ? '✓' : '✗'}</span>
      <div>
        <div className="font-medium">{label}</div>
        <div className="opacity-70">≥ {ratio}:1</div>
      </div>
    </div>
  );
}
