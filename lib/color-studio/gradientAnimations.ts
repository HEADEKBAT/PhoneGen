/**
 * Gradient Studio — animation library.
 *
 * Generates CSS @keyframes for 8 animation types and builds
 * complete animation CSS strings for gradient elements.
 */

import type { AnimationConfig } from './types';

/* ── Animation type metadata ───────────────────────────────────────────────── */

export interface AnimationDefinition {
  type: AnimationConfig['type'];
  name: string;
  description: string;
  keyframes: string; // CSS @keyframes block
  defaultSpeed: number;
  defaultTiming: AnimationConfig['timingFunction'];
}

/* ── Per-type keyframes ────────────────────────────────────────────────────── */

function auroraKeyframes(name: string): string {
  return `@keyframes ${name} {
  0%   { transform: translate(0, 0) scale(1) rotate(0deg); filter: blur(0px); }
  25%  { transform: translate(5%, -5%) scale(1.05) rotate(2deg); filter: blur(1px); }
  50%  { transform: translate(-3%, 3%) scale(0.95) rotate(-1deg); filter: blur(0px); }
  75%  { transform: translate(3%, -2%) scale(1.02) rotate(1deg); filter: blur(0.5px); }
  100% { transform: translate(0, 0) scale(1) rotate(0deg); filter: blur(0px); }
}`;
}

function waveKeyframes(name: string): string {
  return `@keyframes ${name} {
  0%   { transform: translateY(0) scaleY(1); }
  25%  { transform: translateY(-8%) scaleY(1.05); }
  50%  { transform: translateY(0) scaleY(0.95); }
  75%  { transform: translateY(8%) scaleY(1.05); }
  100% { transform: translateY(0) scaleY(1); }
}`;
}

function rotateKeyframes(name: string): string {
  return `@keyframes ${name} {
  0%   { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`;
}

function pulseKeyframes(name: string): string {
  return `@keyframes ${name} {
  0%   { opacity: 1; transform: scale(1); }
  50%  { opacity: 0.7; transform: scale(1.02); }
  100% { opacity: 1; transform: scale(1); }
}`;
}

function floatingKeyframes(name: string): string {
  return `@keyframes ${name} {
  0%   { transform: translateY(0px) rotate(0deg); }
  33%  { transform: translateY(-10px) rotate(1deg); }
  66%  { transform: translateY(5px) rotate(-0.5deg); }
  100% { transform: translateY(0px) rotate(0deg); }
}`;
}

function noiseKeyframes(name: string): string {
  return `@keyframes ${name} {
  0%   { transform: translate(0, 0); }
  10%  { transform: translate(-2%, -2%); }
  20%  { transform: translate(2%, 1%); }
  30%  { transform: translate(-1%, 2%); }
  40%  { transform: translate(2%, -1%); }
  50%  { transform: translate(-2%, 0); }
  60%  { transform: translate(1%, 2%); }
  70%  { transform: translate(0, -2%); }
  80%  { transform: translate(-1%, -1%); }
  90%  { transform: translate(2%, 2%); }
  100% { transform: translate(0, 0); }
}`;
}

function morphKeyframes(name: string): string {
  return `@keyframes ${name} {
  0%   { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
  25%  { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
  50%  { border-radius: 50% 50% 20% 80% / 25% 80% 20% 75%; }
  75%  { border-radius: 40% 60% 60% 40% / 50% 40% 60% 50%; }
  100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
}`;
}

function gradientShiftKeyframes(name: string): string {
  return `@keyframes ${name} {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}`;
}

function blobMotionKeyframes(name: string): string {
  return `@keyframes ${name} {
  0%   { transform: translate(0, 0) scale(1); }
  25%  { transform: translate(20%, -15%) scale(1.1); }
  50%  { transform: translate(-10%, 10%) scale(0.9); }
  75%  { transform: translate(15%, 5%) scale(1.05); }
  100% { transform: translate(0, 0) scale(1); }
}`;
}

/* ── Registry ──────────────────────────────────────────────────────────────── */

