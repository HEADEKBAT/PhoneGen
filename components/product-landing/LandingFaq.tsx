'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { REVEAL_VIEWPORT, revealCard, stagger } from '@/components/home/motion';
import LandingSection from './LandingSection';

export interface LandingFaqItem {
  question: string;
  answer: string;
}

interface LandingFaqProps {
  items: LandingFaqItem[];
  /** Resolved for the locale by the caller. */
  title: string;
  note?: string;
  id?: string;
}

/**
 * The FAQ used by the redesigned product landings and templates.
 *
 * It differs from the FAQ it replaces in two ways that matter. That one
 * centred a 3xl heading, which interrupts a page whose other section headings
 * are left-aligned at `text-lg`; and it opens its answers from React state, so
 * an answer is absent from the document until someone clicks. `<details>` is
 * open-able without JavaScript and its content is in the DOM either way —
 * which matters on a section whose whole point is the questions it answers.
 *
 * Questions arrive as strings, not dictionary keys. The four landings hold
 * theirs in the dictionary and the five page templates hold theirs in
 * manifests; a key-only prop served the first four and locked out the 108
 * pages behind the templates.
 *
 * The FAQPage JSON-LD comes along unchanged: it is what puts these questions
 * in the search result.
 */
export default function LandingFaq({ items, title, note, id }: LandingFaqProps) {
  const reduced = useReducedMotion();

  if (items.length === 0) return null;

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

      <LandingSection id={id} title={title} note={note}>
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
      </LandingSection>
    </>
  );
}
