'use client';

import { useState } from 'react';
import { NAMED_COLORS, searchNamedColors } from '@/lib/color-studio';
import { CopyButton } from '../shared/CopyButton';

export default function ColorNamesTab() {
  const [query, setQuery] = useState('');

  const results = query
    ? searchNamedColors(query)
    : NAMED_COLORS.slice(0, 100);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-foreground">Color Names</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Browse and search named web colors.
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search colors by name or hex..."
          className="w-full h-10 px-4 text-sm bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Results count */}
      <p className="text-xs text-muted-foreground">
        {results.length} of {NAMED_COLORS.length} colors
      </p>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {results.map((named) => (
          <div
            key={named.name}
            className="flex items-center gap-3 p-2 rounded-lg border border-border hover:bg-muted/50 transition-colors"
          >
            <div
              className="size-8 rounded-lg shrink-0 border border-border/50"
              style={{ backgroundColor: named.hex }}
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-foreground truncate">{named.name}</p>
              <p className="text-[10px] font-mono text-muted-foreground">{named.hex}</p>
            </div>
            <CopyButton text={named.hex} />
          </div>
        ))}
      </div>
    </div>
  );
}
