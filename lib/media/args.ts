/**
 * Builds the ffmpeg command line for a conversion.
 *
 * Separated from the engine so it can be read and tested as data: the engine's
 * job is to run an argument list, and getting the argument list right is where
 * the decisions are. A wrong flag here is a file that plays everywhere except
 * the one place the user needed it.
 */

import type { ConversionOptions, VideoAnalysis, VideoCodec, AudioCodec, MediaContainer } from './types';

/* ── Encoder names ──────────────────────────────────────────────────────── */

/**
 * Candidate encoders per codec, best first.
 *
 * A list rather than a name because which encoders a build has depends on how
 * it was compiled — ffmpeg.wasm's default core has libx264 but not libx265,
 * and the native `aac` encoder but not `libfdk_aac`. `pickEncoder` takes the
 * first one the build actually reports.
 */
const VIDEO_ENCODERS: Record<VideoCodec, string[]> = {
  h264: ['libx264', 'h264'],
  h265: ['libx265', 'hevc'],
  av1: ['libsvtav1', 'libaom-av1'],
  vp9: ['libvpx-vp9'],
  mpeg4: ['mpeg4'],
};

const AUDIO_ENCODERS: Record<AudioCodec, string[]> = {
  aac: ['libfdk_aac', 'aac'],
  mp3: ['libmp3lame'],
  opus: ['libopus'],
  vorbis: ['libvorbis'],
  flac: ['flac'],
};

/** The first candidate the build has, or null when it has none of them. */
export function pickEncoder(
  codec: VideoCodec | AudioCodec,
  available: Set<string>,
  kind: 'video' | 'audio',
): string | null {
  const candidates = kind === 'video'
    ? VIDEO_ENCODERS[codec as VideoCodec]
    : AUDIO_ENCODERS[codec as AudioCodec];

  return candidates?.find((name) => available.has(name)) ?? null;
}

/** Which of the registry's codecs this build can actually produce. */
export function supportedCodecs(available: Set<string>): {
  video: VideoCodec[];
  audio: AudioCodec[];
} {
  return {
    video: (Object.keys(VIDEO_ENCODERS) as VideoCodec[]).filter((c) =>
      pickEncoder(c, available, 'video'),
    ),
    audio: (Object.keys(AUDIO_ENCODERS) as AudioCodec[]).filter((c) =>
      pickEncoder(c, available, 'audio'),
    ),
  };
}

/* ── Containers ─────────────────────────────────────────────────────────── */

const AUDIO_ONLY: MediaContainer[] = ['mp3', 'wav', 'ogg', 'aac', 'm4a', 'flac'];

export function isAudioOnly(container: MediaContainer): boolean {
  return AUDIO_ONLY.includes(container);
}

/**
 * Whether the streams can be copied into the new container untouched.
 *
 * This is the difference between seconds and minutes. Converting an HLS
 * recording to MP4 is the common case: the segments already hold H.264 and
 * AAC, and MP4 accepts both, so there is nothing to encode — only the
 * container changes. Re-encoding it anyway would cost a quality generation for
 * no reason at all.
 */
export function canRemux(
  analysis: Pick<VideoAnalysis, 'videoCodec' | 'audioCodec' | 'hasVideo' | 'hasAudio'>,
  options: ConversionOptions,
): boolean {
  /* Anything that changes the pixels rules copying out. */
  if (options.width || options.height || options.frameRate || options.rotate || options.reverse) {
    return false;
  }
  if (options.crf !== undefined && options.videoBitrate) return false;

  const containerAccepts: Partial<Record<MediaContainer, { video: VideoCodec[]; audio: AudioCodec[] }>> = {
    mp4: { video: ['h264', 'h265', 'av1', 'mpeg4'], audio: ['aac', 'mp3'] },
    mov: { video: ['h264', 'h265', 'mpeg4'], audio: ['aac', 'mp3'] },
    mkv: { video: ['h264', 'h265', 'av1', 'vp9', 'mpeg4'], audio: ['aac', 'mp3', 'opus', 'vorbis', 'flac'] },
    webm: { video: ['vp9', 'av1'], audio: ['opus', 'vorbis'] },
  };

  const accepted = containerAccepts[options.container];
  if (!accepted) return false;

  if (analysis.hasVideo) {
    if (!analysis.videoCodec || !accepted.video.includes(analysis.videoCodec)) return false;
    if (analysis.videoCodec !== options.videoCodec) return false;
  }
  if (analysis.hasAudio) {
    if (!analysis.audioCodec || !accepted.audio.includes(analysis.audioCodec)) return false;
    if (analysis.audioCodec !== options.audioCodec) return false;
  }

  return analysis.hasVideo || analysis.hasAudio;
}

/* ── Command line ───────────────────────────────────────────────────────── */

export interface BuildArgsInput {
  inputName: string;
  outputName: string;
  options: ConversionOptions;
  /** Encoders the loaded build reports. */
  available: Set<string>;
  /** What the source turned out to be, when it has been probed. */
  analysis?: Pick<VideoAnalysis, 'videoCodec' | 'audioCodec' | 'hasVideo' | 'hasAudio' | 'container'>;
  /** Copy the streams instead of re-encoding, when the shapes allow it. */
  preferRemux?: boolean;
}

export class UnsupportedCodecError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UnsupportedCodecError';
  }
}

