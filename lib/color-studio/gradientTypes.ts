/**
 * Gradient Studio — extended types.
 *
 * Full GradientConfig with meta, Mesh, Aurora, and recipe types.
 * These build on the base GradientDefinition in types.ts.
 */

import type {
  GradientDefinition,
  AnimationConfig,
  BlendMode,
  NoiseConfig,
  MaskConfig,
} from './types';

/* ── Mesh Gradient ──────────────────────────────────────────────────────────── */

/** A single point in a mesh gradient. */
export interface MeshPoint {
  id: string;
  color: string; // hex
  x: number; // 0–1 relative position
  y: number; // 0–1 relative position
  radius: number; // 0–100% of canvas
  intensity: number; // 0–100
  opacity: number; // 0–1
}

export interface MeshConfig {
  points: MeshPoint[];
  blur: number; // 50–400 px
  noise: number; // 0–100%
  contrast: number; // -100–100
  brightness: number; // 0–200
  saturation: number; // 0–200
}

/* ── Aurora Gradient ────────────────────────────────────────────────────────── */

/** A single layer in an aurora gradient. */
export interface AuroraLayer {
  id: string;
  color: string; // hex
  blurRadius: number; // px
  opacity: number; // 0–1
  blendMode: BlendMode;
  x: number; // 0–1 position
  y: number; // 0–1 position
  scale: number; // 0.1–3
  rotation: number; // 0–360 deg
  speed: number; // 1–10 (animation speed multiplier)
}

export type AuroraStyle =
  | 'ai'
  | 'vercel'
  | 'stripe'
  | 'linear'
  | 'openai'
  | 'glass'
  | 'neon'
  | 'purple-dream'
  | 'ocean'
  | 'cyber'
  | 'sunset'
  | 'nordic'
  | 'synthwave'
  | 'aurora-borealis'
  | 'holographic';

export interface AuroraConfig {
  layers: AuroraLayer[];
  style: AuroraStyle;
  globalBlur: number;
  globalSpeed: number;
  globalIntensity: number;
}

/* ── Background Builder ─────────────────────────────────────────────────────── */

export type BackgroundContext =
  | 'landing'
  | 'dashboard'
  | 'admin-panel'
  | 'portfolio'
  | 'mobile-app'
  | 'documentation'
  | 'pricing'
  | 'hero'
  | 'blog'
  | 'sidebar'
  | 'navbar'
  | 'card'
  | 'button'
  | 'cta';

export type BackgroundMood =
  | 'professional'
  | 'creative'
  | 'calm'
  | 'energetic'
  | 'luxury'
  | 'minimal'
  | 'dark'
  | 'light';

/* ── Recipe ─────────────────────────────────────────────────────────────────── */

