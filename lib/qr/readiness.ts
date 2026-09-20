/**
 * Is this QR code going to scan?
 *
 * Every generator on the market answers that question with silence. You pick
 * colours, drop a logo on top, download a PNG, print five hundred of them, and
 * find out in the field. The complaint threads are full of exactly that, and
 * the one decoder anyone ships (Uniqode's) is a separate page you upload a
 * finished image to — after the mistake is already made.
 *
 * This module answers it before the download button does anything, from the
 * symbol's own geometry rather than from a guess:
 *
 *   • the real version and module count, read off the encoded matrix
 *   • how much of the payload capacity is used, in Byte mode, the mode the
 *     encoder actually uses
 *   • how many modules the logo destroys, counted, against the recovery
 *     budget of the chosen error-correction level
 *   • whether the quiet zone meets the four modules ISO/IEC 18004 requires
 *   • whether the colours are dark-on-light, which the WCAG ratio alone
 *     cannot tell you — white on black scores a perfect 21:1 and most phone
 *     cameras will not read it
 *   • what the code measures in millimetres at the chosen size, and the
 *     smallest it can be printed before the modules fall below the 0.17 mm a
 *     laser printer can hold
 *
 * Issues are ids, not sentences: the studio runs in six languages.
 */

import { byteCapacity } from './capacity';
import { contrastRatio, relativeLuminance } from './contrastCheck';
import {
  buildMatrix,
  coveredModules,
  maxLogoSide,
  EC_RECOVERY,
  LOGO_MIN_EC,
  MAX_LOGO_COVERAGE,
  MIN_DOTS_PER_MODULE,
  MIN_MODULE_MM,
  REQUIRED_QUIET_ZONE,
  type QRMatrix,
} from './matrix';
import type { ErrorCorrection, QROptions } from './types';

export type IssueId =
  /* The code will not scan for most people. */
  | 'inverted'
  | 'contrastVeryLow'
  | 'quietZoneMissing'
  | 'logoOverBudget'
  | 'eyeInvisible'
  | 'overCapacity'
  /* It will scan, but something is working against it. */
  | 'contrastLow'
  | 'quietZoneShort'
  | 'logoOnLowEc'
  | 'printTooSmall';

export interface Issue {
  id: IssueId;
  severity: 'fail' | 'warn';
  /** Numbers for the message, already rounded for display. */
  values?: Record<string, string | number>;
}

export interface PrintPlan {
  /** Modules across, quiet zone included — what actually gets printed. */
  totalModules: number;
  /** Millimetres per module at `widthMm`. */
  moduleMm: number;
  /** The smallest width this symbol can be printed at and still hold up. */
  minWidthMm: number;
  /** Printer dots per module at `dpi`. */
  dotsPerModule: number;
  /** Pixels needed to print `widthMm` at `dpi`. */
  pixels: number;
}

export interface LogoPlan {
  /** Side of the logo square as a fraction of the symbol's width. */
  sideFraction: number;
  /** Share of the symbol's area it covers. */
  coverage: number;
  /** Modules underneath it. */
  covered: number;
  /** Modules in the symbol. */
  total: number;
  /** What the level allows. */
  allowed: number;
  withinBudget: boolean;
}

export interface Readiness {
  /** Null when the payload is empty or will not encode at any version. */
  matrix: QRMatrix | null;
  version: number;
  modules: number;
  /** UTF-8 bytes in the payload. */
  bytes: number;
  capacity: number;
  /** 0–1, against the version the payload landed in. Near 1 by construction. */
  capacityUsed: number;
  /** Bytes that still fit before the symbol grows a version. */
  headroom: number;
  /** The level the symbol is actually built at, after any automatic bump. */
  errorCorrection: ErrorCorrection;
  /** True when a logo forced the level up from what the user chose. */
  ecRaisedForLogo: boolean;
  contrast: { ratio: number; inverted: boolean };
  quietZone: number;
  logo: LogoPlan | null;
  print: PrintPlan;
  issues: Issue[];
  /** No issues at all / warnings only / at least one failure. */
  verdict: 'ready' | 'risky' | 'broken';
}

