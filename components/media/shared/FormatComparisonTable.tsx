'use client';

import { ALL_FORMATS } from '@/lib/media';
import { Film, Music, Image, Check, X } from 'lucide-react';
import { useState } from 'react';

function TypeIcon({ type }: { type: string }) {
  switch (type) {
    case 'video': return <Film className="h-4 w-4" />;
    case 'audio': return <Music className="h-4 w-4" />;
    default: return <Image className="h-4 w-4" />;
  }
}

const COMPARE_FEATURES = [
  { key: 'compatibility', label: 'Compatibility' },
  { key: 'quality', label: 'Quality' },
  { key: 'compression', label: 'Compression' },
] as const;

export default function FormatComparisonTable() {
  const [selectedFormats, setSelectedFormats] = useState<string[]>(['mp4', 'webm', 'mov']);

  const toggleFormat = (id: string) => {
    setSelectedFormats((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const formats = ALL_FORMATS.filter((f) => selectedFormats.includes(f.id));

  return (
    <div className="space-y-4">
      {/* Format multi-select */}
      <div className="flex flex-wrap gap-2">
        {ALL_FORMATS.map((fmt) => {
          const isSelected = selectedFormats.includes(fmt.id);
          return (
            <button
              key={fmt.id}
              onClick={() => toggleFormat(fmt.id)}
              className={`
                inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium
                transition-colors
                ${isSelected
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border text-muted-foreground hover:bg-accent'
                }
              `}
            >
              <TypeIcon type={fmt.type} />
              {fmt.label}
              {isSelected ? <Check className="h-3 w-3" /> : <X className="h-3 w-3 opacity-0" />}
            </button>
          );
        })}
      </div>

      {/* Comparison table */}
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Feature</th>
              {formats.map((fmt) => (
                <th key={fmt.id} className="px-4 py-2.5 text-center text-xs font-semibold text-foreground">
                  {fmt.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            <tr>
              <td className="px-4 py-2 text-xs text-muted-foreground">Type</td>
              {formats.map((fmt) => (
                <td key={fmt.id} className="px-4 py-2 text-center text-xs text-foreground capitalize">
                  {fmt.type}
                </td>
              ))}
            </tr>
            <tr>
              <td className="px-4 py-2 text-xs text-muted-foreground">Extension</td>
              {formats.map((fmt) => (
                <td key={fmt.id} className="px-4 py-2 text-center text-xs font-mono text-foreground">
                  .{fmt.id}
                </td>
              ))}
            </tr>
            {COMPARE_FEATURES.map((feature) => (
              <tr key={feature.key}>
                <td className="px-4 py-2 text-xs text-muted-foreground">{feature.label}</td>
                {formats.map((fmt) => {
                  const val = fmt[feature.key as keyof typeof fmt] as number;
                  return (
                    <td key={fmt.id} className="px-4 py-2 text-center">
                      <div className="flex justify-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span
                            key={i}
                            className={`text-xs ${i < val ? 'text-amber-500' : 'text-muted-foreground/20'}`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
            <tr>
              <td className="px-4 py-2 text-xs text-muted-foreground">Best For</td>
              {formats.map((fmt) => (
                <td key={fmt.id} className="px-4 py-2 text-center">
                  <span className="text-[10px] text-muted-foreground line-clamp-2">
                    {fmt.bestFor.slice(0, 2).join(', ')}
                  </span>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
