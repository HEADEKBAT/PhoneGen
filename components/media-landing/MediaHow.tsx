'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useTranslations } from '@/lib/i18n';
import { REVEAL_VIEWPORT, revealCard, revealUp, stagger } from '@/components/home/motion';

const STEPS = ['s1', 's2', 's3'] as const;

/**
 * Three steps, numbered because they are genuinely ordered.
 *
 * The numbering earns its place here — you cannot pick an output before there
 * is a source to read, and the studio only offers codecs after the engine has
 * said which ones it has. Elsewhere on the site a numbered list would be
 * decoration; this one encodes a real dependency.
 *
 * It exists at all because the page now has two ways in. When the only input
 * was a file, "drop it here" was the whole explanation; with links in the mix,
 * what happens to an m3u8 is the question a visitor actually arrives with.
 */
export default function MediaHow() {
  const { t } = useTranslations();
  const reduced = useReducedMotion();

  return (
    <section className="border-y border-border bg-muted/20">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <motion.h2
          variants={revealUp}
          initial={reduced ? false : 'hidden'}
          whileInView="shown"
          viewport={REVEAL_VIEWPORT}
          className="font-heading text-lg font-semibold tracking-tight text-foreground"
        >
          {t('productLanding.media.howTitle')}
        </motion.h2>

        <motion.ol
          variants={stagger(0.08)}
          initial={reduced ? false : 'hidden'}
          whileInView="shown"
          viewport={REVEAL_VIEWPORT}
          className="mt-6 grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-3 sm:gap-5"
        >
          {STEPS.map((step, index) => (
            <motion.li key={step} variants={revealCard} className="list-none">
              <div className="flex items-baseline gap-2.5">
                <span className="font-mono text-[0.8125rem] text-action" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="font-heading text-[0.9375rem] font-semibold tracking-tight text-foreground">
                  {t(`productLanding.media.how.${step}.title`)}
                </h3>
              </div>
              <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted-foreground">
                {t(`productLanding.media.how.${step}.body`)}
              </p>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}
