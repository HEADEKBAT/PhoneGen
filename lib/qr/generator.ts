/**
 * QR Studio — QR Code Generator Engine.
 *
 * Wraps the `qrcode` and `qr-code-styling` libraries.
 * All generation is client-side, using Canvas API.
 */

import QRCodeStyling from 'qr-code-styling';
import type {
  QROptions,
  QRResult,
  ModuleStyle,
  EyeStyle,
  ErrorCorrection,
  ExportFormat,
} from './types';

/* ── Module style mapping ───────────────────────────────────────────── */

const MODULE_STYLE_MAP: Record<ModuleStyle, string> = {
  square: 'square',
  rounded: 'rounded',
  dots: 'dots',
  circle: 'circle',
  diamond: 'diamond',
  pixel: 'extra-rounded',
  hexagon: 'star',
  minimal: 'square',
};

const EYE_STYLE_MAP: Record<EyeStyle, string> = {
  classic: 'square',
  rounded: 'rounded',
  circle: 'circle',
  frame: 'frame',
  diamond: 'diamond',
  modern: 'leaf',
};

const EC_MAP: Record<ErrorCorrection, string> = {
  L: 'L',
  M: 'M',
  Q: 'Q',
  H: 'H',
};

/* ── Generate QR ────────────────────────────────────────────────────── */

export async function generateQR(options: QROptions): Promise<QRResult> {
  const qr = new QRCodeStyling({
    width: options.quietZone * 2 + 300,
    height: options.quietZone * 2 + 300,
    data: options.content,
    margin: options.quietZone,
    qrOptions: {
      typeNumber: 0,
      mode: 'Byte',
      errorCorrectionLevel: EC_MAP[options.errorCorrection] as any,
    },
    image: options.logo?.dataUrl || undefined,
    imageOptions: {
      hideBackgroundDots: true,
      imageSize: options.logo
        ? Math.min(options.logo.size / 300, 0.3)
        : 0,
      margin: 4,
      crossOrigin: 'anonymous',
    },
    dotsOptions: {
      type: MODULE_STYLE_MAP[options.moduleStyle] as any,
      color: options.colors.pattern,
      gradient: options.colors.gradient
        ? {
            type: options.colors.gradient.type as any,
            rotation: options.colors.gradient.rotation || 0,
            colorStops: options.colors.gradient.colors.map((c, i) => ({
              offset: i / (options.colors!.gradient!.colors.length - 1 || 1),
              color: c,
            })),
          }
        : undefined,
    },
    cornersSquareOptions: {
      type: EYE_STYLE_MAP[options.eyeStyle] as any,
      color: options.colors.eye,
    },
    cornersDotOptions: {
      type: EYE_STYLE_MAP[options.eyeStyle] === 'diamond' ? ('dot' as any) : ('dot' as any),
      color: options.colors.eye,
    },
    backgroundOptions: {
      color: options.background.type === 'solid' ? options.background.value : options.colors.background,
    },
  });

  const dataUrl = await qr.getRawData('png' as any);
  const dataUrlStr = dataUrl ? await blobToDataURL(dataUrl) : '';

  // Estimate version from content length
  const contentLength = options.content.length;
  const version = estimateVersion(contentLength, options.errorCorrection);

  return {
    dataUrl: dataUrlStr,
    version,
    errorCorrection: options.errorCorrection,
    moduleCount: version * 4 + 17,
    size: 300,
    encoding: 'Byte',
    estimatedReadable: true,
  };
}

export async function generateQRToDataURL(options: QROptions): Promise<string> {
  const result = await generateQR(options);
  return result.dataUrl;
}

export async function generateQRToCanvas(options: QROptions, canvas?: HTMLCanvasElement): Promise<HTMLCanvasElement> {
  const qr = new QRCodeStyling({
    width: 400,
    height: 400,
    data: options.content,
    margin: options.quietZone,
    qrOptions: {
      typeNumber: 0,
      mode: 'Byte',
      errorCorrectionLevel: EC_MAP[options.errorCorrection] as any,
    },
    image: options.logo?.dataUrl || undefined,
    imageOptions: {
      hideBackgroundDots: true,
      imageSize: options.logo ? Math.min(options.logo.size / 400, 0.3) : 0,
      margin: 4,
      crossOrigin: 'anonymous',
    },
    dotsOptions: {
      type: MODULE_STYLE_MAP[options.moduleStyle] as any,
      color: options.colors.pattern,
      gradient: options.colors.gradient
        ? {
            type: options.colors.gradient.type as any,
            rotation: options.colors.gradient.rotation || 0,
            colorStops: options.colors.gradient.colors.map((c, i) => ({
              offset: i / (options.colors!.gradient!.colors.length - 1 || 1),
              color: c,
            })),
          }
        : undefined,
    },
    cornersSquareOptions: {
      type: EYE_STYLE_MAP[options.eyeStyle] as any,
      color: options.colors.eye,
    },
    backgroundOptions: {
      color: options.background.type === 'solid' ? options.background.value : options.colors.background,
    },
  });

  if (canvas) {
    await qr.append(canvas);
    return canvas;
  }

  const c = document.createElement('canvas');
  await qr.append(c);
  return c;
}

/* ── Export ──────────────────────────────────────────────────────────── */

