'use client';

import type { HistoryEntry } from '@/lib/media';
import { Clock, Trash2, Download, RotateCcw, FileVideo, Music } from 'lucide-react';

interface HistoryPanelProps {
  history: HistoryEntry[];
  onClear: () => void;
  onReuse: (entry: HistoryEntry) => void;
  onDownload: (entry: HistoryEntry) => void;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

function formatTime(ts: number): string {
  const d = new Date(ts);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return d.toLocaleDateString();
}

function TypeIcon({ container }: { container: string }) {
  const isVideo = ['mp4', 'mov', 'avi', 'mkv', 'webm', 'gif'].includes(container);
  const Icon = isVideo ? FileVideo : Music;
  return <Icon className="h-4 w-4" />;
}

export default function HistoryPanel({ history, onClear, onReuse, onDownload }: HistoryPanelProps) {
  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-12 text-muted-foreground">
        <Clock className="h-10 w-10" />
        <p className="text-sm">No conversions yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">History ({history.length})</h3>
        <button
          onClick={onClear}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors"
        >
          <Trash2 className="h-3 w-3" /> Clear
        </button>
      </div>

      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {[...history].reverse().map((entry) => (
          <div
            key={entry.id}
            className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
          >
            <div className="text-muted-foreground">
              <TypeIcon container={entry.outputFormat} />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground truncate">{entry.fileName}</p>
              <p className="text-[10px] text-muted-foreground">
                {entry.originalFormat.toUpperCase()} → {entry.outputFormat.toUpperCase()}
                {' · '}
                {formatBytes(entry.originalSize)} → {formatBytes(entry.outputSize)}
                {' · '}
                {formatTime(entry.timestamp)}
              </p>
            </div>

            <div className="flex gap-1">
              <button
                onClick={() => onReuse(entry)}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                title="Reuse settings"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => onDownload(entry)}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                title="Download again"
              >
                <Download className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
