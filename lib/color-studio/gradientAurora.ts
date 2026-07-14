/**
 * Gradient Studio — Aurora gradient engine.
 *
 * Builds multi-layer CSS box-shadow aurora effects.
 * Each layer is a blurred color circle positioned in 2D space.
 */

import type { AuroraConfig, AuroraLayer, AuroraStyle } from './gradientTypes';
import { DEFAULT_AURORA_STYLES } from './gradientTypes';
import type { BlendMode } from './types';

/** Build a single aurora layer's CSS. */
export function auroraLayerCSS(layer: AuroraLayer): string {
  const x = layer.x * 100;
  const y = layer.y * 100;
  const blur = layer.blurRadius;

  return `radial-gradient(circle at ${x}% ${y}%, ${layer.color} 0%, transparent ${blur}px)`;
}

/** Build full CSS background for an aurora config. */
export function auroraToCSS(config: AuroraConfig): string {
  const layerCSS = config.layers.map(auroraLayerCSS).join(',\n  ');
  return layerCSS;
}

/** Build CSS blend mode overlay for aurora layers. */
export function auroraBlendModeCSS(config: AuroraConfig): string {
  // The outermost layer's blend mode drives the overall effect
  const dominant = config.layers[config.layers.length - 1]?.blendMode ?? 'normal';
  return `mix-blend-mode: ${dominant};`;
}

/** Create a default aurora config from a style preset. */
export function createAuroraFromStyle(style: AuroraStyle): AuroraConfig {
  const preset = DEFAULT_AURORA_STYLES[style];
  if (!preset) {
    return {
      layers: [],
      style: 'ai',
      globalBlur: 150,
      globalSpeed: 5,
      globalIntensity: 70,
    };
  }

  return {
    style,
    layers: preset.layers.map((l, i) => ({
      id: `aurora-layer-${i}`,
      color: l.color ?? '#667eea',
      blurRadius: l.blurRadius ?? 150,
      opacity: l.opacity ?? 0.3,
      blendMode: (l.blendMode ?? 'normal') as BlendMode,
      x: l.x ?? 0.5,
      y: l.y ?? 0.5,
      scale: l.scale ?? 1,
      rotation: l.rotation ?? 0,
      speed: l.speed ?? 5,
    })),
    globalBlur: 150,
    globalSpeed: 5,
    globalIntensity: 70,
  };
}

/** Get all aurora style metadata for UI display. */
export interface AuroraStyleMeta {
  key: AuroraStyle;
  name: string;
  layerCount: number;
  colors: string[];
}

export function getAuroraStyleMetas(): AuroraStyleMeta[] {
  return (Object.entries(DEFAULT_AURORA_STYLES) as [AuroraStyle, { name: string; layers: Partial<AuroraLayer>[] }][])
    .map(([key, val]) => ({
      key,
      name: val.name,
      layerCount: val.layers.length,
      colors: val.layers.map((l) => l.color ?? '#000'),
    }));
}
