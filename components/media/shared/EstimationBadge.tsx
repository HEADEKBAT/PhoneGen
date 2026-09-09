'use client';

import type { SizeEstimation } from '@/lib/media';
import { HardDrive, Clock, Gauge } from 'lucide-react';

interface EstimationBadgeProps {
  estimation: SizeEstimation;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m}m ${s}s`;
}

export default function EstimationBadge({ estimation }: EstimationBadgeProps) {
  const qualityLabel =
    estimation.qualityEstimate === 'lossless'
      ? 'Lossless'
      : estimation.qualityEstimate === 'high'
        ? 'Excellent'
        : estimation.qualityEstimate === 'medium'
          ? 'Good'
          : 'Reduced';

  const qualityColor =
    estimation.qualityEstimate === 'lossless' || estimation.qualityEstimate === 'high'
      ? 'text-green-600'
      : estimation.qualityEstimate === 'medium'
        ? 'text-amber-600'
        : 'text-red-600';

  const qualityPercent =
    estimation.qualityEstimate === 'lossless' ? 100
      : estimation.qualityEstimate === 'high' ? 90
        : estimation.qualityEstimate === 'medium' ? 70
          : 40;

  return (
    <div className="grid grid-cols-3 gap-3 rounded-xl border border-border bg-card p-3">
      <div className="flex flex-col items-center gap-1">
        <HardDrive className="h-4 w-4 text-muted-foreground" />
        <span className="text-xs font-semibold text-foreground">{formatBytes(estimation.estimatedSize)}</span>
        <span className="text-[10px] text-muted-foreground">Est. Size</span>
      </div>
      <div className="flex flex-col items-center gap-1">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <span className="text-xs font-semibold text-foreground">{formatDuration(estimation.estimatedTime)}</span>
        <span className="text-[10px] text-muted-foreground">Est. Time</span>
      </div>
      <div className="flex flex-col items-center gap-1">
        <Gauge className={`h-4 w-4 ${qualityColor}`} />
        <span className={`text-xs font-semibold ${qualityColor}`}>{qualityLabel}</span>
        <span className="text-[10px] text-muted-foreground">{qualityPercent}% Quality</span>
      </div>
    </div>
  );
}
