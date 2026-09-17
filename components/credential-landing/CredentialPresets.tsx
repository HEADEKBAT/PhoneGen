'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowRight,
  Code,
  Container,
  Database,
  GitBranch,
  Key,
  Lock,
  ShieldCheck,
  Wifi,
  type LucideIcon,
} from 'lucide-react';
import type { Preset } from '@/lib/config/credentialPresets';
import { REVEAL_VIEWPORT, revealCard, revealUp, stagger } from '@/components/home/motion';

/* `credentialPresets.ts` asks for a `Github` icon that the old map did not
   have, so the GitHub preset quietly fell back to a padlock. lucide dropped
   its brand icons, so the entry points at the closest generic one. */
const ICONS: Record<string, LucideIcon> = {
  Wifi, Code, Database, Container, Lock, Key, ShieldCheck, Github: GitBranch,
};

interface CredentialPresetsProps {
  presets: Preset[];
  locale: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
}

/** The services people arrive already knowing they need a secret for. */
export default function CredentialPresets({
  presets,
  locale,
  title,
  subtitle,
  ctaLabel,
}: CredentialPresetsProps) {
  const reduced = useReducedMotion();
  const featured = presets.slice(0, 8);

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
        <Link
          href={`/${locale}/credential-generator/tool`}
          className="group ml-auto inline-flex shrink-0 items-center gap-1.5 text-[0.8125rem] font-medium text-action"
        >
          {ctaLabel}
          <ArrowRight
            size={14}
            aria-hidden="true"
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </Link>
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
        className="grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2 lg:grid-cols-4"
      >
        {featured.map((preset) => {
          const Icon = ICONS[preset.icon] ?? Lock;
          return (
            <motion.li key={preset.id} variants={revealCard} className="list-none">
              <Link
                href={`/${locale}/credential-generator/tool?preset=${preset.id}`}
                className="group flex h-full items-center gap-3 rounded-xl border border-border bg-card p-3.5 shadow-card transition-[border-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-action/40 hover:shadow-elevated"
              >
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-action-soft text-action">
                  <Icon size={15} aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-heading text-[0.875rem] font-semibold text-foreground">
                    {preset.label}
                  </span>
                  <span className="block truncate text-[0.6875rem] text-muted-foreground">
                    {preset.service}
                  </span>
                </span>
              </Link>
            </motion.li>
          );
        })}
      </motion.ul>
    </section>
  );
}
