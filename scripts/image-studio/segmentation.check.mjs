/**
 * Standalone check of the segmentation core from lib/image-studio/backgroundRemover.ts.
 * Mirrors the shipped logic exactly (redmean distance, border clustering,
 * 4-connected flood fill) on synthetic images, with no canvas involved.
 */

const MAX_TOLERANCE_DISTANCE = 220;
const SOFT_BAND_FACTOR = 1.6;
const BORDER_FRACTION = 0.02;
const MIN_CLUSTER_SHARE = 0.04;
const MAX_CLUSTERS = 4;

function colorDistance(r1, g1, b1, r2, g2, b2) {
  const rmean = (r1 + r2) >> 1;
  const dr = r1 - r2, dg = g1 - g2, db = b1 - b2;
  return Math.sqrt(
    (((512 + rmean) * dr * dr) >> 8) + 4 * dg * dg + (((767 - rmean) * db * db) >> 8),
  );
}

function sampleBackgroundClusters(data, w, h) {
  const band = Math.max(1, Math.round(Math.min(w, h) * BORDER_FRACTION));
  const buckets = new Map();
  let total = 0;
  const add = (x, y) => {
    const i = (y * w + x) * 4;
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const key = ((r >> 3) << 10) | ((g >> 3) << 5) | (b >> 3);
    const bucket = buckets.get(key);
    if (bucket) { bucket.r += r; bucket.g += g; bucket.b += b; bucket.n++; }
    else buckets.set(key, { r, g, b, n: 1 });
    total++;
  };
  for (let y = 0; y < band; y++) for (let x = 0; x < w; x++) { add(x, y); add(x, h - 1 - y); }
  for (let x = 0; x < band; x++) for (let y = band; y < h - band; y++) { add(x, y); add(w - 1 - x, y); }

  const ranked = [...buckets.values()].sort((a, b) => b.n - a.n);
  const clusters = [];
  for (const bucket of ranked) {
    if (clusters.length >= MAX_CLUSTERS) break;
    if (clusters.length > 0 && bucket.n / total < MIN_CLUSTER_SHARE) break;
    clusters.push({ r: bucket.r / bucket.n, g: bucket.g / bucket.n, b: bucket.b / bucket.n });
  }
  return clusters.length ? clusters : [{ r: 255, g: 255, b: 255 }];
}

function distanceToBackground(data, idx, clusters) {
  const i = idx * 4;
  const r = data[i], g = data[i + 1], b = data[i + 2];
  let best = Infinity;
  for (const c of clusters) {
    const d = colorDistance(r, g, b, c.r, c.g, c.b);
    if (d < best) best = d;
  }
  return best;
}

/** The shipped algorithm. */
function floodFillMask(data, w, h, tolerance, softBand = true) {
  const clusters = sampleBackgroundClusters(data, w, h);
  const threshold = (tolerance / 100) * MAX_TOLERANCE_DISTANCE;
  const softThreshold = softBand ? threshold * SOFT_BAND_FACTOR : threshold;

  const n = w * h;
  const alpha = new Uint8Array(n).fill(255);
  const visited = new Uint8Array(n);
  const queue = new Int32Array(n);
  let head = 0, tail = 0;

  const seed = (idx) => {
    if (visited[idx]) return;
    if (distanceToBackground(data, idx, clusters) <= threshold) {
      visited[idx] = 1; alpha[idx] = 0; queue[tail++] = idx;
    }
  };
  for (let x = 0; x < w; x++) { seed(x); seed((h - 1) * w + x); }
  for (let y = 0; y < h; y++) { seed(y * w); seed(y * w + w - 1); }

  while (head < tail) {
    const idx = queue[head++];
    const x = idx % w, y = (idx / w) | 0;
    for (let k = 0; k < 4; k++) {
      const nx = x + (k === 0 ? -1 : k === 1 ? 1 : 0);
      const ny = y + (k === 2 ? -1 : k === 3 ? 1 : 0);
      if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
      const nIdx = ny * w + nx;
      if (visited[nIdx]) continue;
      const d = distanceToBackground(data, nIdx, clusters);
      if (d <= threshold) { visited[nIdx] = 1; alpha[nIdx] = 0; queue[tail++] = nIdx; }
      else if (d <= softThreshold) {
        visited[nIdx] = 1;
        alpha[nIdx] = Math.round(((d - threshold) / (softThreshold - threshold)) * 255);
      }
    }
  }
  return { alpha, clusters, threshold };
}

/** The OLD algorithm this replaced: one global threshold, no connectivity. */
function globalThresholdMask(data, w, h, tolerance) {
  const clusters = sampleBackgroundClusters(data, w, h);
  const threshold = (tolerance / 100) * MAX_TOLERANCE_DISTANCE;
  const n = w * h;
  const alpha = new Uint8Array(n).fill(255);
  for (let i = 0; i < n; i++) {
    if (distanceToBackground(data, i, clusters) <= threshold) alpha[i] = 0;
  }
  return { alpha };
}

/* ── Synthetic images ──────────────────────────────────────────────────── */

function makeImage(w, h, paint) {
  const data = new Uint8ClampedArray(w * h * 4);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const [r, g, b] = paint(x, y);
      const i = (y * w + x) * 4;
      data[i] = r; data[i + 1] = g; data[i + 2] = b; data[i + 3] = 255;
    }
  }
  return data;
}

