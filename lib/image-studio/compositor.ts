/**
 * Image Studio — Compositor
 *
 * Turns (original image + alpha mask + settings) into the final picture.
 * This is the stage that makes the Background, Edge Refinement, Shadow and
 * platform-preset controls actually do something: segmentation produces a
 * mask, and everything the user tweaks afterwards is replayed here.
 *
 * Design notes
 * ────────────
 * • A {@link RenderSource} is prepared **once per image** (decode + bbox) and
 *   reused for every re-render, so dragging a slider costs one composite pass,
 *   not a decode and a segmentation.
 *
 * • Every step is expressed as a canvas draw rather than a JS pixel loop.
 *   Morphological expand/erode is the interesting case: repeatedly compositing
 *   a blurred mask onto itself with `source-over` gives α' = 1−(1−α)^n (a
 *   dilation), and with `destination-in` gives α' = α^n (an erosion). Both run
 *   on the GPU, so they stay interactive on 24-megapixel images where a
 *   JavaScript convolution would not.
 */

import type {
  BackgroundOption,
  EdgeRefinementSettings,
  RenderSettings,
  ShadowSettings,
  ShadowType,
} from './types';
import {
  canvasToBlob,
  closeImage,
  createCanvas,
  decodeImage,
  imageSize,
  releaseCanvas,
  type Canvas2D,
} from './canvas';

/* ── Tuning ───────────────────────────────────────────────────────────────── */

/** Edge radii are expressed relative to the image's short side. */
const EDGE_SCALE_REFERENCE = 1000;

/** Max blur, in reference pixels, at slider value 100. */
const MAX_SMOOTH_RADIUS = 4;
const MAX_FEATHER_RADIUS = 12;
const MAX_EXPAND_RADIUS = 8;

/** Resolution the subject bounding box is measured at. */
const BBOX_SAMPLE_SIDE = 400;

/* ── Render source ────────────────────────────────────────────────────────── */

export interface RenderSource {
  image: ImageBitmap | HTMLImageElement;
  /** Alpha-carrying mask canvas at full resolution (RGB white, α = mask). */
  mask: HTMLCanvasElement;
  width: number;
  height: number;
  /** Tight bounds of the subject, in full-resolution pixels. */
  bounds: { x: number; y: number; width: number; height: number };
}

/**
 * Decode an image + mask pair once, ready for repeated compositing.
 * Call {@link disposeRenderSource} when the image is replaced.
 */
export async function prepareRenderSource(
  originalBlob: Blob,
  maskBlob: Blob,
): Promise<RenderSource> {
  const [image, maskImage] = await Promise.all([
    decodeImage(originalBlob),
    decodeImage(maskBlob),
  ]);

  const { width, height } = imageSize(image);

  const mask = createCanvas(width, height);
  mask.ctx.drawImage(maskImage, 0, 0, width, height);
  closeImage(maskImage);

  return {
    image,
    mask: mask.canvas,
    width,
    height,
    bounds: measureBounds(mask.canvas, width, height),
  };
}

export function disposeRenderSource(source: RenderSource | null): void {
  if (!source) return;
  closeImage(source.image);
  releaseCanvas(source.mask);
}

/**
 * Extract an alpha-carrying mask from an RGBA cutout.
 *
 * `source-in` keeps only the pixels already covered by the cutout's alpha, so
 * filling white through it copies the alpha channel across without a pixel
 * loop. This is how brush touch-ups get folded back into the mask.
 */
export function maskFromCutout(
  cutout: ImageBitmap | HTMLImageElement | HTMLCanvasElement,
  width: number,
  height: number,
): HTMLCanvasElement {
  const mask = createCanvas(width, height);
  mask.ctx.drawImage(cutout, 0, 0, width, height);
  mask.ctx.globalCompositeOperation = 'source-in';
  mask.ctx.fillStyle = '#ffffff';
  mask.ctx.fillRect(0, 0, width, height);
  mask.ctx.globalCompositeOperation = 'source-over';
  return mask.canvas;
}

/**
 * Swap in a new mask (after a brush edit) and re-measure the subject bounds so
 * preset re-framing stays correct. Takes ownership of `mask`.
 */
