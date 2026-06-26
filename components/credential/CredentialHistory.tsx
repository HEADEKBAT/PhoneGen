'use client';

import { useCredentialGeneratorStore } from '@/lib/store';
import { Trash2, Clock } from 'lucide-react';

export default function CredentialHistory() {
  const history = useCredentialGeneratorStore((s) => s.history);
  const clearHistory = useCredentialGeneratorStore((s) => s.clearHistory);

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Clock size={32} className="text-muted-foreground/40 mb-3" />
        <p className="text-sm text-muted-foreground">No history yet</p>
        <p className="text-xs text-muted-foreground/60 mt-1">
          Generated credentials will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Last {history.length} entries — stored only in your browser
        </p>
        <button
          onClick={clearHistory}
          className="h-8 px-3 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:text-destructive hover:border-destructive/30 transition-colors flex items-center gap-1.5"
        >
          <Trash2 size={12} />
          Clear history
        </button>
      </div>

      {/* List */}
      <div className="space-y-1.5 max-h-[400px] overflow-y-auto">
        {history.map((entry, i) => (
          <div
            key={`${entry}-${i}`}
            className="flex items-center gap-3 px-3 py-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors group"
          >
            <span className="text-xs text-muted-foreground w-6 shrink-0 tabular-nums">
              #{history.length - i}
            </span>
            <code className="text-sm text-foreground font-mono truncate flex-1 min-w-0">
              {entry.length > 60 ? `${entry.slice(0, 60)}…` : entry}
            </code>
            <button
              onClick={() => navigator.clipboard.writeText(entry)}
              className="shrink-0 size-6 flex items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors opacity-0 group-hover:opacity-100"
              title="Copy"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
