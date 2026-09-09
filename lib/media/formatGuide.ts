/**
 * Media Studio — Format Guide
 *
 * Educational content for the Format Guide section.
 */

import type { FormatInfo } from './types';
import { FORMATS } from './formats';

export interface FormatGuideEntry {
  format: FormatInfo;
  detailedDescription: string;
  bestUseCase: string;
  typicalBitrate: string;
  fileSizeExample: string;
  recommendations: string[];
  relatedFormats: string[];
}

const GUIDE_EXTRA: Record<string, Omit<FormatGuideEntry, 'format'>> = {
  mp4: {
    detailedDescription: 'MP4 (MPEG-4 Part 14) is the most widely used video format in the world. Based on the QuickTime file format, it supports video, audio, and subtitle tracks. It is the standard format for YouTube, streaming services, mobile devices, and most video editing software.',
    bestUseCase: 'Universal sharing, web embedding, YouTube uploads, and mobile playback.',
    typicalBitrate: '3-8 Mbps for 1080p',
    fileSizeExample: '~100 MB for a 3-minute 1080p video at 4 Mbps',
    recommendations: ['Use MP4 as your default format for maximum compatibility', 'H.264 codec is safest, H.265 is more efficient', 'Add fast start (moov atom) for streaming optimization'],
    relatedFormats: ['mov', 'm4a'],
  },
  mov: {
    detailedDescription: 'MOV (QuickTime File Format) is Apple\'s multimedia container format. It supports multiple tracks of video, audio, text, and effects. Widely used in professional video production and post-production workflows.',
    bestUseCase: 'Video editing, Apple ecosystem, professional production pipelines.',
    typicalBitrate: '10-50 Mbps for 1080p (editing quality)',
    fileSizeExample: '~500 MB for a 3-minute 1080p video at 20 Mbps',
    recommendations: ['Use for video editing workflows', 'Great for ProRes or DNxHD intermediates', 'Not ideal for web delivery without conversion'],
    relatedFormats: ['mp4', 'avi'],
  },
  webm: {
    detailedDescription: 'WebM is an open, royalty-free media format designed for the web. Developed by Google, it uses VP8/VP9 or AV1 video codecs with Vorbis or Opus audio. It supports transparency (alpha channel) for advanced web effects.',
    bestUseCase: 'Web video, transparent overlays, Chrome/Firefox optimization.',
    typicalBitrate: '2-6 Mbps for 1080p VP9',
    fileSizeExample: '~60 MB for a 3-minute 1080p VP9 video',
    recommendations: ['Best for web delivery with VP9 or AV1', 'Supports alpha channel for transparent video', 'Not supported on Safari/iOS — use MP4 as fallback'],
    relatedFormats: ['mp4', 'gif'],
  },
  avi: {
    detailedDescription: 'AVI (Audio Video Interleave) is a legacy multimedia container format introduced by Microsoft in 1992. It stores audio and video data in a simple interleaved structure. While outdated, some legacy systems still require this format.',
    bestUseCase: 'Legacy system compatibility, Windows-based archival.',
    typicalBitrate: 'Varies widely — often uncompressed or minimally compressed',
    fileSizeExample: '~1.5 GB for a 3-minute uncompressed 1080p video',
    recommendations: ['Use only for legacy compatibility', 'Convert to MP4 for modern use', 'Consider MKV for high-quality archiving instead'],
    relatedFormats: ['mkv', 'mp4'],
  },
  mkv: {
    detailedDescription: 'MKV (Matroska Video) is an open-standard container that can hold an unlimited number of video, audio, subtitle, and chapter tracks. It is the preferred format for high-quality video archiving and multi-language content.',
    bestUseCase: 'High-quality archiving, multi-audio tracks, subtitle storage.',
    typicalBitrate: 'Same as video codec used — no overhead limitation',
    fileSizeExample: '~200 MB for a 3-minute 1080p video at 8 Mbps',
    recommendations: ['Best for local archives and backups', 'Ideal for content with multiple languages', 'Convert to MP4 for streaming or sharing'],
    relatedFormats: ['mp4', 'avi', 'webm'],
  },
  gif: {
    detailedDescription: 'GIF (Graphics Interchange Format) is a bitmap image format that supports animation with up to 256 colors per frame. Despite severe color limitations, it remains the most widely supported format for simple animations on the web.',
    bestUseCase: 'Simple looped animations, memes, reaction clips without audio.',
    typicalBitrate: 'N/A — measured by frame size and palette',
    fileSizeExample: '~5 MB for a 10-second 480p animated GIF',
    recommendations: ['Use for simple animations without audio', 'Consider WebM or MP4 for better quality animations', 'Keep clips under 15 seconds for reasonable file sizes'],
    relatedFormats: ['webm', 'mp4'],
  },
  mp3: {
    detailedDescription: 'MP3 (MPEG-1 Audio Layer 3) is the most widely compatible audio format. Developed in the 1990s, it revolutionized digital music by enabling compressed audio with reasonable quality. Supported by every device and platform.',
    bestUseCase: 'Music distribution, podcasts, universal audio playback.',
    typicalBitrate: '128-320 kbps',
    fileSizeExample: '~7 MB for a 3-minute song at 320 kbps',
    recommendations: ['Use 320 kbps for high quality', 'Use 128 kbps for speech/podcasts', 'Consider AAC for better quality at same bitrate'],
    relatedFormats: ['aac', 'm4a', 'wav'],
  },
  wav: {
    detailedDescription: 'WAV (Waveform Audio File Format) is the standard uncompressed audio format on Windows. It stores raw PCM audio data without compression, providing the highest possible audio quality at the cost of large file sizes.',
    bestUseCase: 'Professional audio editing, mastering, lossless archival.',
    typicalBitrate: '1411 kbps (16-bit, 44.1 kHz stereo)',
    fileSizeExample: '~30 MB for a 3-minute song at CD quality',
    recommendations: ['Use for audio editing and mastering', 'Convert to lossy formats for distribution', 'FLAC is a better choice for lossless compression'],
    relatedFormats: ['flac', 'mp3', 'aac'],
  },
  aac: {
    detailedDescription: 'AAC (Advanced Audio Codec) is the successor to MP3, offering better sound quality at the same bitrate. It is the standard audio format for YouTube, iPhone, and most modern streaming services.',
    bestUseCase: 'Streaming, YouTube, Apple devices, high-quality audio at efficient bitrates.',
    typicalBitrate: '128-320 kbps',
    fileSizeExample: '~5 MB for a 3-minute song at 256 kbps',
    recommendations: ['Preferred over MP3 for better quality', '128 kbps for good quality, 256+ for high quality', 'Standard for YouTube and modern streaming'],
    relatedFormats: ['mp3', 'm4a', 'opus'],
  },
  flac: {
    detailedDescription: 'FLAC (Free Lossless Audio Codec) compresses audio without losing any information. It typically achieves 50-60% compression of CD audio while being completely lossless. The gold standard for digital music archiving.',
    bestUseCase: 'Lossless music archiving, audiophile listening, CD ripping.',
    typicalBitrate: '~800 kbps (compressed from 1411 kbps CD audio)',
    fileSizeExample: '~15 MB for a 3-minute song (vs 30 MB WAV)',
    recommendations: ['Best for lossless music archival', 'Compatible with most modern players', 'Convert to MP3/AAC for portable devices'],
    relatedFormats: ['wav', 'mp3', 'aac'],
  },
};

export function getFormatGuide(): FormatGuideEntry[] {
  return Object.keys(GUIDE_EXTRA).map((key) => ({
    format: FORMATS[key]!,
    ...GUIDE_EXTRA[key],
  }));
}

export function getFormatGuideEntry(id: string): FormatGuideEntry | undefined {
  if (!GUIDE_EXTRA[id] || !FORMATS[id]) return undefined;
  return { format: FORMATS[id]!, ...GUIDE_EXTRA[id] };
}
