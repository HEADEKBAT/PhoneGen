/**
 * Media Studio — Route configuration for sitemap & SEO.
 *
 * Each entry corresponds to a dedicated SEO page at /media-studio/{slug}.
 * Adding a new tool means adding one entry here — no other changes needed.
 */

export interface MediaRouteEntry {
  slug: string;
}

export const MEDIA_TOOL_ROUTES: MediaRouteEntry[] = [
  { slug: 'video-converter' },
  { slug: 'video-compressor' },
  { slug: 'video-resizer' },
  { slug: 'video-trimmer' },
  { slug: 'video-cropper' },
  { slug: 'video-rotator' },
  { slug: 'extract-audio' },
  { slug: 'mp4-to-webm' },
  { slug: 'mp4-to-mov' },
  { slug: 'mov-to-mp4' },
  { slug: 'avi-to-mp4' },
  { slug: 'mkv-to-mp4' },
  { slug: 'mp4-to-gif' },
  { slug: 'gif-to-mp4' },
  { slug: 'video-for-youtube' },
  { slug: 'video-for-instagram' },
  { slug: 'video-for-tiktok' },
  { slug: 'video-for-discord' },
  { slug: 'video-for-telegram' },
];
