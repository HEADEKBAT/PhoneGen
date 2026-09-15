'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import Flag from 'react-world-flags';
import type { PhoneCountryExample } from '@/lib/phone/examples';
import { useTranslations } from '@/lib/i18n';
import { EASE } from '@/components/home/motion';

/** How long one country stays up. */
const DWELL_MS = 3200;

interface PhoneShowcaseProps {
  examples: PhoneCountryExample[];
}

/**
 * The hero's demonstration panel: one real number, cycling by country.
 *
 * Every string in it comes from Google's libphonenumber metadata by way of
 * `lib/phone/examples` — the same dataset the generator validates against —
 * so the spacing, the digit count and the calling code are that country's, not
 * a plausible-looking invention. A landing page for a generator that showed
 * hand-typed numbers would be undercutting its own claim in its first screen.
 *
 * Cycling pauses while the pointer or keyboard focus is inside the panel,
 * because the panel ends in a link: a target that changes under the cursor is
 * a mis-click waiting to happen.
 *
 * At rest — before hydration, and whenever the visitor prefers reduced motion
 * — the first country is already fully rendered.
 */
/* `react-world-flags` rather than the emoji flag, as everywhere else on the
   site: Windows ships no flag glyphs, so 🇺🇸 renders there as the letters
   "US" — which on a country card is both wrong and unreadable. */
export default function PhoneShowcase({ examples }: PhoneShowcaseProps) {
  const { locale } = useParams<{ locale: string }>() ?? { locale: 'en' };
  const { t } = useTranslations();
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reduced || paused || examples.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % examples.length), DWELL_MS);
    return () => clearInterval(id);
  }, [reduced, paused, examples.length]);

  if (examples.length === 0) return null;

  const current = examples[index] ?? examples[0];

  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-8 rounded-[2rem] bg-hero-action/[0.12] blur-3xl"
      />

      <div
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
        className="relative rounded-2xl border border-hero-rule bg-hero-panel p-5 shadow-floating backdrop-blur-md sm:p-6"
      >
        <div className="flex items-center gap-2.5">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={current.iso}
              initial={reduced ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -4 }}
              transition={{ duration: 0.2, ease: EASE }}
              className="flex items-center gap-2.5"
            >
              <Flag
                code={current.iso}
                title={current.name}
                style={{ width: '22px', height: '16px', borderRadius: '2px', objectFit: 'cover' }}
              />
              <span className="font-heading text-[0.9375rem] font-semibold tracking-tight text-hero-ink">
                {current.name}
              </span>
              <span className="font-mono text-[0.8125rem] text-hero-muted">
                {current.callingCode}
              </span>
            </motion.span>
          </AnimatePresence>

          <span className="ml-auto flex items-center gap-1.5 font-mono text-[0.6875rem] text-hero-muted">
            <span className="relative flex size-1.5">
              {!reduced && !paused && (
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-hero-brand opacity-60" />
              )}
              <span className="relative inline-flex size-1.5 rounded-full bg-hero-brand" />
            </span>
            {t('productLanding.phone.showcase.label')}
          </span>
        </div>

        {/* Fixed height so the panel does not jump between countries with
            different digit counts. */}
        <div className="mt-4 min-h-24 rounded-xl bg-hero-well px-4 py-3.5">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={current.iso}
              initial={reduced ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: EASE }}
            >
              <code className="block font-mono text-xl font-medium tracking-tight text-hero-ink tabular-nums sm:text-2xl">
                {current.international}
              </code>
              <code className="mt-1.5 block font-mono text-sm text-hero-muted tabular-nums">
                {current.e164}
              </code>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-3.5 flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="rounded bg-hero-brand/15 px-1.5 py-0.5 font-mono text-[0.6875rem] text-hero-brand">
            ✓ libphonenumber
          </span>
          <span className="text-[0.8125rem] text-hero-ink-soft">
            {t('productLanding.phone.showcase.note')}
          </span>

          <span className="ml-auto flex shrink-0 items-center gap-1.5" aria-hidden="true">
            {examples.map((example, i) => (
              <span
                key={example.iso}
                className={
                  i === index
                    ? 'h-1 w-4 rounded-full bg-hero-action transition-all duration-300'
                    : 'size-1 rounded-full bg-hero-rule transition-all duration-300'
                }
              />
            ))}
          </span>
        </div>

        {/* Inside its own AnimatePresence, keyed like the two blocks above, so
            the link's country changes on the same frame as the number's. A
            link that swapped destination a beat before or after the panel
            around it would be the mis-click the pause guards against. */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={current.iso}
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduced ? undefined : { opacity: 0 }}
            transition={{ duration: 0.2, ease: EASE }}
          >
            <Link
              href={`/${locale}/phone-generator/${current.iso}`}
              className="group mt-4 flex items-center justify-between gap-3 rounded-xl border border-hero-rule px-4 py-2.5 text-[0.8125rem] font-medium text-hero-ink transition-colors duration-200 hover:border-hero-action/50 hover:text-hero-action"
            >
              <span>
                {t('productLanding.phone.cta.primary')} — {current.name}
              </span>
              <ArrowRight
                size={15}
                aria-hidden="true"
                className="shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