export async function exportQRToFormat(
  options: QROptions,
  format: ExportFormat,
  size: number = 400,
): Promise<Blob> {
  const qr = new QRCodeStyling({
    width: size,
    height: size,
    data: options.content,
    margin: options.quietZone,
    qrOptions: {
      typeNumber: 0,
      mode: 'Byte',
      errorCorrectionLevel: EC_MAP[options.errorCorrection] as any,
    },
    image: options.logo?.dataUrl || undefined,
    imageOptions: {
      hideBackgroundDots: true,
      imageSize: options.logo ? Math.min(options.logo.size / size, 0.3) : 0,
      margin: 4,
    },
    dotsOptions: {
      type: MODULE_STYLE_MAP[options.moduleStyle] as any,
      color: options.colors.pattern,
      gradient: options.colors.gradient
        ? {
            type: options.colors.gradient.type as any,
            rotation: options.colors.gradient.rotation || 0,
            colorStops: options.colors.gradient.colors.map((c, i) => ({
              offset: i / (options.colors!.gradient!.colors.length - 1 || 1),
              color: c,
            })),
          }
        : undefined,
    },
    cornersSquareOptions: {
      type: EYE_STYLE_MAP[options.eyeStyle] as any,
      color: options.colors.eye,
    },
    backgroundOptions: {
      color: options.background.type === 'solid' ? options.background.value : options.colors.background,
    },
  });

  const rawData = await qr.getRawData(format as any);
  if (rawData) {
    if (rawData instanceof Buffer) return new Blob([rawData as unknown as BlobPart]);
    return rawData as Blob;
  }

  // Fallback: render to canvas and export
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  await qr.append(canvas);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Failed to export QR code'));
      },
      format === 'png' ? 'image/png' :
      format === 'jpeg' ? 'image/jpeg' :
      format === 'webp' ? 'image/webp' : 'image/png',
    );
  });
}

/* ── SVG export ──────────────────────────────────────────────────────── */

export async function exportQRToSVG(options: QROptions): Promise<string> {
  const qr = new QRCodeStyling({
    width: 400,
    height: 400,
    data: options.content,
    margin: options.quietZone,
    qrOptions: {
      typeNumber: 0,
      mode: 'Byte',
      errorCorrectionLevel: EC_MAP[options.errorCorrection] as any,
    },
    image: options.logo?.dataUrl || undefined,
    imageOptions: {
      hideBackgroundDots: true,
      imageSize: options.logo ? Math.min(options.logo.size / 400, 0.3) : 0,
      margin: 4,
    },
    dotsOptions: {
      type: MODULE_STYLE_MAP[options.moduleStyle] as any,
      color: options.colors.pattern,
    },
    cornersSquareOptions: {
      type: EYE_STYLE_MAP[options.eyeStyle] as any,
      color: options.colors.eye,
    },
    backgroundOptions: {
      color: options.background.type === 'solid' ? options.background.value : options.colors.background,
    },
  });

  const raw = await qr.getRawData('svg' as any);
  if (raw) {
    return await blobToText(raw);
  }

  return '<svg/>';
}

/* ── Size safety check ──────────────────────────────────────────────── */

export function calculateSafeLogoSize(qrSize: number, errorCorrection: ErrorCorrection): number {
  const maxRatio: Record<ErrorCorrection, number> = {
    L: 0.2,
    M: 0.25,
    Q: 0.3,
    H: 0.35,
  };
  return Math.floor(qrSize * maxRatio[errorCorrection]);
}

export function isLogoSafe(logoSizePx: number, qrSize: number, errorCorrection: ErrorCorrection): boolean {
  return logoSizePx <= calculateSafeLogoSize(qrSize, errorCorrection);
}

/* ── Helpers ─────────────────────────────────────────────────────────── */

function estimateVersion(contentLength: number, ec: ErrorCorrection): number {
  // Numeric mode capacities per version for error correction levels
  const capacities: Record<ErrorCorrection, number[]> = {
    L: [41, 77, 127, 187, 255, 322, 370, 461, 552, 652, 772, 883, 1022, 1101, 1250, 1408, 1548, 1725, 1903, 2061, 2232, 2409, 2620, 2812, 3057, 3283, 3517, 3669, 3909, 4158, 4417, 4686, 4965, 5253, 5529, 5836, 6143, 6477, 6742, 7089],
    M: [34, 63, 101, 149, 202, 255, 293, 365, 432, 513, 604, 691, 796, 871, 991, 1082, 1212, 1346, 1500, 1600, 1708, 1872, 2059, 2188, 2395, 2544, 2701, 2857, 3035, 3289, 3486, 3693, 3909, 4134, 4343, 4588, 4775, 5039, 5313, 5596],
    Q: [27, 48, 77, 111, 144, 178, 207, 259, 312, 364, 427, 489, 580, 621, 703, 775, 876, 948, 1062, 1150, 1224, 1357, 1468, 1588, 1718, 1804, 1933, 2085, 2181, 2358, 2473, 2670, 2805, 2949, 3081, 3244, 3417, 3599, 3791, 3993],
    H: [17, 34, 58, 82, 106, 139, 154, 202, 235, 288, 331, 374, 427, 468, 530, 602, 674, 746, 813, 919, 969, 1056, 1108, 1228, 1286, 1425, 1501, 1581, 1677, 1777, 1852, 2037, 2117, 2224, 2342, 2441, 2566, 2665, 2791, 2905],
  };

  const cap = capacities[ec];
  for (let v = 0; v < cap.length; v++) {
    if (contentLength <= cap[v]) return v + 1;
  }
  return 40;
}

async function blobToDataURL(blob: Blob | Buffer): Promise<string> {
  const b = blob instanceof Buffer ? new Blob([(blob as unknown) as BlobPart]) : (blob as Blob);
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(b);
  });
}

async function blobToText(blob: Blob | Buffer): Promise<string> {
  const b = blob instanceof Buffer ? new Blob([(blob as unknown) as BlobPart]) : (blob as Blob);
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(b);
  });
}
