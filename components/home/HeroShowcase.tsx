'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import {
  CreditCard,
  Key,
  Palette,
  Phone,
  Scan,
  Wallet,
  type LucideIcon,
} from 'lucide-react';
import {
  HERO_HIGHLIGHT_IDS,
  getCatalogueEntry,
  type CatalogueEntry,
} from '@/lib/config/homeCatalogue';
import { useTranslations } from '@/lib/i18n';
import { EASE } from './motion';

const ICONS: Record<string, LucideIcon> = {
  phone: Phone,
  credential: Key,
  payment: CreditCard,
  barcode: Scan,
  cryptoWallet: Wallet,
  color: Palette,
};

/** How long a sample stays up, and how fast its characters land. */
const DWELL_MS = 3200;
const TYPE_MS = 22;

/**
 * The hero's demonstration panel.
 *
 * A data generator should open by generating something. This cycles through
 * six of the catalogue's samples, typing each one out and marking it against
 * the standard it satisfies — which is the platform's whole claim, made in
 * three seconds instead of a paragraph.
 *
 * The samples are the same strings the catalogue cards show, read from the one
 * registry, so the hero cannot drift from the cards below it.
 *
 * At rest — before hydration, and whenever the visitor prefers reduced motion —
 * the first sample is already rendered in full. Nothing here waits for a timer
 * to become readable.
 *
 * The panel is glass rather than card-coloured: it sits on the hero's night
 * sky, where a solid light surface would read as a sheet of paper taped over
 * the window. Its colours come from the `hero-*` set for the same reason the
 * headline's do.
 */
export default function HeroShowcase() {
  const { t } = useTranslations();
  const reduced = useReducedMotion();

  const items = HERO_HIGHLIGHT_IDS.map(getCatalogueEntry).filter(
    (entry): entry is CatalogueEntry => Boolean(entry),
  );

  const [index, setIndex] = useState(0);
  const [typed, setTyped] = useState(items[0]?.sample.length ?? 0);

  const current = items[index];

  /* Advance through the samples. */
  useEffect(() => {
    if (reduced || items.length < 2) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
      setTyped(0);
    }, DWELL_MS);
    return () => clearInterval(id);
  }, [reduced, items.length]);

  /* Type the current sample in. */
  useEffect(() => {
    if (reduced || !current) return;
    const total = current.sample.length;
    if (typed >= total) return;
    const id = setTimeout(() => setTyped((n) => Math.min(n + 1, total)), TYPE_MS);
    return () => clearTimeout(id);
  }, [reduced, current, typed]);

  if (!current) return null;

  const Icon = ICONS[current.id] ?? Key;
  const shown = reduced ? current.sample : current.sample.slice(0, typed);
  const typing = !reduced && typed < current.sample.length;

  return (
    <div className="relative">
      {/* A warm bloom behind the panel, so it sits in light rather than on flat ground. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-8 rounded-[2rem] bg-hero-action/[0.12] blur-3xl"
      />

      <div className="relative rounded-2xl border border-hero-rule bg-hero-panel p-5 shadow-floating backdrop-blur-md sm:p-6">
        <div className="flex items-center gap-2.5">
          <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-hero-action-soft text-hero-action">
            <Icon size={15} aria-hidden="true" />
          </span>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={current.id}
              initial={reduced ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -4 }}
              transition={{ duration: 0.2, ease: EASE }}
              className="font-heading text-[0.9375rem] font-semibold tracking-tight text-hero-ink"
            >
              {t(`products.${current.id}.title`)}
            </motion.span>
          </AnimatePresence>
          <span className="ml-auto flex items-center gap-1.5 font-mono text-[0.6875rem] text-hero-muted">
            <span className="relative flex size-1.5">
              {!reduced && (
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-hero-brand opacity-60" />
              )}
              <span className="relative inline-flex size-1.5 rounded-full bg-hero-brand" />
            </span>
            {t('platformHome.showcase.label')}
          </span>
        </div>

        {/* The value. Height is fixed so the panel does not jump between samples. */}
        <div className="mt-4 flex min-h-16 items-center rounded-xl bg-hero-well px-4 py-3.5">
          <code className="font-mono text-sm break-all text-hero-ink sm:text-base">
            {shown}
            {typing && (
              <span
                aria-hidden="true"
                className="ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[0.15em] animate-pulse bg-hero-action"
              />
            )}
          </code>
        </div>

        <div className="mt-3.5 flex flex-wrap items-center gap-x-3 gap-y-2">
          {current.validates && (
            <span className="rounded bg-hero-brand/15 px-1.5 py-0.5 font-mono text-[0.6875rem] text-hero-brand">
              ✓ {current.validates}
            </span>
          )}
          <span className="text-[0.8125rem] text-hero-ink-soft">
            {t('platformHome.showcase.note')}
          </span>

          {/* Which of the six is up, and how far through it is. */}
          <span className="ml-auto flex shrink-0 items-center gap-1.5" aria-hidden="true">
            {items.map((item, i) => (
              <span
                key={item.id}
                className={
                  i === index
                    ? 'h-1 w-4 rounded-full bg-hero-action transition-all duration-300'
                    : 'size-1 rounded-full bg-hero-rule transition-all duration-300'
                }
              />
            ))}
          </span>
        </div>
      </div>
    </div>
  );
}
