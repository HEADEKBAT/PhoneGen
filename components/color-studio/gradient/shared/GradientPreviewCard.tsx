'use client';

import type { GradientDefinition } from '@/lib/color-studio/types';
import { gradientToCSS } from '@/lib/color-studio';

interface GradientPreviewCardProps {
  gradient: GradientDefinition;
  className?: string;
  height?: number | string;
  showInfo?: boolean;
}

export function GradientPreviewCard({
  gradient,
  className = '',
  height = 160,
  showInfo = false,
}: GradientPreviewCardProps) {
  const css = gradientToCSS(gradient);

  return (
    <div className={`rounded-xl border border-border/50 overflow-hidden ${className}`}>
      <div
        className="w-full"
        style={{
          height: typeof height === 'number' ? `${height}px` : height,
          background: css,
        }}
      />
      {showInfo && (
        <div className="p-2 bg-card border-t border-border/30">
          <p className="text-[10px] font-mono text-muted-foreground truncate">{css}</p>
        </div>
      )}
    </div>
  );
}
