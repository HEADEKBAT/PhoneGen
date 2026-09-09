/**
 * Media Studio — Codec Guide
 *
 * Educational content for the Codec Explorer section.
 */

import type { CodecInfo } from './types';
import { VIDEO_CODECS, AUDIO_CODECS } from './codecs';

export interface CodecGuideEntry {
  codec: CodecInfo;
  fullName: string;
  howItWorks: string;
  whenToUse: string[];
  whenToAvoid: string[];
  alternatives: string[];
}

const VIDEO_GUIDE: Record<string, Omit<CodecGuideEntry, 'codec'>> = {
  h264: {
    fullName: 'H.264 / AVC (Advanced Video Coding)',
    howItWorks: 'H.264 uses block-based motion compensation and spatial prediction to compress video. It divides frames into macroblocks, predicts motion between frames, and efficiently encodes the differences. It supports multiple profiles from baseline (low-end) to high (broadcast quality).',
    whenToUse: ['When maximum compatibility is needed', 'For streaming to all devices', 'For YouTube and social media uploads', 'For video conferencing'],
    whenToAvoid: ['When maximum compression is needed for 4K+ content', 'When royalty-free is a requirement'],
    alternatives: ['h265', 'av1', 'vp9'],
  },
  h265: {
    fullName: 'H.265 / HEVC (High Efficiency Video Coding)',
    howItWorks: 'HEVC improves upon H.264 by using larger coding tree units (up to 64×64 vs 16×16), better intra-prediction, and improved motion compensation. This enables roughly 50% better compression at the same quality level.',
    whenToUse: ['For 4K and 8K content', 'When bandwidth is limited but quality matters', 'For modern device playback', 'For HEVC-compatible streaming'],
    whenToAvoid: ['When supporting older devices is required', 'When encoding speed is critical', 'In royalty-sensitive projects (check licensing)'],
    alternatives: ['av1', 'h264', 'vp9'],
  },
  av1: {
    fullName: 'AV1 (AOMedia Video 1)',
    howItWorks: 'AV1 uses advanced coding tools including recursive block partitioning, compound prediction modes, and warped motion compensation. Developed by the Alliance for Open Media, it achieves ~30% better compression than HEVC while being completely royalty-free.',
    whenToUse: ['For web streaming at lowest bandwidth', 'When future-proofing content', 'For royalty-free projects', 'For YouTube and Netflix encoding'],
    whenToAvoid: ['When real-time encoding is needed (very slow)', 'For legacy device support', 'For live streaming'],
    alternatives: ['vp9', 'h265', 'h264'],
  },
  vp9: {
    fullName: 'VP9',
    howItWorks: 'VP9 uses similar technologies to HEVC including larger block sizes and improved prediction modes. It was developed by Google as an open, royalty-free successor to VP8. VP9 is the standard codec for WebM and YouTube.',
    whenToUse: ['For YouTube uploads (recommended by YouTube)', 'For WebM format', 'For Chrome/Firefox optimization', 'For royalty-free projects'],
    whenToAvoid: ['When Apple/Safari compatibility is needed', 'When hardware encoding is required on older devices'],
    alternatives: ['av1', 'h265', 'h264'],
  },
};

const AUDIO_GUIDE: Record<string, Omit<CodecGuideEntry, 'codec'>> = {
  aac: {
    fullName: 'AAC (Advanced Audio Codec)',
    howItWorks: 'AAC uses Modified Discrete Cosine Transform (MDCT) with improved filter banks and better handling of transients compared to MP3. It achieves better sound quality at the same bitrate through more efficient perceptual coding.',
    whenToUse: ['For YouTube and streaming audio', 'For Apple ecosystem compatibility', 'When quality matters at moderate bitrates', 'For modern audio applications'],
    whenToAvoid: ['When maximum lossless quality is required', 'For extremely low-bitrate applications (use Opus)'],
    alternatives: ['opus', 'mp3', 'flac'],
  },
  mp3: {
    fullName: 'MP3 (MPEG Audio Layer 3)',
    howItWorks: 'MP3 uses perceptual coding to remove audio frequencies that humans are less likely to hear. It divides audio into frequency bands and quantizes them based on a psychoacoustic model. Despite its age, it remains the most compatible audio format.',
    whenToUse: ['For maximum device compatibility', 'For music distribution to general audience', 'For portable devices and car stereos'],
    whenToAvoid: ['When best quality at low bitrates is needed', 'For lossless archiving', 'For multi-channel audio'],
    alternatives: ['aac', 'opus', 'flac'],
  },
  opus: {
    fullName: 'Opus',
    howItWorks: 'Opus combines SILK (speech coding) and CELT (audio coding) technologies, dynamically switching between them based on content. It supports variable bitrate from 6 kbps to 510 kbps with excellent quality across the entire range.',
    whenToUse: ['For real-time communication (VoIP, conferencing)', 'For streaming at any bitrate', 'For open-source and royalty-free projects', 'For best quality at low bitrates'],
    whenToAvoid: ['When Apple/hardware device support is required', 'For compatibility with legacy media players'],
    alternatives: ['aac', 'mp3', 'vorbis'],
  },
  flac: {
    fullName: 'FLAC (Free Lossless Audio Codec)',
    howItWorks: 'FLAC uses linear prediction with Rice coding to losslessly compress PCM audio. When audio samples can be predicted accurately from previous samples, only the prediction error needs to be stored. This achieves 50-60% compression of CD audio without any loss.',
    whenToUse: ['For lossless music archival', 'For audiophile playback', 'For CD ripping and preservation'],
    whenToAvoid: ['For portable device playback (files too large)', 'For streaming over limited bandwidth'],
    alternatives: ['wav', 'aac', 'mp3'],
  },
};

export function getCodecGuide(): CodecGuideEntry[] {
  const result: CodecGuideEntry[] = [];

  for (const [id, guide] of Object.entries(VIDEO_GUIDE)) {
    const codec = VIDEO_CODECS[id];
    if (codec) result.push({ codec, ...guide });
  }

  for (const [id, guide] of Object.entries(AUDIO_GUIDE)) {
    const codec = AUDIO_CODECS[id];
    if (codec) result.push({ codec, ...guide });
  }

  return result;
}

export function getVideoCodecGuide(): CodecGuideEntry[] {
  return Object.entries(VIDEO_GUIDE).map(([id, guide]) => ({
    codec: VIDEO_CODECS[id]!,
    ...guide,
  }));
}

export function getAudioCodecGuide(): CodecGuideEntry[] {
  return Object.entries(AUDIO_GUIDE).map(([id, guide]) => ({
    codec: AUDIO_CODECS[id]!,
    ...guide,
  }));
}
