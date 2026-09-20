'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Contrast, Frame, Ruler, Stamp, type LucideIcon } from 'lucide-react';
import { useTranslations } from '@/lib/i18n';
import { REVEAL_VIEWPORT, revealCard, revealUp, stagger } from '@/components/home/motion';

const CHECKS: { id: string; icon: LucideIcon }[] = [
  { id: 'quietZone', icon: Frame },
  { id: 'inverted', icon: Contrast },
  { id: 'logo', icon: Stamp },
  { id: 'print', icon: Ruler },
];

/**
 * The four things the studio checks before it will hand over a file.
 *
 * This is the part of the product nobody else has. Every generator in the
 * field — and the field is large — gives you a PNG and finds out with you;
 * the one decoder anyone ships is a separate page you upload a finished image
 * to. Saying so plainly, with the specific failures named, is worth more than
 * another row of "fast, free, unlimited".
 */
export default function QRChecks() {
  const { t } = useTranslations();
  const reduced = useReducedMotion();

  return (
    <section className="border-y border-border bg-muted/20">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <motion.div
          variants={revealUp}
          initial={reduced ? false : 'hidden'}
          whileInView="shown"
          viewport={REVEAL_VIEWPORT}
          className="relative mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-border pb-2.5"
        >
          <h2 className="font-heading text-lg font-semibold tracking-tight text-foreground">
            {t('qrLanding.checks.title')}
          </h2>
          <p className="text-[0.8125rem] text-muted-foreground">{t('qrLanding.checks.note')}</p>
          <span
            aria-hidden="true"
            className="absolute -bottom-px left-0 h-0.5 w-9 rounded-full bg-action"
          />
        </motion.div>

        <motion.ul
          variants={stagger()}
          initial={reduced ? false : 'hidden'}
          whileInView="shown"
          viewport={REVEAL_VIEWPORT}
          className="grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2"
        >
          {CHECKS.map(({ id, icon: Icon }) => (
            <motion.li
              key={id}
              variants={revealCard}
              className="list-none rounded-xl border border-border bg-card p-4 shadow-card"
            >
              <div className="flex items-center gap-2.5">
                <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-action-soft text-action">
                  <Icon size={15} aria-hidden="true" />
                </span>
                <h3 className="font-heading text-[0.9375rem] font-semibold tracking-tight text-foreground">
                  {t(`qrLanding.checks.${id}.title`)}
                </h3>
              </div>
              <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted-foreground">
                {t(`qrLanding.checks.${id}.desc`)}
              </p>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
