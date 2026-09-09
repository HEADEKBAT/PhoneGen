/**
 * Media Studio — Smart Recommendations Engine
 *
 * Based on video analysis, suggests the best conversion actions.
 */

import type { Recommendation, VideoAnalysis, ConversionAction } from './types';

const RECOMMENDATION_TEMPLATES: Record<ConversionAction, Omit<Recommendation, 'priority'>> = {
  compress: {
    action: 'compress',
    label: 'Compress Video',
    description: 'Reduce file size while maintaining quality',
    icon: 'FileDown',
    container: 'mp4',
    videoCodec: 'h264',
    audioCodec: 'aac',
  },
  web: {
    action: 'web',
    label: 'Convert for Web',
    description: 'Optimize for fast web loading',
    icon: 'Globe',
    container: 'webm',
    videoCodec: 'vp9',
    audioCodec: 'opus',
  },
  mobile: {
    action: 'mobile',
    label: 'Convert for Mobile',
    description: 'Optimize for mobile playback',
    icon: 'Smartphone',
    container: 'mp4',
    videoCodec: 'h264',
    audioCodec: 'aac',
  },
  youtube: {
    action: 'youtube',
    label: 'Convert for YouTube',
    description: 'Best format for YouTube uploads',
    icon: 'Play',
    container: 'mp4',
    videoCodec: 'h264',
    audioCodec: 'aac',
  },
  tiktok: {
    action: 'tiktok',
    label: 'Convert for TikTok',
    description: 'Vertical video for TikTok',
    icon: 'Music',
    container: 'mp4',
    videoCodec: 'h264',
    audioCodec: 'aac',
  },
  instagram: {
    action: 'instagram',
    label: 'Convert for Instagram',
    description: 'Optimized for Instagram feed/stories',
    icon: 'Camera',
    container: 'mp4',
    videoCodec: 'h264',
    audioCodec: 'aac',
  },
  telegram: {
    action: 'telegram',
    label: 'Convert for Telegram',
    description: 'Compressed for Telegram sharing',
    icon: 'Send',
    container: 'mp4',
    videoCodec: 'h264',
    audioCodec: 'aac',
  },
  discord: {
    action: 'discord',
    label: 'Convert for Discord',
    description: 'Fits Discord file size limits',
    icon: 'MessageSquare',
    container: 'mp4',
    videoCodec: 'h264',
    audioCodec: 'aac',
  },
  whatsapp: {
    action: 'whatsapp',
    label: 'Convert for WhatsApp',
    description: 'Small file for WhatsApp sharing',
    icon: 'Phone',
    container: 'mp4',
    videoCodec: 'h264',
    audioCodec: 'aac',
  },
  obs: {
    action: 'obs',
    label: 'Convert for OBS',
    description: 'High quality recording preset',
    icon: 'Monitor',
    container: 'mp4',
    videoCodec: 'h264',
    audioCodec: 'aac',
  },
  premiere: {
    action: 'premiere',
    label: 'Convert for Premiere',
    description: 'Editing-ready for Adobe Premiere',
    icon: 'Film',
    container: 'mov',
    videoCodec: 'h264',
    audioCodec: 'aac',
  },
  davinci: {
    action: 'davinci',
    label: 'Convert for DaVinci',
    description: 'Optimized for DaVinci Resolve',
    icon: 'Clapperboard',
    container: 'mov',
    videoCodec: 'h264',
    audioCodec: 'aac',
  },
  'extract-audio': {
    action: 'extract-audio',
    label: 'Extract Audio',
    description: 'Extract audio track as MP3',
    icon: 'Headphones',
    container: 'mp3',
    videoCodec: 'h264',
    audioCodec: 'mp3',
  },
  'create-gif': {
    action: 'create-gif',
    label: 'Create GIF',
    description: 'Convert short clip to animated GIF',
    icon: 'Image',
    container: 'gif',
    videoCodec: 'h264',
    audioCodec: 'aac',
  },
  'generate-thumbnail': {
    action: 'generate-thumbnail',
    label: 'Generate Thumbnail',
    description: 'Extract a frame as thumbnail image',
    icon: 'ImagePlus',
    container: 'mp4',
    videoCodec: 'h264',
    audioCodec: 'aac',
  },
};

export function getRecommendations(analysis: VideoAnalysis): Recommendation[] {
  const recs: (Recommendation & { priority: number })[] = [];
  const { fileSize, duration, width, height, container } = analysis;

  // Always suggest compress for files over 50MB
  if (fileSize > 50 * 1024 * 1024) {
    recs.push({ ...RECOMMENDATION_TEMPLATES.compress, priority: 1 });
  }

  // Suggest web conversion for non-web formats
  if (container && !['mp4', 'webm'].includes(container)) {
    recs.push({ ...RECOMMENDATION_TEMPLATES.web, priority: 2 });
  }

  // Suggest mobile for high-res video
  if (width > 1920 || height > 1080) {
    recs.push({ ...RECOMMENDATION_TEMPLATES.mobile, priority: 3 });
  }

  // Always offer platform presets
  recs.push(
    { ...RECOMMENDATION_TEMPLATES.youtube, priority: 4 },
    { ...RECOMMENDATION_TEMPLATES.tiktok, priority: 5 },
    { ...RECOMMENDATION_TEMPLATES.instagram, priority: 6 },
    { ...RECOMMENDATION_TEMPLATES.telegram, priority: 7 },
    { ...RECOMMENDATION_TEMPLATES.discord, priority: 8 },
    { ...RECOMMENDATION_TEMPLATES.whatsapp, priority: 9 },
  );

  // Suggest extract audio for short clips
  if (duration < 600 && fileSize < 100 * 1024 * 1024) {
    recs.push({ ...RECOMMENDATION_TEMPLATES['extract-audio'], priority: 10 });
  }

  // Suggest GIF for very short clips
  if (duration < 10) {
    recs.push({ ...RECOMMENDATION_TEMPLATES['create-gif'], priority: 11 });
  }

  // Suggest editing presets for professional formats
  if (container === 'mov' || container === 'avi') {
    recs.push(
      { ...RECOMMENDATION_TEMPLATES.premiere, priority: 12 },
      { ...RECOMMENDATION_TEMPLATES.davinci, priority: 13 },
    );
  }

  return recs.sort((a, b) => a.priority - b.priority);
}

export function getQuickActions(): Recommendation[] {
  return [
    { ...RECOMMENDATION_TEMPLATES.compress, priority: 1 },
    { ...RECOMMENDATION_TEMPLATES.web, priority: 2 },
    { ...RECOMMENDATION_TEMPLATES.mobile, priority: 3 },
    { ...RECOMMENDATION_TEMPLATES['extract-audio'], priority: 4 },
    { ...RECOMMENDATION_TEMPLATES['create-gif'], priority: 5 },
  ].sort((a, b) => a.priority - b.priority);
}
