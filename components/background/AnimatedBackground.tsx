'use client';

import { Suspense } from 'react';
import AuroraLayer from './AuroraLayer';
import GridLayer from './GridLayer';
import StarsLayer from './StarsLayer';
import NoiseLayer from './NoiseLayer';
import FloatingDataLayer from './FloatingDataLayer';

export interface AnimatedBackgroundProps {
  /** Show aurora gradient orbs */
  aurora?: boolean;
  /** Show subtle grid overlay */
  grid?: boolean;
  /** Show twinkling stars */
  stars?: boolean;
  /** Show grain texture */
  noise?: boolean;
  /** Show floating data snippets */
  floatingData?: boolean;
}

/**
 * Animated background orchestrator for the GenCore hero section.
 *
 * Assembles 5 independent layers into a single cosmic/data-generation backdrop.
 * Each layer can be toggled individually via props.
 *
 * All animations use CSS-only transform/opacity for GPU compositing.
 * No Canvas, WebGL, requestAnimationFrame, or setInterval.
 */
export default function AnimatedBackground({
  aurora = true,
  grid = true,
  stars = true,
  noise = true,
  floatingData = true,
}: AnimatedBackgroundProps) {
  return (
    <>
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .gencore-bg-animated * {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>

      <div
        className="gencore-bg-animated absolute inset-0 z-0 pointer-events-none"
        role="presentation"
        aria-hidden="true"
      >
        <Suspense fallback={null}>
          <AuroraLayer enabled={aurora} />
        </Suspense>
        <Suspense fallback={null}>
          <GridLayer enabled={grid} />
        </Suspense>
        <Suspense fallback={null}>
          <StarsLayer enabled={stars} />
        </Suspense>
        <Suspense fallback={null}>
          <NoiseLayer enabled={noise} />
        </Suspense>
        <Suspense fallback={null}>
          <FloatingDataLayer enabled={floatingData} />
        </Suspense>
      </div>
    </>
  );
}
