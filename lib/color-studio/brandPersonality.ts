/**
 * Brand personality definitions.
 *
 * Each personality adjusts the color system to evoke a specific emotional
 * tone — Professional, Luxury, Playful, Calm, etc. These are applied on
 * top of the palette style and project preset to fine-tune the feel.
 */

import type { PersonalityModifiers } from './themeBuilder';

export interface BrandPersonality {
  id: string;
  name: string;
  description: string;
  icon: string;
  modifiers: PersonalityModifiers;
}

export const BRAND_PERSONALITIES: BrandPersonality[] = [
  {
    id: 'professional',
    name: 'Professional',
    description: 'Polished, restrained, widely trusted — the default for business',
    icon: 'Briefcase',
    modifiers: { chromaScale: 0.85, warmthBias: 0, lightnessSpread: 1.0, saturationBias: -0.1 },
  },
  {
    id: 'friendly',
    name: 'Friendly',
    description: 'Warm, approachable, slightly playful — puts users at ease',
    icon: 'Smile',
    modifiers: { chromaScale: 1.0, warmthBias: 0.15, lightnessSpread: 1.05, saturationBias: 0.05 },
  },
  {
    id: 'luxury',
    name: 'Luxury',
    description: 'Deep, rich, premium — gold undertones, controlled saturation',
    icon: 'Gem',
    modifiers: { chromaScale: 0.8, warmthBias: 0.2, lightnessSpread: 0.9, saturationBias: -0.15 },
  },
  {
    id: 'trust',
    name: 'Trust',
    description: 'Blue-leaning, stable, reliable — confidence and security',
    icon: 'ShieldCheck',
    modifiers: { chromaScale: 0.9, warmthBias: -0.2, lightnessSpread: 1.0, saturationBias: -0.05 },
  },
  {
    id: 'innovation',
    name: 'Innovation',
    description: 'Cool, slightly experimental, forward-thinking — tech-forward',
    icon: 'Lightbulb',
    modifiers: { chromaScale: 1.15, warmthBias: -0.15, lightnessSpread: 1.1, saturationBias: 0.1 },
  },
  {
    id: 'playful',
    name: 'Playful',
    description: 'Vibrant, fun, diverse — energetic and engaging',
    icon: 'Sparkles',
    modifiers: { chromaScale: 1.3, warmthBias: 0.1, lightnessSpread: 1.1, saturationBias: 0.2 },
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Artistic, unexpected combinations — design-forward',
    icon: 'Palette',
    modifiers: { chromaScale: 1.2, warmthBias: 0.05, lightnessSpread: 1.05, saturationBias: 0.15 },
  },
  {
    id: 'elegant',
    name: 'Elegant',
    description: 'Refined, subdued, graceful — timeless sophistication',
    icon: 'Feather',
    modifiers: { chromaScale: 0.7, warmthBias: 0.1, lightnessSpread: 0.95, saturationBias: -0.2 },
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Less is more — restrained palette, content-first',
    icon: 'Circle',
    modifiers: { chromaScale: 0.65, warmthBias: 0, lightnessSpread: 1.0, saturationBias: -0.2 },
  },
  {
    id: 'bold',
    name: 'Bold',
    description: 'Strong, impactful, unapologetic — makes a statement',
    icon: 'FlipHorizontal',
    modifiers: { chromaScale: 1.4, warmthBias: 0, lightnessSpread: 1.15, saturationBias: 0.2 },
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'High-end feel, deep chroma, rich surfaces — top-shelf quality',
    icon: 'Crown',
    modifiers: { chromaScale: 0.95, warmthBias: 0.15, lightnessSpread: 0.9, saturationBias: 0 },
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean, cool, minimal — contemporary design language',
    icon: 'Monitor',
    modifiers: { chromaScale: 0.9, warmthBias: -0.1, lightnessSpread: 1.0, saturationBias: 0 },
  },
  {
    id: 'nature',
    name: 'Nature',
    description: 'Organic, grounded, harmonious — biophilic design',
    icon: 'Leaf',
    modifiers: { chromaScale: 0.85, warmthBias: 0.2, lightnessSpread: 0.95, saturationBias: -0.05 },
  },
  {
    id: 'calm',
    name: 'Calm',
    description: 'Peaceful, low-arousal, restful — meditation-grade interface',
    icon: 'Wind',
    modifiers: { chromaScale: 0.6, warmthBias: 0.05, lightnessSpread: 0.95, saturationBias: -0.2 },
  },
  {
    id: 'energy',
    name: 'Energy',
    description: 'Dynamic, warm, high-vitality — action-oriented design',
    icon: 'Zap',
    modifiers: { chromaScale: 1.35, warmthBias: 0.2, lightnessSpread: 1.1, saturationBias: 0.2 },
  },
  {
    id: 'sophisticated',
    name: 'Sophisticated',
    description: 'Mature, deep, nuanced — dark-chromatic elegance',
    icon: 'Glasses',
    modifiers: { chromaScale: 0.75, warmthBias: 0.1, lightnessSpread: 0.85, saturationBias: -0.1 },
  },
  {
    id: 'warm',
    name: 'Warm',
    description: 'Cozy, welcoming, golden — makes users feel at home',
    icon: 'Sun',
    modifiers: { chromaScale: 1.0, warmthBias: 0.3, lightnessSpread: 1.02, saturationBias: 0.1 },
  },
  {
    id: 'cool',
    name: 'Cool',
    description: 'Calm, collected, crisp — professional detachment',
    icon: 'Snowflake',
    modifiers: { chromaScale: 0.85, warmthBias: -0.25, lightnessSpread: 1.05, saturationBias: -0.05 },
  },
];

/** Lookup a brand personality by ID. */
export function getBrandPersonality(id: string): BrandPersonality | undefined {
  return BRAND_PERSONALITIES.find((p) => p.id === id);
}

/** All brand personality IDs. */
export const BRAND_PERSONALITY_IDS = BRAND_PERSONALITIES.map((p) => p.id);
