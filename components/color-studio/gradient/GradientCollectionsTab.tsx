'use client';

import { useState, useMemo } from 'react';
import { Search, Grid3X3, List, Star } from 'lucide-react';
import { useGradientStudioStore } from '@/lib/stores/gradientStudio';
import { getAllPresets, searchPresets, getPresetCategories, getPresetCategoryCounts } from '@/lib/color-studio/gradientPresets';
import { filterPresets, getCollections } from '@/lib/color-studio/gradientCollections';
import { GradientPreviewCard } from './shared/GradientPreviewCard';
import { GradientFavButton } from './shared/GradientFavButton';
import { useGradientFavoritesStore } from '@/lib/stores/gradientFavorites';

export function GradientCollectionsTab() {
  const currentGradient = useGradientStudioStore((s) => s.currentGradient);
  const setCurrentGradient = useGradientStudioStore((s) => s.setCurrentGradient);
  const pushHistory = useGradientStudioStore((s) => s.pushHistory);

  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories = useMemo(() => getCollections(), []);
  const categoryCounts = useMemo(() => getPresetCategoryCounts(), []);

  const presets = useMemo(() => {
    if (activeCategory) {
      return filterPresets({ category: activeCategory, query, sortBy: 'popularity' });
    }
    return query ? searchPresets(query) : getAllPresets().sort((a, b) => b.popularity - a.popularity);
  }, [activeCategory, query]);

  const handleSelectPreset = (preset: typeof presets[0]) => {
    pushHistory(currentGradient);
    setCurrentGradient(preset.gradient);
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search presets..."
          className="w-full h-9 pl-9 pr-4 text-xs bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Category pills */}
      <div className="flex gap-1.5 flex-wrap">
        <button
          type="button"
          onClick={() => setActiveCategory(null)}
          className={`px-2.5 py-1 text-[10px] font-medium rounded-full border transition-colors ${
            activeCategory === null
              ? 'bg-primary/10 border-primary text-primary'
              : 'bg-card border-border/50 text-muted-foreground hover:border-border'
          }`}
        >
          All ({Object.values(categoryCounts).reduce((a, b) => a + b, 0)})
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
            className={`px-2.5 py-1 text-[10px] font-medium rounded-full border transition-colors ${
              activeCategory === cat.id
                ? 'bg-primary/10 border-primary text-primary'
                : 'bg-card border-border/50 text-muted-foreground hover:border-border'
            }`}
          >
            {cat.icon} {cat.name} ({cat.count})
          </button>
        ))}
      </div>

      {/* View toggle */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">{presets.length} presets</p>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`p-1 rounded ${viewMode === 'grid' ? 'bg-muted text-foreground' : 'text-muted-foreground'}`}
          >
            <Grid3X3 size={14} />
          </button>
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`p-1 rounded ${viewMode === 'list' ? 'bg-muted text-foreground' : 'text-muted-foreground'}`}
          >
            <List size={14} />
          </button>
        </div>
      </div>

      {/* Presets grid/list */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {presets.slice(0, 50).map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleSelectPreset(preset)}
              className="group text-left rounded-xl border border-border/50 overflow-hidden hover:border-primary/50 transition-colors bg-card"
            >
              <div className="relative">
                <GradientPreviewCard gradient={preset.gradient} height={80} />
                <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <GradientFavButton gradient={preset.gradient} />
                </div>
              </div>
              <div className="p-2">
                <p className="text-xs font-medium text-foreground truncate">{preset.name}</p>
                <p className="text-[10px] text-muted-foreground truncate">{preset.description}</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-[10px] text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded">
                    {preset.category}
                  </span>
                  <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground ml-auto">
                    <Star size={10} /> {preset.popularity}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-1.5">
          {presets.slice(0, 100).map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleSelectPreset(preset)}
              className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-muted/50 transition-colors text-left"
            >
              <div className="size-10 rounded-lg shrink-0 border border-border/30" style={{
                background: `linear-gradient(135deg, ${preset.gradient.stops[0]?.color}, ${preset.gradient.stops[preset.gradient.stops.length - 1]?.color})`,
              }} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground truncate">{preset.name}</p>
                <p className="text-[10px] text-muted-foreground truncate">{preset.description}</p>
              </div>
              <span className="text-[10px] text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded shrink-0">
                {preset.category}
              </span>
            </button>
          ))}
        </div>
      )}

      {presets.length === 0 && (
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground">No presets found</p>
        </div>
      )}
    </div>
  );
}
