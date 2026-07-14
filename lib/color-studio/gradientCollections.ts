/**
 * Gradient Studio — collection registry + search.
 *
 * Provides categorized collection views over the preset library,
 * with filtering, sorting, and multi-category browsing.
 */

import {
  getAllPresets,
  getPresetsByCategory,
  searchPresets,
  getPresetCategories,
  getPresetCategoryCounts,
} from './gradientPresets';
import type { PresetEntry } from './gradientPresets';

/* ── Collection descriptors ────────────────────────────────────────────────── */

export interface CollectionInfo {
  id: string;
  name: string;
  description: string;
  icon: string; // emoji
  count: number;
}

const COLLECTION_META: Record<string, { name: string; description: string; icon: string }> = {
  minimal: { name: 'Minimal', description: 'Clean and simple gradients', icon: '◻️' },
  corporate: { name: 'Corporate', description: 'Professional business gradients', icon: '🏢' },
  ai: { name: 'AI / Tech', description: 'Modern technology gradients', icon: '🤖' },
  crypto: { name: 'Crypto / Web3', description: 'Blockchain and crypto gradients', icon: '₿' },
  medical: { name: 'Medical / Health', description: 'Clean healthcare gradients', icon: '🏥' },
  gaming: { name: 'Gaming', description: 'Vibrant gaming gradients', icon: '🎮' },
  luxury: { name: 'Luxury', description: 'Premium luxury gradients', icon: '💎' },
  pastel: { name: 'Pastel', description: 'Soft pastel gradients', icon: '🌸' },
  dark: { name: 'Dark', description: 'Dark mode gradients', icon: '🌙' },
  light: { name: 'Light', description: 'Light and airy gradients', icon: '☀️' },
  warm: { name: 'Warm', description: 'Warm-toned gradients', icon: '🔥' },
  cold: { name: 'Cold', description: 'Cool-toned gradients', icon: '❄️' },
  nature: { name: 'Nature', description: 'Nature-inspired gradients', icon: '🌿' },
  ocean: { name: 'Ocean', description: 'Ocean and sea gradients', icon: '🌊' },
  forest: { name: 'Forest', description: 'Forest and woodland gradients', icon: '🌲' },
  coffee: { name: 'Coffee', description: 'Coffee-inspired gradients', icon: '☕' },
  sunset: { name: 'Sunset', description: 'Sunset and dusk gradients', icon: '🌅' },
  synthwave: { name: 'Synthwave', description: 'Retro synthwave gradients', icon: '🌈' },
  cyberpunk: { name: 'Cyberpunk', description: 'Cyberpunk and neon gradients', icon: '⚡' },
  glass: { name: 'Glass', description: 'Glassmorphism gradients', icon: '🪟' },
  mesh: { name: 'Mesh', description: 'Mesh gradient approximations', icon: '🔮' },
  aurora: { name: 'Aurora', description: 'Aurora borealis gradients', icon: '🌌' },
  glow: { name: 'Glow', description: 'Glow effect gradients', icon: '💡' },
  neon: { name: 'Neon', description: 'Neon sign gradients', icon: '🟢' },
  business: { name: 'Business', description: 'Business and startup gradients', icon: '📊' },
};

/** Get all available collections with metadata. */
export function getCollections(): CollectionInfo[] {
  const counts = getPresetCategoryCounts();
  return Object.entries(COLLECTION_META)
    .filter(([id]) => counts[id] && counts[id] > 0)
    .map(([id, meta]) => ({
      id,
      ...meta,
      count: counts[id] ?? 0,
    }))
    .sort((a, b) => b.count - a.count);
}

/** Get a single collection by ID. */
export function getCollection(id: string): CollectionInfo | undefined {
  const meta = COLLECTION_META[id];
  if (!meta) return undefined;
  const counts = getPresetCategoryCounts();
  return { id, ...meta, count: counts[id] ?? 0 };
}

/** Get presets for a specific collection. */
export function getCollectionPresets(id: string): PresetEntry[] {
  return getPresetsByCategory(id);
}

/* ── Combined search + filter ──────────────────────────────────────────────── */

export interface CollectionFilter {
  category?: string;
  query?: string;
  sortBy?: 'popularity' | 'name' | 'newest';
  limit?: number;
}

/** Search and filter presets with full options. */
export function filterPresets(filter: CollectionFilter = {}): PresetEntry[] {
  let results = filter.category
    ? getPresetsByCategory(filter.category)
    : getAllPresets();

  if (filter.query) {
    const q = filter.query.toLowerCase();
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.gradient.tags?.some((t) => t.toLowerCase().includes(q)),
    );
  }

  if (filter.sortBy === 'popularity') {
    results.sort((a, b) => b.popularity - a.popularity);
  } else if (filter.sortBy === 'name') {
    results.sort((a, b) => a.name.localeCompare(b.name));
  } else if (filter.sortBy === 'newest') {
    results.sort((a, b) => b.gradient.createdAt - a.gradient.createdAt);
  }

  if (filter.limit && filter.limit > 0) {
    results = results.slice(0, filter.limit);
  }

  return results;
}

/** Get random presets for the "surprise me" feature. */
export function getRandomPresets(count = 6): PresetEntry[] {
  const all = getAllPresets();
  const shuffled = [...all].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/** Get featured presets (top popularity, diverse categories). */
export function getFeaturedPresets(count = 12): PresetEntry[] {
  const top = getAllPresets()
    .sort((a, b) => b.popularity - a.popularity);

  // Ensure category diversity
  const seen = new Set<string>();
  const featured: PresetEntry[] = [];

  for (const p of top) {
    if (!seen.has(p.category) || featured.length < count) {
      featured.push(p);
      seen.add(p.category);
    }
    if (featured.length >= count) break;
  }

  return featured;
}
