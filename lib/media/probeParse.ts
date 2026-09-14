/**
 * Reads what ffmpeg says about a file.
 *
 * ffmpeg.wasm ships no ffprobe, so the way to learn a file's shape is to ask
 * ffmpeg to open it without an output — it prints the stream layout to stderr
 * and exits with "At least one output file must be specified", which is an
 * error only in the sense that we never wanted an output. Everything useful is
 * in those log lines, and this module turns them into numbers.
 *
 * It is pure text-in, data-out, which is the point: the parsing is the part
 * that breaks on somebody's unusual file, and it is the part worth testing.
 * Before this existed the studio simply asserted 1920×1080 at 30 fps for every
 * file anyone opened.
 */

import type { VideoAnalysis, VideoCodec, AudioCodec, VideoContainer } from './types';

/* ── Codec names ────────────────────────────────────────────────────────── */

/** ffmpeg's decoder names → the registry's codec ids. */
const VIDEO_CODEC_ALIASES: Record<string, VideoCodec> = {
  h264: 'h264',
  avc1: 'h264',
  hevc: 'h265',
  h265: 'h265',
  hev1: 'h265',
  av1: 'av1',
  libaom: 'av1',
  vp9: 'vp9',
  'vp09': 'vp9',
  mpeg4: 'mpeg4',
};

const AUDIO_CODEC_ALIASES: Record<string, AudioCodec> = {
  aac: 'aac',
  mp3: 'mp3',
  mp3float: 'mp3',
  opus: 'opus',
  flac: 'flac',
  vorbis: 'vorbis',
};

function normaliseVideoCodec(name: string): VideoCodec | null {
  return VIDEO_CODEC_ALIASES[name.toLowerCase()] ?? null;
}

function normaliseAudioCodec(name: string): AudioCodec | null {
  return AUDIO_CODEC_ALIASES[name.toLowerCase()] ?? null;
}

/* ── Small parsers ──────────────────────────────────────────────────────── */

/** "00:01:02.53" → 62.53 seconds. */
export function parseTimestamp(value: string): number | null {
  const m = /^(\d+):(\d{1,2}):(\d{1,2}(?:\.\d+)?)$/.exec(value.trim());
  if (!m) return null;
  return Number(m[1]) * 3600 + Number(m[2]) * 60 + Number(m[3]);
}

