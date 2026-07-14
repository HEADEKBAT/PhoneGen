/**
 * Palette style definitions.
 *
 * Each style is a named set of modifiers that adjusts the theme generation
 * algorithm to produce a distinct visual aesthetic. Styles change color
 * temperature, saturation, contrast, and neutral warmth.
 */

import type { StyleModifiers } from './themeBuilder';

export interface PaletteStyle {
  id: string;
  name: string;
  description: string;
  icon: string;
  modifiers: StyleModifiers;
}

/**
 * 30+ palette styles covering modern UI aesthetics.
 * Inspired by Open Color, Tailwind, Radix, Catppuccin, Nord,
 * Tokyo Night, and contemporary design systems.
 */
export const PALETTE_STYLES: PaletteStyle[] = [
  /* ─── Modern / Classic ─────────────────────────────────────────────────── */
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean, restrained, low saturation — maximum focus on content',
    icon: 'Circle',
    modifiers: { temperature: 0, saturation: 0.7, contrast: 1.1, brightness: 0, neutralWarmth: 0, curve: 'linear' },
  },
  {
    id: 'corporate',
    name: 'Corporate',
    description: 'Professional, trustworthy, balanced — ideal for B2B',
    icon: 'Building',
    modifiers: { temperature: -0.1, saturation: 0.85, contrast: 1.0, brightness: 0, neutralWarmth: -0.1, curve: 'linear' },
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean, slightly cool, well-balanced — contemporary default',
    icon: 'Monitor',
    modifiers: { temperature: -0.05, saturation: 0.9, contrast: 1.05, brightness: 0, neutralWarmth: -0.05, curve: 'linear' },
  },
  {
    id: 'material',
    name: 'Material',
    description: 'Google Material Design inspired — bold, layered, vibrant',
    icon: 'Layout',
    modifiers: { temperature: 0, saturation: 1.1, contrast: 1.0, brightness: 0, neutralWarmth: 0, curve: 'ease-out' },
  },

  /* ─── Warm / Earthy ────────────────────────────────────────────────────── */
  {
    id: 'warm',
    name: 'Warm',
    description: 'Cozy, inviting, golden undertones — friendly interfaces',
    icon: 'Sun',
    modifiers: { temperature: 0.3, saturation: 1.0, contrast: 1.0, brightness: 0.02, neutralWarmth: 0.2, curve: 'linear' },
  },
  {
    id: 'nature',
    name: 'Nature',
    description: 'Organic greens and earth tones — sustainable, calm',
    icon: 'Leaf',
    modifiers: { temperature: 0.15, saturation: 0.9, contrast: 0.95, brightness: 0, neutralWarmth: 0.1, curve: 's-curve' },
  },
  {
    id: 'forest',
    name: 'Forest',
    description: 'Deep greens, browns, mossy accents — natural and grounding',
    icon: 'TreePine',
    modifiers: { temperature: 0.2, saturation: 1.0, contrast: 0.9, brightness: -0.03, neutralWarmth: 0.15, curve: 's-curve' },
  },
  {
    id: 'earth',
    name: 'Earth',
    description: 'Terracottas, sands, clays — warm, organic, tactile',
    icon: 'Mountain',
    modifiers: { temperature: 0.35, saturation: 1.1, contrast: 1.0, brightness: 0, neutralWarmth: 0.25, curve: 'ease-in' },
  },
  {
    id: 'coffee',
    name: 'Coffee',
    description: 'Rich browns, caramels, warm neutrals — cozy and sophisticated',
    icon: 'Coffee',
    modifiers: { temperature: 0.4, saturation: 0.8, contrast: 1.0, brightness: -0.02, neutralWarmth: 0.3, curve: 'ease-in' },
  },
  {
    id: 'sunset',
    name: 'Sunset',
    description: 'Vivid oranges, pinks, purples — dramatic and energetic',
    icon: 'Sunset',
    modifiers: { temperature: 0.5, saturation: 1.3, contrast: 1.1, brightness: 0.02, neutralWarmth: 0.1, curve: 'ease-out' },
  },

  /* ─── Cool / Oceanic ───────────────────────────────────────────────────── */
  {
    id: 'cold',
    name: 'Cold',
    description: 'Cool blue tones, crisp, clean — refreshing interface feel',
    icon: 'Snowflake',
    modifiers: { temperature: -0.3, saturation: 1.0, contrast: 1.05, brightness: 0.02, neutralWarmth: -0.2, curve: 'linear' },
  },
  {
    id: 'ocean',
    name: 'Ocean',
    description: 'Blues, teals, aquamarines — fluid and professional',
    icon: 'Waves',
    modifiers: { temperature: -0.25, saturation: 1.1, contrast: 1.0, brightness: 0, neutralWarmth: -0.15, curve: 's-curve' },
  },
  {
    id: 'nord',
    name: 'Nord',
    description: 'Arctic-inspired pastels, low contrast, calm — developer favorite',
    icon: 'Snowflake',
    modifiers: { temperature: -0.2, saturation: 0.65, contrast: 0.85, brightness: 0.05, neutralWarmth: -0.15, curve: 'ease-out' },
  },
  {
    id: 'tokyo-night',
    name: 'Tokyo Night',
    description: 'Deep midnight blues, vibrant accents — dark theme optimized',
    icon: 'Moon',
    modifiers: { temperature: -0.3, saturation: 1.0, contrast: 1.15, brightness: -0.05, neutralWarmth: -0.2, curve: 'ease-in' },
  },

  /* ─── Vibrant / Bold ───────────────────────────────────────────────────── */
  {
    id: 'neon',
    name: 'Neon',
    description: 'Electric brights, high saturation — nightlife and energy',
    icon: 'Zap',
    modifiers: { temperature: 0, saturation: 1.6, contrast: 1.2, brightness: 0, neutralWarmth: 0, curve: 'ease-out' },
  },
  {
    id: 'synthwave',
    name: 'Synthwave',
    description: '80s retro futurism — pinks, purples, cyans, high contrast',
    icon: 'Radio',
    modifiers: { temperature: 0.2, saturation: 1.5, contrast: 1.2, brightness: -0.03, neutralWarmth: -0.1, curve: 'ease-out' },
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    description: 'Neon-drenched dystopian — electric blues, hot pinks, high energy',
    icon: 'CircuitBoard',
    modifiers: { temperature: -0.1, saturation: 1.7, contrast: 1.3, brightness: -0.05, neutralWarmth: -0.2, curve: 'ease-in' },
  },
  {
    id: 'retro',
    name: 'Retro',
    description: 'Vintage warmth, muted saturation, nostalgic feel',
    icon: 'RotateCcw',
    modifiers: { temperature: 0.25, saturation: 0.7, contrast: 0.9, brightness: 0.03, neutralWarmth: 0.2, curve: 'ease-in' },
  },

  /* ─── Soft / Subtle ────────────────────────────────────────────────────── */
  {
    id: 'pastel',
    name: 'Pastel',
    description: 'Soft, gentle colors — friendly, approachable, low-stress',
    icon: 'Heart',
    modifiers: { temperature: 0.1, saturation: 0.5, contrast: 0.9, brightness: 0.08, neutralWarmth: 0.05, curve: 'ease-out' },
  },
  {
    id: 'muted',
    name: 'Muted',
    description: 'Subdued, sophisticated — elegant and understated',
    icon: 'Droplets',
    modifiers: { temperature: 0, saturation: 0.55, contrast: 1.0, brightness: 0.02, neutralWarmth: 0, curve: 'linear' },
  },
  {
    id: 'soft',
    name: 'Soft',
    description: 'Gentle contrasts, comfortable — easy on the eyes for long sessions',
    icon: 'Cloud',
    modifiers: { temperature: 0.05, saturation: 0.75, contrast: 0.9, brightness: 0.05, neutralWarmth: 0.05, curve: 'ease-out' },
  },
  {
    id: 'glassmorphism',
    name: 'Glassmorphism',
    description: 'Frosted glass effect, soft transparencies, blurred backgrounds',
    icon: 'GlassWater',
    modifiers: { temperature: -0.05, saturation: 0.8, contrast: 0.95, brightness: 0.06, neutralWarmth: -0.05, curve: 'ease-out' },
  },
  {
    id: 'clay',
    name: 'Clay',
    description: 'Warm, rounded, tactile — soft shadows and earthy tones',
    icon: 'Box',
    modifiers: { temperature: 0.2, saturation: 0.8, contrast: 0.95, brightness: 0.03, neutralWarmth: 0.15, curve: 's-curve' },
  },

  /* ─── Dark / Dramatic ──────────────────────────────────────────────────── */
  {
    id: 'dark',
    name: 'Dark',
    description: 'Deep backgrounds, high contrast — easy on OLED screens',
    icon: 'Moon',
    modifiers: { temperature: -0.1, saturation: 1.0, contrast: 1.2, brightness: -0.08, neutralWarmth: -0.05, curve: 'ease-in' },
  },
  {
    id: 'brutalism',
    name: 'Brutalism',
    description: 'Raw, high contrast, minimal — bold and unapologetic',
    icon: 'Triangle',
    modifiers: { temperature: 0, saturation: 1.0, contrast: 1.4, brightness: 0, neutralWarmth: 0, curve: 'linear' },
  },
  {
    id: 'dracula',
    name: 'Dracula',
    description: 'Dark theme with vibrant, distinctive accents — popular among developers',
    icon: 'Ghost',
    modifiers: { temperature: -0.15, saturation: 1.3, contrast: 1.15, brightness: -0.05, neutralWarmth: -0.1, curve: 'ease-in' },
  },

  /* ─── Category-Specific ────────────────────────────────────────────────── */
  {
    id: 'healthcare',
    name: 'Healthcare',
    description: 'Clean whites, healing blues, soft greens — trust and calm',
    icon: 'HeartPulse',
    modifiers: { temperature: -0.15, saturation: 0.7, contrast: 1.0, brightness: 0.04, neutralWarmth: -0.1, curve: 'ease-out' },
  },
  {
    id: 'education',
    name: 'Education',
    description: 'Warm, approachable, encouraging — great for learning platforms',
    icon: 'BookOpen',
    modifiers: { temperature: 0.15, saturation: 0.85, contrast: 0.95, brightness: 0.03, neutralWarmth: 0.1, curve: 's-curve' },
  },
  {
    id: 'gaming',
    name: 'Gaming',
    description: 'Dark backgrounds, vibrant neon accents, high energy',
    icon: 'Gamepad2',
    modifiers: { temperature: -0.1, saturation: 1.5, contrast: 1.2, brightness: -0.05, neutralWarmth: -0.1, curve: 'ease-in' },
  },
  {
    id: 'luxury',
    name: 'Luxury',
    description: 'Deep, rich, gold-adjacent — premium and exclusive feel',
    icon: 'Gem',
    modifiers: { temperature: 0.2, saturation: 0.9, contrast: 1.1, brightness: -0.02, neutralWarmth: 0.15, curve: 'ease-in' },
  },
  {
    id: 'crypto',
    name: 'Crypto',
    description: 'Bold, digital, futuristic — Web3-ready aesthetic',
    icon: 'Bitcoin',
    modifiers: { temperature: -0.2, saturation: 1.3, contrast: 1.15, brightness: -0.03, neutralWarmth: -0.15, curve: 'ease-out' },
  },
  {
    id: 'ai',
    name: 'AI',
    description: 'Cool purples, gradients, futuristic — cutting-edge feel',
    icon: 'Brain',
    modifiers: { temperature: -0.1, saturation: 1.2, contrast: 1.1, brightness: 0, neutralWarmth: -0.1, curve: 's-curve' },
  },
  {
    id: 'fintech',
    name: 'Fintech',
    description: 'Reliable blues, greens, clear hierarchy — financial trust',
    icon: 'Banknote',
    modifiers: { temperature: -0.15, saturation: 0.85, contrast: 1.05, brightness: 0.01, neutralWarmth: -0.1, curve: 'linear' },
  },
  {
    id: 'catppuccin',
    name: 'Catppuccin',
    description: 'Popular pastel theme — warm, soft, highly readable',
    icon: 'Cat',
    modifiers: { temperature: 0.1, saturation: 0.6, contrast: 0.9, brightness: 0.06, neutralWarmth: 0.1, curve: 'ease-out' },
  },
  {
    id: 'gruvbox',
    name: 'Gruvbox',
    description: 'Retro earth tones, warm contrast — classic developer theme',
    icon: 'Box',
    modifiers: { temperature: 0.3, saturation: 0.8, contrast: 1.0, brightness: 0.02, neutralWarmth: 0.25, curve: 'ease-in' },
  },
  {
    id: 'everforest',
    name: 'Everforest',
    description: 'Soft greens, warm tones — easy on the eyes, nature-inspired',
    icon: 'Trees',
    modifiers: { temperature: 0.2, saturation: 0.65, contrast: 0.9, brightness: 0.04, neutralWarmth: 0.15, curve: 's-curve' },
  },
  {
    id: 'solarized',
    name: 'Solarized',
    description: 'Precision-balanced, scientific — optimal luminance contrast',
    icon: 'Sun',
    modifiers: { temperature: 0.1, saturation: 0.6, contrast: 0.85, brightness: 0.03, neutralWarmth: 0.1, curve: 's-curve' },
  },
  {
    id: 'light',
    name: 'Light',
    description: 'Bright, airy, minimal shadows — clean light-mode default',
    icon: 'Sun',
    modifiers: { temperature: 0, saturation: 0.9, contrast: 1.0, brightness: 0.08, neutralWarmth: 0, curve: 'linear' },
  },
];

/** Lookup a palette style by ID. */
export function getPaletteStyle(id: string): PaletteStyle | undefined {
  return PALETTE_STYLES.find((s) => s.id === id);
}

/** All style IDs. */
export const PALETTE_STYLE_IDS = PALETTE_STYLES.map((s) => s.id);
