'use client';

import type { BackgroundLayerProps } from './types';

/** Aurora orb configuration */
interface Orb {
  color: string;
  size: string;
  top: string;
  left: string;
  animName: string;
  duration: number;
  dx: number;
  dy: number;
}

const ORBS: Orb[] = [
  {
    color: 'rgba(99,102,241,0.18)',
    size: '700px',
    top: '-15%',
    left: '-10%',
    animName: 'aurora-drift-1',
    duration: 35,
    dx: 40,
    dy: -30,
  },
  {
    color: 'rgba(6,182,212,0.10)',
    size: '600px',
    top: '10%',
    left: '55%',
    animName: 'aurora-drift-2',
    duration: 28,
    dx: -35,
    dy: 25,
  },
  {
    color: 'rgba(168,85,247,0.12)',
    size: '500px',
    top: '40%',
    left: '70%',
    animName: 'aurora-drift-3',
    duration: 32,
    dx: 20,
    dy: 35,
  },
  {
    color: 'rgba(99,102,241,0.08)',
    size: '550px',
    top: '55%',
    left: '20%',
    animName: 'aurora-drift-4',
    duration: 25,
    dx: -25,
    dy: -20,
  },
];

/**
 * Large blurred gradient orbs that drift slowly across the background.
 * Pure CSS animation — no JS animation loop.
 */
export default function AuroraLayer({ enabled = true }: BackgroundLayerProps) {
  if (!enabled) return null;

  return (
    <>
      <style>{`
        ${ORBS.map(
          (orb) => `
        @keyframes ${orb.animName} {
          0%, 100% { transform: translate3d(0, 0, 0); }
          33% { transform: translate3d(${orb.dx * 0.6}px, ${orb.dy * 0.5}px, 0); }
          66% { transform: translate3d(${orb.dx * -0.4}px, ${orb.dy * 1.2}px, 0); }
        }`,
        ).join('\n')}
      `}</style>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        {ORBS.map((orb, i) => (
          <div
            key={i}
            aria-hidden="true"
            style={{
              position: 'absolute',
              width: orb.size,
              height: orb.size,
              top: orb.top,
              left: orb.left,
              background: `radial-gradient(ellipse, ${orb.color}, transparent 70%)`,
              borderRadius: '50%',
              filter: 'blur(120px)',
              animation: `${orb.animName} ${orb.duration}s ease-in-out infinite alternate`,
              willChange: 'transform',
            }}
          />
        ))}
      </div>
    </>
  );
}
