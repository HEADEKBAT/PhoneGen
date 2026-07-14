'use client';

interface ColorSwatchProps {
  hex: string;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
}

const SIZE_MAP = {
  sm: 'size-8',
  md: 'size-10',
  lg: 'size-16',
};

export function ColorSwatch({ hex, size = 'md', onClick, className = '' }: ColorSwatchProps) {
  return (
    <button
      type="button"
      className={`rounded-lg border border-border/50 shadow-xs transition-transform hover:scale-105 ${SIZE_MAP[size]} ${className}`}
      style={{ backgroundColor: hex }}
      onClick={onClick}
      title={hex}
    />
  );
}
