/**
 * Media Studio — Codec Definitions
 *
 * Video and audio codec information for the Codec Explorer.
 */

import type { CodecInfo } from './types';

export const VIDEO_CODECS: Record<string, CodecInfo> = {
  h264: {
    id: 'h264',
    label: 'H.264 (AVC)',
    type: 'video',
    description: 'The most widely supported video codec. Used across all platforms, devices, and streaming services. The safe choice for maximum compatibility.',
    useCases: ['Web video', 'YouTube', 'Social media', 'Broadcast', 'Video conferencing'],
    pros: ['Universal compatibility', 'Hardware acceleration everywhere', 'Good quality/compression', 'Mature ecosystem'],
    cons: ['Not the most efficient', 'Older technology (2003)', 'Royalty-encumbered'],
    compatibility: 5,
    yearIntroduced: 2003,
    compressionEfficiency: 3,
  },
  h265: {
    id: 'h265',
    label: 'H.265 (HEVC)',
    type: 'video',
    description: 'Successor to H.264 with ~50% better compression. Used for 4K/8K video and modern streaming, but with licensing complexity.',
    useCases: ['4K/8K video', 'HEVC streaming', 'High-efficiency encoding', 'Modern devices'],
    pros: ['~50% better compression than H.264', '4K/8K support', 'Hardware acceleration on modern devices'],
    cons: ['Licensing/royalty complexity', 'Slower encoding', 'Limited older device support'],
    compatibility: 3,
    yearIntroduced: 2013,
    compressionEfficiency: 4,
  },
  av1: {
    id: 'av1',
    label: 'AV1',
    type: 'video',
    description: 'Modern royalty-free codec from the Alliance for Open Media. Best compression efficiency but requires more processing power.',
    useCases: ['Web streaming', 'YouTube', 'Netflix', 'Modern browsers'],
    pros: ['Royalty-free', 'Best compression efficiency', 'Open standard', 'Future-proof'],
    cons: ['Slow encoding', 'Limited hardware support', 'Not supported on older devices'],
    compatibility: 2,
    yearIntroduced: 2018,
    compressionEfficiency: 5,
  },
  vp9: {
    id: 'vp9',
    label: 'VP9',
    type: 'video',
    description: 'Google\'s open and royalty-free video codec. Standard for YouTube and WebM. Good balance of quality and performance.',
    useCases: ['YouTube', 'WebM', 'Chrome/Firefox optimization', 'Web streaming'],
    pros: ['Royalty-free', 'Good compression', 'Hardware support on modern devices', 'Mature'],
    cons: ['Not as efficient as AV1', 'Limited Apple support', 'Slower than H.264'],
    compatibility: 3,
    yearIntroduced: 2013,
    compressionEfficiency: 4,
  },
  mpeg4: {
    id: 'mpeg4',
    label: 'MPEG-4',
    type: 'video',
    description: 'Legacy video codec (DivX/Xvid). Used in early digital video and some older devices. Not recommended for new content.',
    useCases: ['Legacy content', 'Old devices', 'Backward compatibility'],
    pros: ['Wide legacy support', 'Simple encoding'],
    cons: ['Poor compression', 'Low quality', 'Very outdated', 'No hardware support'],
    compatibility: 1,
    yearIntroduced: 1998,
    compressionEfficiency: 1,
  },
};

export const AUDIO_CODECS: Record<string, CodecInfo> = {
  aac: {
    id: 'aac',
    label: 'AAC',
    type: 'audio',
    description: 'Advanced Audio Codec — the standard for YouTube, iPhone, and modern streaming. Superior to MP3 at the same bitrate.',
    useCases: ['Streaming', 'YouTube', 'Apple devices', 'Modern audio'],
    pros: ['Better quality than MP3 at same bitrate', 'Hardware accelerated', 'Widely supported'],
    cons: ['Slightly more complex to encode than MP3'],
    compatibility: 5,
    yearIntroduced: 1997,
    compressionEfficiency: 4,
  },
  mp3: {
    id: 'mp3',
    label: 'MP3',
    type: 'audio',
    description: 'The most widely compatible audio codec. Supported everywhere but showing its age compared to modern codecs.',
    useCases: ['Music', 'Podcasts', 'Universal playback', 'Portable devices'],
    pros: ['Universal support', 'All devices', 'Simple encoding'],
    cons: ['Lower quality at same bitrate', 'Older technology', 'No multichannel support'],
    compatibility: 5,
    yearIntroduced: 1993,
    compressionEfficiency: 3,
  },
  opus: {
    id: 'opus',
    label: 'Opus',
    type: 'audio',
    description: 'Modern royalty-free audio codec with excellent quality across all bitrates. The best choice for streaming and VoIP.',
    useCases: ['Streaming', 'VoIP', 'Gaming', 'Open source'],
    pros: ['Best quality at any bitrate', 'Royalty-free', 'Low latency', 'Wide bitrate range'],
    cons: ['Limited hardware support', 'Not mainstream on portable devices'],
    compatibility: 3,
    yearIntroduced: 2012,
    compressionEfficiency: 5,
  },
  flac: {
    id: 'flac',
    label: 'FLAC',
    type: 'audio',
    description: 'Free Lossless Audio Codec — compresses audio without losing any data. The gold standard for lossless audio.',
    useCases: ['Audiophile listening', 'Music archiving', 'Lossless distribution'],
    pros: ['Lossless quality', 'Free/open', 'Good compression (for lossless)', 'Metadata support'],
    cons: ['Large files', 'Limited portable device support'],
    compatibility: 3,
    yearIntroduced: 2001,
    compressionEfficiency: 2,
  },
  vorbis: {
    id: 'vorbis',
    label: 'Vorbis',
    type: 'audio',
    description: 'Free open-source audio codec, commonly used in OGG containers. Popular in gaming and open-source software.',
    useCases: ['Open source software', 'Gaming', 'OGG container'],
    pros: ['Free/open', 'Good quality', 'Mature'],
    cons: ['Limited device support', 'Not as efficient as Opus', 'No Apple support'],
    compatibility: 2,
    yearIntroduced: 2000,
    compressionEfficiency: 3,
  },
};

export const ALL_VIDEO_CODECS = Object.values(VIDEO_CODECS);
export const ALL_AUDIO_CODECS = Object.values(AUDIO_CODECS);
export const ALL_CODECS = [...ALL_VIDEO_CODECS, ...ALL_AUDIO_CODECS];

export function getVideoCodec(id: string): CodecInfo | undefined {
  return VIDEO_CODECS[id];
}

export function getAudioCodec(id: string): CodecInfo | undefined {
  return AUDIO_CODECS[id];
}
