'use client';

import type { VideoAnalysis } from '@/lib/media';
import {
  Video,
  Monitor,
  Clock,
  Activity,
  FileJson,
  Music,
  Maximize2,
  RefreshCw,
} from 'lucide-react';

interface AnalysisCardsProps {
  analysis: VideoAnalysis;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function formatBitrate(bitrate: number | null): string {
  if (!bitrate) return '—';
  if (bitrate < 1000) return `${bitrate} bps`;
  if (bitrate < 1000 * 1000) return `${(bitrate / 1000).toFixed(0)} kbps`;
  return `${(bitrate / 1000 / 1000).toFixed(1)} Mbps`;
}

interface CardDef {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
}

export default function AnalysisCards({ analysis }: AnalysisCardsProps) {
  const cards: CardDef[] = [
    {
      icon: <Video className="h-4 w-4" />,
      label: 'Container',
      value: analysis.container?.toUpperCase() || 'Unknown',
      sub: `${analysis.videoCodec?.toUpperCase() || '?'} / ${analysis.audioCodec?.toUpperCase() || '?'}`,
    },
    {
      icon: <Monitor className="h-4 w-4" />,
      label: 'Resolution',
      value: `${analysis.width}×${analysis.height}`,
      sub: `${analysis.aspectRatio} · ${analysis.frameRate.toFixed(1)} fps`,
    },
    {
      icon: <Activity className="h-4 w-4" />,
      label: 'Video Bitrate',
      value: formatBitrate(analysis.videoBitrate),
      sub: analysis.hdr ? 'HDR' : analysis.colorSpace || undefined,
    },
    {
      icon: <Music className="h-4 w-4" />,
      label: 'Audio',
      value: formatBitrate(analysis.audioBitrate),
      sub: analysis.audioChannels ? `${analysis.audioChannels} ch` : undefined,
    },
    {
      icon: <Clock className="h-4 w-4" />,
      label: 'Duration',
      value: formatDuration(analysis.duration),
      sub: analysis.rotation ? `Rotated ${analysis.rotation}°` : undefined,
    },
    {
      icon: <Maximize2 className="h-4 w-4" />,
      label: 'File Size',
      value: formatBytes(analysis.fileSize),
      sub: analysis.fileName,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className="flex flex-col gap-1.5 rounded-xl border border-border bg-card p-3"
        >
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            {card.icon}
            <span>{card.label}</span>
          </div>
          <span className="text-sm font-semibold text-foreground truncate">{card.value}</span>
          {card.sub && (
            <span className="text-[10px] text-muted-foreground/70 truncate">{card.sub}</span>
          )}
        </div>
      ))}
    </div>
  );
}
