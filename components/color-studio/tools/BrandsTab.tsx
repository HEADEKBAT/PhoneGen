'use client';

import { useState } from 'react';
import { BRAND_PALETTES, searchBrandPalettes } from '@/lib/color-studio';
import { CopyButton } from '../shared/CopyButton';

export default function BrandsTab() {
  const [query, setQuery] = useState('');

  const palettes = query ? searchBrandPalettes(query) : BRAND_PALETTES;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-foreground">Brand Palettes</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Color palettes from well-known brands and products.
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search brands..."
          className="w-full h-10 px-4 text-sm bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {palettes.map((palette) => (
          <div
            key={palette.name}
            className="rounded-xl border border-border bg-card overflow-hidden"
          >
            {/* Color stripe */}
            <div className="flex h-12">
              {palette.colors.map((hex, i) => (
                <div
                  key={i}
                  className="flex-1 relative group cursor-pointer"
                  style={{ backgroundColor: hex }}
                  onClick={() => navigator.clipboard.writeText(hex)}
                >
                  <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-mono bg-black/30 text-white">
                    {hex}
                  </span>
                </div>
              ))}
            </div>

            {/* Info */}
            <div className="p-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-foreground">{palette.name}</h4>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(palette.colors.join(', '));
                  }}
                  className="text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  Copy all
                </button>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {palette.colors.map((hex, i) => (
                  <CopyButton key={i} text={hex} label={hex} />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