const ANIMATION_DEFINITIONS: AnimationDefinition[] = [
  {
    type: 'aurora',
    name: 'Aurora',
    description: 'Gentle sweeping motion with blur variation — mimics northern lights',
    keyframes: auroraKeyframes('gradient-aurora'),
    defaultSpeed: 6,
    defaultTiming: 'ease-in-out',
  },
  {
    type: 'wave',
    name: 'Wave',
    description: 'Vertical undulation like ocean waves',
    keyframes: waveKeyframes('gradient-wave'),
    defaultSpeed: 4,
    defaultTiming: 'ease-in-out',
  },
  {
    type: 'rotate',
    name: 'Rotate',
    description: 'Continuous 360° rotation',
    keyframes: rotateKeyframes('gradient-rotate'),
    defaultSpeed: 3,
    defaultTiming: 'linear',
  },
  {
    type: 'pulse',
    name: 'Pulse',
    description: 'Gentle opacity and scale breathing effect',
    keyframes: pulseKeyframes('gradient-pulse'),
    defaultSpeed: 2,
    defaultTiming: 'ease-in-out',
  },
  {
    type: 'floating',
    name: 'Floating',
    description: 'Slow levitation with subtle rotation',
    keyframes: floatingKeyframes('gradient-floating'),
    defaultSpeed: 3,
    defaultTiming: 'ease-in-out',
  },
  {
    type: 'noise',
    name: 'Noise',
    description: 'Subtle shifting noise texture',
    keyframes: noiseKeyframes('gradient-noise'),
    defaultSpeed: 0.5,
    defaultTiming: 'linear',
  },
  {
    type: 'morph',
    name: 'Morph',
    description: 'Morphing border-radius blob effect',
    keyframes: morphKeyframes('gradient-morph'),
    defaultSpeed: 8,
    defaultTiming: 'ease-in-out',
  },
  {
    type: 'gradient-shift',
    name: 'Gradient Shift',
    description: 'Animated background position for gradient movement',
    keyframes: gradientShiftKeyframes('gradient-shift'),
    defaultSpeed: 5,
    defaultTiming: 'ease',
  },
  {
    type: 'blob-motion',
    name: 'Blob Motion',
    description: 'Complex multi-directional blob movement',
    keyframes: blobMotionKeyframes('gradient-blob'),
    defaultSpeed: 10,
    defaultTiming: 'ease-in-out',
  },
];

/** Get all animation definitions. */
export function getAnimations(): AnimationDefinition[] {
  return ANIMATION_DEFINITIONS;
}

/** Get a single animation definition by type. */
export function getAnimation(type: AnimationConfig['type']): AnimationDefinition | undefined {
  return ANIMATION_DEFINITIONS.find((a) => a.type === type);
}

/** Generate a unique keyframes name for a gradient. */
export function keyframesName(id: string, type: string): string {
  return `gradient-${type}-${id.slice(-6)}`;
}

/** Build the full animation CSS property value from an AnimationConfig. */
export function animationCSSValue(anim: AnimationConfig): string {
  if (anim.type === 'static') return 'none';

  const name = keyframesName('anim', anim.type);
  const speed = anim.speed;
  const timing = anim.timingFunction;
  const delay = anim.delay;
  const direction = anim.direction;
  const iteration = anim.loop ? 'infinite' : '1';

  return `${name} ${speed}s ${timing} ${delay}s ${direction} ${iteration}`;
}

/** Build the complete CSS @keyframes + animation property for a gradient. */
export function buildFullAnimationCSS(
  anim: AnimationConfig,
  id: string,
): string {
  if (anim.type === 'static') return '';

  const def = getAnimation(anim.type);
  if (!def) return '';

  const name = keyframesName(id, anim.type);
  const keyframes = def.keyframes.replace(/gradient-\w+/g, name);
  const animationValue = animationCSSValue(anim);

  return `${keyframes}\n\n.element {\n  animation: ${animationValue};\n  background-size: 200% 200%;\n}`;
}

/** Animation labels for UI display. */
export const ANIMATION_TYPE_LABELS: Record<AnimationConfig['type'], string> = {
  static: 'None',
  aurora: 'Aurora',
  wave: 'Wave',
  rotate: 'Rotate',
  pulse: 'Pulse',
  floating: 'Floating',
  noise: 'Noise',
  morph: 'Morph',
  'gradient-shift': 'Gradient Shift',
  'blob-motion': 'Blob Motion',
};

/** Direction labels. */
export const DIRECTION_LABELS: Record<AnimationConfig['direction'], string> = {
  normal: 'Normal',
  reverse: 'Reverse',
  alternate: 'Alternate',
  'alternate-reverse': 'Alternate Reverse',
};

/** Timing function labels. */
export const TIMING_LABELS: Record<AnimationConfig['timingFunction'], string> = {
  linear: 'Linear',
  ease: 'Ease',
  'ease-in': 'Ease In',
  'ease-out': 'Ease Out',
  'ease-in-out': 'Ease In Out',
};
