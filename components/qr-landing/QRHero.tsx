'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { ArrowDown, ArrowRight } from 'lucide-react';
import Starfield from '@/components/background/Starfield';
import type { HeroSymbol } from '@/lib/qr/landingSamples';
import { useTranslations } from '@/lib/i18n';
import { EASE } from '@/components/home/motion';
import QRSymbol from './QRSymbol';

interface QRHeroProps {
  locale: string;
  symbol: HeroSymbol | null;
  typeCount: number;
}

/**
 * Hero for the QR landing.
 *
 * It replaces the shared `ProductHero` — a centred badge over three pulsing
 * rings and a five-layer aurora, the same shape on twenty-odd product pages,
 * describing a product it never showed. A QR generator's first screen should
 * contain a QR code that works, and now it does: real, server-rendered, and
 * scannable off the screen.
 */
export default function QRHero({ locale, symbol, typeCount }: QRHeroProps) {
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

  const facts = ['types', 'vector', 'inBrowser', 'noAccount'] as const;

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
                  {t(`qrLanding.eyebrow.${fact}`, { count: String(typeCount) })}
                </span>
              </span>
            ))}
          </motion.p>

          <motion.h1
            {...rise(0.06)}
            className="mt-5 max-w-[16ch] font-heading text-4xl font-bold leading-[1.08] tracking-tight text-hero-ink sm:text-5xl lg:text-[3.5rem]"
          >
            {t('qrLanding.title')}
          </motion.h1>

          <motion.p
            {...rise(0.12)}
            className="mt-5 max-w-[56ch] text-base leading-relaxed text-hero-ink-soft sm:text-lg"
          >
            {t('qrLanding.lede')}
          </motion.p>

          <motion.div {...rise(0.18)} className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href={`/${locale}/qr-generator/tool`}
              className="group inline-flex items-center gap-2 rounded-xl bg-hero-action px-5 py-3 text-[0.8125rem] font-semibold text-hero-action-foreground shadow-card transition-[filter,transform] duration-200 hover:brightness-105 active:scale-[0.98]"
            >
              {t('qrLanding.cta.primary')}
              <ArrowRight
                size={15}
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </Link>
            <a
              href="#payloads"
              className="group inline-flex items-center gap-2 rounded-xl border border-hero-rule bg-hero-panel px-5 py-3 text-[0.8125rem] font-medium text-hero-ink backdrop-blur-sm transition-colors duration-200 hover:border-hero-action/50 hover:text-hero-action"
            >
              {t('qrLanding.cta.secondary')}
              <ArrowDown
                size={15}
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:translate-y-0.5"
              />
            </a>
          </motion.div>
        </div>

        {symbol && (
          <motion.div {...rise(0.24)}>
            <QRSymbol symbol={symbol} />
          </motion.div>
        )}
      </div>
    </section>
  );
}
