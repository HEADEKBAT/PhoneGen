'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowRight,
  Container,
  Database,
  Key,
  Lock,
  ShieldCheck,
  Wifi,
  type LucideIcon,
} from 'lucide-react';
import type { UseCase } from '@/lib/config/credentialLanding';
import { REVEAL_VIEWPORT, revealCard, revealUp, stagger } from '@/components/home/motion';

const ICONS: Record<string, LucideIcon> = { Wifi, Database, Container, Lock, Key, ShieldCheck };

interface CredentialUseCasesProps {
  useCases: UseCase[];
  locale: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
}

/**
 * Six jobs, each a preset link that opens the tool already configured.
 *
 * These are the section that earns its place by being *specific*: "a 63
 * character mixed random string" is what a Wi-Fi router wants, and the link
 * sets exactly that. The card carries the configuration in words so a visitor
 * can see what they are about to get before they click.
 */
export default function CredentialUseCases({
  useCases,
  locale,
  title,
  subtitle,
  ctaLabel,
}: CredentialUseCasesProps) {
  const reduced = useReducedMotion();

  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
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
        {useCases.map((useCase) => {
          const Icon = ICONS[useCase.icon] ?? Lock;
          return (
            <motion.li key={useCase.id} variants={revealCard} className="list-none">
              <Link
                href={`/${locale}/credential-generator/tool?preset=${useCase.preset}`}
                className="group flex h-full flex-col gap-2 rounded-xl border border-border bg-card p-4 shadow-card transition-[border-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-action/40 hover:shadow-elevated"
              >
                <div className="flex items-center gap-2.5">
                  <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-action-soft text-action">
                    <Icon size={15} aria-hidden="true" />
                  </span>
                  <h3 className="font-heading text-[0.9375rem] font-semibold tracking-tight text-foreground">
                    {useCase.label}
                  </h3>
                </div>
                <p className="text-[0.8125rem] leading-relaxed text-muted-foreground">
                  {useCase.desc}
                </p>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-1 text-[0.8125rem] font-medium text-action">
                  {ctaLabel}
                  <ArrowRight
                    size={13}
                    aria-hidden="true"
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                </span>
              </Link>
            </motion.li>
          );
        })}
      </motion.ul>
    </section>
  );
}
