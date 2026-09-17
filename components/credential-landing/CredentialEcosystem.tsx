'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Building, Mail, Phone, Scan, Users, type LucideIcon } from 'lucide-react';
import type { EcosystemLink } from '@/lib/config/credentialLanding';
import { REVEAL_VIEWPORT, revealCard, revealUp, stagger } from '@/components/home/motion';

const ICONS: Record<string, LucideIcon> = { Users, Mail, Phone, Building, Scan };

interface CredentialEcosystemProps {
  links: EcosystemLink[];
  locale: string;
  title: string;
  subtitle: string;
}

/**
 * The sibling generators.
 *
 * Kept, restyled, and shorn of the "flow diagram" that used to sit under it:
 * five static spans with arrows between them, drawn to look like a pipeline
 * that nothing in the product actually performs. These are real links to real
 * tools, which is what the section was for.
 */
export default function CredentialEcosystem({
  links,
  locale,
  title,
  subtitle,
}: CredentialEcosystemProps) {
  const reduced = useReducedMotion();

  return (
    <section className="border-t border-border bg-muted/20">
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
          variants={stagger(0.03)}
          initial={reduced ? false : 'hidden'}
          whileInView="shown"
          viewport={REVEAL_VIEWPORT}
          className="grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2 lg:grid-cols-3"
        >
          {links.map((link) => {
            const Icon = ICONS[link.icon] ?? Users;
            return (
              <motion.li key={link.id} variants={revealCard} className="list-none">
                <Link
                  href={`/${locale}${link.href}`}
                  className="group flex h-full flex-col gap-2 rounded-xl border border-border bg-card p-4 shadow-card transition-[border-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-action/40 hover:shadow-elevated"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-action-soft text-action">
                      <Icon size={15} aria-hidden="true" />
                    </span>
                    <h3 className="font-heading text-[0.9375rem] font-semibold tracking-tight text-foreground">
                      {link.label}
                    </h3>
                    <ArrowRight
                      size={14}
                      aria-hidden="true"
                      className="ml-auto shrink-0 text-muted-foreground opacity-0 transition-[opacity,transform] duration-200 group-hover:translate-x-0.5 group-hover:opacity-100"
                    />
                  </div>
                  <p className="text-[0.8125rem] leading-relaxed text-muted-foreground">
                    {link.desc}
                  </p>
                </Link>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
}
