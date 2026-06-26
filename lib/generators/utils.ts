/**
 * Shared helpers for generator modules.
 */

/**
 * Pick `count` unique random items from an array.
 * Falls back to Fisher-Yates slice when count >= array length.
 */
export function pick<T>(arr: readonly T[], count: number): T[] {
  if (count >= arr.length) {
    return shuffle([...arr]);
  }
  const copy = [...arr];
  const result: T[] = [];
  for (let i = 0; i < count; i++) {
    const idx = Math.floor(Math.random() * copy.length);
    result.push(copy[idx]);
    copy[idx] = copy[copy.length - 1];
    copy.pop();
  }
  return result;
}

/**
 * Fisher-Yates shuffle (in-place).
 */
export function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Clamp a number between min and max.
 */
export function clamp(n: number, min: number, max: number): number {
  return Math.min(Math.max(n, min), max);
}
