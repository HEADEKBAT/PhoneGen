'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from '@/lib/i18n';
import { REVEAL_VIEWPORT, revealUp } from './motion';

interface ClosingSectionProps {
  /** Read from the country registry, so the sentence cannot go stale. */
  countryCount: number;
}

export default function ClosingSection({ countryCount }: ClosingSectionProps) {
  const { locale } = useParams<{ locale: string }>() ?? { locale: 'en' };
  const { t } = useTranslations();
  const reduced = useReducedMotion();

  return (
    <motion.section
      variants={revealUp}
      initial={reduced ? false : 'hidden'}
      whileInView="shown"
      viewport={REVEAL_VIEWPORT}
      className="border-t border-border"
    >
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-20">
        <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {t('platformHome.closing.title')}
        </h2>
        <p className="mx-auto mt-3 max-w-[44ch] text-[0.8125rem] text-muted-foreground">
          {t('platformHome.closing.body', { n: countryCount })}
        </p>
        <Link
          href={`/${locale}/phone-generator`}
          className="group mt-6 inline-flex items-center gap-2 rounded-xl bg-action px-6 py-3 text-[0.8125rem] font-semibold text-action-foreground shadow-card transition-[filter,transform] duration-200 hover:brightness-105 active:scale-[0.98]"
        >
          {t('platformHome.closing.cta')}
          <ArrowRight
            size={15}
            aria-hidden="true"
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </Link>
      </div>
    </motion.section>
  );
}