/** Inputs the caller controls that are not part of the symbol itself. */
export interface ReadinessContext {
  /** Physical width the user intends to print, in millimetres. */
  widthMm?: number;
  /** Printer resolution the plan is computed against. */
  dpi?: number;
}

const DEFAULT_WIDTH_MM = 30;
const DEFAULT_DPI = 300;

/**
 * The level the symbol should be built at.
 *
 * A logo forces H. It is not a preference: at level M a logo can only cover
 * 7% of the area before it is eating the budget that print noise needs, and
 * nobody drops a logo on a QR code to make it 7% of the area. Raising the
 * level costs a slightly denser symbol and is the difference between a code
 * that scans off a crumpled flyer and one that does not.
 */
export function effectiveErrorCorrection(options: QROptions): ErrorCorrection {
  if (!options.logo) return options.errorCorrection;
  const order: ErrorCorrection[] = ['L', 'M', 'Q', 'H'];
  return order.indexOf(options.errorCorrection) >= order.indexOf(LOGO_MIN_EC)
    ? options.errorCorrection
    : LOGO_MIN_EC;
}

export function analyseReadiness(
  options: QROptions,
  context: ReadinessContext = {},
): Readiness {
  const widthMm = context.widthMm ?? DEFAULT_WIDTH_MM;
  const dpi = context.dpi ?? DEFAULT_DPI;

  const ec = effectiveErrorCorrection(options);
  const matrix = buildMatrix(options.content, ec);
  const issues: Issue[] = [];

  const bytes = new TextEncoder().encode(options.content).length;
  const version = matrix?.version ?? 0;
  const modules = matrix?.size ?? 0;
  const capacity = version ? byteCapacity(version, ec) : 0;
  const capacityUsed = capacity ? bytes / capacity : 0;

  if (options.content && !matrix) {
    issues.push({ id: 'overCapacity', severity: 'fail', values: { bytes } });
  }

  /* There is deliberately no "nearly full" warning. The encoder picks the
     smallest version the payload fits in, so the payload is *always* near that
     version's capacity — a warning on it would fire on every code ever made.
     What is worth knowing is the opposite figure: how many more bytes fit
     before the symbol jumps a version and every module gets smaller. That is
     `headroom`, and it is information, not an alarm. */

  /* ── Colour ──────────────────────────────────────────────────────── */

  const pattern = options.colors.pattern;
  const background =
    options.background.type === 'solid' ? options.background.value : options.colors.background;

  const ratio = safeRatio(pattern, background);
  /* The ratio is symmetric, so it cannot see this on its own: white modules on
     a black background score 21:1 and read as perfect. Decoders expect dark
     modules on a light field, and a phone's built-in camera app very often
     refuses the inverse outright. */
  const inverted = safeLuminance(pattern) > safeLuminance(background);

  if (inverted) issues.push({ id: 'inverted', severity: 'fail' });
  else if (ratio < 3) issues.push({ id: 'contrastVeryLow', severity: 'fail', values: { ratio: round(ratio) } });
  else if (ratio < 4.5) issues.push({ id: 'contrastLow', severity: 'warn', values: { ratio: round(ratio) } });

  /* The finder patterns have their own colour and their own picker, and
     nothing was checking it. An eye the colour of the background is three
     missing corners, which is the one thing every decoder looks for first. */
  if (safeRatio(options.colors.eye, background) < 3) {
    issues.push({ id: 'eyeInvisible', severity: 'fail' });
  }

  /* ── Quiet zone ──────────────────────────────────────────────────── */

  const quietZone = options.quietZone;
  if (quietZone <= 0) issues.push({ id: 'quietZoneMissing', severity: 'fail' });
  else if (quietZone < REQUIRED_QUIET_ZONE) {
    issues.push({
      id: 'quietZoneShort',
      severity: 'warn',
      values: { modules: quietZone, required: REQUIRED_QUIET_ZONE },
    });
  }

  /* ── Logo ────────────────────────────────────────────────────────── */

  let logo: LogoPlan | null = null;
  if (options.logo && matrix) {
    const sideFraction = Math.min(1, Math.max(0, options.logo.size / 100));
    const coverage = sideFraction * sideFraction;
    const covered = coveredModules(matrix, sideFraction);
    const total = matrix.size * matrix.size;
    const allowed = MAX_LOGO_COVERAGE[ec];

    logo = { sideFraction, coverage, covered, total, allowed, withinBudget: coverage <= allowed };

    if (!logo.withinBudget) {
      issues.push({
        id: 'logoOverBudget',
        severity: 'fail',
        values: {
          coverage: Math.round(coverage * 100),
          allowed: Math.round(allowed * 100),
          covered,
          total,
          maxSide: Math.round(maxLogoSide(ec) * 100),
        },
      });
    }

    if (options.errorCorrection !== ec) {
      issues.push({
        id: 'logoOnLowEc',
        severity: 'warn',
        values: { from: options.errorCorrection, to: ec, recovery: Math.round(EC_RECOVERY[ec] * 100) },
      });
    }
  }

  /* ── Print ───────────────────────────────────────────────────────── */

  const totalModules = modules + quietZone * 2;
  const moduleMm = totalModules ? widthMm / totalModules : 0;
  const dotsPerModule = (moduleMm / 25.4) * dpi;
  const pixels = Math.ceil((widthMm / 25.4) * dpi);

  /* Two floors, and the stricter one wins. A module has to be big enough for
     the press to hold at all — DENSO WAVE puts that at about 0.17 mm for a
     common laser printer — and big enough that the printer's own dots do not
     ragged its edges, which needs four dots across. At 300 dpi that second
     floor is 0.339 mm and is the one that binds; at 1200 dpi the first one is. */
  const dotFloorMm = (MIN_DOTS_PER_MODULE * 25.4) / dpi;
  const moduleFloorMm = Math.max(MIN_MODULE_MM, dotFloorMm);
  const minWidthMm = totalModules * moduleFloorMm;

  if (totalModules && moduleMm < moduleFloorMm) {
    issues.push({
      id: 'printTooSmall',
      severity: 'warn',
      values: {
        moduleMm: moduleMm.toFixed(2),
        floorMm: moduleFloorMm.toFixed(2),
        minWidthMm: Math.ceil(minWidthMm),
        widthMm,
        dpi,
        dots: dotsPerModule.toFixed(1),
      },
    });
  }

  const verdict = issues.some((issue) => issue.severity === 'fail')
    ? 'broken'
    : issues.length > 0
      ? 'risky'
      : 'ready';

  return {
    matrix,
    version,
    modules,
    bytes,
    capacity,
    capacityUsed,
    headroom: Math.max(0, capacity - bytes),
    errorCorrection: ec,
    ecRaisedForLogo: ec !== options.errorCorrection,
    contrast: { ratio: round(ratio), inverted },
    quietZone,
    logo,
    print: {
      totalModules,
      moduleMm,
      minWidthMm,
      dotsPerModule,
      pixels,
    },
    issues,
    verdict,
  };
}

/* ── Helpers ─────────────────────────────────────────────────────────── */

const HEX = /^#[0-9a-fA-F]{6}$/;

/**
 * The colour pickers accept partial input — `#`, `#a`, `#ab` — as you type.
 * `relativeLuminance` parses with `slice` and `parseInt`, so a partial value
 * produced NaN, and a NaN ratio failed every comparison and rendered as
 * "NaN:1" in the panel. Anything that is not a full six-digit hex is treated
 * as unknown rather than as a number.
 */
function safeLuminance(hex: string): number {
  return HEX.test(hex) ? relativeLuminance(hex) : 0;
}

function safeRatio(a: string, b: string): number {
  if (!HEX.test(a) || !HEX.test(b)) return 21;
  return contrastRatio(a, b);
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

export { MIN_MODULE_MM, MIN_DOTS_PER_MODULE, REQUIRED_QUIET_ZONE, EC_RECOVERY };
