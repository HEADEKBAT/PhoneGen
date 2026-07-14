/**
 * Gradient Studio — Reverse Gradient Builder.
 *
 * Extracts dominant colors from image data and generates
 * a matching gradient configuration.
 */

import type { GradientConfig } from './gradientTypes';
import { generateGradientId } from './gradientTypes';

/* ── Color quantization (simple median cut) ────────────────────────────────── */

interface RGBColor {
  r: number;
  g: number;
  b: number;
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => Math.round(n).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function colorDistance(a: RGBColor, b: RGBColor): number {
  return Math.sqrt(
    (a.r - b.r) ** 2 + (a.g - b.g) ** 2 + (a.b - b.b) ** 2,
  );
}

/**
 * Extract dominant colors from ImageData using simple bucket quantization.
 * Returns up to `maxColors` hex strings sorted by frequency.
 */
export function extractDominantColors(
  imageData: ImageData,
  maxColors = 5,
): string[] {
  const { data, width, height } = imageData;
  const pixels: RGBColor[] = [];

  // Sample pixels (skip for performance)
  const step = Math.max(1, Math.floor(Math.sqrt((width * height) / 10000)));

  for (let i = 0; i < data.length; i += 4 * step) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];
    if (a > 128) {
      // Ignore near-white and near-black for better results
      const brightness = (r + g + b) / 3;
      if (brightness > 240 || brightness < 15) continue;
      pixels.push({ r, g, b });
    }
  }

  if (pixels.length === 0) {
    return ['#667eea', '#764ba2'];
  }

  // Simple k-means clustering
  const k = Math.min(maxColors, pixels.length);
  const clusters = kMeans(pixels, k, 5);

  // Sort by cluster size (most frequent first)
  return clusters
    .sort((a, b) => b.count - a.count)
    .map((c) => rgbToHex(c.centroid.r, c.centroid.g, c.centroid.b));
}

interface Cluster {
  centroid: RGBColor;
  count: number;
}

function kMeans(pixels: RGBColor[], k: number, iterations: number): Cluster[] {
  // Initialize centroids randomly
  let centroids: RGBColor[] = [];
  for (let i = 0; i < k; i++) {
    const idx = Math.floor(Math.random() * pixels.length);
    centroids.push({ ...pixels[idx] });
  }

  for (let iter = 0; iter < iterations; iter++) {
    // Assign pixels to nearest centroid
    const assignments: RGBColor[][] = Array.from({ length: k }, () => []);

    for (const pixel of pixels) {
      let minDist = Infinity;
      let assignIdx = 0;
      for (let j = 0; j < k; j++) {
        const dist = colorDistance(pixel, centroids[j]);
        if (dist < minDist) {
          minDist = dist;
          assignIdx = j;
        }
      }
      assignments[assignIdx].push(pixel);
    }

    // Recompute centroids
    for (let j = 0; j < k; j++) {
      if (assignments[j].length === 0) continue;
      let sumR = 0, sumG = 0, sumB = 0;
      for (const p of assignments[j]) {
        sumR += p.r;
        sumG += p.g;
        sumB += p.b;
      }
      centroids[j] = {
        r: sumR / assignments[j].length,
        g: sumG / assignments[j].length,
        b: sumB / assignments[j].length,
      };
    }
  }

  // Count final assignments
  const clusters: Cluster[] = centroids.map((centroid) => ({ centroid, count: 0 }));

  for (const pixel of pixels) {
    let minDist = Infinity;
    let assignIdx = 0;
    for (let j = 0; j < k; j++) {
      const dist = colorDistance(pixel, centroids[j]);
      if (dist < minDist) {
        minDist = dist;
        assignIdx = j;
      }
    }
    clusters[assignIdx].count++;
  }

  return clusters;
}

/**
 * Create a gradient config from an image's dominant colors.
 * Sorted darkest-to-lightest for a natural gradient.
 */
export function createGradientFromColors(colors: string[]): GradientConfig {
  if (colors.length === 0) {
    colors = ['#667eea', '#764ba2'];
  }

  const sorted = [...colors].sort((a, b) => {
    const hexToBrightness = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16) || 0;
      const g = parseInt(hex.slice(3, 5), 16) || 0;
      const b = parseInt(hex.slice(5, 7), 16) || 0;
      return (r + g + b) / 3;
    };
    return hexToBrightness(a) - hexToBrightness(b);
  });

  const stops = sorted.map((color, i) => ({
    offset: i / (sorted.length - 1),
    color,
  }));

  return {
    id: generateGradientId(),
    name: 'Reverse Gradient',
    type: 'linear',
    angle: 135,
    stops,
    tags: ['reverse', 'image'],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    position: { x: 0.5, y: 0.5 },
    shape: 'circle',
    size: 'farthest-corner',
    blendMode: 'normal',
    noise: null,
    mask: null,
    animation: null,
    mesh: null,
    aurora: null,
  };
}

/**
 * Load an image from a File/Blob to an HTMLImageElement.
 */
export function loadImage(file: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      resolve(img);
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      reject(new Error('Failed to load image'));
      URL.revokeObjectURL(url);
    };
    img.src = url;
  });
}

/**
 * Extract ImageData from an HTMLImageElement.
 */
export function imageToImageData(
  img: HTMLImageElement,
  maxSize = 200,
): ImageData {
  const canvas = document.createElement('canvas');
  const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
  canvas.width = Math.floor(img.width * scale);
  canvas.height = Math.floor(img.height * scale);

  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}
