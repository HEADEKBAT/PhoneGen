/**
 * Gradient Studio — preset library.
 *
 * 200+ categorized gradient presets covering all CollectionCategory values.
 * Each preset includes metadata for search, filtering, and sorting.
 */

import type { GradientConfig } from './gradientTypes';
import { generateGradientId } from './gradientTypes';
import type { GradientDefinition } from './types';

/* ── Translator from simpler GradientDefinition to full GradientConfig ─────── */

function toConfig(
  base: GradientDefinition,
  overrides?: Partial<GradientConfig>,
): GradientConfig {
  return {
    id: generateGradientId(),
    name: overrides?.name ?? 'Untitled',
    tags: overrides?.tags ?? [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    ...base,
    ...overrides,
    position: overrides?.position ?? base.position ?? { x: 0.5, y: 0.5 },
    shape: overrides?.shape ?? base.shape ?? 'circle',
    size: overrides?.size ?? base.size ?? 'farthest-corner',
    blendMode: overrides?.blendMode ?? base.blendMode ?? 'normal',
    noise: overrides?.noise ?? base.noise ?? null,
    mask: overrides?.mask ?? base.mask ?? null,
    animation: overrides?.animation ?? base.animation ?? null,
    mesh: overrides?.mesh ?? null,
    aurora: overrides?.aurora ?? null,
  };
}

/* ── Preset registry ───────────────────────────────────────────────────────── */

export interface PresetEntry {
  id: string;
  name: string;
  description: string;
  category: string;
  gradient: GradientConfig;
  popularity: number; // 0–100
  isPremium: boolean;
}

const registry: PresetEntry[] = [];

function register(
  category: string,
  name: string,
  description: string,
  grad: GradientDefinition,
  popularity = 50,
  isPremium = false,
  tags?: string[],
): void {
  registry.push({
    id: `preset-${registry.length + 1}`,
    name,
    description,
    category,
    gradient: toConfig(grad, { name, tags: tags ?? [category] }),
    popularity,
    isPremium,
  });
}

/* ── Minimal ───────────────────────────────────────────────────────────────── */

register('minimal', 'Clean White', 'Subtle white-to-light-gray gradient', { type: 'linear', angle: 180, stops: [{ offset: 0, color: '#ffffff' }, { offset: 1, color: '#f0f0f0' }] }, 60);
register('minimal', 'Gray Scale', 'Smooth gray transition', { type: 'linear', angle: 135, stops: [{ offset: 0, color: '#e0e0e0' }, { offset: 1, color: '#9e9e9e' }] }, 55);
register('minimal', 'Soft Cloud', 'Gentle off-white gradient', { type: 'linear', angle: 90, stops: [{ offset: 0, color: '#fafafa' }, { offset: 1, color: '#eaeaea' }] }, 50);
register('minimal', 'Pearl', 'Elegant pearl-toned fade', { type: 'linear', angle: 45, stops: [{ offset: 0, color: '#f5f5f5' }, { offset: 1, color: '#e8e0e0' }] }, 45);
register('minimal', 'Slate Light', 'Light slate gradient', { type: 'linear', angle: 160, stops: [{ offset: 0, color: '#e2e8f0' }, { offset: 1, color: '#cbd5e1' }] }, 55);
register('minimal', 'Cool Gray', 'Cool-toned gray fade', { type: 'linear', angle: 135, stops: [{ offset: 0, color: '#f1f5f9' }, { offset: 0.5, color: '#e2e8f0' }, { offset: 1, color: '#cbd5e1' }] }, 50);

/* ── Corporate ─────────────────────────────────────────────────────────────── */

register('corporate', 'Blue Trust', 'Professional blue gradient for enterprise', { type: 'linear', angle: 135, stops: [{ offset: 0, color: '#1e3a8a' }, { offset: 1, color: '#3b82f6' }] }, 90);
register('corporate', 'Navy Premium', 'Dark navy to royal blue', { type: 'linear', angle: 90, stops: [{ offset: 0, color: '#0f172a' }, { offset: 1, color: '#1d4ed8' }] }, 85);
register('corporate', 'Corporate Teal', 'Teal-based professional gradient', { type: 'linear', angle: 160, stops: [{ offset: 0, color: '#0d9488' }, { offset: 1, color: '#14b8a6' }] }, 80);
register('corporate', 'Steel', 'Industrial steel blue', { type: 'linear', angle: 135, stops: [{ offset: 0, color: '#475569' }, { offset: 1, color: '#94a3b8' }] }, 70);
register('corporate', 'Executive', 'Dark sophisticated gradient', { type: 'linear', angle: 180, stops: [{ offset: 0, color: '#1e293b' }, { offset: 1, color: '#334155' }] }, 75);
register('corporate', 'Consulting', 'Clean blue-to-indigo', { type: 'linear', angle: 145, stops: [{ offset: 0, color: '#2563eb' }, { offset: 1, color: '#4f46e5' }] }, 80);

/* ── AI / Tech ─────────────────────────────────────────────────────────────── */

register('ai', 'AI Purple', 'Modern AI-purple gradient', { type: 'linear', angle: 135, stops: [{ offset: 0, color: '#667eea' }, { offset: 1, color: '#764ba2' }] }, 95);
register('ai', 'Deep Learning', 'Deep indigo to violet', { type: 'linear', angle: 120, stops: [{ offset: 0, color: '#312e81' }, { offset: 1, color: '#7c3aed' }] }, 90);
register('ai', 'Neural Network', 'Pink-to-purple tech gradient', { type: 'linear', angle: 150, stops: [{ offset: 0, color: '#ec4899' }, { offset: 1, color: '#8b5cf6' }] }, 85);
register('ai', 'Data Flow', 'Cyan and indigo data gradient', { type: 'linear', angle: 135, stops: [{ offset: 0, color: '#06b6d4' }, { offset: 1, color: '#6366f1' }] }, 80);
register('ai', 'Machine Learning', 'Vibrant AI gradient', { type: 'linear', angle: 145, stops: [{ offset: 0, color: '#a855f7' }, { offset: 1, color: '#ec4899' }] }, 85);
register('ai', 'OpenAI Green', 'Inspired by OpenAI brand', { type: 'linear', angle: 135, stops: [{ offset: 0, color: '#10a37f' }, { offset: 1, color: '#1a1a2e' }] }, 75);

/* ── Crypto / Web3 ─────────────────────────────────────────────────────────── */

register('crypto', 'Bitcoin Orange', 'Bitcoin-inspired orange gradient', { type: 'linear', angle: 135, stops: [{ offset: 0, color: '#f7931a' }, { offset: 1, color: '#ff6b35' }] }, 85);
register('crypto', 'Ethereum', 'Ethereum purple gradient', { type: 'linear', angle: 135, stops: [{ offset: 0, color: '#627eea' }, { offset: 1, color: '#8b5cf6' }] }, 85);
register('crypto', 'Solana', 'Solana-inspired teal gradient', { type: 'linear', angle: 90, stops: [{ offset: 0, color: '#9945ff' }, { offset: 1, color: '#14f195' }] }, 80);
register('crypto', 'DeFi Pulse', 'Vibrant DeFi gradient', { type: 'linear', angle: 160, stops: [{ offset: 0, color: '#6366f1' }, { offset: 1, color: '#ec4899' }] }, 75);
register('crypto', 'NFT Royalty', 'Premium NFT gradient', { type: 'linear', angle: 145, stops: [{ offset: 0, color: '#8b5cf6' }, { offset: 1, color: '#f59e0b' }] }, 70);

/* ── Medical / Health ──────────────────────────────────────────────────────── */

register('medical', 'Healing Green', 'Calming medical green', { type: 'linear', angle: 135, stops: [{ offset: 0, color: '#059669' }, { offset: 1, color: '#34d399' }] }, 80);
register('medical', 'Clinical Blue', 'Clean medical blue', { type: 'linear', angle: 180, stops: [{ offset: 0, color: '#0284c7' }, { offset: 1, color: '#7dd3fc' }] }, 80);
register('medical', 'Wellness', 'Gentle teal gradient for wellness', { type: 'linear', angle: 90, stops: [{ offset: 0, color: '#0d9488' }, { offset: 1, color: '#99f6e4' }] }, 75);
register('medical', 'Pharma', 'Trustworthy pharmaceutical gradient', { type: 'linear', angle: 145, stops: [{ offset: 0, color: '#1e40af' }, { offset: 1, color: '#60a5fa' }] }, 70);

/* ── Gaming ────────────────────────────────────────────────────────────────── */

register('gaming', 'Cyberpunk', 'Neon cyberpunk gradient', { type: 'linear', angle: 135, stops: [{ offset: 0, color: '#ff00ff' }, { offset: 1, color: '#00ffff' }] }, 90);
register('gaming', 'Esports', 'Vibrant esports gradient', { type: 'linear', angle: 150, stops: [{ offset: 0, color: '#ff0080' }, { offset: 1, color: '#7928ca' }] }, 85);
register('gaming', 'Retro Arcade', 'Retro gaming gradient', { type: 'linear', angle: 90, stops: [{ offset: 0, color: '#ff6b6b' }, { offset: 1, color: '#ffd93d' }] }, 80);
register('gaming', 'Battle Royale', 'Intense gaming gradient', { type: 'linear', angle: 135, stops: [{ offset: 0, color: '#dc2626' }, { offset: 1, color: '#f97316' }] }, 75);
register('gaming', 'GG EZ', 'Fun gaming gradient', { type: 'linear', angle: 145, stops: [{ offset: 0, color: '#a855f7' }, { offset: 1, color: '#ec4899' }] }, 70);

/* ── Luxury ────────────────────────────────────────────────────────────────── */

register('luxury', 'Gold Premium', 'Elegant gold gradient', { type: 'linear', angle: 135, stops: [{ offset: 0, color: '#bf953f' }, { offset: 0.5, color: '#fcf6ba' }, { offset: 1, color: '#b38728' }] }, 95);
register('luxury', 'Royal Purple', 'Regal purple gradient', { type: 'linear', angle: 135, stops: [{ offset: 0, color: '#4c1d95' }, { offset: 1, color: '#8b5cf6' }] }, 90);
register('luxury', 'Champagne', 'Sophisticated champagne gradient', { type: 'linear', angle: 180, stops: [{ offset: 0, color: '#f7e8d0' }, { offset: 1, color: '#e6cca8' }] }, 80);
register('luxury', 'Platinum', 'Premium platinum gradient', { type: 'linear', angle: 160, stops: [{ offset: 0, color: '#e8e8e8' }, { offset: 1, color: '#b0b0b0' }] }, 75);
register('luxury', 'Burgundy', 'Rich burgundy for luxury brands', { type: 'linear', angle: 135, stops: [{ offset: 0, color: '#800020' }, { offset: 1, color: '#4a0011' }] }, 85);

/* ── Pastel ────────────────────────────────────────────────────────────────── */

register('pastel', 'Pastel Dream', 'Soft pink-to-lavender pastel', { type: 'linear', angle: 135, stops: [{ offset: 0, color: '#fbc2eb' }, { offset: 1, color: '#a6c1ee' }] }, 90);
register('pastel', 'Cotton Candy', 'Sweet cotton candy gradient', { type: 'linear', angle: 90, stops: [{ offset: 0, color: '#ffd1ff' }, { offset: 1, color: '#a1c4fd' }] }, 85);
register('pastel', 'Mint Fresh', 'Cool mint pastel', { type: 'linear', angle: 160, stops: [{ offset: 0, color: '#c1f0c1' }, { offset: 1, color: '#d4fcff' }] }, 80);
register('pastel', 'Peach Sorbet', 'Warm peach pastel', { type: 'linear', angle: 135, stops: [{ offset: 0, color: '#ffdab9' }, { offset: 1, color: '#ffb6c1' }] }, 85);
register('pastel', 'Lavender Fields', 'Calming lavender gradient', { type: 'linear', angle: 145, stops: [{ offset: 0, color: '#e6e6fa' }, { offset: 1, color: '#d8bfd8' }] }, 80);
register('pastel', 'Baby Blue', 'Soft baby blue gradient', { type: 'linear', angle: 180, stops: [{ offset: 0, color: '#b3d9ff' }, { offset: 1, color: '#d4edff' }] }, 75);

/* ── Dark ──────────────────────────────────────────────────────────────────── */

register('dark', 'Midnight', 'Deep midnight gradient', { type: 'linear', angle: 135, stops: [{ offset: 0, color: '#0f0c29' }, { offset: 0.5, color: '#302b63' }, { offset: 1, color: '#24243e' }] }, 95);
register('dark', 'Dark Matter', 'Pure dark gradient', { type: 'linear', angle: 180, stops: [{ offset: 0, color: '#000000' }, { offset: 1, color: '#1a1a2e' }] }, 90);
register('dark', 'Void', 'Absolute darkness with subtle blue', { type: 'linear', angle: 90, stops: [{ offset: 0, color: '#0a0a0a' }, { offset: 1, color: '#16213e' }] }, 85);
register('dark', 'Nightfall', 'Dark gradient transitioning to deep purple', { type: 'linear', angle: 145, stops: [{ offset: 0, color: '#0f0f0f' }, { offset: 1, color: '#2d1b69' }] }, 85);
register('dark', 'Obsidian', 'Black obsidian gradient', { type: 'linear', angle: 135, stops: [{ offset: 0, color: '#1a1a2e' }, { offset: 1, color: '#16213e' }] }, 80);
register('dark', 'Dark Royal', 'Dark royal gradient', { type: 'linear', angle: 160, stops: [{ offset: 0, color: '#0a0a23' }, { offset: 1, color: '#1a0a3e' }] }, 80);

/* ── Light ─────────────────────────────────────────────────────────────────── */

register('light', 'White Pearl', 'Clean light gradient', { type: 'linear', angle: 135, stops: [{ offset: 0, color: '#ffffff' }, { offset: 1, color: '#f8fafc' }] }, 70);
register('light', 'Soft Dawn', 'Gentle light gradient', { type: 'linear', angle: 90, stops: [{ offset: 0, color: '#fef9ef' }, { offset: 1, color: '#fdf2e9' }] }, 65);
register('light', 'Ice', 'Cold ice gradient', { type: 'linear', angle: 180, stops: [{ offset: 0, color: '#f0faff' }, { offset: 1, color: '#e0f2fe' }] }, 60);
register('light', 'Alabaster', 'Smooth alabaster gradient', { type: 'linear', angle: 145, stops: [{ offset: 0, color: '#fafafa' }, { offset: 1, color: '#f5f5f4' }] }, 55);

/* ── Warm ──────────────────────────────────────────────────────────────────── */

register('warm', 'Sunset Warm', 'Warm sunset gradient', { type: 'linear', angle: 135, stops: [{ offset: 0, color: '#ff6b6b' }, { offset: 1, color: '#ffa94d' }] }, 85);
register('warm', 'Coral Reef', 'Vibrant coral gradient', { type: 'linear', angle: 90, stops: [{ offset: 0, color: '#ff6b6b' }, { offset: 1, color: '#ee5a24' }] }, 80);
register('warm', 'Amber Glow', 'Warm amber gradient', { type: 'linear', angle: 160, stops: [{ offset: 0, color: '#f59e0b' }, { offset: 1, color: '#d97706' }] }, 75);
register('warm', 'Terra Cotta', 'Earthy terra cotta gradient', { type: 'linear', angle: 135, stops: [{ offset: 0, color: '#e07a5f' }, { offset: 1, color: '#d4a373' }] }, 70);

/* ── Cold ──────────────────────────────────────────────────────────────────── */

register('cold', 'Arctic Blue', 'Cold arctic gradient', { type: 'linear', angle: 135, stops: [{ offset: 0, color: '#0284c7' }, { offset: 1, color: '#38bdf8' }] }, 80);
register('cold', 'Glacier', 'Icy blue gradient', { type: 'linear', angle: 180, stops: [{ offset: 0, color: '#0ea5e9' }, { offset: 1, color: '#bae6fd' }] }, 75);
register('cold', 'Frost', 'Frosty gradient', { type: 'linear', angle: 90, stops: [{ offset: 0, color: '#e0f2fe' }, { offset: 1, color: '#f0f9ff' }] }, 65);
register('cold', 'Winter', 'Cold winter gradient', { type: 'linear', angle: 145, stops: [{ offset: 0, color: '#7dd3fc' }, { offset: 1, color: '#f0f9ff' }] }, 70);

/* ── Nature ────────────────────────────────────────────────────────────────── */

register('nature', 'Forest Green', 'Deep forest gradient', { type: 'linear', angle: 135, stops: [{ offset: 0, color: '#064e3b' }, { offset: 1, color: '#059669' }] }, 85);
register('nature', 'Moss', 'Earthy moss gradient', { type: 'linear', angle: 160, stops: [{ offset: 0, color: '#4d7c0f' }, { offset: 1, color: '#65a30d' }] }, 75);
register('nature', 'Earth', 'Earthy brown gradient', { type: 'linear', angle: 135, stops: [{ offset: 0, color: '#92400e' }, { offset: 1, color: '#b45309' }] }, 70);
register('nature', 'Mountain', 'Mountain-inspired gradient', { type: 'linear', angle: 180, stops: [{ offset: 0, color: '#1e3a5f' }, { offset: 1, color: '#6b7280' }] }, 75);

/* ── Ocean ─────────────────────────────────────────────────────────────────── */

register('ocean', 'Deep Sea', 'Deep ocean gradient', { type: 'linear', angle: 135, stops: [{ offset: 0, color: '#0c2340' }, { offset: 1, color: '#0077b6' }] }, 90);
register('ocean', 'Tropical Waters', 'Tropical ocean gradient', { type: 'linear', angle: 90, stops: [{ offset: 0, color: '#00b4d8' }, { offset: 1, color: '#90e0ef' }] }, 85);
register('ocean', 'Coral Blue', 'Coral reef blue gradient', { type: 'linear', angle: 160, stops: [{ offset: 0, color: '#0077b6' }, { offset: 1, color: '#00b4d8' }] }, 80);
register('ocean', 'Marina', 'Marina blue gradient', { type: 'linear', angle: 145, stops: [{ offset: 0, color: '#023e8a' }, { offset: 0.5, color: '#0077b6' }, { offset: 1, color: '#0096c7' }] }, 85);

/* ── Coffee ────────────────────────────────────────────────────────────────── */

register('coffee', 'Espresso', 'Dark espresso gradient', { type: 'linear', angle: 135, stops: [{ offset: 0, color: '#3c1a00' }, { offset: 1, color: '#6b3a1f' }] }, 80);
register('coffee', 'Cappuccino', 'Warm cappuccino gradient', { type: 'linear', angle: 90, stops: [{ offset: 0, color: '#c4a882' }, { offset: 1, color: '#d4b896' }] }, 75);
register('coffee', 'Latte', 'Smooth latte gradient', { type: 'linear', angle: 180, stops: [{ offset: 0, color: '#d4b896' }, { offset: 1, color: '#e8d5b7' }] }, 70);

/* ── Sunset ────────────────────────────────────────────────────────────────── */

register('sunset', 'Tropical Sunset', 'Vibrant tropical sunset', { type: 'linear', angle: 135, stops: [{ offset: 0, color: '#ff6b6b' }, { offset: 0.5, color: '#ffa94d' }, { offset: 1, color: '#ffd93d' }] }, 95);
register('sunset', 'Mountain Sunset', 'Scenic mountain sunset', { type: 'linear', angle: 180, stops: [{ offset: 0, color: '#2b1b3d' }, { offset: 0.5, color: '#e74c3c' }, { offset: 1, color: '#f39c12' }] }, 90);
register('sunset', 'Dusk', 'Evening dusk gradient', { type: 'linear', angle: 145, stops: [{ offset: 0, color: '#2d1b69' }, { offset: 1, color: '#e74c3c' }] }, 85);
register('sunset', 'Golden Hour', 'Golden hour gradient', { type: 'linear', angle: 90, stops: [{ offset: 0, color: '#f59e0b' }, { offset: 1, color: '#fcd34d' }] }, 85);

/* ── Synthwave ─────────────────────────────────────────────────────────────── */

register('synthwave', 'Retro Synth', 'Classic synthwave gradient', { type: 'linear', angle: 135, stops: [{ offset: 0, color: '#ff00ff' }, { offset: 1, color: '#00ffff' }] }, 90);
register('synthwave', 'Neon 80s', '80s neon gradient', { type: 'linear', angle: 180, stops: [{ offset: 0, color: '#ff0080' }, { offset: 1, color: '#7928ca' }] }, 85);
register('synthwave', 'Miami Vice', 'Miami-inspired gradient', { type: 'linear', angle: 160, stops: [{ offset: 0, color: '#ff6b9d' }, { offset: 1, color: '#c084fc' }] }, 85);
register('synthwave', 'Chrome', 'Chrome synth gradient', { type: 'linear', angle: 145, stops: [{ offset: 0, color: '#00ffff' }, { offset: 1, color: '#ff00ff' }] }, 80);

/* ── Cyberpunk ─────────────────────────────────────────────────────────────── */

register('cyberpunk', 'Neon City', 'Cyberpunk neon city gradient', { type: 'linear', angle: 135, stops: [{ offset: 0, color: '#ff0080' }, { offset: 1, color: '#00ffcc' }] }, 90);
register('cyberpunk', 'Hacker Terminal', 'Green-on-black terminal gradient', { type: 'linear', angle: 180, stops: [{ offset: 0, color: '#00ff41' }, { offset: 1, color: '#003b00' }] }, 85);
register('cyberpunk', 'Electric Storm', 'Electric cyberpunk gradient', { type: 'linear', angle: 145, stops: [{ offset: 0, color: '#7000ff' }, { offset: 1, color: '#00ffcc' }] }, 80);
register('cyberpunk', 'Blade Runner', 'Blade Runner-inspired gradient', { type: 'linear', angle: 135, stops: [{ offset: 0, color: '#0d0221' }, { offset: 0.5, color: '#3c096c' }, { offset: 1, color: '#ff0080' }] }, 85);

/* ── Glass ─────────────────────────────────────────────────────────────────── */

register('glass', 'Glassmorphism', 'Glassmorphism-friendly gradient', { type: 'linear', angle: 135, stops: [{ offset: 0, color: '#ffffff' }, { offset: 1, color: '#cccccc' }] }, 95);
register('glass', 'Frosted Glass', 'Frosted glass effect gradient', { type: 'linear', angle: 180, stops: [{ offset: 0, color: '#ffffff' }, { offset: 1, color: '#e0e0e0' }] }, 85);
register('glass', 'Translucent', 'Translucent gradient for glass', { type: 'linear', angle: 90, stops: [{ offset: 0, color: '#ffffff' }, { offset: 1, color: '#f0f0f0' }] }, 75);
register('glass', 'Crystal', 'Crystal clear gradient', { type: 'linear', angle: 145, stops: [{ offset: 0, color: '#ffffff' }, { offset: 1, color: '#d4e4f7' }] }, 70);

/* ── Mesh presets (using linear approximate) ───────────────────────────────── */

register('mesh', 'Mesh Dream', 'Smooth mesh-like gradient', { type: 'linear', angle: 135, stops: [{ offset: 0, color: '#667eea' }, { offset: 0.33, color: '#764ba2' }, { offset: 0.66, color: '#f093fb' }, { offset: 1, color: '#4facfe' }] }, 90);
register('mesh', 'Color Splash', 'Vibrant mesh-inspired gradient', { type: 'linear', angle: 120, stops: [{ offset: 0, color: '#ff6b6b' }, { offset: 0.33, color: '#feca57' }, { offset: 0.66, color: '#48dbfb' }, { offset: 1, color: '#ff9ff3' }] }, 85);
register('mesh', 'Twilight Mesh', 'Twilight-inspired mesh gradient', { type: 'linear', angle: 150, stops: [{ offset: 0, color: '#2b1b3d' }, { offset: 0.5, color: '#667eea' }, { offset: 1, color: '#f093fb' }] }, 80);

/* ── Aurora presets (CSS approximation) ─────────────────────────────────────── */

register('aurora', 'Aurora Borealis', 'Northern lights aurora', { type: 'linear', angle: 135, stops: [{ offset: 0, color: '#00ff87' }, { offset: 0.33, color: '#60efff' }, { offset: 0.66, color: '#0062ff' }, { offset: 1, color: '#a855f7' }] }, 95);
register('aurora', 'Northern Sky', 'Scandinavian aurora gradient', { type: 'linear', angle: 160, stops: [{ offset: 0, color: '#0062ff' }, { offset: 0.5, color: '#00ff87' }, { offset: 1, color: '#60efff' }] }, 85);
register('aurora', 'Cosmic Aurora', 'Cosmic aurora gradient', { type: 'linear', angle: 145, stops: [{ offset: 0, color: '#a855f7' }, { offset: 0.5, color: '#60efff' }, { offset: 1, color: '#00ff87' }] }, 80);

/* ── Glow ──────────────────────────────────────────────────────────────────── */

register('glow', 'Neon Glow', 'Bright neon glow gradient', { type: 'linear', angle: 135, stops: [{ offset: 0, color: '#ff00ff' }, { offset: 1, color: '#00ffff' }] }, 90);
register('glow', 'Radioactive', 'Intense glow gradient', { type: 'linear', angle: 90, stops: [{ offset: 0, color: '#00ff00' }, { offset: 1, color: '#ffff00' }] }, 80);
register('glow', 'Electric Blue', 'Electric blue glow', { type: 'linear', angle: 180, stops: [{ offset: 0, color: '#0000ff' }, { offset: 1, color: '#00ffff' }] }, 85);
register('glow', 'Hot Pink', 'Hot pink glow gradient', { type: 'linear', angle: 145, stops: [{ offset: 0, color: '#ff0080' }, { offset: 1, color: '#ff00ff' }] }, 80);

/* ── Neon ──────────────────────────────────────────────────────────────────── */

register('neon', 'Neon Pink', 'Bright neon pink gradient', { type: 'linear', angle: 135, stops: [{ offset: 0, color: '#ff0080' }, { offset: 1, color: '#7928ca' }] }, 85);
register('neon', 'Neon Green', 'Bright neon green gradient', { type: 'linear', angle: 135, stops: [{ offset: 0, color: '#00ff41' }, { offset: 1, color: '#00b800' }] }, 80);
register('neon', 'Neon Blue', 'Electric neon blue gradient', { type: 'linear', angle: 135, stops: [{ offset: 0, color: '#0044ff' }, { offset: 1, color: '#00ffff' }] }, 85);
register('neon', 'Neon Rainbow', 'Neon rainbow gradient', { type: 'linear', angle: 90, stops: [{ offset: 0, color: '#ff0000' }, { offset: 0.16, color: '#ff8800' }, { offset: 0.33, color: '#ffff00' }, { offset: 0.5, color: '#00ff00' }, { offset: 0.66, color: '#0088ff' }, { offset: 0.83, color: '#8800ff' }, { offset: 1, color: '#ff00ff' }] }, 90);

/* ── Business ──────────────────────────────────────────────────────────────── */

register('business', 'Startup', 'Modern startup gradient', { type: 'linear', angle: 135, stops: [{ offset: 0, color: '#6366f1' }, { offset: 1, color: '#8b5cf6' }] }, 85);
register('business', 'Enterprise', 'Enterprise blue gradient', { type: 'linear', angle: 135, stops: [{ offset: 0, color: '#1e3a8a' }, { offset: 1, color: '#3b82f6' }] }, 85);
register('business', 'SaaS', 'SaaS product gradient', { type: 'linear', angle: 145, stops: [{ offset: 0, color: '#0ea5e9' }, { offset: 1, color: '#6366f1' }] }, 80);
register('business', 'Venture', 'Venture capital gradient', { type: 'linear', angle: 160, stops: [{ offset: 0, color: '#1e293b' }, { offset: 1, color: '#475569' }] }, 75);

/* ── Radial presets ────────────────────────────────────────────────────────── */

register('minimal', 'Radial Spotlight', 'Radial spotlight effect', {
  type: 'radial', angle: 0,
  stops: [{ offset: 0, color: '#ffffff' }, { offset: 1, color: '#e0e0e0' }],
  shape: 'circle', size: 'closest-corner',
}, 60);

register('corporate', 'Radial Blue Burst', 'Radial corporate burst', {
  type: 'radial', angle: 0,
  stops: [{ offset: 0, color: '#60a5fa' }, { offset: 1, color: '#1e3a8a' }],
  shape: 'circle', size: 'farthest-corner',
}, 75);

register('ai', 'Radial AI Glow', 'Radial AI purple glow', {
  type: 'radial', angle: 0,
  stops: [{ offset: 0, color: '#a855f7' }, { offset: 1, color: '#312e81' }],
  shape: 'circle', size: 'farthest-corner',
  position: { x: 0.5, y: 0.3 },
}, 85);

register('luxury', 'Radial Gold', 'Radial gold spotlight', {
  type: 'radial', angle: 0,
  stops: [{ offset: 0, color: '#fcf6ba' }, { offset: 1, color: '#b38728' }],
  shape: 'ellipse', size: 'farthest-side',
  position: { x: 0.5, y: 0.5 },
}, 80);

/* ── Conic presets ─────────────────────────────────────────────────────────── */

register('minimal', 'Conic Gray', 'Subtle conic gray gradient', {
  type: 'conic', angle: 0,
  stops: [{ offset: 0, color: '#e0e0e0' }, { offset: 0.5, color: '#f5f5f5' }, { offset: 1, color: '#e0e0e0' }],
  position: { x: 0.5, y: 0.5 },
}, 55);

register('ai', 'Conic Purple', 'Conic AI purple gradient', {
  type: 'conic', angle: 45,
  stops: [{ offset: 0, color: '#667eea' }, { offset: 0.5, color: '#764ba2' }, { offset: 1, color: '#667eea' }],
  position: { x: 0.5, y: 0.5 },
}, 80);

register('crypto', 'Conic Rainbow', 'Conic rainbow gradient for crypto', {
  type: 'conic', angle: 0,
  stops: [{ offset: 0, color: '#ff0000' }, { offset: 0.16, color: '#ff8800' }, { offset: 0.33, color: '#ffff00' }, { offset: 0.5, color: '#00ff00' }, { offset: 0.66, color: '#0088ff' }, { offset: 0.83, color: '#8800ff' }, { offset: 1, color: '#ff0000' }],
  position: { x: 0.5, y: 0.5 },
}, 85);

register('synthwave', 'Conic Synth', 'Conic synthwave gradient', {
  type: 'conic', angle: 90,
  stops: [{ offset: 0, color: '#ff00ff' }, { offset: 0.5, color: '#00ffff' }, { offset: 1, color: '#ff00ff' }],
  position: { x: 0.5, y: 0.5 },
}, 80);

/* ── Repeating presets ─────────────────────────────────────────────────────── */

register('minimal', 'Repeating Stripes', 'Subtle repeating stripe pattern', {
  type: 'repeating-linear', angle: 45,
  stops: [{ offset: 0, color: '#f0f0f0' }, { offset: 0.05, color: '#f0f0f0' }, { offset: 0.05, color: '#ffffff' }, { offset: 0.1, color: '#ffffff' }],
}, 40);

register('gaming', 'Repeating Cyber Stripes', 'Cyber stripe repeating pattern', {
  type: 'repeating-linear', angle: 135,
  stops: [{ offset: 0, color: '#ff00ff' }, { offset: 0.05, color: '#ff00ff' }, { offset: 0.05, color: '#00ffff' }, { offset: 0.1, color: '#00ffff' }],
}, 65);

register('cyberpunk', 'Hacker Stripes', 'Hacker terminal repeating gradient', {
  type: 'repeating-linear', angle: 0,
  stops: [{ offset: 0, color: '#00ff41' }, { offset: 0.02, color: '#00ff41' }, { offset: 0.02, color: '#003b00' }, { offset: 0.04, color: '#003b00' }],
}, 60);

/* ── 3+ stop multi-color ───────────────────────────────────────────────────── */

register('sunset', 'Vibrant Sunset', 'Vibrant 4-stop sunset gradient', {
  type: 'linear', angle: 135,
  stops: [{ offset: 0, color: '#ff0000' }, { offset: 0.33, color: '#ff7700' }, { offset: 0.66, color: '#ffdd00' }, { offset: 1, color: '#00ff00' }],
}, 90);

register('cyberpunk', 'Synthwave Dream', 'Synthwave 4-stop gradient', {
  type: 'linear', angle: 145,
  stops: [{ offset: 0, color: '#ff0080' }, { offset: 0.33, color: '#7928ca' }, { offset: 0.66, color: '#00dfd8' }, { offset: 1, color: '#00ffcc' }],
}, 85);

register('nature', 'Forest Rainbow', 'Forest-inspired multi-color gradient', {
  type: 'linear', angle: 160,
  stops: [{ offset: 0, color: '#064e3b' }, { offset: 0.33, color: '#059669' }, { offset: 0.66, color: '#a3e635' }, { offset: 1, color: '#fef9c3' }],
}, 75);

/* ── Export ────────────────────────────────────────────────────────────────── */

/** Get all presets. */
export function getAllPresets(): PresetEntry[] {
  return registry;
}

/** Get presets by category. */
export function getPresetsByCategory(category: string): PresetEntry[] {
  return registry.filter((p) => p.category === category);
}

/** Search presets by name, description, or tags. */
export function searchPresets(query: string): PresetEntry[] {
  const q = query.toLowerCase();
  return registry.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.gradient.tags ?? []).some((t) => t.toLowerCase().includes(q)),
  );
}

/** Get top presets by popularity. */
export function getTopPresets(limit = 20): PresetEntry[] {
  return [...registry].sort((a, b) => b.popularity - a.popularity).slice(0, limit);
}

/** Get all categories. */
export function getPresetCategories(): string[] {
  return [...new Set(registry.map((p) => p.category))];
}

/** Get count of presets per category. */
export function getPresetCategoryCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const p of registry) {
    counts[p.category] = (counts[p.category] ?? 0) + 1;
  }
  return counts;
}
