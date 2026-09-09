/**
 * Media Studio — Size & Time Estimation
 *
 * Estimates output file size and encoding time based on input analysis
 * and target conversion options. Uses heuristic formulas.
 */

import type { SizeEstimation, VideoAnalysis, ConversionOptions } from './types';

const BITRATE_TABLE: Record<string, { low: string; medium: string; high: string }> = {
  '2160p': { low: '15M', medium: '35M', high: '60M' },
  '1440p': { low: '8M', medium: '16M', high: '30M' },
  '1080p': { low: '3M', medium: '8M', high: '16M' },
  '720p': { low: '1.5M', medium: '4M', high: '8M' },
  '480p': { low: '0.5M', medium: '1.5M', high: '3M' },
  '360p': { low: '0.3M', medium: '0.8M', high: '1.5M' },
};

function getResolutionLabel(width: number, height: number): string {
  const maxDim = Math.max(width, height);
  if (maxDim >= 3840) return '2160p';
  if (maxDim >= 2560) return '1440p';
  if (maxDim >= 1920) return '1080p';
  if (maxDim >= 1280) return '720p';
  if (maxDim >= 854) return '480p';
  return '360p';
}

function parseBitrateString(bitrate: string | undefined): number {
  if (!bitrate) return 0;
  const match = bitrate.match(/^(\d+(?:\.\d+)?)\s*([KM])?/);
  if (!match) return 0;
  const val = parseFloat(match[1]!);
  const unit = match[2];
  if (unit === 'K') return val * 1000;
  if (unit === 'M') return val * 1000 * 1000;
  return val;
}

export function estimateOutput(analysis: VideoAnalysis, options: ConversionOptions): SizeEstimation {
  const { duration, fileSize, width, height } = analysis;
  const resLabel = getResolutionLabel(options.width || width, options.height || height);

  const targetBitrate = parseBitrateString(options.videoBitrate);
  const audioBitrate = parseBitrateString(options.audioBitrate || '128k');

  const effectiveVideoBitrate = targetBitrate || parseBitrateString(BITRATE_TABLE[resLabel]?.medium || '4M');
  const totalBitrate = effectiveVideoBitrate + audioBitrate;

  const estimatedSizeBytes = (totalBitrate / 8) * duration;
  const compressionRatio = fileSize > 0 ? fileSize / Math.max(estimatedSizeBytes, 1) : 1;

  let qualityEstimate: 'lossless' | 'high' | 'medium' | 'low';
  const crf = options.crf ?? 23;
  if (crf <= 18) qualityEstimate = 'lossless';
  else if (crf <= 23) qualityEstimate = 'high';
  else if (crf <= 28) qualityEstimate = 'medium';
  else qualityEstimate = 'low';

  // Rough time estimate: duration * (complexity factor based on resolution)
  const complexityFactor = (options.width || width) * (options.height || height) / (1920 * 1080);
  const presetFactor = options.preset === 'ultrafast' ? 0.3
    : options.preset === 'fast' ? 0.6
    : options.preset === 'slow' ? 2
    : options.preset === 'veryslow' ? 4
    : 1;
  const estimatedTimeMs = duration * 1000 * complexityFactor * presetFactor * 0.5;

  const quality = crf <= 18 ? 4 : crf <= 23 ? 3 : crf <= 28 ? 2 : 1;
  const confidence = Math.min(1, 0.3 + (fileSize > 0 ? 0.4 : 0) + (targetBitrate > 0 ? 0.3 : 0));

  return {
    estimatedSize: estimatedSizeBytes,
    compressionRatio,
    qualityEstimate,
    estimatedTime: estimatedTimeMs,
    confidence,
  };
}
