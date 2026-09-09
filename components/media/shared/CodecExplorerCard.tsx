'use client';

import type { CodecInfo } from '@/lib/media';
import { getVideoCodecGuide, getAudioCodecGuide } from '@/lib/media';
import { ChevronDown, ChevronUp, Cpu } from 'lucide-react';
import { useState } from 'react';

interface CodecExplorerCardProps {
  codec: CodecInfo;
}

export default function CodecExplorerCard({ codec }: CodecExplorerCardProps) {
  const [expanded, setExpanded] = useState(false);
  const videoGuide = getVideoCodecGuide().find((g) => g.codec.id === codec.id);
  const audioGuide = getAudioCodecGuide().find((g) => g.codec.id === codec.id);
  const guide = videoGuide || audioGuide;

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-3 p-4 text-left hover:bg-accent/30 transition-colors"
      >
        <div className="text-muted-foreground">
          <Cpu className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">{codec.label}</p>
          <p className="text-xs text-muted-foreground truncate">{codec.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground">
            {codec.yearIntroduced} · ★ {codec.compatibility}/5
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
          {codec.useCases.length > 0 && (
            <p><span className="font-medium text-foreground">Use cases: </span>{codec.useCases.join(', ')}</p>
          )}

          {guide && (
            <>
              {guide.fullName && codec.id !== guide.codec.id && (
                <p><span className="font-medium text-foreground">Full name: </span>{guide.fullName}</p>
              )}
              {guide.howItWorks && (
                <p>{guide.howItWorks}</p>
              )}
              <div className="flex gap-6">
                {guide.whenToUse && (
                  <div>
                    <span className="font-medium text-green-600">When to use:</span>
                    <p className="mt-0.5">{guide.whenToUse}</p>
                  </div>
                )}
                {guide.whenToAvoid && (
                  <div>
                    <span className="font-medium text-red-600">When to avoid:</span>
                    <p className="mt-0.5">{guide.whenToAvoid}</p>
                  </div>
                )}
              </div>
            </>
          )}

          <div className="flex gap-6">
            <div>
              <span className="font-medium text-green-600">Pros:</span>
              <ul className="mt-0.5 list-inside list-disc">
                {codec.pros.slice(0, 3).map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
            <div>
              <span className="font-medium text-red-600">Cons:</span>
              <ul className="mt-0.5 list-inside list-disc">
                {codec.cons.slice(0, 3).map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          </div>

          {codec.compressionEfficiency && (
            <p>
              <span className="font-medium text-foreground">Compression efficiency: </span>
              {codec.compressionEfficiency}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