export function replaceMask(source: RenderSource, mask: HTMLCanvasElement): void {
  if (source.mask !== mask) releaseCanvas(source.mask);
  source.mask = mask;
  source.bounds = measureBounds(mask, source.width, source.height);
}

/**
 * Tight bounding box of the opaque region, measured on a small proxy so the
 * scan stays under ~160k pixels regardless of source resolution.
 */
function measureBounds(
  mask: HTMLCanvasElement,
  fullW: number,
  fullH: number,
): { x: number; y: number; width: number; height: number } {
  const scale = Math.min(1, BBOX_SAMPLE_SIDE / Math.max(fullW, fullH));
  const w = Math.max(1, Math.round(fullW * scale));
  const h = Math.max(1, Math.round(fullH * scale));

  const proxy = createCanvas(w, h, true);
  proxy.ctx.drawImage(mask, 0, 0, w, h);
  const data = proxy.ctx.getImageData(0, 0, w, h).data;

  let minX = w;
  let minY = h;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (data[(y * w + x) * 4 + 3] > 16) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  releaseCanvas(proxy.canvas);

  // Nothing survived the cut — treat the whole frame as the subject so the
  // user still sees their picture instead of an empty canvas.
  if (maxX < 0) return { x: 0, y: 0, width: fullW, height: fullH };

  const inv = 1 / scale;
  const x = Math.max(0, Math.floor(minX * inv));
  const y = Math.max(0, Math.floor(minY * inv));
  return {
    x,
    y,
    width: Math.min(fullW - x, Math.ceil((maxX - minX + 1) * inv)),
    height: Math.min(fullH - y, Math.ceil((maxY - minY + 1) * inv)),
  };
}

/* ── Canvas filter support ────────────────────────────────────────────────── */

let _filterSupport: boolean | null = null;

/** `ctx.filter` is unavailable on a few older engines; degrade, don't crash. */
function supportsCanvasFilter(): boolean {
  if (_filterSupport !== null) return _filterSupport;
  try {
    const { canvas, ctx } = createCanvas(1, 1);
    ctx.filter = 'blur(1px)';
    _filterSupport = ctx.filter === 'blur(1px)';
    releaseCanvas(canvas);
  } catch {
    _filterSupport = false;
  }
  return _filterSupport;
}

/* ── Edge refinement ──────────────────────────────────────────────────────── */

/**
 * Apply expand / smooth / feather to the mask, returning a new canvas.
 *
 * Order matters: expand first (it changes where the edge *is*), then smooth
 * (removes staircasing from the flood fill), then feather (the deliberate
 * soft falloff the user asked for).
 */
function refineMask(
  source: RenderSource,
  edge: EdgeRefinementSettings,
): HTMLCanvasElement {
  const { width, height } = source;
  const unit = Math.max(width, height) / EDGE_SCALE_REFERENCE;

  const smoothRadius = (Math.abs(edge.smooth) / 100) * MAX_SMOOTH_RADIUS * unit;
  const featherRadius = (Math.abs(edge.feather) / 50) * MAX_FEATHER_RADIUS * unit;
  const expandRadius = (Math.abs(edge.expand) / 50) * MAX_EXPAND_RADIUS * unit;

  const work = createCanvas(width, height);
  work.ctx.drawImage(source.mask, 0, 0);

  const canFilter = supportsCanvasFilter();
  const nothingToDo =
    smoothRadius < 0.25 && featherRadius < 0.25 && expandRadius < 0.25;
  if (!canFilter || nothingToDo) return work.canvas;

  /* ── Expand / contract ────────────────────────────────────────────────── */
  if (expandRadius >= 0.25) {
    blurInPlace(work, expandRadius);
    // Three passes lands close to a true morphological op while keeping the
    // transition band; more passes just harden the edge without moving it.
    stackAlpha(work, edge.expand > 0 ? 'source-over' : 'destination-in', 3);
  }

  /* ── Smooth ───────────────────────────────────────────────────────────── */
  if (smoothRadius >= 0.25) {
    blurInPlace(work, smoothRadius);
    // Hair detail wants the blurred, semi-transparent edge kept as-is;
    // otherwise snap it back to a crisp contour.
    if (!edge.hairDetail) hardenAlpha(work, 2);
  }

  /* ── Feather ──────────────────────────────────────────────────────────── */
  if (featherRadius >= 0.25) {
    blurInPlace(work, featherRadius);
  }

  return work.canvas;
}

