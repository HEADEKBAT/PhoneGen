'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { REVEAL_VIEWPORT, revealUp } from '@/components/home/motion';

interface LandingClosingProps {
  title: string;
  body: string;
  cta: string;
  /** Absolute, locale-prefixed, or a `#anchor` on this page. */
  href: string;
}

/**
 * The last thing on a product landing: one sentence and the one button.
 *
 * Strings rather than dictionary keys, for the reason given on `LandingFaq`:
 * the page templates carry copy from manifests, already resolved.
 */
export default function LandingClosing({ title, body, cta, href }: LandingClosingProps) {
  const reduced = useReducedMotion();

  const className =
    'group mt-7 inline-flex items-center gap-2 rounded-xl bg-action px-5 py-3 text-[0.8125rem] font-semibold text-white shadow-card transition-[filter,transform] duration-200 hover:brightness-105 active:scale-[0.98]';

  const label = (
    <>
      {cta}
      <ArrowRight
        size={15}
        aria-hidden="true"
        className="transition-transform duration-200 group-hover:translate-x-0.5"
      />
    </>
  );

  return (
    <motion.section
      variants={revealUp}
      initial={reduced ? false : 'hidden'}
      whileInView="shown"
      viewport={REVEAL_VIEWPORT}
      className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 sm:py-20"
    >
      <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        {title}
      </h2>
      <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">{body}</p>

      {/* An in-page anchor is not a route change, so `next/link` would be the
          wrong element for it. */}
      {href.startsWith('#') ? (
        <a href={href} className={className}>
          {label}
        </a>
      ) : (
        <Link href={href} className={className}>
          {label}
        </Link>
      )}
    </motion.section>
  );
}
