'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowDown, ArrowRight } from 'lucide-react';
import Starfield from '@/components/background/Starfield';
import { useTranslations } from '@/lib/i18n';
import { EASE } from '@/components/home/motion';
import MediaShowcase from './MediaShowcase';

/**
 * Hero for the Media Studio landing.
 *
 * It used to be the generic `ProductHero`: a centred badge, three pulsing
 * rings and a sentence, identical on twenty-three product pages. That shape
 * describes a product; it never shows one, and for a converter the thing worth
 * showing is a conversion.
 *
 * The night sky is the home page's, deliberately — this page and the home page
 * are the same site, and the studio had been drifting into looking like a
 * separate product. Like the home page's hero it commits to dark in both
 * themes and uses the `hero-*` tokens for everything inside, because
 * `text-foreground` on a night sky is near-black on near-black.
 */
export default function MediaHero() {
  const { locale } = useParams<{ locale: string }>() ?? { locale: 'en' };
  const { t } = useTranslations();
  const reduced = useReducedMotion();

  const rise = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 12 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.45, delay, ease: EASE },
        };

  const facts = ['formats', 'hls', 'inBrowser', 'noAccount'] as const;

  return (
    <section className="relative isolate overflow-hidden bg-hero-ground">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-48 left-[18%] size-[38rem] rounded-full bg-hero-action/[0.10] blur-[130px]" />
        <div className="absolute -bottom-56 right-[14%] size-[32rem] rounded-full bg-hero-brand/[0.07] blur-[140px]" />

        <Starfield className="absolute inset-0 size-full" />

        <div className="absolute -bottom-[30rem] left-1/2 h-[36rem] w-[120rem] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,138,61,0.16),rgba(62,207,142,0.06)_38%,transparent_68%)]" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-background to-transparent" />
      </div>

      <div className="relative mx-auto grid max-w-5xl grid-cols-1 items-center gap-10 px-4 pt-16 pb-14 sm:px-6 sm:pt-20 sm:pb-18 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-14 lg:pt-24 lg:pb-24">
        <div>
          <motion.p
            {...rise(0)}
            className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs text-hero-muted sm:text-[0.8125rem]"
          >
            {facts.map((fact, index) => (
              <span key={fact} className="flex items-center gap-x-4">
                {index > 0 && (
                  <span aria-hidden="true" className="size-[3px] rounded-full bg-hero-rule" />
                )}
                <span className={index === 1 ? 'text-hero-action' : undefined}>
                  {t(`productLanding.media.eyebrow.${fact}`)}
                </span>
              </span>
            ))}
          </motion.p>

          <motion.h1
            {...rise(0.06)}
            className="mt-5 max-w-[16ch] font-heading text-4xl font-bold leading-[1.08] tracking-tight text-hero-ink sm:text-5xl lg:text-[3.5rem]"
          >
            {t('productLanding.media.title')}
          </motion.h1>

          <motion.p
            {...rise(0.12)}
            className="mt-5 max-w-[54ch] text-base leading-relaxed text-hero-ink-soft sm:text-lg"
          >
            {t('productLanding.media.lede')}
          </motion.p>

          <motion.div {...rise(0.18)} className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href={`/${locale}/media-studio/tool`}
              className="group inline-flex items-center gap-2 rounded-xl bg-hero-action px-5 py-3 text-[0.8125rem] font-semibold text-hero-action-foreground shadow-card transition-[filter,transform] duration-200 hover:brightness-105 active:scale-[0.98]"
            >
              {t('productLanding.media.cta.primary')}
              <ArrowRight
                size={15}
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </Link>
            <a
              href="#can"
              className="group inline-flex items-center gap-2 rounded-xl border border-hero-rule bg-hero-panel px-5 py-3 text-[0.8125rem] font-medium text-hero-ink backdrop-blur-sm transition-colors duration-200 hover:border-hero-action/50 hover:text-hero-action"
            >
              {t('productLanding.media.cta.secondary')}
              <ArrowDown
                size={15}
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:translate-y-0.5"
              />
            </a>
          </motion.div>
        </div>

        <motion.div {...rise(0.24)}>
          <MediaShowcase />
        </motion.div>
      </div>
    </section>
  );
}
