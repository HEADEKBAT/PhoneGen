'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Cpu, Eraser, Infinity as InfinityIcon, WifiOff, type LucideIcon } from 'lucide-react';
import { useTranslations } from '@/lib/i18n';
import { REVEAL_VIEWPORT, revealCard, revealUp, stagger } from '@/components/home/motion';

const ITEMS: { id: string; icon: LucideIcon }[] = [
  { id: 'crypto', icon: Cpu },
  { id: 'browser', icon: WifiOff },
  { id: 'history', icon: Eraser },
  { id: 'free', icon: InfinityIcon },
];

/**
 * Four claims a visitor can check, in place of six they could not.
 *
 * The section this replaces promised "Your credentials never leave your device
 * — guaranteed", "Trusted by developers worldwide" and "Full source code is
 * available on GitHub for audit", the last of which pointed at no repository.
 * A page whose whole subject is whether you can trust it has no business
 * making claims that rest on being believed.
 *
 * What is left is checkable: the API the values come from, the absence of any
 * request (open the network panel), where the history lives, and what it
 * costs. Each one is a statement about this page that the visitor can verify
 * from this page.
 */
export default function CredentialSecurity({ title, subtitle }: { title: string; subtitle: string }) {
  const { t } = useTranslations();
  const reduced = useReducedMotion();

  return (
    <section className="border-y border-border bg-muted/20">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
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
          <p className="text-[0.8125rem] text-muted-foreground">{subtitle}</p>
          <span
            aria-hidden="true"
            className="absolute -bottom-px left-0 h-0.5 w-9 rounded-full bg-action"
          />
        </motion.div>

        <motion.ul
          variants={stagger()}
          initial={reduced ? false : 'hidden'}
          whileInView="shown"
          viewport={REVEAL_VIEWPORT}
          className="grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2"
        >
          {ITEMS.map(({ id, icon: Icon }) => (
            <motion.li
              key={id}
              variants={revealCard}
              className="list-none rounded-xl border border-border bg-card p-4 shadow-card"
            >
              <div className="flex items-center gap-2.5">
                <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-action-soft text-action">
                  <Icon size={15} aria-hidden="true" />
                </span>
                <h3 className="font-mono text-[0.875rem] font-medium tracking-tight text-foreground">
                  {t(`credentialLanding.securityItems.${id}.title`)}
                </h3>
              </div>
              <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted-foreground">
                {t(`credentialLanding.securityItems.${id}.desc`)}
              </p>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
