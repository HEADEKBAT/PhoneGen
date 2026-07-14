'use client';

import { Heart } from 'lucide-react';
import { useGradientFavoritesStore } from '@/lib/stores/gradientFavorites';
import type { GradientConfig } from '@/lib/color-studio/gradientTypes';

interface GradientFavButtonProps {
  gradient: GradientConfig;
  className?: string;
}

export function GradientFavButton({ gradient, className = '' }: GradientFavButtonProps) {
  const isFavorite = useGradientFavoritesStore((s) => s.isFavorite(gradient.id));
  const addFavorite = useGradientFavoritesStore((s) => s.addFavorite);
  const removeFavorite = useGradientFavoritesStore((s) => s.removeFavorite);

  const toggle = () => {
    if (isFavorite) {
      removeFavorite(gradient.id);
    } else {
      addFavorite(gradient);
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className={`p-1.5 rounded-lg border transition-colors ${
        isFavorite
          ? 'bg-red-500/10 border-red-500/30 text-red-500 hover:bg-red-500/20'
          : 'bg-card border-border/50 text-muted-foreground hover:text-red-400 hover:border-red-300/50'
      } ${className}`}
      title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart
        size={16}
        className={isFavorite ? 'fill-red-500' : ''}
      />
    </button>
  );
}
