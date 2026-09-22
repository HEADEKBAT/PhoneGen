'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { REVEAL_VIEWPORT, revealCard, stagger } from '@/components/home/motion';

export interface LandingCard {
  /** Falls back to the title, which is unique in every use so far. */
  id?: string;
  /** A rendered element, so server components can pass one too. */
  icon?: ReactNode;
  title: string;
  desc: string;
  /** Makes the whole card a link. Locale-prefixed, or a `#anchor`. */
  href?: string;
}

interface LandingCardsProps {
  items: LandingCard[];
  /** Columns at the widest breakpoint. Below it the grid halves, then stacks. */
  columns?: 2 | 3;
}

/**
 * A staggered grid of icon, title and one paragraph.
 *
 * The same card is in QRChecks, PhoneFormats, CredentialUseCases, the old
 * FeatureGrid and the tool shell's related-tools row — five hands, five sets
 * of paddings. `h-full` with the paragraph pushed down by `mt-auto` keeps a
 * row of cards level when one description runs two lines longer than the rest,
 * which is the thing that actually makes a grid look unfinished.
 */
export default function LandingCards({ items, columns = 2 }: LandingCardsProps) {
  const reduced = useReducedMotion();

  if (items.length === 0) return null;

  const cols = columns === 3 ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2';

  return (
    <motion.ul
      variants={stagger()}
      initial={reduced ? false : 'hidden'}
      whileInView="shown"
      viewport={REVEAL_VIEWPORT}
      className={`grid list-none grid-cols-1 gap-3 p-0 ${cols}`}
    >
      {items.map((item) => {
        const body = (
          <>
            <div className="flex items-center gap-2.5">
              {item.icon && (
                <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-action-soft text-action">
                  {item.icon}
                </span>
              )}
              <h3 className="font-heading text-[0.9375rem] font-semibold tracking-tight text-foreground">
                {item.title}
              </h3>
              {item.href && (
                <ArrowUpRight
                  size={14}
                  aria-hidden="true"
                  className="ml-auto shrink-0 text-muted-foreground transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-action"
                />
              )}
            </div>
            <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted-foreground">
              {item.desc}
            </p>
          </>
        );

        const className =
          'group flex h-full flex-col rounded-xl border border-border bg-card p-4 shadow-card transition-colors duration-200';

        return (
          <motion.li key={item.id ?? item.title} variants={revealCard} className="list-none">
            {item.href ? (
              <Link href={item.href} className={`${className} hover:border-action/40`}>
                {body}
              </Link>
            ) : (
              <div className={className}>{body}</div>
            )}
          </motion.li>
        );
      })}
    </motion.ul>
  );
}
