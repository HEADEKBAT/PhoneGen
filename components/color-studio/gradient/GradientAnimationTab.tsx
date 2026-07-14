'use client';

import { useGradientStudioStore } from '@/lib/stores/gradientStudio';
import { gradientToCSS } from '@/lib/color-studio/gradients';
import { getAnimations, getAnimation, buildFullAnimationCSS, ANIMATION_TYPE_LABELS, DIRECTION_LABELS, TIMING_LABELS } from '@/lib/color-studio/gradientAnimations';
import type { AnimationConfig } from '@/lib/color-studio/types';
import { GradientPreviewCard } from './shared/GradientPreviewCard';
import { GradientExportCodeBlock } from './shared/GradientExportCodeBlock';
import { ChevronDown, ChevronUp, Play, StopCircle } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export function GradientAnimationTab() {
  const gradient = useGradientStudioStore((s) => s.currentGradient);
  const updateGradient = useGradientStudioStore((s) => s.updateCurrentGradient);
  const pushHistory = useGradientStudioStore((s) => s.pushHistory);

  const animation = gradient.animation ?? { type: 'static', speed: 3, direction: 'normal', delay: 0, loop: true, timingFunction: 'ease-in-out' } as AnimationConfig;
  const [isPlaying, setIsPlaying] = useState(false);
  const prevAnimRef = useRef(animation.type);

  // Auto-play on animation type change
  useEffect(() => {
    if (animation.type !== 'static' && prevAnimRef.current !== animation.type) {
      setIsPlaying(true);
    }
    prevAnimRef.current = animation.type;
  }, [animation.type]);

  const animations = getAnimations();

  const handleAnimChange = (partial: Partial<AnimationConfig>) => {
    pushHistory(gradient);
    updateGradient({
      animation: { ...animation, ...partial },
    });
  };

  const cssCode = buildFullAnimationCSS(animation, gradient.id);
  const gradientCss = gradientToCSS(gradient);

  return (
    <div className="space-y-5">
      {/* Animated preview */}
      <div className="relative rounded-xl border border-border/50 overflow-hidden">
        <div
          className="w-full h-56 transition-all"
          style={{
            background: gradientCss,
            backgroundSize: '200% 200%',
            animation: isPlaying && animation.type !== 'static'
              ? `${animation.type} ${animation.speed}s ${animation.timingFunction} ${animation.delay}s ${animation.direction} ${animation.loop ? 'infinite' : '1'}`
              : 'none',
          }}
        />
        <div className="absolute top-3 right-3 flex gap-2">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className={`p-2 rounded-lg border transition-colors ${
              isPlaying
                ? 'bg-red-500/10 border-red-500/30 text-red-500'
                : 'bg-card border-border/50 text-muted-foreground hover:text-foreground'
            }`}
            title={isPlaying ? 'Stop' : 'Play'}
          >
            {isPlaying ? <StopCircle size={18} /> : <Play size={18} />}
          </button>
        </div>
        {animation.type !== 'static' && (
          <div className="absolute bottom-3 left-3 px-2.5 py-1 bg-black/60 backdrop-blur-sm rounded-full text-[10px] font-medium text-white">
            {animation.type} · {animation.speed}s
          </div>
        )}
      </div>

      {/* Animation type grid */}
      <div>
        <label className="text-xs font-semibold text-foreground mb-2 block">Animation Type</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          <button
            type="button"
            onClick={() => handleAnimChange({ type: 'static' })}
            className={`p-3 rounded-xl border text-left transition-colors ${
              animation.type === 'static'
                ? 'bg-primary/10 border-primary'
                : 'bg-card border-border/50 hover:border-border'
            }`}
          >
            <span className={`text-xs font-semibold ${animation.type === 'static' ? 'text-primary' : 'text-foreground'}`}>
              None
            </span>
            <p className="text-[10px] text-muted-foreground mt-1">No animation</p>
          </button>
          {animations.map((anim) => (
            <button
              key={anim.type}
              type="button"
              onClick={() => handleAnimChange({ type: anim.type })}
              className={`p-3 rounded-xl border text-left transition-colors ${
                animation.type === anim.type
                  ? 'bg-primary/10 border-primary'
                  : 'bg-card border-border/50 hover:border-border'
              }`}
            >
              <span className={`text-xs font-semibold ${animation.type === anim.type ? 'text-primary' : 'text-foreground'}`}>
                {anim.name}
              </span>
              <p className="text-[10px] text-muted-foreground mt-1 leading-tight line-clamp-2">
                {anim.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Controls */}
      {animation.type !== 'static' && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Speed */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                Speed: {animation.speed}s
              </label>
              <input
                type="range"
                min={0.5}
                max={20}
                step={0.5}
                value={animation.speed}
                onChange={(e) => handleAnimChange({ speed: parseFloat(e.target.value) })}
                className="w-full h-1.5 accent-primary"
              />
            </div>

            {/* Delay */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                Delay: {animation.delay}s
              </label>
              <input
                type="range"
                min={0}
                max={10}
                step={0.5}
                value={animation.delay}
                onChange={(e) => handleAnimChange({ delay: parseFloat(e.target.value) })}
                className="w-full h-1.5 accent-primary"
              />
            </div>

            {/* Direction */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                Direction
              </label>
              <select
                value={animation.direction}
                onChange={(e) => handleAnimChange({ direction: e.target.value as AnimationConfig['direction'] })}
                className="w-full h-8 px-2 text-xs bg-background border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-ring"
              >
                {Object.entries(DIRECTION_LABELS).map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
            </div>

            {/* Timing */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                Timing
              </label>
              <select
                value={animation.timingFunction}
                onChange={(e) => handleAnimChange({ timingFunction: e.target.value as AnimationConfig['timingFunction'] })}
                className="w-full h-8 px-2 text-xs bg-background border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-ring"
              >
                {Object.entries(TIMING_LABELS).map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Loop toggle */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={animation.loop}
              onChange={(e) => handleAnimChange({ loop: e.target.checked })}
              className="accent-primary size-4"
            />
            <span className="text-xs font-medium text-muted-foreground">Loop animation</span>
          </label>
        </>
      )}

      {/* CSS output */}
      {animation.type !== 'static' && (
        <div className="space-y-2">
          <label className="text-xs font-semibold text-foreground">Generated CSS</label>
          <GradientExportCodeBlock
            code={cssCode}
            language="css"
            label="Animation CSS"
          />
        </div>
      )}
    </div>
  );
}
