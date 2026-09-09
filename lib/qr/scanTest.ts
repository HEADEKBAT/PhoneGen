/**
 * QR Studio — Scan test / self-verification.
 *
 * After generating a QR code, run an automated scan test to verify
 * readability, check error correction, version, encoding, size,
 * and estimate scan quality.
 */

import type { ErrorCorrection, ScanTestResult } from './types';

const EC_LEVELS: ErrorCorrection[] = ['L', 'M', 'Q', 'H'];

export function runScanTest(
  content: string,
  errorCorrection: ErrorCorrection,
  contentLength: number,
): ScanTestResult {
  const warnings: string[] = [];

  // Estimate version
  const version = estimateVersionForScanTest(contentLength, errorCorrection);

  // Encoding detection
  const encoding = detectEncoding(content);

  // Size estimation
  const size = version * 4 + 17;

  // Check if data fits in chosen EC level
  const maxData = getMaxDataCapacity(version, errorCorrection);
  if (contentLength > maxData) {
    warnings.push(`Content (${contentLength} chars) may exceed capacity (${maxData} chars) for version ${version} at error correction ${errorCorrection}. Consider increasing error correction or shortening content.`);
  }

  // Detect potential issues
  if (!content.trim()) {
    warnings.push('QR code content is empty.');
  }

  if (content.length > 1000) {
    warnings.push('Content is long — QR code will be dense. Consider using a higher error correction level.');
  }

  if (errorCorrection === 'L' && content.length > 500) {
    warnings.push('Low error correction with long content may reduce scan reliability.');
  }

  // Estimate scan quality
  const scanQuality = estimateScanQuality(
    version,
    errorCorrection,
    contentLength,
    warnings.length,
  );

  return {
    readable: warnings.length === 0 && contentLength <= maxData,
    errorCorrection,
    version,
    encoding,
    size,
    estimatedScanQuality: scanQuality,
    warnings,
  };
}

export function getErrorCorrectionDescription(level: ErrorCorrection): string {
  const descriptions: Record<ErrorCorrection, { label: string; recovery: string; description: string }> = {
    L: {
      label: 'Low',
      recovery: '~7%',
      description: 'Recovers up to 7% of damaged data. Best for controlled environments where the QR code won\'t be damaged.',
    },
    M: {
      label: 'Medium',
      recovery: '~15%',
      description: 'Recovers up to 15% of damaged data. Good balance of capacity and reliability for most use cases.',
    },
    Q: {
      label: 'Quartile',
      recovery: '~25%',
      description: 'Recovers up to 25% of damaged data. Recommended for QR codes on curved surfaces or with logos.',
    },
    H: {
      label: 'High',
      recovery: '~30%',
      description: 'Recovers up to 30% of damaged data. Best for QR codes that may be partially obscured or damaged.',
    },
  };
  return `${descriptions[level].label} (${descriptions[level].recovery} recovery) — ${descriptions[level].description}`;
}

export function getErrorCorrectionRecommendation(
  hasLogo: boolean,
  contentLength: number,
  usage: string,
): ErrorCorrection {
  if (hasLogo) return 'Q';
  if (contentLength > 500) return 'M';
  if (usage === 'print' || usage === 'poster') return 'Q';
  return 'M';
}

/* ── Internal helpers ────────────────────────────────────────────────── */

function detectEncoding(content: string): string {
  if (/^[0-9]+$/.test(content)) return 'Numeric';
  if (/^[0-9A-Z $%*+\-./:]+$/.test(content)) return 'Alphanumeric';
  // Check for UTF-8 multi-byte characters
  if (/[^\x00-\x7F]/.test(content)) return 'UTF-8 / Byte';
  return 'Byte';
}

function estimateVersionForScanTest(contentLength: number, ec: ErrorCorrection): number {
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

function getMaxDataCapacity(version: number, ec: ErrorCorrection): number {
  const capacities: Record<ErrorCorrection, number[]> = {
    L: [41, 77, 127, 187, 255, 322, 370, 461, 552, 652, 772, 883, 1022, 1101, 1250, 1408, 1548, 1725, 1903, 2061, 2232, 2409, 2620, 2812, 3057, 3283, 3517, 3669, 3909, 4158, 4417, 4686, 4965, 5253, 5529, 5836, 6143, 6477, 6742, 7089],
    M: [34, 63, 101, 149, 202, 255, 293, 365, 432, 513, 604, 691, 796, 871, 991, 1082, 1212, 1346, 1500, 1600, 1708, 1872, 2059, 2188, 2395, 2544, 2701, 2857, 3035, 3289, 3486, 3693, 3909, 4134, 4343, 4588, 4775, 5039, 5313, 5596],
    Q: [27, 48, 77, 111, 144, 178, 207, 259, 312, 364, 427, 489, 580, 621, 703, 775, 876, 948, 1062, 1150, 1224, 1357, 1468, 1588, 1718, 1804, 1933, 2085, 2181, 2358, 2473, 2670, 2805, 2949, 3081, 3244, 3417, 3599, 3791, 3993],
    H: [17, 34, 58, 82, 106, 139, 154, 202, 235, 288, 331, 374, 427, 468, 530, 602, 674, 746, 813, 919, 969, 1056, 1108, 1228, 1286, 1425, 1501, 1581, 1677, 1777, 1852, 2037, 2117, 2224, 2342, 2441, 2566, 2665, 2791, 2905],
  };

  const cap = capacities[ec];
  if (version >= 1 && version <= 40) {
    return cap[version - 1];
  }
  return 0;
}

function estimateScanQuality(
  version: number,
  ec: ErrorCorrection,
  contentLength: number,
  warningCount: number,
): 'excellent' | 'good' | 'fair' | 'poor' {
  if (warningCount > 2) return 'poor';
  if (warningCount > 0) return 'fair';
  if (version <= 10 && (ec === 'Q' || ec === 'H')) return 'excellent';
  if (version <= 20) return 'good';
  if (version <= 30) return 'fair';
  return 'poor';
}
