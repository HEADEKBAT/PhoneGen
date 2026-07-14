'use client';

import { useEffect, useState } from 'react';

/**
 * SkeletonBlock — a configurable shimmer block used as the building
 * block for all skeleton components.
 *
 * Replaces the old raw CSS `.shimmer` class with a performant,
 * animated skeleton block that respects `prefers-reduced-motion`.
 */
export function SkeletonBlock({
  className = '',
  style,
  children,
}: {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <div
      className={`rounded-lg bg-muted/50 ${reducedMotion ? 'opacity-30' : 'animate-pulse'} ${className}`}
      style={style}
      aria-hidden="true"
    >
      {children}
    </div>
  );
}

/**
 * SkeletonText — simulates a line of text at a given width percentage.
 */
export function SkeletonText({ width = '100%', className = '' }: { width?: string; className?: string }) {
  return (
    <SkeletonBlock
      className={`h-4 ${className}`}
      style={{ width }}
    />
  );
}

/**
 * SkeletonHeading — simulates a heading line.
 */
export function SkeletonHeading({ width = '60%', className = '' }: { width?: string; className?: string }) {
  return (
    <SkeletonBlock
      className={`h-8 ${className}`}
      style={{ width }}
    />
  );
}

/**
 * SkeletonCard — simulates a card with optional image and text lines.
 */
export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`rounded-xl border border-border bg-card p-6 space-y-4 ${className}`}>
      <SkeletonBlock className="h-10 w-10 rounded-lg" />
      <div className="space-y-2">
        <SkeletonHeading width="70%" />
        <SkeletonText width="100%" />
        <SkeletonText width="85%" />
      </div>
    </div>
  );
}

/**
 * SkeletonIcon — simulates a square icon at a fixed size.
 */
export function SkeletonIcon({ className = '' }: { className?: string }) {
  return <SkeletonBlock className={`size-8 rounded-lg ${className}`} />;
}
