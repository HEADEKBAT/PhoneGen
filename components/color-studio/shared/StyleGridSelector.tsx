'use client';

/**
 * StyleGridSelector — reusable scrollable grid for selecting
 * palette styles, project types, or brand personalities.
 */

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export interface SelectorItem {
  id: string;
  name: string;
  description: string;
  icon?: string;
}

interface StyleGridSelectorProps<T extends SelectorItem> {
  items: T[];
  selectedId: string;
  onSelect: (id: string) => void;
  label: string;
  visibleCount?: number;
}

export function StyleGridSelector<T extends SelectorItem>({
  items,
  selectedId,
  onSelect,
  label,
  visibleCount = 8,
}: StyleGridSelectorProps<T>) {
  const [showAll, setShowAll] = useState(false);
  const displayed = showAll ? items : items.slice(0, visibleCount);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold text-foreground">{label}</h4>
        {items.length > visibleCount && (
          <button
            type="button"
            onClick={() => setShowAll(!showAll)}
            className="flex items-center gap-0.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
          >
            {showAll ? 'Show less' : `Show all (${items.length})`}
            {showAll ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {displayed.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            className={`px-2.5 py-1.5 text-[11px] font-medium rounded-lg border transition-colors text-left ${
              selectedId === item.id
                ? 'bg-primary/10 text-primary border-primary/30'
                : 'bg-card text-muted-foreground border-border hover:text-foreground hover:border-muted-foreground/30'
            }`}
            title={item.description}
          >
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
}
