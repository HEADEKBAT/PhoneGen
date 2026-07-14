/**
 * Image color extraction.
 *
 * Uses canvas-based k-means clustering to extract dominant colors
 * from an image. Runs purely on the client via a hidden canvas.
 */

import type { RGB, ColorPalette } from './types';
import { rgbToHex } from './converters';

/**
 * Extract dominant colors from an image element.
 *
 * @param img — HTMLImageElement (must be loaded and crossOrigin-friendly)
 * @param count — number of colors to extract (default: 5)
 * @param sampleRate — fraction of pixels to sample (default: 0.1)
 * @returns palette of dominant colors
 */
export function extractColorsFromImage(
  img: HTMLImageElement,
  count = 5,
  sampleRate = 0.1,
): ColorPalette {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return { name: 'Extracted', colors: ['#000000'] };

  // Scale down for performance
  const maxSize = 200;
  let w = img.naturalWidth;
  let h = img.naturalHeight;
  if (w > maxSize || h > maxSize) {
    const ratio = maxSize / Math.max(w, h);
    w = Math.round(w * ratio);
    h = Math.round(h * ratio);
  }
  canvas.width = w;
  canvas.height = h;
  ctx.drawImage(img, 0, 0, w, h);

  const imageData = ctx.getImageData(0, 0, w, h);
  const pixels = imageData.data;

  // Sample pixels
  const sampled: RGB[] = [];
  const step = Math.max(1, Math.round(1 / sampleRate));
  for (let i = 0; i < pixels.length; i += step * 4) {
    sampled.push({ r: pixels[i], g: pixels[i + 1], b: pixels[i + 2] });
  }

  if (sampled.length === 0) return { name: 'Extracted', colors: ['#000000'] };

  const clusters = kMeans(sampled, count, 10);
  return {
    name: 'Extracted Colors',
    colors: clusters.map((c) => rgbToHex(c)),
  };
}

/* ─── K-Means Clustering ────────────────────────────────────────────────── */

function euclideanDist(a: RGB, b: RGB): number {
  const dr = a.r - b.r;
  const dg = a.g - b.g;
  const db = a.b - b.b;
  return dr * dr + dg * dg + db * db;
}

function randomCentroids(pixels: RGB[], k: number): RGB[] {
  const centroids: RGB[] = [];
  const used = new Set<number>();
  while (centroids.length < k && used.size < pixels.length) {
    const idx = Math.floor(Math.random() * pixels.length);
    if (!used.has(idx)) {
      used.add(idx);
      centroids.push({ ...pixels[idx] });
    }
  }
  // Fill with black if not enough distinct pixels
  while (centroids.length < k) {
    centroids.push({ r: 0, g: 0, b: 0 });
  }
  return centroids;
}

function kMeans(pixels: RGB[], k: number, maxIterations: number): RGB[] {
  let centroids = randomCentroids(pixels, k);
  const assignments = new Array(pixels.length).fill(-1);

  for (let iter = 0; iter < maxIterations; iter++) {
    // Assign each pixel to nearest centroid
    let changed = false;
    for (let i = 0; i < pixels.length; i++) {
      let minDist = Infinity;
      let best = 0;
      for (let j = 0; j < k; j++) {
        const d = euclideanDist(pixels[i], centroids[j]);
        if (d < minDist) {
          minDist = d;
          best = j;
        }
      }
      if (assignments[i] !== best) {
        assignments[i] = best;
        changed = true;
      }
    }

    if (!changed) break;

    // Recompute centroids
    for (let j = 0; j < k; j++) {
      let sumR = 0, sumG = 0, sumB = 0, count = 0;
      for (let i = 0; i < pixels.length; i++) {
        if (assignments[i] === j) {
          sumR += pixels[i].r;
          sumG += pixels[i].g;
          sumB += pixels[i].b;
          count++;
        }
      }
      if (count > 0) {
        centroids[j] = {
          r: Math.round(sumR / count),
          g: Math.round(sumG / count),
          b: Math.round(sumB / count),
        };
      }
    }
  }

  // Sort centroids by brightness (descending)
  const brightness = (c: RGB) => c.r * 0.299 + c.g * 0.587 + c.b * 0.114;
  return centroids.sort((a, b) => brightness(b) - brightness(a));
}
