'use client';

import { useState } from 'react';
import { useGradientStudioStore } from '@/lib/stores/gradientStudio';
import { gradientToCSS } from '@/lib/color-studio/gradients';
import type { GradientRecipe } from '@/lib/color-studio/gradientTypes';
import { generateGradientId } from '@/lib/color-studio/gradientTypes';
import { GradientPreviewCard } from './shared/GradientPreviewCard';
import { GradientFavButton } from './shared/GradientFavButton';
import { Plus, Trash2, Download, Upload, Save, Edit3, Check, X, BookOpen } from 'lucide-react';

export function GradientRecipesTab() {
  const recipes = useGradientStudioStore((s) => s.recipes);
  const addRecipe = useGradientStudioStore((s) => s.addRecipe);
  const removeRecipe = useGradientStudioStore((s) => s.removeRecipe);
  const updateRecipe = useGradientStudioStore((s) => s.updateRecipe);
  const loadRecipe = useGradientStudioStore((s) => s.loadRecipe);
  const currentGradient = useGradientStudioStore((s) => s.currentGradient);
  const pushHistory = useGradientStudioStore((s) => s.pushHistory);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [newName, setNewName] = useState('');

  const handleSaveCurrent = () => {
    const name = newName.trim() || `Recipe ${recipes.length + 1}`;
    const recipe: GradientRecipe = {
      id: generateGradientId(),
      name,
      description: `Saved ${new Date().toLocaleDateString()}`,
      gradient: { ...currentGradient },
      tags: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    addRecipe(recipe);
    setNewName('');
  };

  const handleLoadRecipe = (id: string) => {
    pushHistory(currentGradient);
    loadRecipe(id);
  };

  const handleExportAll = () => {
    const data = JSON.stringify(recipes, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gradient-recipes-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        const imported: GradientRecipe[] = JSON.parse(text);
        if (Array.isArray(imported)) {
          imported.forEach((r) => addRecipe(r));
        }
      } catch {
        // ignore parse errors
      }
    };
    input.click();
  };

  const startEditing = (id: string, name: string) => {
    setEditingId(id);
    setEditName(name);
  };

  const saveEdit = (id: string) => {
    if (editName.trim()) {
      updateRecipe(id, { name: editName.trim() });
    }
    setEditingId(null);
  };

  return (
    <div className="space-y-5">
      {/* Save current gradient */}
      <div className="p-4 rounded-xl border border-border/50 bg-card space-y-3">
        <div className="flex items-center gap-2">
          <Save size={16} className="text-muted-foreground" />
          <span className="text-xs font-semibold text-foreground">Save Current Gradient</span>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Recipe name..."
            className="flex-1 h-9 px-3 text-xs bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            onKeyDown={(e) => e.key === 'Enter' && handleSaveCurrent()}
          />
          <button
            type="button"
            onClick={handleSaveCurrent}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Plus size={14} />
            Save
          </button>
        </div>
      </div>

      {/* Import/Export */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleExportAll}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-border/50 bg-card hover:bg-muted transition-colors"
        >
          <Download size={14} />
          Export All
        </button>
        <button
          type="button"
          onClick={handleImport}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-border/50 bg-card hover:bg-muted transition-colors"
        >
          <Upload size={14} />
          Import
        </button>
      </div>

      {/* Recipe list */}
      {recipes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
          <BookOpen size={32} className="text-muted-foreground/40" />
          <h3 className="text-sm font-semibold text-foreground">No Recipes Yet</h3>
          <p className="text-xs text-muted-foreground max-w-sm">
            Save your current gradient configuration as a recipe above.
            Recipes preserve all settings including colors, blend modes, noise, and masks.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              className="flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-card hover:border-border transition-colors"
            >
              {/* Mini preview */}
              <button
                type="button"
                onClick={() => handleLoadRecipe(recipe.id)}
                className="shrink-0"
                title="Load this recipe"
              >
                <div
                  className="size-12 rounded-lg border border-border/30"
                  style={{
                    background: gradientToCSS(recipe.gradient),
                  }}
                />
              </button>

              {/* Info */}
              <div className="flex-1 min-w-0">
                {editingId === recipe.id ? (
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="flex-1 h-7 px-2 text-xs bg-background border border-input rounded focus:outline-none focus:ring-1 focus:ring-ring"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveEdit(recipe.id);
                        if (e.key === 'Escape') setEditingId(null);
                      }}
                    />
                    <button type="button" onClick={() => saveEdit(recipe.id)} className="p-1 text-green-500 hover:text-green-400">
                      <Check size={14} />
                    </button>
                    <button type="button" onClick={() => setEditingId(null)} className="p-1 text-muted-foreground hover:text-foreground">
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleLoadRecipe(recipe.id)}
                    className="text-left w-full"
                  >
                    <p className="text-xs font-medium text-foreground truncate">{recipe.name}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {recipe.gradient.type} · {recipe.gradient.stops.length} stops · {new Date(recipe.createdAt).toLocaleDateString()}
                    </p>
                  </button>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0">
                <GradientFavButton gradient={recipe.gradient} />
                <button
                  type="button"
                  onClick={() => startEditing(recipe.id, recipe.name)}
                  className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  title="Rename"
                >
                  <Edit3 size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => removeRecipe(recipe.id)}
                  className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
