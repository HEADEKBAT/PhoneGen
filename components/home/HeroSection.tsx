'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useTranslations } from '@/lib/i18n';
import { EASE } from './motion';

interface HeroSectionProps {
  /** Search text, owned by the page so the catalogue can filter on it. */
  query: string;
  onQuery: (value: string) => void;
  /** Counts read from the registries, so the copy cannot drift from reality. */
  generatorCount: number;
  countryCount: number;
}

/** The searches people arrive with, in the order they arrive with them. */
const CHIPS: { key: string; q: string }[] = [
  { key: 'phone', q: 'phone' },
  { key: 'password', q: 'password' },
  { key: 'card', q: 'card' },
  { key: 'qr', q: 'qr' },
  { key: 'uuid', q: 'uuid' },
];

/**
 * Hero for the platform home page.
 *
 * It used to be the wordmark at 8rem and a paragraph about what a data
 * generation platform is — half a screen spent telling visitors something they
 * knew before they clicked. With sixteen generators, the useful thing to put
 * at the top is the way to find one, so the search field is the hero.
 */
export default function HeroSection({
  query,
  onQuery,
  generatorCount,
  countryCount,
}: HeroSectionProps) {
  const { t } = useTranslations();
  const reduced = useReducedMotion();
  const inputRef = useRef<HTMLInputElement>(null);

  /* "/" focuses the search, the way every tool catalogue does it. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== '/' || e.metaKey || e.ctrlKey || e.altKey) return;
      const el = document.activeElement;
      const typing =
        el instanceof HTMLInputElement ||
        el instanceof HTMLTextAreaElement ||
        (el instanceof HTMLElement && el.isContentEditable);
      if (typing) return;
      e.preventDefault();
      inputRef.current?.focus();
      inputRef.current?.select();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  /* Entrance runs on mount, not on scroll — the hero is already on screen. */
  const rise = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 12 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.45, delay, ease: EASE },
        };

  return (
    <section className="relative border-b border-border">
      {/* A single warm bloom behind the search, so the hero is not flat. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -top-40 left-1/4 size-[36rem] rounded-full bg-action/[0.07] blur-[120px] dark:bg-action/[0.09]" />
        <div className="absolute -bottom-52 right-1/4 size-[30rem] rounded-full bg-primary/[0.06] blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 pt-16 pb-12 sm:pt-24 sm:pb-16">
        <motion.p
          {...rise(0)}
          className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs text-muted-foreground sm:text-[0.8125rem]"
        >
          <span className="text-action">
            {t('platformHome.eyebrow.generators', { n: generatorCount })}
          </span>
          <span aria-hidden="true" className="size-[3px] rounded-full bg-border" />
          <span>{t('platformHome.eyebrow.countries', { n: countryCount })}</span>
          <span aria-hidden="true" className="size-[3px] rounded-full bg-border" />
          <span>{t('platformHome.eyebrow.inBrowser')}</span>
          <span aria-hidden="true" className="size-[3px] rounded-full bg-border" />
          <span>{t('platformHome.eyebrow.nothingStored')}</span>
        </motion.p>

        <motion.h1
          {...rise(0.06)}
          className="mt-5 max-w-[17ch] font-heading text-4xl font-bold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-6xl"
        >
          {t('platformHome.title')}
        </motion.h1>

        <motion.p
          {...rise(0.12)}
          className="mt-5 max-w-[52ch] text-base leading-relaxed text-muted-foreground sm:text-lg"
        >
          {t('platformHome.lede')}
        </motion.p>

        <motion.div {...rise(0.18)} className="mt-8 max-w-2xl">
          <div className="group flex items-center gap-3 rounded-2xl border border-border bg-card px-4 shadow-card transition-[border-color,box-shadow] focus-within:border-action/40 focus-within:shadow-elevated">
            <Search size={17} className="shrink-0 text-action" aria-hidden="true" />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => onQuery(e.target.value)}
              aria-label={t('platformHome.searchLabel')}
              placeholder={t('platformHome.searchPlaceholder')}
              className="h-13 min-w-0 flex-1 bg-transparent py-3.5 text-base text-foreground outline-none placeholder:text-muted-foreground"
            />
            {query ? (
              <button
                type="button"
                onClick={() => onQuery('')}
                aria-label={t('platformHome.clear')}
                className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
              >
                <X size={16} />
              </button>
            ) : (
              <kbd
                aria-hidden="true"
                className="hidden shrink-0 rounded border border-border px-1.5 py-0.5 font-mono text-[0.6875rem] text-muted-foreground sm:block"
              >
                /
              </kbd>
            )}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-[0.8125rem] text-muted-foreground">
              {t('platformHome.popular')}
            </span>
            {CHIPS.map((chip) => (
              <button
                key={chip.key}
                type="button"
                onClick={() => onQuery(chip.q)}
                className="rounded-full border border-border bg-card px-3 py-1 text-[0.8125rem] text-muted-foreground transition-colors hover:border-action/40 hover:text-action"
              >
                {t(`platformHome.chips.${chip.key}`)}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
