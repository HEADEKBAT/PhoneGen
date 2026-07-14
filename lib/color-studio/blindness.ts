/**
 * Color blindness simulation.
 *
 * Uses the LMS (Long-Medium-Short) cone response model and
 * Brettel, Viénot, and Mollon 1997 transformation matrices
 * to simulate protanopia, deuteranopia, tritanopia, and
 * achromatopsia.
 */

import type { RGB, ColorBlindnessType } from './types';
import { relativeLuminance } from './contrast';

/* ─── LMS matrices (Brettel 1997) ────────────────────────────────────────── */

const LMS_FROM_RGB = [
  [0.31399022, 0.63951294, 0.04649755],
  [0.15537241, 0.75789446, 0.08670142],
  [0.01775239, 0.10944209, 0.87256922],
];

const TO_LMS = (r: number, g: number, b: number): [number, number, number] => {
  const linearize = (c: number) => {
    const v = c / 255;
    return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  const [rl, gl, bl] = [linearize(r), linearize(g), linearize(b)];
  return [
    LMS_FROM_RGB[0][0] * rl + LMS_FROM_RGB[0][1] * gl + LMS_FROM_RGB[0][2] * bl,
    LMS_FROM_RGB[1][0] * rl + LMS_FROM_RGB[1][1] * gl + LMS_FROM_RGB[1][2] * bl,
    LMS_FROM_RGB[2][0] * rl + LMS_FROM_RGB[2][1] * gl + LMS_FROM_RGB[2][2] * bl,
  ];
};

const FROM_LMS = (l: number, m: number, s: number): RGB => {
  const rl = 5.47221206 * l - 4.6419601 * m + 0.16963708 * s;
  const gl = -1.1252419 * l + 2.29317094 * m - 0.1678952 * s;
  const bl = 0.02980165 * l - 0.19318073 * m + 1.16364789 * s;

  const gamma = (v: number) => {
    const vv = Math.max(0, Math.min(1, v));
    const s = vv <= 0.0031308 ? 12.92 * vv : 1.055 * Math.pow(vv, 1 / 2.4) - 0.055;
    return Math.round(Math.max(0, Math.min(255, s * 255)));
  };

  return { r: gamma(rl), g: gamma(gl), b: gamma(bl) };
};

/* ─── Simulation functions ───────────────────────────────────────────────── */

/** Simulate protanopia (L-cone deficiency). */
export function simulateProtanopia(rgb: RGB): RGB {
  const [l, m, s] = TO_LMS(rgb.r, rgb.g, rgb.b);
  return FROM_LMS(0, m, s);
}

/** Simulate deuteranopia (M-cone deficiency). */
export function simulateDeuteranopia(rgb: RGB): RGB {
  const [l, m, s] = TO_LMS(rgb.r, rgb.g, rgb.b);
  return FROM_LMS(l, 0, s);
}

/** Simulate tritanopia (S-cone deficiency). */
export function simulateTritanopia(rgb: RGB): RGB {
  const [l, m, s] = TO_LMS(rgb.r, rgb.g, rgb.b);
  return FROM_LMS(l, m, 0);
}

/** Simulate achromatopsia (total color blindness — grayscale). */
export function simulateAchromatopsia(rgb: RGB): RGB {
  const l = relativeLuminance(rgb);
  const v = Math.round(l * 255);
  return { r: v, g: v, b: v };
}


/* ─── Lookup ─────────────────────────────────────────────────────────────── */

export const BLINDNESS_SIMULATORS: Record<ColorBlindnessType, (rgb: RGB) => RGB> = {
  protanopia: simulateProtanopia,
  deuteranopia: simulateDeuteranopia,
  tritanopia: simulateTritanopia,
  achromatopsia: simulateAchromatopsia,
};

export const BLINDNESS_LABELS: Record<ColorBlindnessType, string> = {
  protanopia: 'Protanopia (red-blind)',
  deuteranopia: 'Deuteranopia (green-blind)',
  tritanopia: 'Tritanopia (blue-blind)',
  achromatopsia: 'Achromatopsia (grayscale)',
};

export function simulateBlindness(rgb: RGB, type: ColorBlindnessType): RGB {
  return BLINDNESS_SIMULATORS[type](rgb);
}