/** Blur a canvas by redrawing it through the filter into a scratch buffer. */
function blurInPlace(target: Canvas2D, radius: number): void {
  const { width, height } = target.canvas;
  const scratch = createCanvas(width, height);
  scratch.ctx.filter = `blur(${radius.toFixed(2)}px)`;
  scratch.ctx.drawImage(target.canvas, 0, 0);

  target.ctx.clearRect(0, 0, width, height);
  target.ctx.drawImage(scratch.canvas, 0, 0);
  releaseCanvas(scratch.canvas);
}

/**
 * Composite a canvas onto itself `passes` times.
 *
 * `source-over`     → α' = 1 − (1 − α)^(passes+1)   (grow / dilate)
 * `destination-in`  → α' = α^(passes+1)             (shrink / erode)
 */
function stackAlpha(
  target: Canvas2D,
  op: 'source-over' | 'destination-in',
  passes: number,
): void {
  const { width, height } = target.canvas;
  const copy = createCanvas(width, height);
  copy.ctx.drawImage(target.canvas, 0, 0);

  target.ctx.globalCompositeOperation = op;
  for (let i = 0; i < passes; i++) {
    target.ctx.drawImage(copy.canvas, 0, 0);
  }
  target.ctx.globalCompositeOperation = 'source-over';

  releaseCanvas(copy.canvas);
}

/**
 * Push mid alphas toward 0 or 1 without moving the 50% contour, by pairing a
 * dilation with an equal erosion.
 */
function hardenAlpha(target: Canvas2D, strength: number): void {
  stackAlpha(target, 'source-over', strength);
  stackAlpha(target, 'destination-in', strength);
}

/* ── Backgrounds ──────────────────────────────────────────────────────────── */

const PROCEDURAL_GRADIENTS: Record<string, [string, string]> = {
  gradient: ['#6366f1', '#a855f7'],
  studio: ['#f8fafc', '#cbd5e1'],
  office: ['#e2e8f0', '#94a3b8'],
  nature: ['#d1fae5', '#6ee7b7'],
};

/**
 * Paint the background layer. Runs before the shadow so both sit behind the
 * subject; `transparent` simply paints nothing.
 */
function paintBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  background: BackgroundOption,
  source: RenderSource,
): void {
  switch (background.type) {
    case 'transparent':
      return;

    case 'white':
      ctx.fillStyle = background.color ?? '#ffffff';
      ctx.fillRect(0, 0, width, height);
      return;

    case 'black':
      ctx.fillStyle = background.color ?? '#000000';
      ctx.fillRect(0, 0, width, height);
      return;

    case 'custom':
      ctx.fillStyle = background.color ?? '#6366f1';
      ctx.fillRect(0, 0, width, height);
      return;

    case 'blur':
    case 'glass': {
      // Re-use the source photo as its own backdrop: cover the frame, blur it
      // hard, then (for glass) wash it out with a translucent scrim.
      const radius = background.blurRadius ?? (background.type === 'glass' ? 40 : 24);
      drawCover(ctx, source.image, source.width, source.height, width, height, radius);
      if (background.type === 'glass') {
        ctx.fillStyle = 'rgba(255,255,255,0.35)';
        ctx.fillRect(0, 0, width, height);
      }
      return;
    }

    case 'upload': {
      // The uploaded backdrop is decoded by the caller and handed over as a
      // gradient fallback if it could not be loaded.
      ctx.fillStyle = background.color ?? '#ffffff';
      ctx.fillRect(0, 0, width, height);
      return;
    }

    case 'gradient':
    case 'studio':
    case 'office':
    case 'nature':
    default: {
      const [from, to] =
        PROCEDURAL_GRADIENTS[background.type] ?? PROCEDURAL_GRADIENTS.gradient;
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, background.color ?? from);
      gradient.addColorStop(1, background.gradient ?? to);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      return;
    }
  }
}

