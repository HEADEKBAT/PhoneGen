'use client';

import type { VideoAnalysis, Recommendation } from '@/lib/media';
import { getRecommendations } from '@/lib/media';
import { Lightbulb, ArrowRight, Video, Music, Image, Gauge } from 'lucide-react';

interface FormatAdvisorProps {
  analysis: VideoAnalysis;
  onSelect: (recommendation: Recommendation) => void;
}

function ActionIcon({ action }: { action: string }) {
  const className = 'h-4 w-4';
  switch (action) {
    case 'compress': return <Gauge className={className} />;
    case 'extract-audio': return <Music className={className} />;
    case 'create-gif': return <Image className={className} />;
    default: return <Video className={className} />;
  }
}

export default function FormatAdvisor({ analysis, onSelect }: FormatAdvisorProps) {
  const recommendations = getRecommendations(analysis);
  const topRecs = recommendations.slice(0, 5);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm text-foreground">
        <Lightbulb className="h-4 w-4 text-amber-500" />
        <span className="font-semibold">Smart Recommendations</span>
        <span className="text-xs text-muted-foreground">
          based on your file analysis
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {topRecs.map((rec, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(rec)}
            className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 text-left hover:border-primary/50 hover:bg-accent/30 transition-all group"
          >
            <div className="text-muted-foreground group-hover:text-primary transition-colors">
              <ActionIcon action={rec.action} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground">{rec.label}</p>
              <p className="text-[10px] text-muted-foreground line-clamp-1">{rec.description}</p>
            </div>
            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors opacity-0 group-hover:opacity-100" />
          </button>
        ))}
      </div>
    </div>
  );
}
