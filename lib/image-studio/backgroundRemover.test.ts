import { describe, expect, it } from 'vitest';

import {
  colorDistance,
  computeAlphaMask,
  sampleBackgroundClusters,
} from './backgroundRemover';

/**
 * computeAlphaMask takes raw RGBA and returns an alpha mask, with no canvas
 * involved, so the algorithm can be exercised on synthetic images.
 *
 * The headline case is the white patch inside the subject. A global colour
 * threshold removes every pixel resembling the backdrop and punches a hole
 * through a white shirt on a white background; the flood fill cannot reach
 * those pixels, so they survive.
 */

const W = 200;
const H = 200;

const inSubject = (x: number, y: number) => x >= 60 && x < 140 && y >= 60 && y < 140;
const inWhitePatch = (x: number, y: number) => x >= 85 && x < 115 && y >= 85 && y < 115;

function paint(fn: (x: number, y: number) => [number, number, number]): Uint8ClampedArray {
  const data = new Uint8ClampedArray(W * H * 4);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const [r, g, b] = fn(x, y);
      const i = (y * W + x) * 4;
      data[i] = r;
      data[i + 1] = g;
      data[i + 2] = b;
      data[i + 3] = 255;
    }
  }
  return data;
}

/** Red square on white, with a white square inside it. */
const whiteOnWhite = paint((x, y) =>
  inSubject(x, y) ? (inWhitePatch(x, y) ? [255, 255, 255] : [200, 40, 40]) : [255, 255, 255],
);

const alphaAt = (mask: Uint8Array, x: number, y: number) => mask[y * W + x];

describe('computeAlphaMask', () => {
  it('removes the background and keeps the subject', async () => {
    const mask = await computeAlphaMask(whiteOnWhite, W, H, {
      tolerance: 40,
      softBand: true,
      despeckle: false,
    });

    expect(alphaAt(mask, 2, 2)).toBe(0);
    expect(alphaAt(mask, 100, 5)).toBe(0);
    expect(alphaAt(mask, 70, 70)).toBe(255);
  });

  it('keeps a white region enclosed by the subject', async () => {
    const mask = await computeAlphaMask(whiteOnWhite, W, H, {
      tolerance: 40,
      softBand: true,
      despeckle: false,
    });

    expect(alphaAt(mask, 100, 100)).toBe(255);
  });

  it('handles a two-tone backdrop', async () => {
    const twoTone = paint((x, y) =>
      inSubject(x, y) ? [30, 90, 200] : y < H / 2 ? [230, 230, 230] : [255, 255, 255],
    );

    const mask = await computeAlphaMask(twoTone, W, H, {
      tolerance: 40,
      softBand: true,
      despeckle: false,
    });

    expect(alphaAt(mask, 10, 10)).toBe(0);
    expect(alphaAt(mask, 10, 190)).toBe(0);
    expect(alphaAt(mask, 100, 100)).toBe(255);
  });

  it('emits a soft transition band only when asked', async () => {
    const antiAliased = paint((x, y) => {
      if (inSubject(x, y)) return [0, 0, 0];
      const nearEdge =
        (x >= 58 && x < 60 && y >= 58 && y < 142) || (y >= 58 && y < 60 && x >= 58 && x < 142);
      return nearEdge ? [210, 210, 210] : [255, 255, 255];
    });

    const partial = (mask: Uint8Array) =>
      Array.from(mask).filter((value) => value > 0 && value < 255).length;

    const soft = await computeAlphaMask(antiAliased, W, H, {
      tolerance: 45,
      softBand: true,
      despeckle: false,
    });
    const hard = await computeAlphaMask(antiAliased, W, H, {
      tolerance: 45,
      softBand: false,
      despeckle: false,
    });

    expect(partial(soft)).toBeGreaterThan(0);
    expect(partial(hard)).toBe(0);
  });

  it('never removes less as tolerance rises', async () => {
    const gradient = paint((x, y) => {
      if (inSubject(x, y)) return [10, 10, 10];
      const value = 200 + Math.round((x / W) * 40);
      return [value, value, value];
    });

    const removed: number[] = [];
    for (const tolerance of [10, 25, 40, 60, 80]) {
      const mask = await computeAlphaMask(gradient, W, H, {
        tolerance,
        softBand: true,
        despeckle: false,
      });
      removed.push(mask.reduce((total, value) => total + (value === 0 ? 1 : 0), 0));
    }

    for (let i = 1; i < removed.length; i++) {
      expect(removed[i]).toBeGreaterThanOrEqual(removed[i - 1]);
    }
    // The 80×80 subject survives even at the most aggressive setting.
    expect(removed[removed.length - 1]).toBeLessThanOrEqual(W * H - 6400);
  });

  it('leaves the subject intact when despeckling', async () => {
    const mask = await computeAlphaMask(whiteOnWhite, W, H, {
      tolerance: 40,
      softBand: true,
      despeckle: true,
    });

    expect(alphaAt(mask, 70, 70)).toBe(255);
    expect(alphaAt(mask, 100, 100)).toBe(255);
  });

  it('stops when the caller aborts', async () => {
    const controller = new AbortController();
    controller.abort();

    await expect(
      computeAlphaMask(whiteOnWhite, W, H, {
        tolerance: 40,
        softBand: true,
        despeckle: true,
        signal: controller.signal,
      }),
    ).rejects.toThrow();
  });
});

describe('sampleBackgroundClusters', () => {
  it('finds one cluster on a uniform backdrop', () => {
    expect(sampleBackgroundClusters(whiteOnWhite, W, H)).toHaveLength(1);
  });

  it('finds both tones of a two-tone backdrop', () => {
    const twoTone = paint((x, y) =>
      inSubject(x, y) ? [30, 90, 200] : y < H / 2 ? [230, 230, 230] : [255, 255, 255],
    );

    expect(sampleBackgroundClusters(twoTone, W, H)).toHaveLength(2);
  });
});

describe('colorDistance', () => {
  it('is zero for identical colours', () => {
    expect(colorDistance(10, 20, 30, 10, 20, 30)).toBe(0);
  });

  it('spans roughly 0–765 from black to white', () => {
    expect(colorDistance(0, 0, 0, 255, 255, 255)).toBeGreaterThan(760);
    expect(colorDistance(0, 0, 0, 255, 255, 255)).toBeLessThan(766);
  });

  it('weights green above blue, as perception does', () => {
    const green = colorDistance(128, 128, 128, 128, 148, 128);
    const blue = colorDistance(128, 128, 128, 128, 128, 148);

    expect(green).toBeGreaterThan(blue);
  });
});
