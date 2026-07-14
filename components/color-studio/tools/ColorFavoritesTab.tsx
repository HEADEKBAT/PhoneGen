'use client';

import { useState } from 'react';
import { useColorFavoritesStore } from '@/lib/stores/colorFavorites';
import { useColorStudioStore } from '@/lib/stores/colorStudio';
import { CopyButton } from '../shared/CopyButton';

export default function ColorFavoritesTab() {
  const { favorites, removeFavorite, renameFavorite, clearAll } = useColorFavoritesStore();
  const { setColors } = useColorStudioStore();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editName, setEditName] = useState('');

  const handleRename = (index: number) => {
    if (editName.trim()) {
      renameFavorite(index, editName.trim());
    }
    setEditingIndex(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Saved Palettes</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Your saved color palettes (persisted in localStorage).
          </p>
        </div>
        {favorites.length > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="text-xs text-muted-foreground hover:text-destructive transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-12 text-sm text-muted-foreground">
          <p>No saved palettes yet.</p>
          <p className="text-xs mt-1">Use the Palette or Random tools and save your favorites.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {[...favorites].reverse().map((fav, ri) => {
            const realIndex = favorites.length - 1 - ri;
            return (
              <div
                key={realIndex}
                className="rounded-xl border border-border bg-card overflow-hidden"
              >
                {/* Color stripe */}
                <div className="flex h-10">
                  {fav.colors.map((hex, ci) => (
                    <div
                      key={ci}
                      className="flex-1 cursor-pointer"
                      style={{ backgroundColor: hex }}
                      onClick={() => navigator.clipboard.writeText(hex)}
                      title={hex}
                    />
                  ))}
                </div>

                {/* Info */}
                <div className="p-3">
                  <div className="flex items-center justify-between">
                    {editingIndex === realIndex ? (
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onBlur={() => handleRename(realIndex)}
                        onKeyDown={(e) => e.key === 'Enter' && handleRename(realIndex)}
                        className="text-sm font-semibold bg-background border border-input rounded px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-ring"
                        autoFocus
                      />
                    ) : (
                      <h4
                        className="text-sm font-semibold text-foreground cursor-pointer hover:text-primary transition-colors"
                        onClick={() => {
                          setEditName(fav.name);
                          setEditingIndex(realIndex);
                        }}
                        title="Click to rename"
                      >
                        {fav.name}
                      </h4>
                    )}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setColors(fav.colors)}
                        className="text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Load
                      </button>
                      <button
                        type="button"
                        onClick={() => removeFavorite(realIndex)}
                        className="text-[11px] text-muted-foreground hover:text-destructive transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {fav.colors.map((hex, ci) => (
                      <CopyButton key={ci} text={hex} label={hex} />
                    ))}
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {new Date(fav.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
