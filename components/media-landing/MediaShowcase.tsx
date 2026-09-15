'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FileVideo, Globe, Link2, Music, type LucideIcon } from 'lucide-react';
import { MEDIA_SHOWCASE } from '@/lib/config/mediaLanding';
import { useTranslations } from '@/lib/i18n';
import { EASE } from '@/components/home/motion';

const ICONS: Record<string, LucideIcon> = { Link2, FileVideo, Music, Globe };

/** How long a pair stays up. */
const DWELL_MS = 2800;

/**
 * The hero's demonstration panel.
 *
 * A converter should open by showing a conversion. Each card is one real pair
 * — an input name, an output name, and the stamp that says what happened in
 * between. The first of the four is `index.m3u8 → recording.mp4` marked
 * `-c copy`, because that is the studio's one genuine advantage over a
 * server-side converter and it fits in six characters.
 *
 * At rest — before hydration, and whenever the visitor prefers reduced motion
 * — the first pair is already fully rendered. Nothing here waits on a timer to
 * become readable.
 *
 * Glass rather than card-coloured, and `hero-*` colours throughout, for the
 * same reason as the home page's panel: it sits on a night sky, where a solid
 * light surface reads as paper taped over the window.
 */
export default function MediaShowcase() {
  const { t } = useTranslations();
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % MEDIA_SHOWCASE.length), DWELL_MS);
    return () => clearInterval(id);
  }, [reduced]);

  const current = MEDIA_SHOWCASE[index];
  const Icon = ICONS[current.icon] ?? FileVideo;

  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-8 rounded-[2rem] bg-hero-action/[0.12] blur-3xl"
      />

      <div className="relative rounded-2xl border border-hero-rule bg-hero-panel p-5 shadow-floating backdrop-blur-md sm:p-6">
        <div className="flex items-center gap-2.5">
          <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-hero-action-soft text-hero-action">
            <Icon size={15} aria-hidden="true" />
          </span>
          {/* Names the kind of conversion in words. The badge below names the
              standard; putting both in one line made the header read as a
              caption about the panel rather than about the pair inside it. */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={current.id}
              initial={reduced ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -4 }}
              transition={{ duration: 0.2, ease: EASE }}
              className="font-heading text-[0.9375rem] font-semibold tracking-tight text-hero-ink"
            >
              {t(`productLanding.media.showcase.kinds.${current.id}`)}
            </motion.span>
          </AnimatePresence>
          <span className="ml-auto flex items-center gap-1.5 font-mono text-[0.6875rem] text-hero-muted">
            <span className="relative flex size-1.5">
              {!reduced && (
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-hero-brand opacity-60" />
              )}
              <span className="relative inline-flex size-1.5 rounded-full bg-hero-brand" />
            </span>
            {t('productLanding.media.showcase.label')}
          </span>
        </div>

        {/* Fixed height so the panel does not jump between pairs. */}
        <div className="mt-4 min-h-24 rounded-xl bg-hero-well px-4 py-3.5">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={current.id}
              initial={reduced ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: EASE }}
            >
              <code className="block font-mono text-sm break-all text-hero-muted sm:text-[0.9375rem]">
                {current.from}
              </code>
              <code className="mt-1.5 flex items-baseline gap-2 font-mono text-sm break-all text-hero-ink sm:text-base">
                <span aria-hidden="true" className="text-hero-action">
                  ↓
                </span>
                {current.to}
              </code>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-3.5 flex flex-wrap items-center gap-x-3 gap-y-2">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={current.id}
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduced ? undefined : { opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="rounded bg-hero-brand/15 px-1.5 py-0.5 font-mono text-[0.6875rem] text-hero-brand"
            >
              ✓ {current.badge}
            </motion.span>
          </AnimatePresence>
          <span className="text-[0.8125rem] text-hero-ink-soft">
            {t('productLanding.media.showcase.note')}
          </span>

          <span className="ml-auto flex shrink-0 items-center gap-1.5" aria-hidden="true">
            {MEDIA_SHOWCASE.map((item, i) => (
              <span
                key={item.id}
                className={
                  i === index
                    ? 'h-1 w-4 rounded-full bg-hero-action transition-all duration-300'
                    : 'size-1 rounded-full bg-hero-rule transition-all duration-300'
                }
              />
            ))}
          </span>
        </div>
      </div>
    </div>
  );
}
