/**
 * QR Studio — the drawing engine.
 *
 * `qr-code-styling` draws the symbol; `./matrix` says what the symbol is and
 * `./readiness` says whether it will scan. This file is the bridge: it turns
 * the studio's options into that library's options, once, in one place.
 *
 * ── What changed, and why it mattered ───────────────────────────────────────
 *
 * The same forty-line options object was written out four times, with four
 * sets of small divergences — one omitted the corner-dot colour, another the
 * gradient, a third the crossOrigin — so the preview, the PNG and the SVG were
 * three subtly different pictures. There is one builder now.
 *
 * Two of those divergences were not cosmetic:
 *
 * **The quiet zone was in the wrong unit.** The slider is labelled "modules",
 * ISO/IEC 18004 §5.3.1 specifies the quiet zone in modules, and the value went
 * straight into the library's `margin`, which is pixels. At a 300 px preview
 * with a version-2 symbol, a module is about 10 px — so the default of "4
 * modules" was four *pixels*, roughly a third of one module. A code with no
 * quiet zone against coloured artwork is the most common scanning failure
 * there is, and every code this studio has ever produced had one.
 *
 * **The logo size was arithmetic that meant nothing.** `imageSize` in this
 * library is not a width; it is multiplied by the level's recovery ratio and
 * the result is the share of *modules* the image may hide. The studio passed
 * `logo.size / 300` where `logo.size` was the logo's pixel width, then clamped
 * to 0.3 — so every logo above 90 px wide, which is every logo, got the same
 * maximum coverage no matter what the user chose. `logoImageSize` below does
 * the real conversion, and `readiness.ts` refuses to let it past the budget.
 */

import QRCodeStyling, {
  type CornerSquareType,
  type DotType,
  type ErrorCorrectionLevel,
  type FileExtension,
  type Options as StylingOptions,
  type GradientType as StyledGradientType,
} from 'qr-code-styling';
import { buildMatrix, EC_RECOVERY } from './matrix';
import { effectiveErrorCorrection } from './readiness';
import type {
  QROptions,
  ModuleStyle,
  EyeStyle,
  ErrorCorrection,
  ExportFormat,
  GradientType,
} from './types';

/* ── Project option → library value ─────────────────────────────────── */

/**
 * Module shape. The library draws six: dots, rounded, classy,
 * classy-rounded, square, extra-rounded. `diamond`, `hexagon` and `minimal`
 * have no equivalent and render as squares — three of the eight entries in the
 * picker are the same shape, which is a product decision still to be made.
 */
const MODULE_STYLE_MAP: Record<ModuleStyle, DotType> = {
  square: 'square',
  rounded: 'rounded',
  dots: 'dots',
  circle: 'dots',
  diamond: 'square',
  pixel: 'extra-rounded',
  hexagon: 'square',
  minimal: 'square',
};

/** Eye shape. `frame`, `diamond` and `modern` likewise render as squares. */
const EYE_STYLE_MAP: Record<EyeStyle, CornerSquareType> = {
  classic: 'square',
  rounded: 'rounded',
  circle: 'dot',
  frame: 'square',
  diamond: 'square',
  modern: 'square',
};

const EC_MAP: Record<ErrorCorrection, ErrorCorrectionLevel> = {
  L: 'L',
  M: 'M',
  Q: 'Q',
  H: 'H',
};

/**
 * Gradient kind. The library tests `type === 'radial'` and draws linear for
 * anything else, so `conic` has always rendered as linear.
 */
const GRADIENT_TYPE_MAP: Record<GradientType, StyledGradientType> = {
  linear: 'linear',
  radial: 'radial',
  conic: 'linear',
};

/** Raster formats the library can write directly. */
const RAW_DATA_FORMAT: Record<'png' | 'svg' | 'jpeg' | 'webp', FileExtension> = {
  png: 'png',
  svg: 'svg',
  jpeg: 'jpeg',
  webp: 'webp',
};

/** Formats this library cannot write; `./exporters` builds them from the matrix. */
export const VECTOR_FORMATS: ExportFormat[] = ['pdf', 'eps'];

/* ── Option builder ─────────────────────────────────────────────────── */

/**
 * `imageSize` for a logo whose side is `sideFraction` of the symbol's width.
 *
 * The library computes `maxHiddenDots = floor(imageSize × recovery(level) ×
 * modules²)`, so `imageSize × recovery` is the share of the symbol's area the
 * image is allowed to cover. Inverting that is the whole conversion.
 */
