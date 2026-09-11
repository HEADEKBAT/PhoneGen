'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useTranslations } from '@/lib/i18n';
import { REVEAL_VIEWPORT, revealCard, revealUp, stagger } from './motion';

/**
 * The five questions people actually arrive with.
 *
 * Also emitted as FAQPage JSON-LD, which is what makes these eligible for a
 * rich result — the previous FAQ was rendered but never marked up.
 */
const QUESTIONS = ['free', 'phones', 'cards', 'storage', 'seed'] as const;

export default function FaqSection() {
  const { t } = useTranslations();
  const reduced = useReducedMotion();

  const faqs = QUESTIONS.map((id) => ({
    id,
    q: t(`platformHome.faq.${id}.q`),
    a: t(`platformHome.faq.${id}.a`),
  }));

  return (
    <section id="faq" className="border-t border-border">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
        <motion.h2
          variants={revealUp}
          initial={reduced ? false : 'hidden'}
          whileInView="shown"
          viewport={REVEAL_VIEWPORT}
          className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
        >
          {t('platformHome.faq.title')}
        </motion.h2>

        <motion.div
          variants={stagger(0.05, 0.05)}
          initial={reduced ? false : 'hidden'}
          whileInView="shown"
          viewport={REVEAL_VIEWPORT}
          className="mt-6"
        >
          {faqs.map((faq) => (
            <motion.details
              key={faq.id}
              variants={revealCard}
              className="group border-b border-border py-4"
            >
              <summary className="flex cursor-pointer list-none items-center gap-4 text-[0.9375rem] font-medium text-foreground [&::-webkit-details-marker]:hidden">
                {faq.q}
                <ChevronDown
                  size={16}
                  aria-hidden="true"
                  className="ml-auto shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180"
                />
              </summary>
              <p className="mt-3 max-w-[62ch] text-[0.8125rem] leading-relaxed text-muted-foreground">
                {faq.a}
              </p>
            </motion.details>
          ))}
        </motion.div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map((faq) => ({
              '@type': 'Question',
              name: faq.q,
              acceptedAnswer: { '@type': 'Answer', text: faq.a },
            })),
          }),
        }}
      />
    </section>
  );
}
