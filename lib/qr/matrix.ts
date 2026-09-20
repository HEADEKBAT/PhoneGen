/**
 * The symbol itself — module matrix, version, capacity — from `qrcode`.
 *
 * ── Why a second QR library ─────────────────────────────────────────────────
 *
 * `qr-code-styling` draws a beautiful symbol and tells you nothing about it:
 * no version, no module count, no capacity. Everything this studio claimed to
 * know about a code it was guessing. Two different version estimates were
 * shown on two different tabs, both computed from *numeric-mode* capacity
 * tables while the encoder was hardcoded to Byte mode, which holds roughly a
 * third as much — so every version shown was far too low and every capacity
 * check far too lax.
 *
 * `qrcode` was already a dependency, and the generator's own docstring claimed
 * to wrap it; it was imported nowhere. It encodes the same payload the styling
 * library does and hands back the actual matrix, so the numbers this file
 * reports are read off the symbol rather than estimated from a string length.
 */

import QRCode from 'qrcode';
import type { ErrorCorrection } from './types';

export interface QRMatrix {
  /** Modules per side, including the finder patterns; 21 for version 1. */
  size: number;
  /** 1–40. */
  version: number;
  /** Row-major, one byte per module, 1 = dark. */
  data: Uint8Array;
  /** Dark or light at (x, y). */
  isDark(x: number, y: number): boolean;
}

/**
 * Share of the codewords each level can lose and still decode
 * (ISO/IEC 18004 §5.1; DENSO WAVE publishes the same four figures).
 */
export const EC_RECOVERY: Record<ErrorCorrection, number> = {
  L: 0.07,
  M: 0.15,
  Q: 0.25,
  H: 0.3,
};

/**
 * Share of the symbol's **area** a centred logo may cover, per level.
 *
 * Deliberately below the recovery figures above. The error-correction budget
 * is not a logo budget: it also has to absorb print registration, a crease, a
 * shadow, glare and an oblique scan. Level L gets nothing at all — 7% of
 * codewords is inside the noise floor of a photocopier.
 */
export const MAX_LOGO_COVERAGE: Record<ErrorCorrection, number> = {
  L: 0,
  M: 0.07,
  Q: 0.15,
  H: 0.2,
};

/** The level a logo needs. Anything less spends the whole budget on the logo. */
export const LOGO_MIN_EC: ErrorCorrection = 'H';

/**
 * The smallest module a common laser printer can hold, in millimetres.
 * DENSO WAVE's FAQ: "the minimum printable module size is about 0.17 mm".
 */
export const MIN_MODULE_MM = 0.17;

/**
 * Modules of clear space required on all four sides (ISO/IEC 18004 §5.3.1).
 * Not a recommendation — a symbol without it is out of spec, and a phone
 * pointed at a code printed flush against coloured artwork is the single most
 * common reason a QR "just doesn't scan".
 */
export const REQUIRED_QUIET_ZONE = 4;

/** Printer dots per module, below which the module edges break up. */
export const MIN_DOTS_PER_MODULE = 4;

/**
 * Encodes `content` and returns the symbol.
 *
 * Byte mode, matching what the styling library is configured with — the two
 * must agree or the matrix describes a different symbol than the one on
 * screen.
 */
export function buildMatrix(content: string, ec: ErrorCorrection): QRMatrix | null {
  if (!content) return null;

  try {
    const symbol = QRCode.create(content, { errorCorrectionLevel: ec });
    const { size, data } = symbol.modules;

    return {
      size,
      version: symbol.version,
      data,
      isDark: (x, y) => data[y * size + x] === 1,
    };
  } catch {
    /* Over capacity even at version 40, or an encoding the library refuses.
       The caller reports it; throwing here would take the preview with it. */
    return null;
  }
}

/** Dark modules over total — a sanity figure, and what the preview samples. */
export function darkRatio(matrix: QRMatrix): number {
  let dark = 0;
  for (let i = 0; i < matrix.data.length; i++) if (matrix.data[i] === 1) dark++;
  return dark / matrix.data.length;
}

/**
 * Modules a centred square logo covers, given its side as a fraction of the
 * symbol's width.
 *
 * Counted, not approximated: the studio needs to say "38 of 625 modules", and
 * a fraction of a fraction is not a sentence anyone can check.
 */
export function coveredModules(matrix: QRMatrix, sideFraction: number): number {
  const side = Math.ceil(sideFraction * matrix.size);
  const start = Math.floor((matrix.size - side) / 2);
  const end = Math.min(matrix.size, start + side);

  let covered = 0;
  for (let y = Math.max(0, start); y < end; y++) {
    for (let x = Math.max(0, start); x < end; x++) covered++;
  }
  return covered;
}

/**
 * The largest logo side (as a fraction of symbol width) that stays inside the
 * coverage budget for a level. Area is the square of the side, so the side is
 * the square root of the allowance.
 */
export function maxLogoSide(ec: ErrorCorrection): number {
  return Math.sqrt(MAX_LOGO_COVERAGE[ec]);
}
