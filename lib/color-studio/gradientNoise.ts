/**
 * Gradient Studio — noise generator.
 *
 * Generates SVG noise data URLs and CSS noise overlays
 * for use as gradient texture effects.
 */

import type { NoiseConfig } from './types';

/** Generate an SVG noise data URL. */
export function generateNoiseDataURL(config: NoiseConfig): string {
  const size = Math.max(1, config.size);
  const intensity = Math.max(0, Math.min(100, config.intensity));
  const contrast = Math.max(0, Math.min(100, config.contrast));

  // Map intensity 0–100 → alpha 0–0.5
  const alpha = (intensity / 100) * 0.5;

  // Map contrast 0–100 → threshold 0.3–0.7
  const threshold = 0.3 + (contrast / 100) * 0.4;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
  <filter id="n">
    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" />
    <feColorMatrix type="matrix" values="
      0 0 0 0 0
      0 0 0 0 0
      0 0 0 0 0
      0 0 0 ${alpha} 0
    "/>
    <feComponentTransfer>
      <feFuncA type="discrete" tableValues="0 ${threshold} 1"/>
    </feComponentTransfer>
  </filter>
  <rect width="100%" height="100%" filter="url(#n)" opacity="1"/>
</svg>`;

  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

/** Generate CSS noise overlay styles. */
export function generateNoiseCSS(config: NoiseConfig): string {
  if (!config.enabled) return '';

  const size = Math.max(1, config.size);
  const intensity = Math.max(0, Math.min(100, config.intensity));

  return `/* Noise overlay */
background-blend-mode: overlay;
background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 ${intensity / 200} 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");`;
}

/** Get CSS filter noise style for Canvas-based noise. */
export function generateCanvasNoiseScript(intensity: number): string {
  return `
function applyNoise(canvas, intensity = ${intensity}) {
  const ctx = canvas.getContext('2d');
  const imageData = ctx.createImageData(canvas.width, canvas.height);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const v = Math.random() * 255;
    data[i] = v;
    data[i + 1] = v;
    data[i + 2] = v;
    data[i + 3] = (Math.random() * intensity) / 100 * 255;
  }
  ctx.putImageData(imageData, 0, 0);
}`;
}

/** Default SVG noise as a reusable data URL (for quick preview). */
export function getDefaultNoiseDataURL(): string {
  return generateNoiseDataURL({ enabled: true, intensity: 30, size: 2, contrast: 50, type: 'svg' });
}
