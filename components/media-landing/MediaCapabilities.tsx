'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowRight,
  FileVideo,
  Film,
  Globe,
  Link2,
  Minimize2,
  Music,
  Smartphone,
  type LucideIcon,
} from 'lucide-react';
import { MEDIA_CAPABILITIES, type MediaCapability } from '@/lib/config/mediaLanding';
import { useTranslations } from '@/lib/i18n';
import { REVEAL_VIEWPORT, revealCard, revealUp, stagger } from '@/components/home/motion';

const ICONS: Record<string, LucideIcon> = {
  Link2,
  FileVideo,
  Globe,
  Minimize2,
  Smartphone,
  Music,
  Film,
};

/**
 * What the studio does, grouped by the job rather than by the feature.
 *
 * The page it replaces had six cards headed "Universal Format Support",
 * "Smart Compression", "Advanced Controls" — labels that could sit on any
 * converter ever shipped and tell a visitor nothing about this one. Each card
 * here carries a real conversion in monospace instead, and links to the page
 * for that job, so the section doubles as the internal linking this product
 * family never had.
 */
export default function MediaCapabilities() {
  const { locale } = useParams<{ locale: string }>() ?? { locale: 'en' };
  const { t } = useTranslations();
  const reduced = useReducedMotion();

  return (
    <section id="can" className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      {MEDIA_CAPABILITIES.map((group) => (
        <motion.div
          key={group.id}
          variants={revealUp}
          initial={reduced ? false : 'hidden'}
          whileInView="shown"
          viewport={REVEAL_VIEWPORT}
          className="mb-12 last:mb-0"
        >
          <div className="relative mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-border pb-2.5">
            <h2 className="font-heading text-lg font-semibold tracking-tight text-foreground">
              {t(`productLanding.media.groups.${group.id}.title`)}
            </h2>
            <p className="text-[0.8125rem] text-muted-foreground">
              {t(`productLanding.media.groups.${group.id}.note`)}
            </p>
            <span className="ml-auto font-mono text-[0.8125rem] text-muted-foreground">
              {group.entries.length}
            </span>
            {/* The orange bar overlaps the rule, so the second colour carries
                structure and not only buttons — as on the home page. */}
            <span
              aria-hidden="true"
              className="absolute -bottom-px left-0 h-0.5 w-9 rounded-full bg-action"
            />
          </div>

          <motion.ul
            variants={stagger()}
            initial={reduced ? false : 'hidden'}
            whileInView="shown"
            viewport={REVEAL_VIEWPORT}
            className="grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2 lg:grid-cols-3"
          >
            {group.entries.map((entry) => (
              <CapabilityCard key={entry.id} entry={entry} locale={locale} />
            ))}
          </motion.ul>
        </motion.div>
      ))}
    </section>
  );
}

function CapabilityCard({ entry, locale }: { entry: MediaCapability; locale: string }) {
  const { t } = useTranslations();
  const Icon = ICONS[entry.icon] ?? FileVideo;

  return (
    <motion.li variants={revealCard} className="list-none">
      <Link
        href={`/${locale}/${entry.href}`}
        className="group flex h-full flex-col gap-2.5 rounded-xl border border-border bg-card p-4 shadow-card transition-[border-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-action/40 hover:shadow-elevated"
      >
        <div className="flex items-center gap-2.5">
          <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-action-soft text-action">
            <Icon size={15} aria-hidden="true" />
          </span>
          <h3 className="font-heading text-[0.9375rem] font-semibold tracking-tight text-foreground">
            {t(`productLanding.media.can.${entry.id}.title`)}
          </h3>
          <ArrowRight
            size={14}
            aria-hidden="true"
            className="ml-auto shrink-0 text-muted-foreground opacity-0 transition-[opacity,transform] duration-200 group-hover:translate-x-0.5 group-hover:opacity-100"
          />
        </div>

        {/* The conversion itself. Data, not copy — the same in every language. */}
        <code className="rounded-lg bg-muted/60 px-2.5 py-2 font-mono text-xs break-all text-muted-foreground">
          {entry.sample}
        </code>

        <p className="text-[0.8125rem] leading-relaxed text-muted-foreground">
          {t(`productLanding.media.can.${entry.id}.note`)}
        </p>
      </Link>
    </motion.li>
  );
}