function logoImageSize(sideFraction: number, ec: ErrorCorrection): number {
  const coverage = sideFraction * sideFraction;
  return coverage / EC_RECOVERY[ec];
}

/**
 * The library's `margin` in pixels for a quiet zone stated in modules.
 *
 * `margin` eats into the given width, so the symbol occupies
 * `width − 2 × margin` and a module is that over the module count. Solving for
 * a margin of `quietZone` modules gives the expression below.
 */
function quietZonePx(width: number, modules: number, quietZone: number): number {
  if (!modules || quietZone <= 0) return 0;
  return Math.round((width * quietZone) / (modules + quietZone * 2));
}

export interface BuildOptions {
  /** Pixel width and height of the rendered square, quiet zone included. */
  size: number;
}

/**
 * The one place the studio's options become the drawing library's options.
 */
export function buildStylingOptions(options: QROptions, { size }: BuildOptions): StylingOptions {
  const ec = effectiveErrorCorrection(options);
  const matrix = buildMatrix(options.content, ec);
  const modules = matrix?.size ?? 0;

  const gradient = options.colors.gradient;
  const gradientOption = gradient
    ? {
        type: GRADIENT_TYPE_MAP[gradient.type],
        rotation: gradient.rotation || 0,
        colorStops: gradient.colors.map((color, index) => ({
          offset: index / (gradient.colors.length - 1 || 1),
          color,
        })),
      }
    : undefined;

  const background =
    options.background.type === 'solid' ? options.background.value : options.colors.background;

  return {
    width: size,
    height: size,
    data: options.content,
    margin: quietZonePx(size, modules, options.quietZone),
    qrOptions: {
      typeNumber: 0,
      mode: 'Byte',
      errorCorrectionLevel: EC_MAP[ec],
    },
    image: options.logo?.dataUrl || undefined,
    imageOptions: {
      hideBackgroundDots: true,
      imageSize: options.logo ? logoImageSize(options.logo.size / 100, ec) : 0,
      margin: 0,
      crossOrigin: 'anonymous',
    },
    dotsOptions: {
      type: MODULE_STYLE_MAP[options.moduleStyle],
      color: options.colors.pattern,
      gradient: gradientOption,
    },
    cornersSquareOptions: {
      type: EYE_STYLE_MAP[options.eyeStyle],
      color: options.colors.eye,
    },
    cornersDotOptions: {
      type: 'dot',
      color: options.colors.eye,
    },
    backgroundOptions: {
      /* `transparent` is not a colour the library takes; it takes an alpha
         channel. Everything but `solid` used to fall through to an opaque
         background while the export panel promised transparency. */
      color: options.background.type === 'transparent' ? 'transparent' : background,
    },
  };
}

/** A configured instance. Fresh each time: the library mutates its options. */
export function createStyledQR(options: QROptions, build: BuildOptions): QRCodeStyling {
  return new QRCodeStyling(buildStylingOptions(options, build));
}

/* ── Render ─────────────────────────────────────────────────────────── */

/**
 * Draws into `container`, which must be an element that can have children.
 *
 * The previous signature took a `<canvas>` and called the library's `append`
 * on it. `append` does `container.appendChild(...)`, and a canvas inside a
 * canvas is fallback content: it is never painted. **The preview rendered
 * nothing at all** — a blank white square, under a contrast panel confidently
 * reporting 21:1 on colours nobody could see.
 */
export function renderQRTo(
  container: HTMLElement,
  options: QROptions,
  build: BuildOptions,
): QRCodeStyling {
  container.replaceChildren();
  const qr = createStyledQR(options, build);
  qr.append(container);
  return qr;
}

/* ── Export ─────────────────────────────────────────────────────────── */

export async function exportQRToFormat(
  options: QROptions,
  format: 'png' | 'svg' | 'jpeg' | 'webp',
  size: number = 1024,
): Promise<Blob> {
  const qr = createStyledQR(options, { size });
  const raw = await qr.getRawData(RAW_DATA_FORMAT[format]);
  if (!raw) throw new Error(`QR export produced nothing for ${format}`);
  return raw instanceof Blob ? raw : new Blob([raw as unknown as BlobPart]);
}

export async function exportQRToSVG(options: QROptions, size: number = 1024): Promise<string> {
  const blob = await exportQRToFormat(options, 'svg', size);
  return blob.text();
}
