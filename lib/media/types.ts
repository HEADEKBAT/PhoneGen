/**
 * Media Studio — Shared Types
 *
 * Core type definitions for the Media Studio engine layer.
 */

/* ── Supported formats ──────────────────────────────────────────── */

export type VideoContainer =
  | 'mp4'
  | 'mov'
  | 'avi'
  | 'mkv'
  | 'webm'
  | 'gif';

export type AudioContainer = 'mp3' | 'wav' | 'ogg' | 'aac' | 'm4a' | 'flac';

export type MediaContainer = VideoContainer | AudioContainer;

export type VideoCodec =
  | 'h264'
  | 'h265'
  | 'av1'
  | 'vp9'
  | 'mpeg4';

export type AudioCodec =
  | 'aac'
  | 'mp3'
  | 'opus'
  | 'flac'
  | 'vorbis';

export type MediaFormat = 'video' | 'audio';

/* ── Presets ────────────────────────────────────────────────────── */

export type DevicePreset =
  | 'youtube'
  | 'tiktok'
  | 'instagram'
  | 'facebook'
  | 'telegram'
  | 'discord'
  | 'whatsapp'
  | 'obs'
  | 'premiere'
  | 'davinci'
  | 'final-cut'
  | 'capcut'
  | 'android'
  | 'iphone'
  | 'windows'
  | 'macos';

export type ConversionAction =
  | 'compress'
  | 'web'
  | 'mobile'
  | 'youtube'
  | 'tiktok'
  | 'instagram'
  | 'telegram'
  | 'discord'
  | 'whatsapp'
  | 'obs'
  | 'premiere'
  | 'davinci'
  | 'extract-audio'
  | 'create-gif'
  | 'generate-thumbnail';

/* ── Video analysis result ──────────────────────────────────────── */

export interface VideoAnalysis {
  container: VideoContainer | null;
  videoCodec: VideoCodec | null;
  audioCodec: AudioCodec | null;
  width: number;
  height: number;
  aspectRatio: string;
  frameRate: number;
  videoBitrate: number | null;
  audioBitrate: number | null;
  audioChannels: number | null;
  duration: number; // seconds
  rotation: number;
  hdr: boolean;
  colorSpace: string | null;
  estimatedQuality: 'low' | 'medium' | 'high' | 'unknown';
  fileSize: number; // bytes
  fileName: string;
  hasAudio: boolean;
  hasVideo: boolean;
  metadata: Record<string, string>;
}

/* ── Conversion options ─────────────────────────────────────────── */

export interface ConversionOptions {
  container: MediaContainer;
  videoCodec: VideoCodec;
  audioCodec: AudioCodec;
  width?: number;
  height?: number;
  frameRate?: number;
  videoBitrate?: string; // e.g. "2M"
  audioBitrate?: string; // e.g. "128k"
  crf?: number; // 0-51, lower = better quality
  preset?: 'ultrafast' | 'fast' | 'medium' | 'slow' | 'veryslow';
  fastStart?: boolean; // moov atom at front for streaming
  audioChannels?: number;
  sampleRate?: number;
  startTime?: number; // trim start in seconds
  duration?: number; // trim duration in seconds
  rotate?: number; // 0, 90, 180, 270
  reverse?: boolean;
}

/* ── Preset definition ──────────────────────────────────────────── */

export interface PresetDefinition {
  id: DevicePreset;
  label: string;
  description: string;
  icon: string;
  container: MediaContainer;
  videoCodec: VideoCodec;
  audioCodec: AudioCodec;
  width?: number;
  height?: number;
  frameRate?: number;
  videoBitrate?: string;
  audioBitrate?: string;
  crf?: number;
}

/* ── Format info ────────────────────────────────────────────────── */

export interface FormatInfo {
  id: MediaContainer;
  label: string;
  type: MediaFormat;
  extensions: string[];
  mimeType: string;
  description: string;
  bestFor: string[];
  compatibility: number; // 1-5 stars
  quality: number; // 1-5
  compression: number; // 1-5
  pros: string[];
  cons: string[];
  browserSupport: string[];
  useCases: string[];
}

/* ── Codec info ─────────────────────────────────────────────────── */

export interface CodecInfo {
  id: VideoCodec | AudioCodec;
  label: string;
  type: 'video' | 'audio';
  description: string;
  useCases: string[];
  pros: string[];
  cons: string[];
  compatibility: number;
  yearIntroduced: number;
  compressionEfficiency: number; // 1-5
}

/* ── Recommendation ─────────────────────────────────────────────── */

export interface Recommendation {
  action: ConversionAction;
  label: string;
  description: string;
  icon: string;
  container: MediaContainer;
  videoCodec: VideoCodec;
  audioCodec: AudioCodec;
  preset?: DevicePreset;
  priority: number; // 1 = highest
}

/* ── Conversion result ──────────────────────────────────────────── */

export interface ConversionResult {
  id: string;
  fileName: string;
  originalName: string;
  originalSize: number;
  outputSize: number;
  container: MediaContainer;
  duration: number;
  encodingTime: number; // ms
  preset: DevicePreset | null;
  blobUrl: string;
  mimeType: string;
  timestamp: number;
}

/* ── History entry ──────────────────────────────────────────────── */

export interface HistoryEntry {
  id: string;
  fileName: string;
  originalFormat: string;
  outputFormat: string;
  originalSize: number;
  outputSize: number;
  savedBytes: number;
  savedPercent: number;
  timestamp: number;
  options: ConversionOptions;
}

/* ── Pipeline stage ─────────────────────────────────────────────── */

export type PipelineStage =
  | 'upload'
  | 'analyze'
  | 'prepare'
  | 'encode'
  | 'optimize'
  | 'finalize'
  | 'done';

export interface PipelineState {
  currentStage: PipelineStage;
  progress: number; // 0-100
  message: string;
  startTime: number | null;
}

/* ── Estimation ─────────────────────────────────────────────────── */

export interface SizeEstimation {
  estimatedSize: number; // bytes
  compressionRatio: number;
  qualityEstimate: 'lossless' | 'high' | 'medium' | 'low';
  estimatedTime: number; // ms (rough estimate)
  confidence: number; // 0-1
}

/* ── Store state ────────────────────────────────────────────────── */

export interface MediaStoreState {
  file: File | null;
  analysis: VideoAnalysis | null;
  options: ConversionOptions;
  pipeline: PipelineState;
  result: ConversionResult | null;
  error: string | null;
  isFfmpegLoaded: boolean;
  history: HistoryEntry[];
}
