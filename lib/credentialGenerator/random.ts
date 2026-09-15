/**
 * Unbiased random primitives for every credential generator.
 *
 * Each generator in this folder had grown its own copy of
 *
 *   const buf = new Uint32Array(1);
 *   crypto.getRandomValues(buf);
 *   return buf[0] % max;
 *
 * which is the textbook modulo-bias mistake. 2³² is not divisible by 62, so
 * the first 2³² mod 62 values of the alphabet come up slightly more often than
 * the rest. The skew is minute — about one part in 69 million — and no one
 * will ever crack a password because of it. It is fixed here anyway, because
 * this is the one directory on the site where "close enough to uniform" is not
 * a thing we get to say: the pages around it promise `crypto.getRandomValues`
 * and count entropy to one decimal place, and an entropy figure means the
 * distribution is flat.
 *
 * `randomInt` rejects the unusable tail of the range instead of folding it
 * back in. The loop is unbounded in principle and runs once with probability
 * greater than 1 − max/2³² in practice.
 */

/** A uniform integer in [0, max). */
export function randomInt(max: number): number {
  if (!Number.isInteger(max) || max <= 0) {
    throw new RangeError(`randomInt: max must be a positive integer, got ${max}`);
  }
  if (max === 1) return 0;

  /* The largest multiple of `max` that fits in a uint32. Values at or above it
     are the tail that would bias the result, and are drawn again. */
  const limit = Math.floor(0x1_0000_0000 / max) * max;
  const buf = new Uint32Array(1);

  for (;;) {
    crypto.getRandomValues(buf);
    if (buf[0] < limit) return buf[0] % max;
  }
}

/** A uniform element of a non-empty array. */
export function pickOne<T>(items: readonly T[]): T {
  if (items.length === 0) throw new RangeError('pickOne: empty array');
  return items[randomInt(items.length)];
}

/** A uniform character of a non-empty string. */
export function pickChar(charset: string): string {
  if (charset.length === 0) throw new RangeError('pickChar: empty charset');
  /* Indexing by code unit, not by code point: every charset in this folder is
     ASCII, and a surrogate pair would be split by `charset[i]` anyway. */
  return charset[randomInt(charset.length)];
}

/** `count` uniform characters of `charset`, drawn independently. */
export function randomString(charset: string, count: number): string {
  let out = '';
  for (let i = 0; i < count; i++) out += pickChar(charset);
  return out;
}

/** A Fisher–Yates shuffle with unbiased swap indices. Returns a new array. */
export function shuffled<T>(items: readonly T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** `count` distinct indices in [0, size), uniform over all such sets. */
export function distinctIndices(size: number, count: number): number[] {
  if (count > size) {
    throw new RangeError(`distinctIndices: cannot draw ${count} of ${size}`);
  }
  /* Partial Fisher–Yates over a sparse map: O(count), and never loops on a
     draw that is already taken — which a naive Set-based sampler does, ever
     more often as `count` approaches `size`. */
  const swapped = new Map<number, number>();
  const out: number[] = [];

  for (let i = 0; i < count; i++) {
    const j = i + randomInt(size - i);
    out.push(swapped.get(j) ?? j);
    swapped.set(j, swapped.get(i) ?? i);
  }

  return out;
}
