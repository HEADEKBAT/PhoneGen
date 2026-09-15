'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from '@/lib/i18n';
import { REVEAL_VIEWPORT, revealUp } from '@/components/home/motion';

/** The last thing on the page: one sentence and the one button. */
export default function MediaClosing() {
  const { locale } = useParams<{ locale: string }>() ?? { locale: 'en' };
  const { t } = useTranslations();
  const reduced = useReducedMotion();

  return (
    <motion.section
      variants={revealUp}
      initial={reduced ? false : 'hidden'}
      whileInView="shown"
      viewport={REVEAL_VIEWPORT}
      className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 sm:py-20"
    >
      <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        {t('productLanding.media.closing.title')}
      </h2>
      <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
        {t('productLanding.media.closing.body')}
      </p>
      <Link
        href={`/${locale}/media-studio/tool`}
        className="group mt-7 inline-flex items-center gap-2 rounded-xl bg-action px-5 py-3 text-[0.8125rem] font-semibold text-white shadow-card transition-[filter,transform] duration-200 hover:brightness-105 active:scale-[0.98]"
      >
        {t('productLanding.media.closing.cta')}
        <ArrowRight
          size={15}
          aria-hidden="true"
          className="transition-transform duration-200 group-hover:translate-x-0.5"
        />
      </Link>
    </motion.section>
  );
}
