'use client';

import type { FormatInfo } from '@/lib/media';
import { getFormatGuide } from '@/lib/media';
import { Film, Music, Image, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface FormatGuideCardProps {
  format: FormatInfo;
}

function TypeIcon({ type }: { type: string }) {
  switch (type) {
    case 'video': return <Film className="h-5 w-5" />;
    case 'audio': return <Music className="h-5 w-5" />;
    default: return <Image className="h-5 w-5" />;
  }
}

export default function FormatGuideCard({ format }: FormatGuideCardProps) {
  const [expanded, setExpanded] = useState(false);
  const guide = getFormatGuide().find((g) => g.format.id === format.id);

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-3 p-4 text-left hover:bg-accent/30 transition-colors"
      >
        <div className="text-muted-foreground">
          <TypeIcon type={format.type} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">{format.label}</p>
          <p className="text-xs text-muted-foreground truncate">{format.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground">
            ★ {format.compatibility}/5
          </span>
          {expanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-border px-4 py-3 space-y-3 text-xs text-muted-foreground">
          {guide?.detailedDescription && (
            <p>{guide.detailedDescription}</p>
          )}

          <div className="flex flex-wrap gap-4">
            {guide?.typicalBitrate && (
              <div>
                <span className="font-medium text-foreground">Typical Bitrate: </span>
                {guide.typicalBitrate}
              </div>
            )}
            {guide?.fileSizeExample && (
              <div>
                <span className="font-medium text-foreground">File Size Example: </span>
                {guide.fileSizeExample}
              </div>
            )}
          </div>

          <div>
            <span className="font-medium text-foreground">Best for: </span>
            {format.bestFor.join(', ')}
          </div>

          {guide?.recommendations && guide.recommendations.length > 0 && (
            <div>
              <span className="font-medium text-foreground">Recommendations: </span>
              <ul className="mt-1 list-inside list-disc space-y-0.5">
                {guide.recommendations.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex gap-6">
            <div>
              <span className="font-medium text-green-600">Pros:</span>
              <ul className="mt-0.5 list-inside list-disc">
                {format.pros.slice(0, 3).map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
            <div>
              <span className="font-medium text-red-600">Cons:</span>
              <ul className="mt-0.5 list-inside list-disc">
                {format.cons.slice(0, 3).map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
