'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { TokenFormat } from '@/lib/color-studio';
import { TOKEN_FORMAT_LABELS } from '@/lib/color-studio';

interface FormatMenuProps {
  formats: Record<string, string>;
  onSelect: (key: string) => void;
  value: string;
  className?: string;
}

export function FormatMenu({ formats, onSelect, value, className = '' }: FormatMenuProps) {
  const [open, setOpen] = useState(false);

  const currentLabel = Object.entries(formats).find(([k]) => k === value)?.[1] || value;

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg border border-border bg-card hover:bg-muted transition-colors"
      >
        {currentLabel}
        <ChevronDown size={12} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 z-20 min-w-[160px] rounded-lg border border-border bg-card shadow-dropdown py-1">
            {Object.entries(formats).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  onSelect(key);
                  setOpen(false);
                }}
                className={`w-full text-left px-3 py-1.5 text-xs transition-colors hover:bg-muted ${
                  key === value ? 'text-primary font-medium' : 'text-foreground'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
