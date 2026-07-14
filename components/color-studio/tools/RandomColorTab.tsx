'use client';

import { RefreshCw } from 'lucide-react';
import { useColorStudioStore } from '@/lib/stores/colorStudio';
import { randomHex } from '@/lib/color-studio';
import { PaletteStrip } from '../shared/PaletteStrip';
import { CopyButton } from '../shared/CopyButton';

export default function RandomColorTab() {
  const { colors, locked, replaceColor, toggleLock, pushHistory, colors: currentColors } = useColorStudioStore();

  const generateRandom = () => {
    const newColors = colors.map((c, i) => (locked.has(i) ? c : randomHex()));
    pushHistory(currentColors);
    useColorStudioStore.setState({ colors: newColors });
  };

  const generateSingle = () => {
    const index = 0;
    if (!locked.has(index)) {
      const newHex = randomHex();
      replaceColor(index, newHex);
    }
  };

  const allLocked = colors.every((_, i) => locked.has(i));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Random Colors</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Generate random color combinations. Lock colors you want to keep.
          </p>
        </div>
        <button
          type="button"
          onClick={generateRandom}
          disabled={allLocked}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw size={14} />
          Generate
        </button>
      </div>

      <PaletteStrip
        colors={colors}
        locked={locked}
        onToggleLock={toggleLock}
        onColorClick={generateSingle}
      />

      <div className="flex flex-wrap gap-2">
        {colors.map((hex, i) => (
          <CopyButton key={i} text={hex} label={hex} />
        ))}
      </div>
    </div>
  );
}
