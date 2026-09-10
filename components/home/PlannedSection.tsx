'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { ALL_PRODUCTS } from '@/lib/config';
import { useTranslations } from '@/lib/i18n';
import { REVEAL_VIEWPORT, revealUp } from './motion';

/**
 * The roadmap products, kept out of the catalogue.
 *
 * Seven of the twenty-three products are `status: 'planned'` and have no page.
 * They used to sit in the main grid as cards that looked like the others and
 * did nothing when clicked. Here they are a collapsed list of names: the
 * ambition is still on the page, and every card in the catalogue above still
 * opens something.
 */
export default function PlannedSection() {
  const { t } = useTranslations();
  const reduced = useReducedMotion();

  const planned = ALL_PRODUCTS.filter(
    (p) => p.status === 'planned' || p.status === 'coming-soon',
  );

  if (planned.length === 0) return null;

  return (
    <motion.section
      variants={revealUp}
      initial={reduced ? false : 'hidden'}
      whileInView="shown"
      viewport={REVEAL_VIEWPORT}
      className="mx-auto max-w-5xl px-4 pb-4 sm:px-6"
    >
      <details className="group rounded-2xl border border-dashed border-border bg-muted/40 px-5 py-4">
        <summary className="flex cursor-pointer list-none items-center gap-3 font-heading text-[0.9375rem] font-semibold text-foreground [&::-webkit-details-marker]:hidden">
          {t('platformHome.planned.title')}
          <span className="rounded border border-border px-1.5 py-0.5 font-mono text-[0.6875rem] tracking-wide text-muted-foreground uppercase">
            {t('platformHome.planned.badge', { n: planned.length })}
          </span>
          <ChevronDown
            size={16}
            aria-hidden="true"
            className="ml-auto text-muted-foreground transition-transform duration-200 group-open:rotate-180"
          />
        </summary>

        <ul className="mt-4 flex list-none flex-wrap gap-2 p-0">
          {planned.map((product) => (
            <li
              key={product.id}
              className="rounded-full border border-border bg-card px-3 py-1 text-[0.8125rem] text-muted-foreground"
            >
              {t(`products.${product.id}.title`)}
            </li>
          ))}
        </ul>

        <p className="mt-3.5 text-[0.8125rem] text-muted-foreground">
          {t('platformHome.planned.note')}
        </p>
      </details>
    </motion.section>
  );
}
