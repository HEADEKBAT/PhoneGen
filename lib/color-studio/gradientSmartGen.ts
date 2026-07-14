/**
 * Gradient Studio — Smart Generation.
 *
 * Maps natural-language prompts to gradient presets using keyword matching.
 * Simple local matching — no server calls.
 */

import type { GradientConfig } from './gradientTypes';
import { generateGradientId } from './gradientTypes';

/* ── Keyword → gradient mapping ────────────────────────────────────────────── */

interface PromptRule {
  keywords: string[];
  weight: number;
  build: () => GradientConfig;
}

function stop(offset: number, color: string): { offset: number; color: string } {
  return { offset, color };
}

function makeConfig(
  name: string,
  type: GradientConfig['type'],
  angle: number,
  stops: { offset: number; color: string }[],
): GradientConfig {
  return {
    id: generateGradientId(),
    name,
    type,
    angle,
    stops,
    tags: [name.toLowerCase()],
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

const RULES: PromptRule[] = [
  {
    keywords: ['sunset', 'sun', 'dusk', 'evening', 'golden hour', 'twilight'],
    weight: 10,
    build: () => makeConfig('Warm Sunset', 'linear', 135, [
      stop(0, '#ff6b6b'), stop(0.33, '#ffa94d'), stop(0.66, '#ffd93d'), stop(1, '#f8f9fa'),
    ]),
  },
  {
    keywords: ['ocean', 'sea', 'water', 'underwater', 'marine', 'waves', 'beach'],
    weight: 10,
    build: () => makeConfig('Deep Ocean', 'linear', 180, [
      stop(0, '#0c2340'), stop(0.5, '#0077b6'), stop(1, '#00b4d8'),
    ]),
  },
  {
    keywords: ['forest', 'nature', 'green', 'wood', 'tree', 'earth', 'natural'],
    weight: 10,
    build: () => makeConfig('Forest Green', 'linear', 135, [
      stop(0, '#064e3b'), stop(0.5, '#059669'), stop(1, '#a3e635'),
    ]),
  },
  {
    keywords: ['neon', 'cyberpunk', 'night city', 'synthwave', 'retro', '80s', 'vaporwave'],
    weight: 10,
    build: () => makeConfig('Neon City', 'linear', 135, [
      stop(0, '#ff0080'), stop(0.5, '#7928ca'), stop(1, '#00ffcc'),
    ]),
  },
  {
    keywords: ['purple', 'royal', 'luxury', 'elegant', 'premium', 'regal'],
    weight: 10,
    build: () => makeConfig('Royal Purple', 'linear', 135, [
      stop(0, '#4c1d95'), stop(0.5, '#7c3aed'), stop(1, '#a855f7'),
    ]),
  },
  {
    keywords: ['gold', 'premium', 'luxury', 'expensive', 'rich', 'classic'],
    weight: 8,
    build: () => makeConfig('Gold Premium', 'linear', 135, [
      stop(0, '#bf953f'), stop(0.5, '#fcf6ba'), stop(1, '#b38728'),
    ]),
  },
  {
    keywords: ['pink', 'cute', 'flower', 'spring', 'romantic', 'love', 'sweet'],
    weight: 8,
    build: () => makeConfig('Cotton Candy', 'linear', 135, [
      stop(0, '#fbc2eb'), stop(0.5, '#ffd1ff'), stop(1, '#a6c1ee'),
    ]),
  },
  {
    keywords: ['dark', 'night', 'midnight', 'space', 'cosmos', 'galaxy'],
    weight: 10,
    build: () => makeConfig('Midnight', 'linear', 135, [
      stop(0, '#0f0c29'), stop(0.5, '#302b63'), stop(1, '#24243e'),
    ]),
  },
  {
    keywords: ['corporate', 'business', 'professional', 'enterprise', 'clean'],
    weight: 8,
    build: () => makeConfig('Corporate Blue', 'linear', 135, [
      stop(0, '#1e3a8a'), stop(0.5, '#2563eb'), stop(1, '#3b82f6'),
    ]),
  },
  {
    keywords: ['fire', 'flame', 'hot', 'lava', 'volcano', 'burning'],
    weight: 7,
    build: () => makeConfig('Burning Flame', 'linear', 135, [
      stop(0, '#dc2626'), stop(0.5, '#f97316'), stop(1, '#f59e0b'),
    ]),
  },
  {
    keywords: ['ice', 'cold', 'frozen', 'arctic', 'snow', 'winter', 'frost'],
    weight: 7,
    build: () => makeConfig('Arctic Ice', 'linear', 180, [
      stop(0, '#0284c7'), stop(0.5, '#7dd3fc'), stop(1, '#e0f2fe'),
    ]),
  },
  {
    keywords: ['tech', 'ai', 'technology', 'digital', 'modern', 'startup'],
    weight: 8,
    build: () => makeConfig('AI Tech', 'linear', 135, [
      stop(0, '#667eea'), stop(0.5, '#764ba2'), stop(1, '#4facfe'),
    ]),
  },
  {
    keywords: ['crypto', 'bitcoin', 'blockchain', 'web3', 'defi'],
    weight: 7,
    build: () => makeConfig('Bitcoin Orange', 'linear', 135, [
      stop(0, '#f7931a'), stop(0.5, '#ff6b35'), stop(1, '#ffd700'),
    ]),
  },
  {
    keywords: ['pastel', 'soft', 'gentle', 'light', 'delicate', 'subtle'],
    weight: 7,
    build: () => makeConfig('Pastel Dream', 'linear', 135, [
      stop(0, '#fbc2eb'), stop(0.5, '#e6e6fa'), stop(1, '#a6c1ee'),
    ]),
  },
  {
    keywords: ['gradient', 'mesh', 'aurora', 'rainbow', 'colorful'],
    weight: 5,
    build: () => makeConfig('Rainbow', 'linear', 135, [
      stop(0, '#ff0000'), stop(0.16, '#ff8800'), stop(0.33, '#ffff00'),
      stop(0.5, '#00ff00'), stop(0.66, '#0088ff'), stop(0.83, '#8800ff'),
      stop(1, '#ff00ff'),
    ]),
  },
];

const SUGGESTED_PROMPTS = [
  'sunset', 'ocean', 'forest', 'neon city', 'royal purple',
  'gold premium', 'pink', 'midnight', 'corporate', 'fire',
  'arctic ice', 'ai tech', 'crypto', 'pastel', 'rainbow',
];

export const PROMPT_EXAMPLES = [
  'warm sunset gradient for a landing page',
  'dark cyberpunk theme with neon accents',
  'luxury gold and purple for a premium brand',
  'calm ocean blues for a wellness app',
  'tech startup gradient with purple and blue',
];

/** Match a prompt to the best gradient configs. */
export function smartMatch(prompt: string): GradientConfig[] {
  const lower = prompt.toLowerCase();
  const words = lower.split(/\s+/);

  const scored = RULES.map((rule) => {
    let score = 0;
    for (const keyword of rule.keywords) {
      if (lower.includes(keyword)) {
        score += rule.weight;
      }
      // Also check individual words
      for (const word of words) {
        if (word.length > 2 && keyword.includes(word)) {
          score += rule.weight * 0.5;
        }
      }
    }
    return { rule, score };
  });

  const matches = scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  if (matches.length === 0) {
    // Return a default gradient
    return [makeConfig('Default Gradient', 'linear', 135, [
      stop(0, '#667eea'), stop(1, '#764ba2'),
    ])];
  }

  return matches.map((m) => m.rule.build());
}

/** Get suggested search prompts for UI. */
export function getSuggestedPrompts(): string[] {
  return SUGGESTED_PROMPTS;
}

/** Check if a prompt has any matches. */
export function hasMatch(prompt: string): boolean {
  const lower = prompt.toLowerCase();
  return RULES.some((rule) =>
    rule.keywords.some((k) => lower.includes(k)),
  );
}
