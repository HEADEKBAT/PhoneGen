'use client';

import type { MediaContainer, FormatInfo } from '@/lib/media';
import { FORMATS, ALL_FORMATS } from '@/lib/media';
import { Film, Music, Image } from 'lucide-react';

interface FormatSelectorProps {
  selected: MediaContainer;
  onChange: (format: MediaContainer) => void;
  filter?: 'video' | 'audio';
}

function FormatIcon({ format }: { format: FormatInfo }) {
  const className = 'h-8 w-8';
  switch (format.type) {
    case 'audio':
      return <Music className={className} />;
    case 'video':
      return format.id === 'gif' ? <Image className={className} /> : <Film className={className} />;
  }
}

export default function FormatSelector({ selected, onChange, filter }: FormatSelectorProps) {
  const formats = filter ? ALL_FORMATS.filter((f) => f.type === filter) : ALL_FORMATS;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {formats.map((format) => {
        const isSelected = format.id === selected;
        return (
          <button
            key={format.id}
            onClick={() => onChange(format.id as MediaContainer)}
            className={`
              relative flex flex-col items-center gap-2 rounded-xl border p-4 text-left
              transition-all duration-200
              ${isSelected
                ? 'border-primary bg-primary/10 ring-1 ring-primary'
                : 'border-border hover:border-primary/50 hover:bg-accent/30'
              }
            `}
            aria-pressed={isSelected}
            role="option"
            aria-selected={isSelected}
          >
            <div className={isSelected ? 'text-primary' : 'text-muted-foreground'}>
              <FormatIcon format={format} />
            </div>
            <span className="text-sm font-semibold">{format.label}</span>

            {/* Stars for compatibility */}
            <div className="flex gap-0.5" aria-label={`${format.compatibility} out of 5 compatibility`}>
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={`text-xs ${i < format.compatibility ? 'text-amber-500' : 'text-muted-foreground/20'}`}
                >
                  ★
                </span>
              ))}
            </div>

            <p className="text-[10px] leading-tight text-muted-foreground text-center line-clamp-2">
              {format.bestFor.slice(0, 3).join(' · ')}
            </p>

            {isSelected && (
              <div className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground font-bold">
                ✓
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
