'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowDown, ArrowRight } from 'lucide-react';
import Starfield from '@/components/background/Starfield';
import { useTranslations } from '@/lib/i18n';
import { EASE } from './motion';
import HeroShowcase from './HeroShowcase';

interface HeroSectionProps {
  /** Counts read from the registries, so the copy cannot drift from reality. */
  generatorCount: number;
  countryCount: number;
}

/**
 * Hero for the platform home page.
 *
 * ── What it is not ──────────────────────────────────────────────────────────
 *
 * First it was the wordmark at 8rem over a paragraph explaining what a data
 * generation platform is — half a screen spent telling visitors something they
 * knew before they clicked. Then it was a search field, which assumed the
 * visitor already knew what to type. Neither showed the thing itself.
 *
 * The catalogue below answers "what is here", card by card, better than a
 * search box can. So the hero's job is the one question the catalogue cannot
 * answer at a glance: what does this actually give me? It answers by handing
 * over a generated value, marked against the standard it satisfies, and then
 * doing it again with a different kind of data.
 *
 * ── The dark band ───────────────────────────────────────────────────────────
 *
 * The hero keeps its night sky in both themes. A starfield on a #f8fafc ground
 * is not a starfield, and a hero that inverts between visits is not an
 * identity — so this one screen commits, and the page under it goes on
 * following the visitor's choice. Everything inside uses `hero-*` colours for
 * that reason: `text-foreground` here would be near-black on a night sky.
 */
export default function HeroSection({ generatorCount, countryCount }: HeroSectionProps) {
  const { locale } = useParams<{ locale: string }>() ?? { locale: 'en' };
  const { t } = useTranslations();
  const reduced = useReducedMotion();

  /* Entrance runs on mount, not on scroll — the hero is already on screen. */
  const rise = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 12 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.45, delay, ease: EASE },
        };

  return (
    <section className="relative isolate overflow-hidden bg-hero-ground">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Two distant nebulae, in the platform's own two colours. */}
        <div className="absolute -top-48 left-[18%] size-[38rem] rounded-full bg-hero-action/[0.10] blur-[130px]" />
        <div className="absolute -bottom-56 right-[14%] size-[32rem] rounded-full bg-hero-brand/[0.07] blur-[140px]" />

        <Starfield className="absolute inset-0 size-full" />

        {/* The limb of something large, just off the bottom edge. It is what
            turns a field of dots into a place, and it hands the hero over to
            the page below instead of ending on a hard line. */}
        <div className="absolute -bottom-[30rem] left-1/2 h-[36rem] w-[120rem] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,138,61,0.16),rgba(62,207,142,0.06)_38%,transparent_68%)]" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-background to-transparent" />
      </div>

      <div className="relative mx-auto grid max-w-5xl grid-cols-1 items-center gap-10 px-4 pt-16 pb-14 sm:px-6 sm:pt-20 sm:pb-18 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-14 lg:pt-24 lg:pb-24">
        <div>
          <motion.p
            {...rise(0)}
            className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs text-hero-muted sm:text-[0.8125rem]"
          >
            <span className="text-hero-action">
              {t('platformHome.eyebrow.generators', { n: generatorCount })}
            </span>
            <span aria-hidden="true" className="size-[3px] rounded-full bg-hero-rule" />
            <span>{t('platformHome.eyebrow.countries', { n: countryCount })}</span>
            <span aria-hidden="true" className="size-[3px] rounded-full bg-hero-rule" />
            <span>{t('platformHome.eyebrow.inBrowser')}</span>
            <span aria-hidden="true" className="size-[3px] rounded-full bg-hero-rule" />
            <span>{t('platformHome.eyebrow.nothingStored')}</span>
          </motion.p>

          <motion.h1
            {...rise(0.06)}
            className="mt-5 max-w-[17ch] font-heading text-4xl font-bold leading-[1.08] tracking-tight text-hero-ink sm:text-5xl lg:text-[3.5rem]"
          >
            {t('platformHome.title')}
          </motion.h1>

          <motion.p
            {...rise(0.12)}
            className="mt-5 max-w-[52ch] text-base leading-relaxed text-hero-ink-soft sm:text-lg"
          >
            {t('platformHome.lede')}
          </motion.p>

          <motion.div {...rise(0.18)} className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href={`/${locale}/phone-generator`}
              className="group inline-flex items-center gap-2 rounded-xl bg-hero-action px-5 py-3 text-[0.8125rem] font-semibold text-hero-action-foreground shadow-card transition-[filter,transform] duration-200 hover:brightness-105 active:scale-[0.98]"
            >
              {t('platformHome.cta.primary')}
              <ArrowRight
                size={15}
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </Link>
            <a
              href="#generators"
              className="group inline-flex items-center gap-2 rounded-xl border border-hero-rule bg-hero-panel px-5 py-3 text-[0.8125rem] font-medium text-hero-ink backdrop-blur-sm transition-colors duration-200 hover:border-hero-action/50 hover:text-hero-action"
            >
              {t('platformHome.cta.secondary', { n: generatorCount })}
              <ArrowDown
                size={15}
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:translate-y-0.5"
              />
            </a>
          </motion.div>
        </div>

        <motion.div {...rise(0.24)}>
          <HeroShowcase />
        </motion.div>
      </div>
    </section>
  );
}
