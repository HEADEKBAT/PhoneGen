'use client';

import { useState, useEffect } from 'react';
import { Clock, Trash2, Copy, Check } from 'lucide-react';
import { getHistory, clearHistory, removeHistoryEntry } from '@/lib/crypto';
import type { HistoryEntry } from '@/lib/crypto';

export default function HistoryPanel() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const handleClear = () => {
    clearHistory();
    setHistory([]);
    setShowConfirm(false);
  };

  const copyAddress = async (entry: HistoryEntry) => {
    await navigator.clipboard.writeText(entry.address);
    setCopiedId(entry.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRemove = (id: string) => {
    removeHistoryEntry(id);
    setHistory((prev) => prev.filter((e) => e.id !== id));
  };

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-8 text-muted-foreground">
        <Clock className="h-8 w-8" />
        <p className="text-xs">No history yet</p>
        <p className="text-[10px]">Generated wallets will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-[10px] text-muted-foreground">
          Last {history.length} entries — stored locally
        </p>
        {!showConfirm ? (
          <button
            onClick={() => setShowConfirm(true)}
            className="text-[10px] text-destructive hover:text-destructive/80 transition-colors"
          >
            Clear all
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={handleClear}
              className="text-[10px] text-destructive font-medium"
            >
              Confirm
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              className="text-[10px] text-muted-foreground"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="space-y-1">
        {history.map((entry) => (
          <div
            key={entry.id}
            className="flex items-center gap-2 p-2 rounded-lg border border-border hover:bg-muted/20 transition-colors group"
          >
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-mono truncate">{entry.address}</p>
              <div className="flex items-center gap-2 text-[9px] text-muted-foreground">
                <span>{entry.type}</span>
                <span>•</span>
                <span>{entry.network}</span>
                <span>•</span>
                <span>{new Date(entry.timestamp).toLocaleString()}</span>
              </div>
            </div>
            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => copyAddress(entry)}
                className="p-1 rounded hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
                title="Copy address"
              >
                {copiedId === entry.id ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              </button>
              <button
                onClick={() => handleRemove(entry.id)}
                className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                title="Remove"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