/** Draw an image scaled to cover the target box, cropping the overflow. */
function drawCover(
  ctx: CanvasRenderingContext2D,
  image: ImageBitmap | HTMLImageElement,
  srcW: number,
  srcH: number,
  destW: number,
  destH: number,
  blurRadius = 0,
): void {
  const scale = Math.max(destW / srcW, destH / srcH);
  const w = srcW * scale;
  const h = srcH * scale;

  ctx.save();
  if (blurRadius > 0 && supportsCanvasFilter()) {
    ctx.filter = `blur(${blurRadius}px)`;
    // Overdraw so the blur does not sample transparent pixels at the edges.
    const bleed = blurRadius * 2;
    ctx.drawImage(
      image,
      (destW - w) / 2 - bleed,
      (destH - h) / 2 - bleed,
      w + bleed * 2,
      h + bleed * 2,
    );
  } else {
    ctx.drawImage(image, (destW - w) / 2, (destH - h) / 2, w, h);
  }
  ctx.restore();
}

/* ── Shadows ──────────────────────────────────────────────────────────────── */

interface ShadowProfile {
  /** Multiplier on the user's distance value. */
  offset: number;
  /** Multiplier on the user's blur value. */
  blur: number;
  /** Vertical squash — 1 keeps the silhouette, <1 lays it on the ground. */
  squashY: number;
  /** Horizontal skew, for raking light. */
  skewX: number;
}

const SHADOW_PROFILES: Record<ShadowType, ShadowProfile> = {
  soft: { offset: 1, blur: 1.6, squashY: 1, skewX: 0 },
  hard: { offset: 1, blur: 0.15, squashY: 1, skewX: 0 },
  floating: { offset: 0.6, blur: 2.6, squashY: 0.25, skewX: 0 },
  studio: { offset: 0.3, blur: 3.2, squashY: 1, skewX: 0 },
  natural: { offset: 1, blur: 1.2, squashY: 0.4, skewX: 0.3 },
  long: { offset: 3, blur: 0.8, squashY: 0.5, skewX: 0.9 },
};

/**
 * Draw a silhouette of the subject behind it.
 *
 * The silhouette is the mask filled black (`source-in`), so it follows the
 * exact cutout — including the feathered edge — rather than a bounding box.
 */
function paintShadow(
  ctx: CanvasRenderingContext2D,
  subject: HTMLCanvasElement,
  placement: { x: number; y: number; width: number; height: number },
  shadow: ShadowSettings,
  unit: number,
): void {
  const profile = SHADOW_PROFILES[shadow.type] ?? SHADOW_PROFILES.soft;

  const silhouette = createCanvas(subject.width, subject.height);
  silhouette.ctx.drawImage(subject, 0, 0);
  silhouette.ctx.globalCompositeOperation = 'source-in';
  silhouette.ctx.fillStyle = '#000000';
  silhouette.ctx.fillRect(0, 0, subject.width, subject.height);
  silhouette.ctx.globalCompositeOperation = 'source-over';

  const angleRad = (shadow.angle * Math.PI) / 180;
  const distance = shadow.distance * profile.offset * unit;
  const dx = Math.cos(angleRad) * distance;
  const dy = Math.sin(angleRad) * distance;
  const blur = shadow.blur * profile.blur * unit;

  ctx.save();
  ctx.globalAlpha = Math.min(1, Math.max(0, shadow.opacity / 100));
  if (blur > 0.25 && supportsCanvasFilter()) {
    ctx.filter = `blur(${blur.toFixed(2)}px)`;
  }

  // Anchor the transform at the subject's feet so squash and skew pivot on the
  // ground line, the way a cast shadow does.
  const baseX = placement.x + placement.width / 2;
  const baseY = placement.y + placement.height;

  ctx.translate(baseX + dx, baseY + dy);
  ctx.transform(1, 0, profile.skewX, profile.squashY, 0, 0);
  ctx.translate(-placement.width / 2, -placement.height);

  ctx.drawImage(silhouette.canvas, 0, 0, placement.width, placement.height);
  ctx.restore();

  releaseCanvas(silhouette.canvas);
}

/* ── Main entry point ─────────────────────────────────────────────────────── */

export interface CompositeResult {
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
  /** True when the result contains any transparency (drives JPEG warnings). */
  hasAlpha: boolean;
}

/**
 * Render the final image. The caller owns the returned canvas and should
 * release it (see {@link releaseCanvas}) once encoded.
 */
