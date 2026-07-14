'use client';

import type { GradientDefinition } from '@/lib/color-studio';
import { gradientToCSS } from '@/lib/color-studio';

interface GradientPreviewProps {
  gradient: GradientDefinition;
  className?: string;
  height?: number;
}

export function GradientPreview({
  gradient,
  className = '',
  height = 120,
}: GradientPreviewProps) {
  const css = gradientToCSS(gradient);

  return (
    <div
      className={`rounded-xl border border-border/50 ${className}`}
      style={{
        height: `${height}px`,
        background: css,
      }}
    />
  );
}
