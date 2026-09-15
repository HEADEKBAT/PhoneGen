'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import type { FAQ } from '@/lib/config/productLanding';
import { useTranslations } from '@/lib/i18n';
import { REVEAL_VIEWPORT, revealCard, revealUp, stagger } from '@/components/home/motion';

interface MediaFaqProps {
  faqs: FAQ[];
}

/**
 * The landing's FAQ.
 *
 * A near-copy of the shared `FAQSection`, kept separate for two reasons and no
 * others. The shared one centres a 3xl heading, which on this page interrupts
 * a rhythm of left-aligned section headings at `text-lg`; and it opens its
 * answers from React state, so an answer is absent from the document until
 * someone clicks. `<details>` is open-able without JavaScript and its content
 * is in the DOM either way — which matters on a page whose whole point is the
 * questions it answers.
 *
 * The FAQPage JSON-LD comes along unchanged: it is what puts these questions
 * in the search result, and dropping it to restyle a heading would be a poor
 * trade.
 */
export default function MediaFaq({ faqs }: MediaFaqProps) {
  const { t } = useTranslations();
  const reduced = useReducedMotion();

  if (faqs.length === 0) return null;

  const items = faqs.map((faq) => ({ question: t(faq.qKey), answer: t(faq.aKey) }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: items.map((item) => ({
              '@type': 'Question',
              name: item.question,
              acceptedAnswer: { '@type': 'Answer', text: item.answer },
            })),
          }),
        }}
      />

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <motion.div
          variants={revealUp}
          initial={reduced ? false : 'hidden'}
          whileInView="shown"
          viewport={REVEAL_VIEWPORT}
          className="relative mb-4 border-b border-border pb-2.5"
        >
          <h2 className="font-heading text-lg font-semibold tracking-tight text-foreground">
            {t('productLanding.faqTitle')}
          </h2>
          <span
            aria-hidden="true"
            className="absolute -bottom-px left-0 h-0.5 w-9 rounded-full bg-action"
          />
        </motion.div>

        <motion.div
          variants={stagger(0.035)}
          initial={reduced ? false : 'hidden'}
          whileInView="shown"
          viewport={REVEAL_VIEWPORT}
          className="grid grid-cols-1 gap-2 lg:grid-cols-2 lg:gap-3"
        >
          {items.map((item) => (
            <motion.details
              key={item.question}
              variants={revealCard}
              className="group h-fit rounded-xl border border-border bg-card shadow-card transition-colors duration-200 hover:border-action/40"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3.5">
                <span className="font-heading text-[0.875rem] font-medium text-foreground">
                  {item.question}
                </span>
                <ChevronDown
                  size={15}
                  aria-hidden="true"
                  className="shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180"
                />
              </summary>
              <p className="px-4 pb-4 text-[0.8125rem] leading-relaxed text-muted-foreground">
                {item.answer}
              </p>
            </motion.details>
          ))}
        </motion.div>
      </section>
    </>
  );
}
