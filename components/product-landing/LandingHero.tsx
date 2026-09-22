'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { ArrowDown, ArrowRight } from 'lucide-react';
import type { ReactNode } from 'react';
import Starfield from '@/components/background/Starfield';
import { EASE } from '@/components/home/motion';

export interface LandingHeroAction {
  label: string;
  /** Locale-prefixed path, or a `#anchor` on this page. */
  href: string;
}

interface LandingHeroProps {
  /**
   * The dotted line above the title. The second item is the accented one —
   * the convention the four landings already shared, kept because it puts the
   * emphasis on the fact that distinguishes the product rather than on the
   * count that opens the row.
   */
  facts?: string[];
  /**
   * Shown as a badge when the page has no facts to put in the eyebrow. An
   * already-rendered element rather than the component, so a server component
   * can pass one: a function prop does not cross into a client component.
   */
  icon?: ReactNode;
  title: string;
  lede: string;
  /** Override for a title that needs more room than sixteen characters wide. */
  titleWidth?: string;
  /** Up to two: the first is the filled button, the second the outlined one. */
  actions?: LandingHeroAction[];
  /** The right-hand column: whatever this product can show working. */
  showcase?: ReactNode;
  /**
   * Half the vertical air. For a page whose point is the tool directly below
   * it: the hero says what the thing is, then gets out of the way.
   */
  compact?: boolean;
}

/**
 * The hero every landing and every template page shares.
 *
 * It was written four times — PhoneHero, QRHero, CredentialHero, MediaHero —
 * and the four were identical but for the strings, the showcase and one
 * character-width. Four copies of a night sky is four places to fix a
 * gradient, and it is why the rest of the site never got one.
 *
 * Everything arrives as a plain string rather than a dictionary key. The
 * templates that will use this — the tool shell, the SEO pages — carry copy
 * from their manifests, already resolved for the locale, and a key-only API is
 * exactly what kept them on the old centred hero.
 *
 * The section commits to dark in both themes, like the home page it borrows
 * from: `text-foreground` on a night sky is near-black on near-black, which is
 * what the separate `hero-*` token set exists to avoid.
 */
export default function LandingHero({
  facts,
  icon,
  title,
  lede,
  titleWidth = 'max-w-[16ch]',
  actions = [],
  showcase,
  compact = false,
}: LandingHeroProps) {
  const reduced = useReducedMotion();

  const rise = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 12 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.45, delay, ease: EASE },
        };

  const [primary, secondary] = actions;

  return (
    <section className="relative isolate overflow-hidden bg-hero-ground">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-48 left-[18%] size-[38rem] rounded-full bg-hero-action/[0.10] blur-[130px]" />
        <div className="absolute -bottom-56 right-[14%] size-[32rem] rounded-full bg-hero-brand/[0.07] blur-[140px]" />

        <Starfield className="absolute inset-0 size-full" />

        <div className="absolute -bottom-[30rem] left-1/2 h-[36rem] w-[120rem] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,138,61,0.16),rgba(62,207,142,0.06)_38%,transparent_68%)]" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-background to-transparent" />
      </div>

      <div
        className={`relative mx-auto grid max-w-5xl grid-cols-1 items-center gap-10 px-4 sm:px-6 lg:gap-14 ${
          compact
            ? 'pt-10 pb-10 sm:pt-14 sm:pb-12 lg:pt-16 lg:pb-14'
            : 'pt-16 pb-14 sm:pt-20 sm:pb-18 lg:pt-24 lg:pb-24'
        } ${showcase ? 'lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]' : ''}`}
      >
        {/* Without a showcase the text stays capped at 3xl rather than running
            the full width: the left edge still lines up with every section
            below, which is what makes the page read as one grid. */}
        <div className={showcase ? undefined : 'max-w-3xl'}>
          {icon && !facts?.length && (
            <motion.span
              {...rise(0)}
              className="mb-5 inline-grid size-12 place-items-center rounded-2xl border border-hero-rule bg-hero-well text-hero-action"
            >
              {icon}
            </motion.span>
          )}

          {!!facts?.length && (
            <motion.p
              {...rise(0)}
              className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs text-hero-muted sm:text-[0.8125rem]"
            >
              {facts.map((fact, index) => (
                <span key={fact} className="flex items-center gap-x-4">
                  {index > 0 && (
                    <span aria-hidden="true" className="size-[3px] rounded-full bg-hero-rule" />
                  )}
                  <span className={index === 1 ? 'text-hero-action' : undefined}>{fact}</span>
                </span>
              ))}
            </motion.p>
          )}

          <motion.h1
            {...rise(0.06)}
            className={`mt-5 font-heading text-4xl font-bold leading-[1.08] tracking-tight text-hero-ink sm:text-5xl lg:text-[3.5rem] ${titleWidth}`}
          >
            {title}
          </motion.h1>

          <motion.p
            {...rise(0.12)}
            className="mt-5 max-w-[56ch] text-base leading-relaxed text-hero-ink-soft sm:text-lg"
          >
            {lede}
          </motion.p>

          {primary && (
            <motion.div {...rise(0.18)} className="mt-8 flex flex-wrap items-center gap-3">
              <HeroAction action={primary} filled />
              {secondary && <HeroAction action={secondary} />}
            </motion.div>
          )}
        </div>

        {showcase && <motion.div {...rise(0.24)}>{showcase}</motion.div>}
      </div>
    </section>
  );
}

/** One button. An in-page anchor is not a route change, so it is not a Link. */
function HeroAction({ action, filled = false }: { action: LandingHeroAction; filled?: boolean }) {
  const anchor = action.href.startsWith('#');
  const Icon = anchor ? ArrowDown : ArrowRight;

  const className = filled
    ? 'group inline-flex items-center gap-2 rounded-xl bg-hero-action px-5 py-3 text-[0.8125rem] font-semibold text-hero-action-foreground shadow-card transition-[filter,transform] duration-200 hover:brightness-105 active:scale-[0.98]'
    : 'group inline-flex items-center gap-2 rounded-xl border border-hero-rule bg-hero-panel px-5 py-3 text-[0.8125rem] font-medium text-hero-ink backdrop-blur-sm transition-colors duration-200 hover:border-hero-action/50 hover:text-hero-action';

  const body = (
    <>
      {action.label}
      <Icon
        size={15}
        aria-hidden="true"
        className={`transition-transform duration-200 ${
          anchor ? 'group-hover:translate-y-0.5' : 'group-hover:translate-x-0.5'
        }`}
      />
    </>
  );

  return anchor ? (
    <a href={action.href} className={className}>
      {body}
    </a>
  ) : (
    <Link href={action.href} className={className}>
      {body}
    </Link>
  );
}
