'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useTranslations } from '@/lib/i18n';
import { REVEAL_VIEWPORT, revealCard, stagger } from './motion';

/**
 * Three claims, each with the technical detail that backs it.
 *
 * This replaces a grid of six audiences with three bullet points apiece —
 * eighteen lines of "Generate realistic test data in seconds" that said the
 * same thing six times. The mono line above each heading names the standard
 * or the mechanism, which is the part a developer actually weighs.
 */
const ITEMS = ['local', 'valid', 'formats'] as const;

export default function TrustSection() {
  const { t } = useTranslations();
  const reduced = useReducedMotion();

  return (
    <section id="why" className="border-t border-border">
      <motion.div
        variants={stagger(0.08)}
        initial={reduced ? false : 'hidden'}
        whileInView="shown"
        viewport={REVEAL_VIEWPORT}
        className="mx-auto grid max-w-5xl grid-cols-1 gap-x-10 gap-y-8 px-4 py-16 sm:grid-cols-3 sm:px-6 sm:py-20"
      >
        {ITEMS.map((item) => (
          <motion.div key={item} variants={revealCard}>
            <p className="font-mono text-[0.8125rem] text-primary">
              {t(`platformHome.trust.${item}.k`)}
            </p>
            <h3 className="mt-2 font-heading text-[0.9375rem] font-semibold tracking-tight text-foreground">
              {t(`platformHome.trust.${item}.title`)}
            </h3>
            <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-muted-foreground">
              {t(`platformHome.trust.${item}.body`)}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
