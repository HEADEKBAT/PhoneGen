/**
 * Media Studio — SEO Landing Pages Config.
 *
 * Follows the same pattern as cryptoSEOPages.ts and paymentSEOPages.ts.
 */

export interface SEOFaq {
  q: string;
  a: string;
}

export interface MediaSEOPageConfig {
  id: string;
  slug: string;
  title: string;
  description: string;
  heroTitle: string;
  heroSubtitle: string;
  ctaLabel?: string;
  faqs: SEOFaq[];
}

/* ── Shared FAQ pools ───────────────────────────────────────────── */

const VIDEO_FAQS: SEOFaq[] = [
  { q: 'Is this video converter free?', a: 'Yes, completely free. All video conversion happens in your browser using FFmpeg.wasm. There are no limits, watermarks, or hidden charges.' },
  { q: 'Are my videos uploaded to a server?', a: 'No. All processing happens entirely in your browser. Your files never leave your device. This ensures complete privacy and security.' },
  { q: 'What is the maximum file size?', a: 'The maximum file size is 500 MB. This is limited by browser memory and FFmpeg.wasm constraints.' },
  { q: 'What formats are supported?', a: 'We support MP4, MOV, AVI, MKV, WEBM, GIF for video, and MP3, WAV, OGG, AAC, M4A, FLAC for audio.' },
];

const COMPRESS_FAQS: SEOFaq[] = [
  { q: 'How much can I compress a video?', a: 'Compression depends on the source format and codec. Typically, you can reduce file size by 50-80% using H.264/H.265 with minimal quality loss.' },
  { q: 'What is the best compression format?', a: 'For maximum compression, use HEVC (H.265) or AV1. For the best balance of compatibility and compression, use H.264 in MP4 container.' },
  { q: 'Will compression reduce quality?', a: 'With proper settings (CRF 18-23), quality loss is barely noticeable. Higher compression (CRF 24+) will reduce quality more noticeably.' },
];

const MP4_WEBM_FAQS: SEOFaq[] = [
  { q: 'What is the difference between MP4 and WEBM?', a: 'MP4 is more universally compatible, while WEBM offers better compression and supports transparency. WEBM uses royalty-free codecs (VP9/AV1).' },
  { q: 'Which is better for web: MP4 or WEBM?', a: 'For maximum compatibility, use MP4 with H.264. For better compression and modern browsers, use WEBM with VP9. Many sites use both with a fallback.' },
  { q: 'Does WEBM support transparency?', a: 'Yes, WEBM supports alpha channel transparency, making it ideal for overlays and graphics with transparent backgrounds.' },
];

const EXTRACT_AUDIO_FAQS: SEOFaq[] = [
  { q: 'How do I extract audio from a video?', a: 'Upload your video, select "Extract Audio" from recommendations, choose your preferred audio format (MP3, AAC, WAV, FLAC, OGG), and convert.' },
  { q: 'What is the best audio format for extraction?', a: 'MP3 for maximum compatibility, AAC for better quality at the same bitrate, FLAC for lossless audio, and Opus for the best compression/quality ratio.' },
  { q: 'Can I extract audio without quality loss?', a: 'Yes, use FLAC format for lossless audio extraction. The file will be larger, but the audio quality will be identical to the source.' },
];

const PLATFORM_FAQS: SEOFaq[] = [
  { q: 'What video format does YouTube recommend?', a: 'YouTube recommends H.264 video with AAC audio in an MP4 container. Optimal settings: 1080p at 30fps with a bitrate of 8-12 Mbps.' },
  { q: 'What format works best for Instagram?', a: 'Instagram supports MP4 with H.264 video and AAC audio. Recommended resolution is 1080×1080 for feed posts and 1080×1920 for Stories.' },
  { q: 'What format should I use for TikTok?', a: 'TikTok works best with MP4 format, H.264 codec, vertical 9:16 aspect ratio (1080×1920), and 30fps frame rate.' },
];

/* ── SEO Pages ─────────────────────────────────────────────────── */

const VIDEO_CONVERTER_PAGE: MediaSEOPageConfig = {
  id: 'video-converter',
  slug: 'video-converter',
  title: 'Free Online Video Converter — Convert Video to MP4, MOV, AVI, WEBM & More',
  description: 'Convert videos online for free. Supports MP4, MOV, AVI, MKV, WEBM, GIF, MP3, and more. 100% browser-based, no uploads, no limits.',
  heroTitle: 'Free Online Video Converter',
  heroSubtitle: 'Convert any video to any format. Fast, private, and free — all in your browser.',
  ctaLabel: 'Convert Video',
  faqs: VIDEO_FAQS,
};

const COMPRESSOR_PAGE: MediaSEOPageConfig = {
  id: 'video-compressor',
  slug: 'video-compressor',
  title: 'Free Online Video Compressor — Reduce Video File Size',
  description: 'Compress videos online for free. Reduce file size by up to 80% without noticeable quality loss. Supports MP4, MOV, AVI, and more.',
  heroTitle: 'Free Online Video Compressor',
  heroSubtitle: 'Reduce video file size up to 80%. No quality loss. No uploads.',
  ctaLabel: 'Compress Video',
  faqs: COMPRESS_FAQS,
};

const MP4_WEBM_PAGE: MediaSEOPageConfig = {
  id: 'mp4-to-webm',
  slug: 'mp4-to-webm',
  title: 'Convert MP4 to WEBM — Free Online Video Converter',
  description: 'Convert MP4 to WEBM online for free. Supports VP9 and Opus codecs for optimal web delivery. No uploads, no signup.',
  heroTitle: 'Convert MP4 to WEBM Online Free',
  heroSubtitle: 'Convert your MP4 videos to WEBM format for optimal web playback.',
  ctaLabel: 'Convert MP4 to WEBM',
  faqs: MP4_WEBM_FAQS,
};

const EXTRACT_AUDIO_PAGE: MediaSEOPageConfig = {
  id: 'extract-audio',
  slug: 'extract-audio',
  title: 'Extract Audio from Video — Free Online Audio Extractor',
  description: 'Extract audio from video files online for free. Convert to MP3, AAC, WAV, FLAC, or OGG. No uploads, browser-based processing.',
  heroTitle: 'Free Online Audio Extractor',
  heroSubtitle: 'Extract audio from any video. MP3, AAC, WAV, FLAC, OGG — your choice.',
  ctaLabel: 'Extract Audio',
  faqs: EXTRACT_AUDIO_FAQS,
};

const PLATFORM_YOUTUBE_PAGE: MediaSEOPageConfig = {
  id: 'video-for-youtube',
  slug: 'video-for-youtube',
  title: 'Convert Video for YouTube — Best YouTube Upload Format',
  description: 'Convert your videos to the optimal format for YouTube uploads. H.264 video, AAC audio, MP4 container. Free online converter.',
  heroTitle: 'Convert Video for YouTube',
  heroSubtitle: 'Optimize your videos for YouTube uploads. Best format, right settings.',
  ctaLabel: 'Convert for YouTube',
  faqs: PLATFORM_FAQS,
};

/* ── Registry ───────────────────────────────────────────────────── */

export const MEDIA_SEO_PAGES: MediaSEOPageConfig[] = [
  VIDEO_CONVERTER_PAGE,
  COMPRESSOR_PAGE,
  MP4_WEBM_PAGE,
  EXTRACT_AUDIO_PAGE,
  PLATFORM_YOUTUBE_PAGE,
];

export const ALL_MEDIA_SEO_PAGES = MEDIA_SEO_PAGES;
