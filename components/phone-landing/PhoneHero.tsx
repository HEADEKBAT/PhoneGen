'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import Starfield from '@/components/background/Starfield';
import type { PhoneCountryExample } from '@/lib/phone/examples';
import { useTranslations } from '@/lib/i18n';
import { EASE } from '@/components/home/motion';
import PhoneShowcase from './PhoneShowcase';

interface PhoneHeroProps {
  examples: PhoneCountryExample[];
}

/**
 * Hero for the phone generator landing.
 *
 * What was here — a centred h1, one sentence, a dropdown and a green button —
 * was the whole page. For the site's flagship product and its main search
 * query that is thin, and it showed the visitor nothing: a generator's first
 * screen should contain a generated number, which is what the panel is for.
 *
 * The night sky, the `hero-*` tokens and the orange action are the home page's,
 * deliberately, so the product pages read as the same site. Like the home page
 * the section commits to dark in both themes; `text-foreground` on a night sky
 * is near-black on near-black, hence the separate token set for everything
 * inside it.
 */
export default function PhoneHero({ examples }: PhoneHeroProps) {
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

  const facts = ['countries', 'library', 'inBrowser', 'noAccount'] as const;

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
                  {t(`productLanding.phone.eyebrow.${fact}`)}
                </span>
              </span>
            ))}
          </motion.p>

          <motion.h1
            {...rise(0.06)}
            className="mt-5 max-w-[16ch] font-heading text-4xl font-bold leading-[1.08] tracking-tight text-hero-ink sm:text-5xl lg:text-[3.5rem]"
          >
            {t('productLanding.phone.title')}
          </motion.h1>

          <motion.p
            {...rise(0.12)}
            className="mt-5 max-w-[54ch] text-base leading-relaxed text-hero-ink-soft sm:text-lg"
          >
            {t('productLanding.phone.lede')}
          </motion.p>

          {/* One button, and it is an anchor rather than a link to a country:
              the country is the choice this product is built around, so
              picking one for the visitor would be picking wrong 244 times. */}
          <motion.div {...rise(0.18)} className="mt-8">
            <a
              href="#countries"
              className="group inline-flex items-center gap-2 rounded-xl bg-hero-action px-5 py-3 text-[0.8125rem] font-semibold text-hero-action-foreground shadow-card transition-[filter,transform] duration-200 hover:brightness-105 active:scale-[0.98]"
            >
              {t('productLanding.phone.cta.secondary')}
              <ArrowDown
                size={15}
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:translate-y-0.5"
              />
            </a>
          </motion.div>
        </div>

        <motion.div {...rise(0.24)}>
          <PhoneShowcase examples={examples} />
        </motion.div>
      </div>
    </section>
  );
}
