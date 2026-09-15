/**
 * Media Studio landing — what the studio does, grouped by the job.
 *
 * Same split as `homeCatalogue`: the samples here are DATA, not copy.
 * `index.m3u8 → recording.mp4` reads the same in every language, and so does
 * `CRF 23`, so neither is translated. Titles and notes come from the i18n
 * files through the keys named below.
 *
 * The `note` on each entry is the honest one-line answer to "what happens to
 * my file", and it is the reason this registry exists rather than a prose
 * feature list: "streams copied, not re-encoded" is the studio's one real
 * advantage over a server-side converter, and it belongs next to the sample
 * that demonstrates it.
 */

export interface MediaCapability {
  /** Key into `productLanding.media.can.<id>.title`. */
  id: string;
  /** One real conversion, shown in monospace. Never translated. */
  sample: string;
  /** Key into `productLanding.media.can.<id>.note`, or absent for none. */
  hasNote?: boolean;
  /** Lucide icon name. */
  icon: string;
  /** SEO page this links to, without the locale prefix. */
  href: string;
}

export interface MediaCapabilityGroup {
  /** Keys into `productLanding.media.groups.<id>.title` / `.note`. */
  id: string;
  entries: MediaCapability[];
}

export const MEDIA_CAPABILITIES: MediaCapabilityGroup[] = [
  {
    id: 'convert',
    entries: [
      {
        id: 'hls',
        sample: 'index.m3u8 → recording.mp4',
        hasNote: true,
        icon: 'Link2',
        href: 'video-converter',
      },
      {
        id: 'container',
        sample: 'clip.mov → clip.mp4',
        hasNote: true,
        icon: 'FileVideo',
        href: 'video-converter',
      },
      {
        id: 'webm',
        sample: 'promo.mp4 → promo.webm',
        hasNote: true,
        icon: 'Globe',
        href: 'mp4-to-webm',
      },
    ],
  },
  {
    id: 'shrink',
    entries: [
      {
        id: 'compress',
        sample: '1.4 GB → 280 MB',
        hasNote: true,
        icon: 'Minimize2',
        href: 'video-compressor',
      },
      {
        id: 'platform',
        sample: '→ 1080×1920 · 30 fps',
        hasNote: true,
        icon: 'Smartphone',
        href: 'video-for-youtube',
      },
    ],
  },
  {
    id: 'extract',
    entries: [
      {
        id: 'audio',
        sample: 'talk.mp4 → talk.mp3',
        hasNote: true,
        icon: 'Music',
        href: 'extract-audio',
      },
      {
        id: 'gif',
        sample: '0:12–0:18 → loop.gif',
        hasNote: true,
        icon: 'Film',
        href: 'video-converter',
      },
    ],
  },
];

/** What the hero's panel cycles through: one pair per conversion kind. */
export interface MediaShowcaseItem {
  id: string;
  from: string;
  to: string;
  /** Key into `productLanding.media.showcase.<id>`. */
  icon: string;
  /** Shown in the green stamp. Never translated — it names a standard. */
  badge: string;
}

export const MEDIA_SHOWCASE: MediaShowcaseItem[] = [
  { id: 'hls', from: 'index.m3u8', to: 'recording.mp4', icon: 'Link2', badge: '-c copy' },
  { id: 'mov', from: 'clip.mov', to: 'clip.mp4', icon: 'FileVideo', badge: 'H.264 + AAC' },
  { id: 'audio', from: 'talk.mp4', to: 'talk.mp3', icon: 'Music', badge: '192 kbps' },
  { id: 'webm', from: 'promo.mp4', to: 'promo.webm', icon: 'Globe', badge: 'VP9 + Opus' },
];
