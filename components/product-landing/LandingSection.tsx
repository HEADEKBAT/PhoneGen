'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { REVEAL_VIEWPORT, revealUp } from '@/components/home/motion';

interface LandingSectionProps {
  /** Anchor target, when a hero button or a nav link points here. */
  id?: string;
  title: string;
  /** The half-sentence that sits on the heading's baseline, to its right. */
  note?: string;
  /** `muted` gives the section its own band: rules top and bottom, a tinted
      ground. Alternating it down the page is what separates the sections. */
  tone?: 'plain' | 'muted';
  children: ReactNode;
}

/**
 * The section shell every redesigned landing repeats: a left-aligned heading
 * at `text-lg`, an optional note on its baseline, a hairline under both and a
 * short orange rule marking the left edge.
 *
 * Written out by hand in QRChecks, QRPayloads, PhoneFormats, PhoneCountries,
 * CredentialTools and five more — and the heading is deliberately small. A
 * centred 3xl heading, which is what the sections this replaces used,
 * announces each section as a new page; these are parts of one page.
 */
export default function LandingSection({
  id,
  title,
  note,
  tone = 'plain',
  children,
}: LandingSectionProps) {
  const reduced = useReducedMotion();

  const inner = (
    <>
      <motion.div
        variants={revealUp}
        initial={reduced ? false : 'hidden'}
        whileInView="shown"
        viewport={REVEAL_VIEWPORT}
        className="relative mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-border pb-2.5"
      >
        <h2 className="font-heading text-lg font-semibold tracking-tight text-foreground">
          {title}
        </h2>
        {note && <p className="text-[0.8125rem] text-muted-foreground">{note}</p>}
        <span
          aria-hidden="true"
          className="absolute -bottom-px left-0 h-0.5 w-9 rounded-full bg-action"
        />
      </motion.div>

      {children}
    </>
  );

  if (tone === 'muted') {
    return (
      <section id={id} className="border-y border-border bg-muted/20">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">{inner}</div>
      </section>
    );
  }

  return (
    <section id={id} className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      {inner}
    </section>
  );
}
