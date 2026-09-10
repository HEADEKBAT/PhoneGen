/**
 * Media Studio — Route configuration for sitemap & SEO.
 *
 * Each entry corresponds to a dedicated SEO page at /media-studio/{slug}.
 * Adding a new tool means adding one entry here — no other changes needed.
 */

export interface MediaRouteEntry {
  slug: string;
}

/**
 * NOTE — emptied deliberately.
 *
 * These slugs were listed before their pages were written, so app/sitemap.ts
 * advertised 19 URLs per locale that answer 404. A sitemap full of missing
 * pages is a quality signal against the whole site, and Search Console reports
 * every one of them.
 *
 * Unlike the SEO landing pages, these entries carry no content — just a slug —
 * so there is nothing to generate a page from. Restore an entry at the same
 * time as its app/[locale]/media-studio/{{slug}}/page.tsx, not before;
 * `node scripts/seo/sitemap.check.mjs` now fails when a listed slug has no page.
 *
 * The previous list is preserved below, commented out, so the intended tool
 * set is not lost.
 */
export const MEDIA_TOOL_ROUTES: MediaRouteEntry[] = [
  // { slug: 'video-converter' },
  // { slug: 'video-compressor' },
  // { slug: 'video-resizer' },
  // { slug: 'video-trimmer' },
  // { slug: 'video-cropper' },
  // { slug: 'video-rotator' },
  // { slug: 'extract-audio' },
  // { slug: 'mp4-to-webm' },
  // { slug: 'mp4-to-mov' },
  // { slug: 'mov-to-mp4' },
  // { slug: 'avi-to-mp4' },
  // { slug: 'mkv-to-mp4' },
  // { slug: 'mp4-to-gif' },
  // { slug: 'gif-to-mp4' },
  // { slug: 'video-for-youtube' },
  // { slug: 'video-for-instagram' },
  // { slug: 'video-for-tiktok' },
  // { slug: 'video-for-discord' },
  // { slug: 'video-for-telegram' },
];
