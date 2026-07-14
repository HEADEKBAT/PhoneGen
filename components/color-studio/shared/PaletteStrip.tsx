'use client';

import { LockButton } from './LockButton';
import { ColorSwatch } from './ColorSwatch';

interface PaletteStripProps {
  colors: string[];
  locked: Set<number>;
  onToggleLock: (index: number) => void;
  onColorClick?: (index: number) => void;
  className?: string;
}

export function PaletteStrip({
  colors,
  locked,
  onToggleLock,
  onColorClick,
  className = '',
}: PaletteStripProps) {
  if (colors.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {colors.map((hex, i) => (
        <div key={i} className="flex flex-col items-center gap-1">
          <div className="relative group">
            <ColorSwatch
              hex={hex}
              size="lg"
              onClick={() => onColorClick?.(i)}
            />
            <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <LockButton
                locked={locked.has(i)}
                onToggle={() => onToggleLock(i)}
              />
            </div>
          </div>
          <span className="text-[10px] font-mono text-muted-foreground">
            {hex}
          </span>
        </div>
      ))}
    </div>
  );
}
