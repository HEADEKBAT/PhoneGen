'use client';

import { useGradientStudioStore } from '@/lib/stores/gradientStudio';
import { gradientToCSS } from '@/lib/color-studio/gradients';
import { GradientPreviewCard } from './shared/GradientPreviewCard';
import { GradientTypeSelector } from './shared/GradientTypeSelector';
import { GradientStopBar } from './shared/GradientStopBar';
import { GradientAngleControl } from './shared/GradientAngleControl';
import { GradientPositionControl } from './shared/GradientPositionControl';
import { GradientBlendModePicker } from './shared/GradientBlendModePicker';
import { GradientNoiseControl } from './shared/GradientNoiseControl';
import { GradientMaskControl } from './shared/GradientMaskControl';
import { GradientFavButton } from './shared/GradientFavButton';
import { CopyButton } from '../shared/CopyButton';
import { ChevronDown, ChevronUp, RotateCcw, Copy, Check } from 'lucide-react';
import { useState, useCallback } from 'react';

export function GradientClassicTab() {
  const gradient = useGradientStudioStore((s) => s.currentGradient);
  const updateGradient = useGradientStudioStore((s) => s.updateCurrentGradient);
  const pushHistory = useGradientStudioStore((s) => s.pushHistory);
  const storeUndo = useGradientStudioStore((s) => s.undo);
  const storeRedo = useGradientStudioStore((s) => s.redo);
  const canUndo = useGradientStudioStore((s) => s.canUndo);
  const canRedo = useGradientStudioStore((s) => s.canRedo);

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showStops, setShowStops] = useState(true);
  const [cssCopied, setCssCopied] = useState(false);

  /* ── Change handlers ──────────────────────────────────────────────────── */

  /**
   * Quick on-the-fly update (slider drag, typing) — updates store in
   * real time but does NOT push history. Saves history spam and keeps
   * the slider responsive.
   */
  const handleQuick = useCallback((partial: Partial<typeof gradient>) => {
    updateGradient(partial);
  }, [updateGradient]);

  /**
   * Committed change — pushes history FIRST, then updates.
   * Used for discrete actions: type switching, adding/removing stops,
   * toggling advanced features, reset.
   */
  const handleCommit = useCallback((partial: Partial<typeof gradient>) => {
    pushHistory(gradient);
    updateGradient(partial);
  }, [gradient, pushHistory, updateGradient]);

  const isRadialOrConic =
    gradient.type === 'radial' || gradient.type === 'conic' ||
    gradient.type === 'repeating-radial';

  const cssCode = gradientToCSS(gradient);

  const handleCopyCss = useCallback(async () => {
    await navigator.clipboard.writeText(cssCode);
    setCssCopied(true);
    setTimeout(() => setCssCopied(false), 1500);
  }, [cssCode]);

  return (
    <div className="space-y-5">
      {/* ── Preview ─────────────────────────────────────────────────────── */}
      <div className="relative">
        <GradientPreviewCard gradient={gradient} height={200} showInfo />
        <div className="absolute top-3 right-3 flex gap-1.5">
          <GradientFavButton gradient={gradient} />
          <button
            type="button"
            onClick={handleCopyCss}
            className="p-1.5 rounded-lg bg-card border border-border/50 text-muted-foreground hover:text-foreground transition-colors"
            title="Copy CSS"
          >
            {cssCopied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
          </button>
          <button
            type="button"
            onClick={() => handleCommit({
              stops: gradient.stops.map((s, i) => ({
                ...s,
                color: i % 2 === 0 ? '#667eea' : '#764ba2',
              })),
            })}
            className="p-1.5 rounded-lg bg-card border border-border/50 text-muted-foreground hover:text-foreground transition-colors"
            title="Reset to defaults"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {/* ── Type selector ──────────────────────────────────────────────── */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-foreground">Gradient Type</label>
        <GradientTypeSelector
          value={gradient.type}
          onChange={(type) => handleCommit({ type })}
        />
      </div>

      {/* ── Angle ──────────────────────────────────────────────────────── */}
      {gradient.type !== 'radial' && gradient.type !== 'repeating-radial' && (
        <GradientAngleControl
          angle={gradient.angle}
          onChange={(angle) => handleQuick({ angle })}        // no history while dragging
          onCommit={(angle) => handleCommit({ angle })}        // push on release
        />
      )}

      {/* ── Position (radial / conic) ──────────────────────────────────── */}
      {isRadialOrConic && (
        <GradientPositionControl
          x={gradient.position?.x ?? 0.5}
          y={gradient.position?.y ?? 0.5}
          onChangeX={(x) => handleQuick({ position: { x, y: gradient.position?.y ?? 0.5 } })}
          onChangeY={(y) => handleQuick({ position: { x: gradient.position?.x ?? 0.5, y } })}
          onCommitX={(x) => handleCommit({ position: { x, y: gradient.position?.y ?? 0.5 } })}
          onCommitY={(y) => handleCommit({ position: { x: gradient.position?.x ?? 0.5, y } })}
        />
      )}

      {/* ── Color stops ────────────────────────────────────────────────── */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => setShowStops(!showStops)}
          className="flex items-center justify-between w-full"
        >
          <label className="text-xs font-semibold text-foreground">Color Stops ({gradient.stops.length})</label>
          {showStops ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {showStops && (
          <GradientStopBar
            stops={gradient.stops}
            onChange={(stops) => handleCommit({ stops })}
          />
        )}
      </div>

      {/* ── Advanced toggle ────────────────────────────────────────────── */}
      <button
        type="button"
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        {showAdvanced ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        {showAdvanced ? 'Hide Advanced' : 'Show Advanced'}
      </button>

      {showAdvanced && (
        <div className="space-y-4 pl-2 border-l-2 border-border/30">
          <GradientBlendModePicker
            value={gradient.blendMode ?? 'normal'}
            onChange={(blendMode) => handleCommit({ blendMode })}
          />
          <GradientNoiseControl
            noise={gradient.noise ?? null}
            onChange={(noise) => handleCommit({ noise })}
          />
          <GradientMaskControl
            mask={gradient.mask ?? null}
            onChange={(mask) => handleCommit({ mask })}
          />
        </div>
      )}

      {/* ── CSS Output (like cssgradient.io) ───────────────────────────── */}
      <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 border-b border-border/30">
          <h4 className="text-xs font-semibold text-foreground">CSS Code</h4>
          <button
            type="button"
            onClick={handleCopyCss}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          >
            {cssCopied ? <Check size={12} /> : <Copy size={12} />}
            {cssCopied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <pre className="text-[12px] font-mono p-4 overflow-x-auto text-foreground leading-relaxed bg-muted/30 select-all cursor-text">
          {cssCode}
        </pre>
      </div>

      {/* ── Undo / Redo ────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={storeUndo}
          disabled={!canUndo()}
          className="px-2.5 py-1 text-xs font-medium rounded-lg border border-border/50 bg-card text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          Undo
        </button>
        <button
          type="button"
          onClick={storeRedo}
          disabled={!canRedo()}
          className="px-2.5 py-1 text-xs font-medium rounded-lg border border-border/50 bg-card text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          Redo
        </button>
      </div>
    </div>
  );
}
