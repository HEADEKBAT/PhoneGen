'use client';

import { useColorStudioStore } from '@/lib/stores/colorStudio';
import { CopyButton } from '../shared/CopyButton';

export default function ColorHistoryTab() {
  const { history, historyIndex } = useColorStudioStore();

  const reversed = [...history].reverse();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-foreground">Color History</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          View and restore previous color states. Max 50 entries.
        </p>
      </div>

      {reversed.length === 0 ? (
        <p className="text-sm text-muted-foreground">No history yet.</p>
      ) : (
        <div className="space-y-2">
          {reversed.map((state, ri) => {
            const originalIndex = history.length - 1 - ri;
            const isCurrent = originalIndex === historyIndex;
            return (
              <div
                key={ri}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                  isCurrent
                    ? 'border-primary/30 bg-primary/5'
                    : 'border-border hover:bg-muted/50'
                }`}
              >
                <span className="text-[10px] font-mono text-muted-foreground w-8 shrink-0">
                  #{originalIndex + 1}
                </span>
                <div className="flex gap-1 flex-1">
                  {state.map((hex, ci) => (
                    <div
                      key={ci}
                      className="size-6 rounded border border-border/30 cursor-pointer hover:scale-110 transition-transform"
                      style={{ backgroundColor: hex }}
                      title={hex}
                      onClick={() => navigator.clipboard.writeText(hex)}
                    />
                  ))}
                </div>
                {isCurrent ? (
                  <span className="text-[10px] font-medium text-primary shrink-0">Current</span>
                ) : (
                  <CopyButton text={state.join(', ')} label="Copy" />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
