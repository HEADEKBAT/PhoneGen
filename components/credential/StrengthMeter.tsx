'use client';

import { useCallback } from 'react';
import type { PasswordScore } from '@/lib/credentialGenerator';

interface StrengthMeterProps {
  score: PasswordScore | null;
}

export default function StrengthMeter({ score }: StrengthMeterProps) {
  if (!score) return null;

  const { score: value, bits, crackTime, isCommon, resistant, weak } = score;

  /* ── Color mapping ──────────────────────────────────────────────────── */
  const getColor = (s: number): string => {
    if (s < 20) return 'bg-red-500';
    if (s < 40) return 'bg-orange-500';
    if (s < 60) return 'bg-yellow-500';
    if (s < 80) return 'bg-lime-500';
    return 'bg-primary';
  };

  const getLabel = (s: number): string => {
    if (s < 20) return 'Very Weak';
    if (s < 40) return 'Weak';
    if (s < 60) return 'Moderate';
    if (s < 80) return 'Strong';
    return 'Very Strong';
  };

  const color = getColor(value);
  const label = getLabel(value);

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
      {/* Score bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2.5 rounded-full bg-muted overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${color}`}
            style={{ width: `${value}%` }}
          />
        </div>
        <span className="text-sm font-semibold text-foreground tabular-nums shrink-0">
          {value}/100
        </span>
      </div>

      {/* Label + bits */}
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="font-medium text-foreground">{label}</span>
        <span className="tabular-nums">{bits} bits entropy</span>
      </div>

      {/* Crack time */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-lg bg-muted/50 px-3 py-2">
          <span className="text-muted-foreground">Offline crack: </span>
          <span className="font-medium text-foreground">{crackTime.offline}</span>
        </div>
        <div className="rounded-lg bg-muted/50 px-3 py-2">
          <span className="text-muted-foreground">Online crack: </span>
          <span className="font-medium text-foreground">{crackTime.online}</span>
        </div>
      </div>

      {/* Resistant / Weak checklists */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        <div className="space-y-1">
          {resistant.length > 0 && (
            <p className="font-medium text-primary mb-1">Resistant against:</p>
          )}
          {resistant.map((item) => (
            <div key={item} className="flex items-center gap-1.5">
              <span className="text-primary shrink-0">&#10003;</span>
              <span className="text-muted-foreground">{item}</span>
            </div>
          ))}
        </div>
        <div className="space-y-1">
          {weak.length > 0 && (
            <p className="font-medium text-destructive mb-1">Weak against:</p>
          )}
          {weak.map((item) => (
            <div key={item} className="flex items-center gap-1.5">
              <span className="text-destructive shrink-0">&#10007;</span>
              <span className="text-muted-foreground">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Common password warning */}
      {isCommon && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2 text-xs text-destructive">
          This password appears in lists of common/leaked passwords. Do not use it.
        </div>
      )}
    </div>
  );
}
