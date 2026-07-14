'use client';

import type { AnimationConfig } from '@/lib/color-studio/types';
import { gradientToCSS } from '@/lib/color-studio';
import type { GradientDefinition } from '@/lib/color-studio/types';

interface GradientAnimationPreviewProps {
  gradient: GradientDefinition;
  animation: AnimationConfig | null;
  className?: string;
}

const ANIMATION_CSS: Record<string, string> = {
  aurora: 'aurora 6s ease-in-out infinite alternate',
  wave: 'wave 4s ease-in-out infinite',
  rotate: 'rotate 3s linear infinite',
  pulse: 'pulse 2s ease-in-out infinite',
  floating: 'floating 3s ease-in-out infinite',
  noise: 'noise 0.5s steps(3) infinite',
  morph: 'morph 8s ease-in-out infinite',
  'gradient-shift': 'gradient-shift 5s ease infinite',
  'blob-motion': 'blob-motion 10s ease-in-out infinite',
};

export function GradientAnimationPreview({
  gradient,
  animation,
  className = '',
}: GradientAnimationPreviewProps) {
  const css = gradientToCSS(gradient);
  const isAnimated = animation && animation.type !== 'static';

  const animationCss = isAnimated ? ANIMATION_CSS[animation.type] ?? '' : '';

  return (
    <div className={`rounded-xl border border-border/50 overflow-hidden ${className}`}>
      <div className="p-4 bg-card border-b border-border/30">
        <h4 className="text-xs font-semibold text-foreground">Live Preview</h4>
        {isAnimated && (
          <p className="text-[10px] text-muted-foreground mt-0.5">
            {animation.type} · {animation.speed}s · {animation.timingFunction}
          </p>
        )}
      </div>
      <div
        className="w-full h-48"
        style={{
          background: css,
          backgroundSize: '200% 200%',
          animation: animationCss
            ? `${animationCss}`
            : undefined,
        }}
      />

      {/* CSS keyframes (if animated) */}
      {isAnimated && (
        <div className="p-3 bg-card border-t border-border/30">
          <p className="text-[10px] font-mono text-muted-foreground whitespace-pre-wrap break-all">
            {`/* Animation: ${animation.type} */
@keyframes ${animation.type} {
  0%   { transform: translate(0, 0) rotate(0deg); }
  50%  { transform: translate(10px, -10px) rotate(3deg); }
  100% { transform: translate(0, 0) rotate(0deg); }
}`}
          </p>
        </div>
      )}
    </div>
  );
}
