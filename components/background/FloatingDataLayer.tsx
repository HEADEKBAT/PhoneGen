'use client';

import { useMemo } from 'react';
import type { BackgroundLayerProps } from './types';

interface DataItem {
  text: string;
  left: string;
  top: string;
  delay: number;
  duration: number;
  dx: number;
  dy: number;
}

/**
 * Demo data snippets that float across the hero background.
 * All values are static/fake — no real user data.
 */
const DATA_TEXTS = [
  '+1 202 555 0182',
  'john.smith@acme.dev',
  'Berlin, Germany',
  'TechNova Inc.',
  'sk_live_3Xk...QpW',
  'JWT_SECRET',
  'P@ssw0rd!',
  'uuid: a8f3b...c1d2',
  'API_KEY_9f8a...',
  '4f8e 9a2b 1c7d 3e5f',
];

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

function generateDataItems(): DataItem[] {
  return DATA_TEXTS.map((text, i) => ({
    text,
    left: `${5 + det(i, 10) * 75}%`,
    top: `${5 + det(i, 11) * 75}%`,
    delay: det(i, 12) * 20,
    duration: 25 + det(i, 13) * 15,
    dx: -30 + det(i, 14) * 60,
    dy: -30 + det(i, 15) * 60,
  }));
}

/**
 * Floating data snippets — the signature GenCore background effect.
 * Extremely low opacity, slightly blurred, very slow movement.
 * Hidden on mobile.
 */
export default function FloatingDataLayer({ enabled = true }: BackgroundLayerProps) {
  const items = useMemo(() => generateDataItems(), []);

  if (!enabled) return null;

  return (
    <>
      <style>{`
        @keyframes float-drift {
          0% {
            transform: translate3d(0, 0, 0);
            opacity: 0.01;
          }
          10% {
            opacity: 0.025;
          }
          80% {
            opacity: 0.025;
          }
          100% {
            transform: translate3d(var(--dx, 20px), var(--dy, -20px), 0);
            opacity: 0.005;
          }
        }
      `}</style>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden md:block"
      >
        {items.map((item, i) => (
          <span
            key={i}
            aria-hidden="true"
            style={
              {
                position: 'absolute',
                left: item.left,
                top: item.top,
                fontFamily: 'ui-monospace, monospace',
                fontSize: '10px',
                lineHeight: 1,
                color: 'inherit',
                opacity: 0.01,
                filter: 'blur(1px)',
                whiteSpace: 'nowrap',
                animation: `float-drift ${item.duration}s ease-in-out ${item.delay}s infinite`,
                '--dx': `${item.dx}px`,
                '--dy': `${item.dy}px`,
                willChange: 'transform, opacity',
              } as React.CSSProperties
            }
          >
            {item.text}
          </span>
        ))}
      </div>
    </>
  );
}
