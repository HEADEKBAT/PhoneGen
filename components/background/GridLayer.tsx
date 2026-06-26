'use client';

import type { BackgroundLayerProps } from './types';

const GRID_SIZE = 48;

/**
 * Subtle futuristic grid overlay.
 * CSS background-image grid with very slow vertical drift.
 */
export default function GridLayer({ enabled = true }: BackgroundLayerProps) {
  if (!enabled) return null;

  return (
    <>
      <style>{`
        @keyframes grid-scroll {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(0, -3px, 0); }
        }
      `}</style>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)
          `,
          backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
          animation: 'grid-scroll 30s linear infinite',
        }}
      />
    </>
  );
}