export function renderComposite(
  source: RenderSource,
  settings: RenderSettings,
): CompositeResult {
  /* ── 1. Mask → refined mask → cutout ────────────────────────────────── */
  const refinedMask = refineMask(source, settings.edge);

  const subject = createCanvas(source.width, source.height);
  subject.ctx.drawImage(source.image, 0, 0, source.width, source.height);
  subject.ctx.globalCompositeOperation = 'destination-in';
  subject.ctx.drawImage(refinedMask, 0, 0);
  subject.ctx.globalCompositeOperation = 'source-over';
  releaseCanvas(refinedMask);

  /* ── 2. Output geometry ─────────────────────────────────────────────── */
  const outW = settings.outputSize?.width ?? source.width;
  const outH = settings.outputSize?.height ?? source.height;
  const padding = Math.max(0, settings.padding ?? 0);

  const out = createCanvas(outW, outH);
  const unit = Math.max(outW, outH) / EDGE_SCALE_REFERENCE;

  /* ── 3. Background ──────────────────────────────────────────────────── */
  paintBackground(out.ctx, outW, outH, settings.background, source);

  /* ── 4. Subject placement ───────────────────────────────────────────── */
  // With an explicit output size we re-frame around the subject's own bounds,
  // so an Amazon 1000×1000 export is the product centred with real padding —
  // not the original photo letterboxed.
  const reframed = settings.outputSize != null;
  const placement = reframed
    ? fitBounds(source.bounds, outW, outH, padding)
    : {
        // Same canvas size as the source, so the subject's bounds map 1:1.
        x: source.bounds.x,
        y: source.bounds.y,
        width: source.bounds.width,
        height: source.bounds.height,
      };

  /* ── 5. Shadow, then subject ────────────────────────────────────────── */
  // The silhouette is cropped to the subject's own bounds so that squash and
  // skew pivot on its feet rather than on the corner of the frame.
  if (settings.shadow && settings.shadow.opacity > 0) {
    const silhouetteSource = cropCanvas(subject.canvas, source.bounds);
    paintShadow(out.ctx, silhouetteSource, placement, settings.shadow, unit);
    releaseCanvas(silhouetteSource);
  }

  if (reframed) {
    const r = source.bounds;
    out.ctx.drawImage(
      subject.canvas,
      r.x, r.y, r.width, r.height,
      placement.x, placement.y, placement.width, placement.height,
    );
  } else {
    out.ctx.drawImage(subject.canvas, 0, 0, outW, outH);
  }

  releaseCanvas(subject.canvas);

  return {
    canvas: out.canvas,
    width: outW,
    height: outH,
    hasAlpha: settings.background.type === 'transparent',
  };
}

/** Fit the subject's bounds into the output box, honouring padding. */
function fitBounds(
  bounds: { x: number; y: number; width: number; height: number },
  outW: number,
  outH: number,
  padding: number,
): { x: number; y: number; width: number; height: number } {
  const availableW = Math.max(1, outW - padding * 2);
  const availableH = Math.max(1, outH - padding * 2);
  const scale = Math.min(availableW / bounds.width, availableH / bounds.height);

  const width = bounds.width * scale;
  const height = bounds.height * scale;

  return {
    x: (outW - width) / 2,
    y: (outH - height) / 2,
    width,
    height,
  };
}

/** Copy a sub-rectangle of a canvas into a new one. */
function cropCanvas(
  canvas: HTMLCanvasElement,
  rect: { x: number; y: number; width: number; height: number },
): HTMLCanvasElement {
  const crop = createCanvas(rect.width, rect.height);
  crop.ctx.drawImage(
    canvas,
    rect.x, rect.y, rect.width, rect.height,
    0, 0, rect.width, rect.height,
  );
  return crop.canvas;
}

/* ── Convenience ──────────────────────────────────────────────────────────── */

/**
 * Render and encode in one step. Returns a PNG unless a format is given;
 * encoding options live in `exporter.ts`.
 */
export async function renderToBlob(
  source: RenderSource,
  settings: RenderSettings,
  type = 'image/png',
  quality?: number,
): Promise<Blob> {
  const result = renderComposite(source, settings);
  try {
    return await canvasToBlob(result.canvas, type, quality);
  } finally {
    releaseCanvas(result.canvas);
  }
}