export function buildConvertArgs(input: BuildArgsInput): string[] {
  const { inputName, outputName, options, available, analysis } = input;
  const args: string[] = ['-hide_banner', '-nostdin'];

  /* -ss before -i seeks by keyframe without decoding what comes before it,
     which on a long file is the difference between instant and a full pass. */
  if (options.startTime !== undefined && options.startTime > 0) {
    args.push('-ss', String(options.startTime));
  }

  args.push('-i', inputName);

  if (options.duration !== undefined && options.duration > 0) {
    args.push('-t', String(options.duration));
  }

  const audioOnly = isAudioOnly(options.container);
  const remux = Boolean(input.preferRemux && analysis && canRemux(analysis, options));

  if (remux) {
    args.push('-c', 'copy');

    /* AAC inside MPEG-TS is ADTS-framed; MP4 and MOV want it raw. Without this
       filter the copy succeeds and the audio is silent. This is the flag that
       makes HLS-to-MP4 work. */
    if (
      (options.container === 'mp4' || options.container === 'mov' || options.container === 'm4a') &&
      analysis?.audioCodec === 'aac'
    ) {
      args.push('-bsf:a', 'aac_adtstoasc');
    }
  } else if (audioOnly) {
    args.push('-vn');

    if (options.container === 'wav') {
      args.push('-c:a', 'pcm_s16le');
    } else {
      const encoder = pickEncoder(options.audioCodec, available, 'audio');
      if (!encoder) {
        throw new UnsupportedCodecError(
          `This build of ffmpeg cannot encode ${options.audioCodec}.`,
        );
      }
      args.push('-c:a', encoder);
    }

    if (options.audioBitrate) args.push('-b:a', options.audioBitrate);
    if (options.audioChannels) args.push('-ac', String(options.audioChannels));
    if (options.sampleRate) args.push('-ar', String(options.sampleRate));
  } else {
    const videoEncoder = pickEncoder(options.videoCodec, available, 'video');
    if (!videoEncoder) {
      throw new UnsupportedCodecError(
        `This build of ffmpeg cannot encode ${options.videoCodec}.`,
      );
    }
    args.push('-c:v', videoEncoder);

    /* x264 and x265 take -crf and -preset; the VP9 and AV1 encoders spell
       quality differently, and passing x264's flags to them is ignored at best. */
    if (videoEncoder === 'libx264' || videoEncoder === 'libx265') {
      if (options.crf !== undefined) args.push('-crf', String(options.crf));
      if (options.preset) args.push('-preset', options.preset);
    } else if (videoEncoder === 'libvpx-vp9') {
      if (options.crf !== undefined) args.push('-crf', String(options.crf), '-b:v', '0');
    } else if (videoEncoder.includes('av1')) {
      if (options.crf !== undefined) args.push('-crf', String(options.crf));
    }

    if (options.videoBitrate) args.push('-b:v', options.videoBitrate);
    if (options.frameRate) args.push('-r', String(options.frameRate));

    const filters: string[] = [];
    if (options.width || options.height) {
      /* -2 keeps the other side proportional and even, which every H.264
         profile requires — -1 can land on an odd number and fail the encode. */
      filters.push(`scale=${options.width ?? -2}:${options.height ?? -2}`);
    }
    if (options.rotate) {
      const map: Record<number, string> = { 90: 'transpose=1', 180: 'transpose=1,transpose=1', 270: 'transpose=2' };
      const filter = map[options.rotate];
      if (filter) filters.push(filter);
    }
    if (options.reverse) filters.push('reverse');
    if (filters.length) args.push('-vf', filters.join(','));

    if (options.container === 'gif') {
      /* GIF has no audio track and a 256-colour palette; without an explicit
         palette ffmpeg dithers against a fixed one and the result bands badly. */
      args.push('-an');
    } else {
      const audioEncoder = pickEncoder(options.audioCodec, available, 'audio');
      if (audioEncoder) {
        args.push('-c:a', audioEncoder);
        if (options.audioBitrate) args.push('-b:a', options.audioBitrate);
        if (options.audioChannels) args.push('-ac', String(options.audioChannels));
        if (options.sampleRate) args.push('-ar', String(options.sampleRate));
      } else {
        args.push('-an');
      }
    }
  }

  /* Moves the index to the front so a player can start before the download
     finishes. Meaningless for anything but MP4-family containers. */
  if (options.fastStart && (options.container === 'mp4' || options.container === 'mov' || options.container === 'm4a')) {
    args.push('-movflags', '+faststart');
  }

  args.push('-y', outputName);
  return args;
}

/**
 * The two commands that give a GIF a palette of its own.
 *
 * One pass counts the colours actually present, the second maps to them. It is
 * twice the work and it is the difference between a banded mess and something
 * worth posting.
 */
export function buildGifArgs(inputName: string, outputName: string, options: ConversionOptions): {
  palette: string[];
  render: string[];
} {
  const fps = options.frameRate ?? 12;
  const scale = options.width ? `scale=${options.width}:-2:flags=lanczos,` : '';

  return {
    palette: [
      '-hide_banner', '-nostdin',
      ...(options.startTime ? ['-ss', String(options.startTime)] : []),
      '-i', inputName,
      ...(options.duration ? ['-t', String(options.duration)] : []),
      '-vf', `fps=${fps},${scale}palettegen=stats_mode=diff`,
      '-y', 'palette.png',
    ],
    render: [
      '-hide_banner', '-nostdin',
      ...(options.startTime ? ['-ss', String(options.startTime)] : []),
      '-i', inputName,
      '-i', 'palette.png',
      ...(options.duration ? ['-t', String(options.duration)] : []),
      '-lavfi', `fps=${fps},${scale}paletteuse=dither=bayer:bayer_scale=3`,
      '-y', outputName,
    ],
  };
}