const W = 200, H = 200;
const inSubject = (x, y) => x >= 60 && x < 140 && y >= 60 && y < 140;
/** A white patch inside the subject — the classic "white shirt" case. */
const inWhitePatch = (x, y) => x >= 85 && x < 115 && y >= 85 && y < 115;

let failures = 0;
function check(name, condition, detail) {
  const ok = Boolean(condition);
  if (!ok) failures++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `  — ${detail}` : ''}`);
}

/* ── 1. White backdrop, red subject with a white patch ─────────────────── */
{
  const data = makeImage(W, H, (x, y) => {
    if (inSubject(x, y)) return inWhitePatch(x, y) ? [255, 255, 255] : [200, 40, 40];
    return [255, 255, 255];
  });

  const { alpha, clusters } = floodFillMask(data, W, H, 40);
  const at = (x, y) => alpha[y * W + x];

  check('background corner is transparent', at(2, 2) === 0, `alpha=${at(2, 2)}`);
  check('background mid-edge is transparent', at(100, 5) === 0, `alpha=${at(100, 5)}`);
  check('red subject body stays opaque', at(70, 70) === 255, `alpha=${at(70, 70)}`);
  check(
    'white patch INSIDE the subject survives (flood fill)',
    at(100, 100) === 255,
    `alpha=${at(100, 100)}`,
  );
  check('exactly one background cluster detected', clusters.length === 1,
    `clusters=${clusters.length}`);

  // The regression this replaced.
  const old = globalThresholdMask(data, W, H, 40);
  check(
    'old global-threshold algorithm DID punch a hole (regression covered)',
    old.alpha[100 * W + 100] === 0,
    `old alpha=${old.alpha[100 * W + 100]}`,
  );
}

/* ── 2. Two-tone backdrop (top grey, bottom white) ─────────────────────── */
{
  const data = makeImage(W, H, (x, y) => {
    if (inSubject(x, y)) return [30, 90, 200];
    return y < H / 2 ? [230, 230, 230] : [255, 255, 255];
  });

  const { alpha, clusters } = floodFillMask(data, W, H, 40);
  const at = (x, y) => alpha[y * W + x];

  check('two-tone: grey half removed', at(10, 10) === 0, `alpha=${at(10, 10)}`);
  check('two-tone: white half removed', at(10, 190) === 0, `alpha=${at(10, 190)}`);
  check('two-tone: subject kept', at(100, 100) === 255, `alpha=${at(100, 100)}`);
  check('two-tone: clusters found', clusters.length >= 1, `clusters=${clusters.length}`);
}

/* ── 3. Tolerance monotonicity ─────────────────────────────────────────── */
{
  // A gradient backdrop: raising tolerance must never remove *fewer* pixels.
  const data = makeImage(W, H, (x, y) => {
    if (inSubject(x, y)) return [10, 10, 10];
    const v = 200 + Math.round((x / W) * 40);
    return [v, v, v];
  });

  const counts = [10, 25, 40, 60, 80].map((t) => {
    const { alpha } = floodFillMask(data, W, H, t);
    return alpha.reduce((acc, a) => acc + (a === 0 ? 1 : 0), 0);
  });

  const monotonic = counts.every((c, i) => i === 0 || c >= counts[i - 1]);
  check('higher tolerance removes at least as much', monotonic, counts.join(' ≤ '));
  check('dark subject never removed at any tolerance', counts[counts.length - 1] < W * H - 6000,
    `removed=${counts[counts.length - 1]} of ${W * H}`);
}

/* ── 4. Soft band produces partial alpha, fast mode does not ───────────── */
{
  // Anti-aliased edge: one column of blended pixels around the subject.
  const data = makeImage(W, H, (x, y) => {
    if (inSubject(x, y)) return [0, 0, 0];
    const nearEdge =
      (x >= 58 && x < 60 && y >= 58 && y < 142) || (y >= 58 && y < 60 && x >= 58 && x < 142);
    // Distance from white ≈135 — inside the soft band (threshold 99 … 158).
    return nearEdge ? [210, 210, 210] : [255, 255, 255];
  });

  const soft = floodFillMask(data, W, H, 45, true).alpha;
  const hard = floodFillMask(data, W, H, 45, false).alpha;

  const partial = (a) => Array.from(a).filter((v) => v > 0 && v < 255).length;
  check('soft band yields partial alpha', partial(soft) > 0, `partial px=${partial(soft)}`);
  check('fast mode yields no partial alpha', partial(hard) === 0, `partial px=${partial(hard)}`);
}

/* ── 5. Colour distance sanity ─────────────────────────────────────────── */
{
  check('identical colours → 0', colorDistance(10, 20, 30, 10, 20, 30) === 0);
  const bw = colorDistance(0, 0, 0, 255, 255, 255);
  check('black↔white near 765', bw > 760 && bw < 766, bw.toFixed(1));
  const greenShift = colorDistance(128, 128, 128, 128, 148, 128);
  const blueShift = colorDistance(128, 128, 128, 128, 128, 148);
  check('green weighted above blue (perceptual)', greenShift > blueShift,
    `${greenShift.toFixed(1)} > ${blueShift.toFixed(1)}`);
}

console.log(`\n${failures === 0 ? 'ALL CHECKS PASSED' : `${failures} CHECK(S) FAILED`}`);
process.exit(failures === 0 ? 0 : 1);
