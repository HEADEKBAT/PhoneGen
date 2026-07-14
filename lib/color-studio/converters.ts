/**
 * Color-space converters.
 *
 * All numeric color values are normalized to their documented ranges
 * (see types.ts). This module provides pure conversion functions;
 * every function is a pure (input → output) mapping.
 */

import type { RGB, HSL, HSV, CMYK, XYZ, LAB, LCH, OKLAB, OKLCH } from './types';

/* ─── HEX ⇄ RGB ─────────────────────────────────────────────────────────── */

/** HEX string (#RRGGBB or #RGB) → RGB. Returns null on invalid input. */
export function hexToRgb(hex: string): RGB | null {
  const cleaned = hex.replace(/^#/, '').trim();
  if (cleaned.length === 3) {
    const [r, g, b] = cleaned;
    return hexToRgb(`#${r}${r}${g}${g}${b}${b}`);
  }
  if (cleaned.length !== 6) return null;
  const num = parseInt(cleaned, 16);
  if (isNaN(num)) return null;
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

/** RGB → HEX string (#RRGGBB). */
export function rgbToHex({ r, g, b }: RGB): string {
  const toHex = (n: number) => Math.round(n).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/* ─── RGB ⇄ HSL ─────────────────────────────────────────────────────────── */

/** RGB (0–255) → HSL (0–1). */
export function rgbToHsl({ r, g, b }: RGB): HSL {
  const [rn, gn, bn] = [r / 255, g / 255, b / 255];
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const delta = max - min;
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (delta !== 0) {
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
    if (max === rn) h = ((gn - bn) / delta + (gn < bn ? 6 : 0)) / 6;
    else if (max === gn) h = ((bn - rn) / delta + 2) / 6;
    else h = ((rn - gn) / delta + 4) / 6;
  }

  return { h, s, l };
}

/** HSL (0–1) → RGB (0–255). */
export function hslToRgb({ h, s, l }: HSL): RGB {
  if (s === 0) {
    const v = Math.round(l * 255);
    return { r: v, g: v, b: v };
  }

  const hue2rgb = (p: number, q: number, t: number) => {
    let tt = t;
    if (tt < 0) tt += 1;
    if (tt > 1) tt -= 1;
    if (tt < 1 / 6) return p + (q - p) * 6 * tt;
    if (tt < 1 / 2) return q;
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const r = hue2rgb(p, q, h + 1 / 3);
  const g = hue2rgb(p, q, h);
  const b = hue2rgb(p, q, h - 1 / 3);

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

/* ─── RGB ⇄ HSV ─────────────────────────────────────────────────────────── */

/** RGB (0–255) → HSV (0–1). */
export function rgbToHsv({ r, g, b }: RGB): HSV {
  const [rn, gn, bn] = [r / 255, g / 255, b / 255];
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const delta = max - min;
  let h = 0;
  const v = max;
  const s = max === 0 ? 0 : delta / max;

  if (delta !== 0) {
    if (max === rn) h = ((gn - bn) / delta + (gn < bn ? 6 : 0)) / 6;
    else if (max === gn) h = ((bn - rn) / delta + 2) / 6;
    else h = ((rn - gn) / delta + 4) / 6;
  }

  return { h, s, v };
}

/** HSV (0–1) → RGB (0–255). */
export function hsvToRgb({ h, s, v }: HSV): RGB {
  if (s === 0) {
    const val = Math.round(v * 255);
    return { r: val, g: val, b: val };
  }

  const hi = Math.floor(h * 6) % 6;
  const f = h * 6 - Math.floor(h * 6);
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);

  const [r, g, b] = (() => {
    switch (hi) {
      case 0: return [v, t, p];
      case 1: return [q, v, p];
      case 2: return [p, v, t];
      case 3: return [p, q, v];
      case 4: return [t, p, v];
      case 5: return [v, p, q];
      default: return [0, 0, 0];
    }
  })();

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

/* ─── RGB ⇄ CMYK ────────────────────────────────────────────────────────── */

/** RGB (0–255) → CMYK (0–1). */
export function rgbToCmyk({ r, g, b }: RGB): CMYK {
  const [rn, gn, bn] = [r / 255, g / 255, b / 255];
  const k = 1 - Math.max(rn, gn, bn);
  if (k === 1) return { c: 0, m: 0, y: 0, k: 1 };
  return {
    c: (1 - rn - k) / (1 - k),
    m: (1 - gn - k) / (1 - k),
    y: (1 - bn - k) / (1 - k),
    k,
  };
}

/** CMYK (0–1) → RGB (0–255). */
export function cmykToRgb({ c, m, y, k }: CMYK): RGB {
  return {
    r: Math.round(255 * (1 - c) * (1 - k)),
    g: Math.round(255 * (1 - m) * (1 - k)),
    b: Math.round(255 * (1 - y) * (1 - k)),
  };
}

/* ─── RGB ⇄ XYZ (D65) ───────────────────────────────────────────────────── */

function srgbToLinear(c: number): number {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

function linearToSrgb(v: number): number {
  const s = v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
  return Math.round(Math.max(0, Math.min(255, s * 255)));
}

/** RGB (0–255) → CIE XYZ (D65). */
export function rgbToXyz({ r, g, b }: RGB): XYZ {
  const [rl, gl, bl] = [srgbToLinear(r), srgbToLinear(g), srgbToLinear(b)];
  return {
    x: rl * 0.4124564 + gl * 0.3575761 + bl * 0.1804375,
    y: rl * 0.2126729 + gl * 0.7151522 + bl * 0.0721750,
    z: rl * 0.0193339 + gl * 0.1191920 + bl * 0.9503041,
  };
}

/** CIE XYZ (D65) → RGB (0–255). */
export function xyzToRgb({ x, y, z }: XYZ): RGB {
  const rl = x *  3.2404542 + y * -1.5371385 + z * -0.4985314;
  const gl = x * -0.9692660 + y *  1.8760108 + z *  0.0415560;
  const bl = x *  0.0556434 + y * -0.2040259 + z *  1.0572252;
  return {
    r: linearToSrgb(rl),
    g: linearToSrgb(gl),
    b: linearToSrgb(bl),
  };
}

/* ─── XYZ ⇄ LAB (D65) ───────────────────────────────────────────────────── */

const REF_X = 0.95047;
const REF_Y = 1.0;
const REF_Z = 1.08883;

function labF(t: number): number {
  return t > 0.008856 ? Math.cbrt(t) : (7.787 * t + 16 / 116);
}

function labFInv(t: number): number {
  return t > 0.206897 ? t * t * t : (t - 16 / 116) / 7.787;
}

/** CIE XYZ (D65) → CIE L*a*b* (D65). */
export function xyzToLab({ x, y, z }: XYZ): LAB {
  const fx = labF(x / REF_X);
  const fy = labF(y / REF_Y);
  const fz = labF(z / REF_Z);
  return {
    l: 116 * fy - 16,
    a: 500 * (fx - fy),
    b: 200 * (fy - fz),
  };
}

/** CIE L*a*b* (D65) → CIE XYZ (D65). */
export function labToXyz({ l, a, b }: LAB): XYZ {
  const fy = (l + 16) / 116;
  const fx = a / 500 + fy;
  const fz = fy - b / 200;
  return {
    x: labFInv(fx) * REF_X,
    y: labFInv(fy) * REF_Y,
    z: labFInv(fz) * REF_Z,
  };
}

/** RGB → CIE L*a*b* (D65). */
export function rgbToLab(rgb: RGB): LAB {
  return xyzToLab(rgbToXyz(rgb));
}

/** CIE L*a*b* (D65) → RGB. */
export function labToRgb(lab: LAB): RGB {
  return xyzToRgb(labToXyz(lab));
}

/* ─── LAB ⇄ LCH ─────────────────────────────────────────────────────────── */

/** CIE L*a*b* → L*C*h°. */
export function labToLch({ l, a, b }: LAB): LCH {
  const c = Math.sqrt(a * a + b * b);
  let h = (Math.atan2(b, a) * 180) / Math.PI;
  if (h < 0) h += 360;
  return { l, c, h };
}

/** L*C*h° → CIE L*a*b*. */
export function lchToLab({ l, c, h }: LCH): LAB {
  const rad = (h * Math.PI) / 180;
  return {
    l,
    a: c * Math.cos(rad),
    b: c * Math.sin(rad),
  };
}

/* ─── RGB ⇄ OKLAB / OKLCH ──────────────────────────────────────────────── */

function srgbToLinearUnit(c: number): number {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

function linearToSrgbUnit(v: number): number {
  const s = v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
  return Math.round(Math.max(0, Math.min(255, s * 255)));
}

/** RGB (0–255) → OKLab (0–1). */
export function rgbToOklab({ r, g, b }: RGB): OKLAB {
  const [rl, gl, bl] = [srgbToLinearUnit(r), srgbToLinearUnit(g), srgbToLinearUnit(b)];
  const l = 0.4122214708 * rl + 0.5363325363 * gl + 0.0514459929 * bl;
  const m = 0.2119034982 * rl + 0.6806995451 * gl + 0.1073969566 * bl;
  const s = 0.0883024619 * rl + 0.2817188376 * gl + 0.6299787005 * bl;

  const l3 = Math.cbrt(l);
  const m3 = Math.cbrt(m);
  const s3 = Math.cbrt(s);

  return {
    l: 0.2104542553 * l3 + 0.7936177850 * m3 - 0.0040720468 * s3,
    a: 1.9779984951 * l3 - 2.4285922050 * m3 + 0.4505937099 * s3,
    b: 0.0259040371 * l3 + 0.7827717662 * m3 - 0.8086757660 * s3,
  };
}

/** OKLab → RGB (0–255). */
export function oklabToRgb({ l, a, b }: OKLAB): RGB {
  const l3 = l + 0.3963377774 * a + 0.2158037573 * b;
  const m3 = l - 0.1055613458 * a - 0.0638541728 * b;
  const s3 = l - 0.0894841775 * a - 1.2914855480 * b;

  const l_ = l3 * l3 * l3;
  const m_ = m3 * m3 * m3;
  const s_ = s3 * s3 * s3;

  const rl = 4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_;
  const gl = -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_;
  const bl = -0.0041960863 * l_ - 0.7034186147 * m_ + 1.7076147010 * s_;

  return {
    r: linearToSrgbUnit(rl),
    g: linearToSrgbUnit(gl),
    b: linearToSrgbUnit(bl),
  };
}

/** OKLab → OKLCH. */
export function oklabToOklch({ l, a, b }: OKLAB): OKLCH {
  const c = Math.sqrt(a * a + b * b);
  let h = (Math.atan2(b, a) * 180) / Math.PI;
  if (h < 0) h += 360;
  return { l, c, h };
}

/** OKLCH → OKLab. */
export function oklchToOklab({ l, c, h }: OKLCH): OKLAB {
  const rad = (h * Math.PI) / 180;
  return { l, a: c * Math.cos(rad), b: c * Math.sin(rad) };
}

/** RGB → OKLCH (convenience). */
export function rgbToOklch(rgb: RGB): OKLCH {
  return oklabToOklch(rgbToOklab(rgb));
}

/** OKLCH → RGB (convenience). */
export function oklchToRgb(oklch: OKLCH): RGB {
  return oklabToRgb(oklchToOklab(oklch));
}

/* ─── Color-string formatting ────────────────────────────────────────────── */

/** Format an RGB color as a CSS string. */
export function formatRgb({ r, g, b, a }: RGB & { a?: number }): string {
  if (a !== undefined && a < 1) return `rgba(${r}, ${g}, ${b}, ${a})`;
  return `rgb(${r}, ${g}, ${b})`;
}

/** Format an HSL color as a CSS string. */
export function formatHsl({ h, s, l, a }: HSL & { a?: number }): string {
  const deg = Math.round(h * 360);
  const sp = Math.round(s * 100);
  const lp = Math.round(l * 100);
  if (a !== undefined && a < 1) return `hsla(${deg}, ${sp}%, ${lp}%, ${a})`;
  return `hsl(${deg}, ${sp}%, ${lp}%)`;
}
