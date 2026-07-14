'use client';

import { useState, useMemo } from 'react';
import { useGradientStudioStore } from '@/lib/stores/gradientStudio';
import { getAuroraStyleMetas } from '@/lib/color-studio/gradientAurora';
import { auroraToCSS } from '@/lib/color-studio/gradientAurora';
import type { AuroraConfig, AuroraLayer, AuroraStyle } from '@/lib/color-studio/gradientTypes';
import { createDefaultAuroraLayer, DEFAULT_AURORA_STYLES } from '@/lib/color-studio/gradientTypes';
import { ColorPicker } from '../shared/ColorPicker';
import { Plus, Trash2, Sparkles } from 'lucide-react';

export function GradientAuroraTab() {
  const [config, setConfig] = useState<AuroraConfig>(() => {
    const style: AuroraStyle = 'aurora-borealis';
    const preset = DEFAULT_AURORA_STYLES[style];
    return {
      style,
      globalBlur: 150,
      globalSpeed: 5,
      globalIntensity: 70,
      layers: preset.layers.map((l, i) => ({
        id: `layer-${i}`,
        color: l.color ?? '#00ff87',
        blurRadius: l.blurRadius ?? 180,
        opacity: l.opacity ?? 0.35,
        blendMode: 'normal' as const,
        x: l.x ?? 0.5,
        y: l.y ?? 0.5,
        scale: 1,
        rotation: 0,
        speed: 5 + i,
      })),
    };
  });

  const styles = useMemo(() => getAuroraStyleMetas(), []);
  const cssValue = useMemo(() => auroraToCSS(config), [config]);

  const selectStyle = (style: AuroraStyle) => {
    const preset = DEFAULT_AURORA_STYLES[style];
    if (!preset) return;
    setConfig({
      style,
      globalBlur: 150,
      globalSpeed: 5,
      globalIntensity: 70,
      layers: preset.layers.map((l, i) => ({
        id: `layer-${Date.now()}-${i}`,
        color: l.color ?? '#667eea',
        blurRadius: l.blurRadius ?? 150,
        opacity: l.opacity ?? 0.3,
        blendMode: 'normal' as const,
        x: l.x ?? 0.5,
        y: l.y ?? 0.5,
        scale: 1,
        rotation: 0,
        speed: 5,
      })),
    });
  };

  const updateLayer = (idx: number, partial: Partial<AuroraLayer>) => {
    setConfig((prev) => ({
      ...prev,
      layers: prev.layers.map((l, i) => (i === idx ? { ...l, ...partial } : l)),
    }));
  };

  const removeLayer = (idx: number) => {
    if (config.layers.length <= 1) return;
    setConfig((prev) => ({
      ...prev,
      layers: prev.layers.filter((_, i) => i !== idx),
    }));
  };

  const addLayer = () => {
    const idx = config.layers.length;
    const layer = createDefaultAuroraLayer(idx);
    setConfig((prev) => ({
      ...prev,
      layers: [...prev.layers, layer],
    }));
  };

  return (
    <div className="space-y-5">
      {/* Live preview */}
      <div className="relative rounded-xl border border-border/50 overflow-hidden h-56">
        <div
          className="absolute inset-0"
          style={{ background: cssValue, backgroundBlendMode: 'overlay' }}
        />
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute bottom-3 left-3 px-2.5 py-1 bg-black/60 backdrop-blur-sm rounded-full text-[10px] font-medium text-white">
          {DEFAULT_AURORA_STYLES[config.style]?.name ?? 'Custom'} · {config.layers.length} layers
        </div>
      </div>

      {/* Style presets */}
      <div>
        <div className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
          <Sparkles size={14} /> Preset Styles
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {styles.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => selectStyle(s.key)}
              className={`p-2 rounded-xl border text-left transition-colors ${
                config.style === s.key
                  ? 'bg-primary/10 border-primary'
                  : 'bg-card border-border/50 hover:border-border'
              }`}
            >
              {/* Mini color bar */}
              <div
                className="h-4 rounded-md mb-1.5"
                style={{
                  background: `linear-gradient(135deg, ${s.colors.slice(0, 3).join(', ')})`,
                }}
              />
              <span className={`text-[10px] font-medium ${config.style === s.key ? 'text-primary' : 'text-foreground'}`}>
                {s.name}
              </span>
              <span className="text-[9px] text-muted-foreground block">{s.layerCount} layers</span>
            </button>
          ))}
        </div>
      </div>

      {/* Layer editor */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-foreground">Layers ({config.layers.length})</label>
          <button
            type="button"
            onClick={addLayer}
            className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-medium rounded-lg border border-border/50 bg-card hover:bg-muted transition-colors"
          >
            <Plus size={12} /> Add Layer
          </button>
        </div>

        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {config.layers.map((layer, idx) => (
            <div
              key={layer.id}
              className="p-3 rounded-xl border border-border/50 bg-card space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="size-4 rounded border border-border/50" style={{ backgroundColor: layer.color }} />
                  <span className="text-xs font-medium text-foreground">Layer {idx + 1}</span>
                  <span className="text-[10px] text-muted-foreground">
                    ({Math.round(layer.x * 100)}%, {Math.round(layer.y * 100)}%)
                  </span>
                </div>
                {config.layers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeLayer(idx)}
                    className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-[10px] font-medium text-muted-foreground uppercase">Color</label>
                  <ColorPicker
                    hex={layer.color}
                    onChange={(hex: string) => updateLayer(idx, { color: hex })}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-medium text-muted-foreground uppercase">
                    Opacity: {Math.round(layer.opacity * 100)}%
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={Math.round(layer.opacity * 100)}
                    onChange={(e) => updateLayer(idx, { opacity: parseInt(e.target.value) / 100 })}
                    className="w-full h-1 accent-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-medium text-muted-foreground uppercase">
                    Blur: {layer.blurRadius}px
                  </label>
                  <input
                    type="range"
                    min={40}
                    max={400}
                    value={layer.blurRadius}
                    onChange={(e) => updateLayer(idx, { blurRadius: parseInt(e.target.value) })}
                    className="w-full h-1 accent-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-medium text-muted-foreground uppercase">X: {Math.round(layer.x * 100)}%</label>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={Math.round(layer.x * 100)}
                    onChange={(e) => updateLayer(idx, { x: parseInt(e.target.value) / 100 })}
                    className="w-full h-1 accent-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-medium text-muted-foreground uppercase">Y: {Math.round(layer.y * 100)}%</label>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={Math.round(layer.y * 100)}
                    onChange={(e) => updateLayer(idx, { y: parseInt(e.target.value) / 100 })}
                    className="w-full h-1 accent-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-medium text-muted-foreground uppercase">Scale: {layer.scale}x</label>
                  <input
                    type="range"
                    min={10}
                    max={300}
                    value={Math.round(layer.scale * 100)}
                    onChange={(e) => updateLayer(idx, { scale: parseInt(e.target.value) / 100 })}
                    className="w-full h-1 accent-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-medium text-muted-foreground uppercase">Speed: {layer.speed}</label>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={layer.speed}
                    onChange={(e) => updateLayer(idx, { speed: parseInt(e.target.value) })}
                    className="w-full h-1 accent-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-medium text-muted-foreground uppercase">Rotation</label>
                  <input
                    type="range"
                    min={0}
                    max={360}
                    value={layer.rotation}
                    onChange={(e) => updateLayer(idx, { rotation: parseInt(e.target.value) })}
                    className="w-full h-1 accent-primary"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