/** "1100 kb/s" → 1_100_000 bits per second. */
function parseBitrate(value: string | undefined): number | null {
  if (!value) return null;
  const m = /([\d.]+)\s*(k|m)?b\/s/i.exec(value);
  if (!m) return null;
  const scale = m[2]?.toLowerCase() === 'm' ? 1_000_000 : m[2] ? 1000 : 1;
  return Math.round(Number(m[1]) * scale);
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

/** 1920×1080 → "16:9". Falls back to "w:h" when the ratio is unusual. */
export function aspectRatio(width: number, height: number): string {
  if (!width || !height) return '';
  const divisor = gcd(width, height) || 1;
  return `${width / divisor}:${height / divisor}`;
}

/* ── The log parser ─────────────────────────────────────────────────────── */

export interface ProbeResult {
  container: string | null;
  durationSeconds: number | null;
  overallBitrate: number | null;
  video: {
    codec: VideoCodec | null;
    rawCodec: string;
    width: number;
    height: number;
    frameRate: number | null;
    bitrate: number | null;
    pixelFormat: string | null;
    colorSpace: string | null;
    rotation: number;
  } | null;
  audio: {
    codec: AudioCodec | null;
    rawCodec: string;
    sampleRate: number | null;
    channels: number | null;
    bitrate: number | null;
  } | null;
}

/**
 * Parses the stderr of `ffmpeg -i <file>`.
 *
 * Tolerant by design: a field it cannot find comes back null rather than
 * throwing, because a missing frame rate should not stop someone converting a
 * file that plays perfectly well.
 */
export function parseProbeOutput(log: string): ProbeResult {
  const result: ProbeResult = {
    container: null,
    durationSeconds: null,
    overallBitrate: null,
    video: null,
    audio: null,
  };

  const input = /Input #0,\s*([^,]+(?:,[^,]+)*?),\s*from\s/.exec(log);
  if (input) {
    /* "mov,mp4,m4a,3gp,3g2,mj2" — ffmpeg names the whole demuxer family. The
       first entry is the one people mean. */
    result.container = input[1].split(',')[0].trim();
  }

  const duration = /Duration:\s*(\d+:\d{2}:\d{2}(?:\.\d+)?)/.exec(log);
  if (duration) result.durationSeconds = parseTimestamp(duration[1]);

  const overall = /Duration:[^\n]*?bitrate:\s*([\d.]+\s*[kM]?b\/s)/i.exec(log);
  if (overall) result.overallBitrate = parseBitrate(overall[1]);

  /* Stream lines. The prefix varies across ffmpeg versions — "Stream #0:0:",
     "Stream #0:0[0x1](und):" — so match loosely up to the media type. */
  const videoLine = /Stream #\d+:\d+[^\n]*?:\s*Video:\s*([^\n]+)/.exec(log);
  if (videoLine) {
    const line = videoLine[1];
    const rawCodec = line.split(/[\s,(]/)[0];

    const size = /(?:^|[\s,])(\d{2,5})x(\d{2,5})(?:[\s,\]]|$)/.exec(line);
    const fps = /([\d.]+)\s*fps/.exec(line);
    const pixFmt = /(?:^|,\s*)(yuv[a-z0-9]+|gbrp[a-z0-9]*|rgb[a-z0-9]*|gray[a-z0-9]*|nv\d+|p\d+[a-z]*)\b/.exec(line);
    const colour = /\b(bt709|bt470bg|smpte170m|bt2020[a-z]*|bt601)\b/i.exec(line);

    /* Rotation arrives in a "Side data:" block after the stream line. */
    const rotation = /rotation of\s*(-?[\d.]+)\s*degrees/.exec(log);
    const rotated = rotation ? Math.round(Number(rotation[1])) : 0;

    result.video = {
      codec: normaliseVideoCodec(rawCodec),
      rawCodec,
      width: size ? Number(size[1]) : 0,
      height: size ? Number(size[2]) : 0,
      frameRate: fps ? Number(fps[1]) : null,
      bitrate: parseBitrate(/,\s*([\d.]+\s*[kM]?b\/s)/i.exec(line)?.[1]),
      pixelFormat: pixFmt ? pixFmt[1] : null,
      colorSpace: colour ? colour[1].toLowerCase() : null,
      /* ffmpeg reports the counter-clockwise angle; normalise to 0–359. */
      rotation: ((rotated % 360) + 360) % 360,
    };
  }

  const audioLine = /Stream #\d+:\d+[^\n]*?:\s*Audio:\s*([^\n]+)/.exec(log);
  if (audioLine) {
    const line = audioLine[1];
    const rawCodec = line.split(/[\s,(]/)[0];

    const hz = /(\d{4,6})\s*Hz/.exec(line);
    const channels = /\b(mono|stereo|(\d)(?:\.\d)?\s*channels?)\b/i.exec(line);

    let channelCount: number | null = null;
    if (channels) {
      if (/mono/i.test(channels[1])) channelCount = 1;
      else if (/stereo/i.test(channels[1])) channelCount = 2;
      else if (channels[2]) channelCount = Number(channels[2]);
    }
    /* "5.1" and "7.1" name the layout, not a channel count ffmpeg spells out. */
    if (/\b5\.1\b/.test(line)) channelCount = 6;
    if (/\b7\.1\b/.test(line)) channelCount = 8;

    result.audio = {
      codec: normaliseAudioCodec(rawCodec),
      rawCodec,
      sampleRate: hz ? Number(hz[1]) : null,
      channels: channelCount,
      bitrate: parseBitrate(/,\s*([\d.]+\s*[kM]?b\/s)/i.exec(line)?.[1]),
    };
  }

  return result;
}

/**
 * Shapes a probe into the studio's `VideoAnalysis`.
 *
 * `fileName` and `fileSize` come from the File object rather than the log —
 * ffmpeg reports the name it was given inside its own virtual filesystem.
 */
export function toAnalysis(
  probe: ProbeResult,
  fileName: string,
  fileSize: number,
): VideoAnalysis {
  const width = probe.video?.width ?? 0;
  const height = probe.video?.height ?? 0;
  const bitrate = probe.video?.bitrate ?? probe.overallBitrate;

  /* A rough band, not a measurement: bits per pixel per second is the cheapest
     signal that separates a phone clip from a re-encoded 240p download. */
  let estimatedQuality: VideoAnalysis['estimatedQuality'] = 'unknown';
  if (width && height && bitrate && probe.video?.frameRate) {
    const bpp = bitrate / (width * height * probe.video.frameRate);
    estimatedQuality = bpp > 0.12 ? 'high' : bpp > 0.05 ? 'medium' : 'low';
  }

  const extension = fileName.split('.').pop()?.toLowerCase() ?? '';

  return {
    container: (probe.container ?? extension) as VideoContainer,
    videoCodec: probe.video?.codec ?? null,
    audioCodec: probe.audio?.codec ?? null,
    width,
    height,
    aspectRatio: aspectRatio(width, height),
    frameRate: probe.video?.frameRate ?? 0,
    videoBitrate: probe.video?.bitrate ?? null,
    audioBitrate: probe.audio?.bitrate ?? null,
    audioChannels: probe.audio?.channels ?? null,
    duration: probe.durationSeconds ?? 0,
    rotation: probe.video?.rotation ?? 0,
    hdr: probe.video?.colorSpace?.startsWith('bt2020') ?? false,
    colorSpace: probe.video?.colorSpace ?? null,
    estimatedQuality,
    fileSize,
    fileName,
    hasAudio: probe.audio !== null,
    hasVideo: probe.video !== null,
    metadata: {},
  };
}

/* ── Encoder inventory ──────────────────────────────────────────────────── */

/**
 * Parses `ffmpeg -encoders` into the set of encoder names the build has.
 *
 * Worth doing rather than assuming: which encoders ffmpeg.wasm ships depends
 * on how the core was compiled, and offering someone H.265 that the build
 * cannot produce turns into a failed conversion several minutes in. The UI
 * asks this and hides what is not there.
 */
export function parseEncoders(log: string): Set<string> {
  const encoders = new Set<string>();

  for (const line of log.split(/\r?\n/)) {
    /* " V....D libx264              libx264 H.264 / AVC" — six flag columns,
       then the name.
       The legend above the table has the same flag shape (" V..... = Video"),
       so requiring the name to start with a letter or digit is what separates
       an encoder from the word after an equals sign. */
    const m = /^\s*[VAS][F.][S.][X.][B.][D.]\s+([A-Za-z0-9][\w.-]*)/.exec(line);
    if (m) encoders.add(m[1]);
  }

  return encoders;
}
