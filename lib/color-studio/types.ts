/* ── Color-space types ────────────────────────────────────────────────────── */

/** 8-bit RGB, 0–255 per channel. `a` is 0–1. */
export interface RGB {
  r: number;
  g: number;
  b: number;
  a?: number;
}

/** HSL, all 0–1. */
export interface HSL {
  h: number; // 0–360 mapped to 0–1
  s: number;
  l: number;
  a?: number;
}

/** HSV / HSB, all 0–1. */
export interface HSV {
  h: number;
  s: number;
  v: number;
  a?: number;
}

/** CMYK, 0–1 each. */
export interface CMYK {
  c: number;
  m: number;
  y: number;
  k: number;
}

/** CIE XYZ (D65). */
export interface XYZ {
  x: number;
  y: number;
  z: number;
}

/** CIE L*a*b* (D65). L: 0–100, a/b: typically -128–127. */
export interface LAB {
  l: number;
  a: number;
  b: number;
}

/** CIE L*C*h° (D65). L: 0–100, C: 0–~150, h: 0–360. */
export interface LCH {
  l: number;
  c: number;
  h: number;
}

/** Oklab. L: 0–1, a/b: -0.4–0.4. */
export interface OKLAB {
  l: number;
  a: number;
  b: number;
}

/** OKLCH. L: 0–1, C: 0–0.4, h: 0–360. */
export interface OKLCH {
  l: number;
  c: number;
  h: number;
}

/** Named color record. */
export interface NamedColor {
  name: string;
  hex: string;
  rgb: RGB;
}

/** A color-stop in a gradient. */
export interface GradientStop {
  offset: number; // 0–1
  color: string; // hex
  opacity?: number; // 0–1, default 1
}

/** Blend mode for gradient layers. */
export type BlendMode =
  | 'normal'
  | 'multiply'
  | 'overlay'
  | 'screen'
  | 'soft-light'
  | 'hard-light'
  | 'difference'
  | 'color-dodge'
  | 'color-burn';

/** Noise overlay configuration. */
export interface NoiseConfig {
  enabled: boolean;
  intensity: number; // 0–100
  size: number; // px
  contrast: number; // 0–100
  type: 'svg' | 'css' | 'canvas';
}

/** Mask overlay configuration. */
export interface MaskConfig {
  type: 'top-fade' | 'bottom-fade' | 'left-fade' | 'right-fade' | 'circle' | 'ellipse' | 'spotlight' | 'text';
  size: number; // 0–100%
  softness: number; // 0–100%
}

/** Animation configuration for animated gradients. */
export interface AnimationConfig {
  type: 'static' | 'aurora' | 'wave' | 'rotate' | 'pulse' | 'floating' | 'noise' | 'morph' | 'gradient-shift' | 'blob-motion';
  speed: number; // 1–10
  direction: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
  delay: number; // seconds
  loop: boolean;
  timingFunction: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
}

/** Gradient definition. */
export interface GradientDefinition {
  type: 'linear' | 'radial' | 'conic' | 'repeating-linear' | 'repeating-radial';
  angle: number; // degrees
  stops: GradientStop[];
  /** Position for radial/conic (0–1 each). */
  position?: { x: number; y: number };
  /** Shape for radial gradients. */
  shape?: 'circle' | 'ellipse';
  /** Size keyword for radial gradients. */
  size?: 'closest-side' | 'farthest-side' | 'closest-corner' | 'farthest-corner' | string;
  /** Blend mode for the gradient. */
  blendMode?: BlendMode;
  /** Noise overlay. */
  noise?: NoiseConfig | null;
  /** Mask overlay. */
  mask?: MaskConfig | null;
  /** Animation config. */
  animation?: AnimationConfig | null;
}

/** Palette generated from a seed. */
export interface ColorPalette {
  name: string;
  colors: string[]; // hex strings
}

/** Color harmony type. */
export type HarmonyType =
  | 'complementary'
  | 'split-complementary'
  | 'analogous'
  | 'triadic'
  | 'tetradic'
  | 'square'
  | 'monochromatic';

/** WCAG contrast level. */
export type WCAGLevel = 'AA' | 'AAA' | 'AA-large' | 'fail';

/** Design token category. */
export type TokenFormat = 'css' | 'tailwind' | 'scss' | 'less' | 'style-dictionary';

/** Color blindness type. */
export type ColorBlindnessType = 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia';

/** Supported color string formats. */
export type ColorStringFormat = 'hex' | 'hexa' | 'rgb' | 'rgba' | 'hsl' | 'hsla' | 'hsv' | 'hsva' | 'cmyk' | 'lab' | 'lch';

/** Union of all color-space objects. */
export type ColorSpace = RGB | HSL | HSV | CMYK | XYZ | LAB | LCH | OKLAB | OKLCH;
