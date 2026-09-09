'use client';

import { useState, useMemo } from 'react';
import { Check, ChevronDown, Search } from 'lucide-react';
import { ALL_NETWORKS } from '@/lib/crypto';
import type { NetworkId } from '@/lib/crypto';

interface NetworkSelectorProps {
  value: NetworkId;
  onChange: (network: NetworkId) => void;
}

export default function NetworkSelector({ value, onChange }: NetworkSelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search) return ALL_NETWORKS;
    const q = search.toLowerCase();
    return ALL_NETWORKS.filter(
      (n) => n.name.toLowerCase().includes(q) || n.symbol.toLowerCase().includes(q),
    );
  }, [search]);

  const selected = ALL_NETWORKS.find((n) => n.id === value);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-3 py-2 rounded-xl border border-border bg-background hover:border-muted-foreground/30 transition-colors text-sm"
      >
        <div className="flex items-center gap-2">
          <span className="font-medium">{selected?.symbol}</span>
          <span className="text-muted-foreground">{selected?.name}</span>
        </div>
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 right-0 mt-1 z-20 bg-background border border-border rounded-xl shadow-lg max-h-80 overflow-hidden">
            <div className="p-2 border-b border-border">
              <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-muted/50">
                <Search className="h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search networks..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent border-none outline-none text-xs w-full"
                  autoFocus
                />
              </div>
            </div>
            <div className="overflow-y-auto max-h-60">
              {filtered.map((net) => (
                <button
                  key={net.id}
                  onClick={() => {
                    onChange(net.id);
                    setOpen(false);
                    setSearch('');
                  }}
                  className={`flex items-center justify-between w-full px-3 py-2 text-xs hover:bg-muted/30 transition-colors ${
                    value === net.id ? 'bg-primary/5 text-primary font-medium' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-muted/50">
                      {net.symbol}
                    </span>
                    <span>{net.name}</span>
                  </div>
                  {value === net.id && <Check className="h-3.5 w-3.5" />}
                </button>
              ))}
              {filtered.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-4">No networks found</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