export interface GradientRecipe {
  id: string;
  name: string;
  description: string;
  /** The full gradient configuration. */
  gradient: GradientConfig;
  /** All background context settings (for Background Builder). */
  context?: BackgroundContext;
  mood?: BackgroundMood;
  /** Tags for search. */
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

/* ── Full Gradient Config (extends GradientDefinition with meta) ────────────── */

export interface GradientConfig extends GradientDefinition {
  id: string;
  name: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
  /** Mesh gradient config (used when type is not a simple classic gradient). */
  mesh?: MeshConfig | null;
  /** Aurora config (for aurora mode). */
  aurora?: AuroraConfig | null;
}

/* ── Export ─────────────────────────────────────────────────────────────────── */

export type GradientExportFormat =
  | 'css'
  | 'tailwind'
  | 'svg'
  | 'png'
  | 'json'
  | 'react'
  | 'vue'
  | 'scss'
  | 'less'
  | 'style-dictionary';

export interface ExportOptions {
  format: GradientExportFormat;
  includeVariables: boolean;
  includeMeta: boolean;
  includeAnimation: boolean;
  includeNoise: boolean;
  includeMasks: boolean;
}

/* ── Collection / Preset ────────────────────────────────────────────────────── */

export type CollectionCategory =
  | 'minimal'
  | 'corporate'
  | 'ai'
  | 'crypto'
  | 'medical'
  | 'gaming'
  | 'luxury'
  | 'pastel'
  | 'dark'
  | 'light'
  | 'warm'
  | 'cold'
  | 'nature'
  | 'ocean'
  | 'forest'
  | 'coffee'
  | 'sunset'
  | 'synthwave'
  | 'cyberpunk'
  | 'glass'
  | 'mesh'
  | 'aurora'
  | 'glow'
  | 'neon'
  | 'business';

export interface GradientPreset {
  id: string;
  name: string;
  description: string;
  category: CollectionCategory;
  gradient: GradientConfig;
  popularity: number; // 0–100
  isPremium: boolean;
}

/* ── Defaults ───────────────────────────────────────────────────────────────── */

export function createDefaultMeshPoint(index: number): MeshPoint {
  const colors = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b', '#fa709a'];
  const positions = [
    { x: 0.2, y: 0.3 },
    { x: 0.8, y: 0.3 },
    { x: 0.5, y: 0.7 },
    { x: 0.3, y: 0.6 },
    { x: 0.7, y: 0.8 },
    { x: 0.5, y: 0.2 },
  ];
  const p = positions[index % positions.length];
  return {
    id: `mesh-point-${index}`,
    color: colors[index % colors.length],
    x: p.x,
    y: p.y,
    radius: 30 + (index * 5),
    intensity: 80 - (index * 5),
    opacity: 0.8 - (index * 0.05),
  };
}

export function createDefaultAuroraLayer(index: number): AuroraLayer {
  const colors = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b', '#fa709a'];
  const positions = [
    { x: 0.2, y: 0.2 },
    { x: 0.8, y: 0.2 },
    { x: 0.5, y: 0.8 },
    { x: 0.8, y: 0.7 },
    { x: 0.3, y: 0.6 },
    { x: 0.5, y: 0.3 },
  ];
  const p = positions[index % positions.length];
  return {
    id: `aurora-layer-${index}`,
    color: colors[index % colors.length],
    blurRadius: 120 + (index * 20),
    opacity: 0.3 + (index * 0.05),
    blendMode: 'normal',
    x: p.x,
    y: p.y,
    scale: 1 + (index * 0.2),
    rotation: index * 60,
    speed: 3 + index,
  };
}

export const DEFAULT_AURORA_STYLES: Record<AuroraStyle, { name: string; layers: Partial<AuroraLayer>[] }> = {
  ai: { name: 'AI', layers: [
    { color: '#667eea', blurRadius: 180, opacity: 0.4, x: 0.2, y: 0.3 },
    { color: '#764ba2', blurRadius: 200, opacity: 0.35, x: 0.7, y: 0.6 },
    { color: '#4facfe', blurRadius: 150, opacity: 0.3, x: 0.5, y: 0.2 },
  ]},
  vercel: { name: 'Vercel', layers: [
    { color: '#000000', blurRadius: 120, opacity: 0.5, x: 0.5, y: 0.5 },
    { color: '#ffffff', blurRadius: 100, opacity: 0.15, x: 0.3, y: 0.3 },
  ]},
  stripe: { name: 'Stripe', layers: [
    { color: '#6772E5', blurRadius: 160, opacity: 0.4, x: 0.3, y: 0.3 },
    { color: '#32325D', blurRadius: 140, opacity: 0.3, x: 0.7, y: 0.7 },
  ]},
  linear: { name: 'Linear', layers: [
    { color: '#5E6AD2', blurRadius: 150, opacity: 0.35, x: 0.2, y: 0.2 },
    { color: '#8B5CF6', blurRadius: 180, opacity: 0.3, x: 0.8, y: 0.8 },
  ]},
  openai: { name: 'OpenAI', layers: [
    { color: '#10A37F', blurRadius: 160, opacity: 0.35, x: 0.3, y: 0.4 },
    { color: '#1A1A2E', blurRadius: 140, opacity: 0.3, x: 0.7, y: 0.6 },
  ]},
  glass: { name: 'Glass', layers: [
    { color: '#ffffff', blurRadius: 100, opacity: 0.15, x: 0.5, y: 0.5 },
    { color: '#cccccc', blurRadius: 120, opacity: 0.1, x: 0.3, y: 0.3 },
  ]},
  neon: { name: 'Neon', layers: [
    { color: '#ff00ff', blurRadius: 200, opacity: 0.5, x: 0.2, y: 0.2 },
    { color: '#00ffff', blurRadius: 200, opacity: 0.5, x: 0.8, y: 0.8 },
    { color: '#ffff00', blurRadius: 150, opacity: 0.4, x: 0.5, y: 0.5 },
  ]},
  'purple-dream': { name: 'Purple Dream', layers: [
    { color: '#8B5CF6', blurRadius: 200, opacity: 0.5, x: 0.2, y: 0.1 },
    { color: '#EC4899', blurRadius: 180, opacity: 0.4, x: 0.8, y: 0.3 },
    { color: '#6366F1', blurRadius: 160, opacity: 0.35, x: 0.5, y: 0.8 },
  ]},
  ocean: { name: 'Ocean', layers: [
    { color: '#06b6d4', blurRadius: 180, opacity: 0.4, x: 0.2, y: 0.2 },
    { color: '#3b82f6', blurRadius: 160, opacity: 0.35, x: 0.7, y: 0.3 },
    { color: '#1e3a5f', blurRadius: 200, opacity: 0.3, x: 0.5, y: 0.8 },
  ]},
  cyber: { name: 'Cyber', layers: [
    { color: '#ff0080', blurRadius: 180, opacity: 0.5, x: 0.2, y: 0.1 },
    { color: '#00ffcc', blurRadius: 180, opacity: 0.4, x: 0.8, y: 0.9 },
    { color: '#7000ff', blurRadius: 160, opacity: 0.35, x: 0.5, y: 0.5 },
  ]},
  sunset: { name: 'Sunset', layers: [
    { color: '#ff6b6b', blurRadius: 180, opacity: 0.5, x: 0.1, y: 0.1 },
    { color: '#ffa94d', blurRadius: 160, opacity: 0.4, x: 0.5, y: 0.3 },
    { color: '#ffd93d', blurRadius: 140, opacity: 0.35, x: 0.8, y: 0.2 },
  ]},
  nordic: { name: 'Nordic', layers: [
    { color: '#88c0d0', blurRadius: 160, opacity: 0.35, x: 0.2, y: 0.2 },
    { color: '#81a1c1', blurRadius: 140, opacity: 0.3, x: 0.7, y: 0.3 },
    { color: '#bf616a', blurRadius: 180, opacity: 0.2, x: 0.5, y: 0.8 },
  ]},
  synthwave: { name: 'Synthwave', layers: [
    { color: '#ff00ff', blurRadius: 200, opacity: 0.4, x: 0.3, y: 0.2 },
    { color: '#00ffff', blurRadius: 180, opacity: 0.35, x: 0.7, y: 0.8 },
    { color: '#ff0080', blurRadius: 160, opacity: 0.3, x: 0.5, y: 0.5 },
  ]},
  'aurora-borealis': { name: 'Aurora Borealis', layers: [
    { color: '#00ff87', blurRadius: 200, opacity: 0.4, x: 0.1, y: 0.2 },
    { color: '#60efff', blurRadius: 200, opacity: 0.35, x: 0.5, y: 0.1 },
    { color: '#0062ff', blurRadius: 180, opacity: 0.3, x: 0.9, y: 0.3 },
    { color: '#a855f7', blurRadius: 160, opacity: 0.25, x: 0.5, y: 0.7 },
  ]},
  holographic: { name: 'Holographic', layers: [
    { color: '#ff0080', blurRadius: 180, opacity: 0.3, x: 0.2, y: 0.2 },
    { color: '#7928ca', blurRadius: 180, opacity: 0.3, x: 0.8, y: 0.2 },
    { color: '#00dfd8', blurRadius: 180, opacity: 0.3, x: 0.5, y: 0.8 },
    { color: '#ff4d4d', blurRadius: 160, opacity: 0.2, x: 0.3, y: 0.6 },
  ]},
};

/** Generate a unique ID. */
export function generateGradientId(): string {
  return `grad-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/** Create a default GradientConfig. */
export function createDefaultGradientConfig(): GradientConfig {
  return {
    id: generateGradientId(),
    name: 'New Gradient',
    type: 'linear',
    angle: 135,
    stops: [
      { offset: 0, color: '#667eea', opacity: 1 },
      { offset: 1, color: '#764ba2', opacity: 1 },
    ],
    tags: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    position: { x: 0.5, y: 0.5 },
    shape: 'circle',
    size: 'farthest-corner',
    blendMode: 'normal',
    noise: null,
    mask: null,
    animation: null,
    mesh: null,
    aurora: null,
  };
}
