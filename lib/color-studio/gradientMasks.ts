/**
 * Gradient Studio — mask utilities.
 *
 * Builds CSS mask values for 8 mask types used to shape gradient overlays.
 */

import type { MaskConfig } from './types';

/* ── Mask type metadata ────────────────────────────────────────────────────── */

export interface MaskDefinition {
  type: MaskConfig['type'];
  name: string;
  description: string;
  icon: string;
}

export const MASK_DEFINITIONS: MaskDefinition[] = [
  { type: 'top-fade', name: 'Top Fade', description: 'Fades out toward the top edge', icon: '⬆' },
  { type: 'bottom-fade', name: 'Bottom Fade', description: 'Fades out toward the bottom edge', icon: '⬇' },
  { type: 'left-fade', name: 'Left Fade', description: 'Fades out toward the left edge', icon: '⬅' },
  { type: 'right-fade', name: 'Right Fade', description: 'Fades out toward the right edge', icon: '➡' },
  { type: 'circle', name: 'Circle', description: 'Circular vignette mask', icon: '⭕' },
  { type: 'ellipse', name: 'Ellipse', description: 'Elliptical vignette mask', icon: '🔮' },
  { type: 'spotlight', name: 'Spotlight', description: 'Center spotlight effect', icon: '🔦' },
  { type: 'text', name: 'Text', description: 'Clip to text shape', icon: '🔤' },
];

/** Build a CSS mask-image value from a MaskConfig. */
export function buildMaskCSS(mask: MaskConfig): string {
  const { type, size, softness } = mask;
  const s = Math.max(0, Math.min(100, size)) / 100;
  const soft = Math.max(0, Math.min(100, softness)) / 100;

  // Convert size+softness to stop positions
  const hardStop = s;
  const softStart = Math.max(0, hardStop - soft * 0.3);
  const softEnd = Math.min(1, hardStop + soft * 0.3);

  switch (type) {
    case 'top-fade':
      return `linear-gradient(to bottom, transparent ${Math.round(softStart * 100)}%, black ${Math.round(softEnd * 100)}%)`;

    case 'bottom-fade':
      return `linear-gradient(to top, transparent ${Math.round(softStart * 100)}%, black ${Math.round(softEnd * 100)}%)`;

    case 'left-fade':
      return `linear-gradient(to right, transparent ${Math.round(softStart * 100)}%, black ${Math.round(softEnd * 100)}%)`;

    case 'right-fade':
      return `linear-gradient(to left, transparent ${Math.round(softStart * 100)}%, black ${Math.round(softEnd * 100)}%)`;

    case 'circle':
      return `radial-gradient(circle ${Math.round(s * 100)}% at center, black ${Math.round(Math.max(0, s - soft * 0.5) * 100)}%, transparent ${Math.round(s * 100)}%)`;

    case 'ellipse':
      return `radial-gradient(ellipse ${Math.round(s * 100)}% ${Math.round(s * 70)}% at center, black ${Math.round(Math.max(0, s - soft * 0.5) * 100)}%, transparent ${Math.round(s * 100)}%)`;

    case 'spotlight':
      return `radial-gradient(circle ${Math.round(Math.max(10, s * 50))}% at center, black 0%, transparent ${Math.round(Math.max(20, s * 50 + soft * 30))}%)`;

    case 'text':
      return `linear-gradient(to bottom, black ${Math.round(softStart * 100)}%, transparent ${Math.round(softEnd * 100)}%) /* Use with -webkit-text-fill-color: transparent */`;

    default:
      return 'none';
  }
}

/** Build the full CSS mask property block. */
export function buildFullMaskCSS(mask: MaskConfig): string {
  return `mask-image: ${buildMaskCSS(mask)};
-webkit-mask-image: ${buildMaskCSS(mask)};
mask-repeat: no-repeat;
-webkit-mask-repeat: no-repeat;
mask-size: cover;
-webkit-mask-size: cover;`;
}
