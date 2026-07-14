/**
 * Gradient Studio — blend mode utilities.
 *
 * CSS mapping and labels for all 9 supported blend modes.
 */

import type { BlendMode } from './types';

/** Map a BlendMode to its CSS mix-blend-mode value. */
export function blendModeToCSS(mode: BlendMode): string {
  return mode;
}

/** Human-readable labels for each blend mode. */
export const BLEND_MODE_LABELS: Record<BlendMode, string> = {
  normal: 'Normal',
  multiply: 'Multiply',
  overlay: 'Overlay',
  screen: 'Screen',
  'soft-light': 'Soft Light',
  'hard-light': 'Hard Light',
  difference: 'Difference',
  'color-dodge': 'Color Dodge',
  'color-burn': 'Color Burn',
};

/** Short descriptions for each blend mode. */
export const BLEND_MODE_DESCRIPTIONS: Record<BlendMode, string> = {
  normal: 'Default — no blending',
  multiply: 'Darkens by multiplying color values',
  overlay: 'Combines multiply and screen',
  screen: 'Lightens by inverting, multiplying, inverting',
  'soft-light': 'Soft, subdued lighting effect',
  'hard-light': 'Harsh, strong lighting effect',
  difference: 'Subtracts darker from lighter color',
  'color-dodge': 'Lightens by decreasing contrast',
  'color-burn': 'Darkens by increasing contrast',
};

/** Get all blend modes as an array. */
export function getAllBlendModes(): BlendMode[] {
  return [
    'normal', 'multiply', 'overlay', 'screen',
    'soft-light', 'hard-light', 'difference',
    'color-dodge', 'color-burn',
  ];
}
