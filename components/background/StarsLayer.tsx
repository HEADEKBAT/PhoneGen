'use client';

import { useMemo } from 'react';
import type { BackgroundLayerProps } from './types';

interface Star {
  left: string;
  top: string;
  size: number;
  delay: number;
  duration: number;
}

const STAR_COUNT = 50;
const MOBILE_VISIBLE = 20;

/**
 * Deterministic pseudo-random — SplitMix hash using 32-bit integer math.
 * Produces well-scattered values (no linear patterns) identical on every JS engine.
 * Avoids hydration mismatches that Math.random() would cause.
 */
function det(i: number, offset: number): number {
  let z = (i + offset * 7919) | 0;
  z = Math.imul(z ^ (z >>> 16), 0x85ebca6b);
  z = Math.imul(z ^ (z >>> 13), 0xc2b2ae35);
  z = (z ^ (z >>> 16)) >>> 0;
  return z / 0xffffffff;
}

/**
 * Generate star coordinates/meta — fully deterministic, stable across SSR and hydration.
 */
function generateStars(): Star[] {
  return Array.from({ length: STAR_COUNT }, (_, i) => ({
    left: `${det(i, 1) * 100}%`,
    top: `${det(i, 2) * 100}%`,
    size: det(i, 3) < 0.6 ? 1 : 2,
    delay: det(i, 4) * 10,
    duration: 12 + det(i, 5) * 12,
  }));
}

/**
 * Twinkling star field.
 * First 20 stars are always visible; remaining 30 only on md+.
 * Uses React.useMemo for stable positions.
 */
export default function StarsLayer({ enabled = true }: BackgroundLayerProps) {
  const stars = useMemo(() => generateStars(), []);

  if (!enabled) return null;

  return (
    <>
      <style>{`
        @keyframes star-pulse {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.85; }
        }

        @keyframes star-float {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(0, -5px, 0); }
        }
      `}</style>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {stars.map((star, i) => (
          <span
            key={i}
            className={i >= MOBILE_VISIBLE ? 'hidden md:block' : undefined}
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
              borderRadius: '50%',
              background: '#fff',
              animation: `star-pulse ${star.duration}s ease-in-out ${star.delay}s infinite, star-float ${star.duration}s ease-in-out ${star.delay}s infinite`,
              willChange: 'transform, opacity',
            }}
          />
        ))}
      </div>
    </>
  );
}
