'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowRight,
  Clock,
  Hash,
  Key,
  KeyRound,
  Lock,
  Scan,
  ShieldCheck,
  Shuffle,
  Webhook,
  type LucideIcon,
} from 'lucide-react';
import type { LandingTool } from '@/lib/config/credentialLanding';
import type { ToolSample } from '@/lib/credential/samples';
import { useTranslations } from '@/lib/i18n';
import { REVEAL_VIEWPORT, revealCard, revealUp, stagger } from '@/components/home/motion';

const ICONS: Record<string, LucideIcon> = {
  Key, KeyRound, Hash, Clock, Scan, Lock, Webhook, Shuffle, ShieldCheck,
};

/**
 * Which tools belong together.
 *
 * By what the output is for, not by what it is made of: the person looking for
 * a Wi-Fi password and the person looking for a webhook signing secret are not
 * browsing the same list, even though both are random strings.
 */
const GROUPS: { id: string; slugs: string[] }[] = [
  {
    id: 'passwords',
    slugs: [
      'password-generator',
      'passphrase-generator',
      'random-pin-generator',
      'password-strength-checker',
    ],
  },
  { id: 'identifiers', slugs: ['uuid-generator', 'uuid-v7-generator'] },
  {
    id: 'secrets',
    slugs: [
      'jwt-secret-generator',
      'api-key-generator',
      'webhook-secret-generator',
      'session-secret-generator',
      'random-token-generator',
    ],
  },
];

interface CredentialToolsProps {
  tools: LandingTool[];
  samples: ToolSample[];
  locale: string;
}

/**
 * The eleven tool pages, each showing what it produces.
 *
 * The grid this replaces was eleven identical tiles — icon, name, one line of
 * description — and every one of them linked to `?mode=`, because the localized
 * config dropped the slug field. So the eleven pages had no inbound link from
 * anywhere on the site, and the cards showed a visitor nothing they could not
 * have guessed from the name. Each card now carries a real sample from that
 * generator and points at that generator's page.
 */
export default function CredentialTools({ tools, samples, locale }: CredentialToolsProps) {
  const { t } = useTranslations();
  const reduced = useReducedMotion();

  const bySlug = new Map(tools.filter((tool) => tool.slug).map((tool) => [tool.slug!, tool]));
  const sampleBySlug = new Map(samples.map((sample) => [sample.slug, sample.sample]));

  return (
    <section id="tools" className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      {GROUPS.map((group) => {
        const entries = group.slugs
          .map((slug) => bySlug.get(slug))
          .filter((tool): tool is LandingTool => Boolean(tool));
        if (entries.length === 0) return null;

        return (
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
                {t(`credentialLanding.groups.${group.id}.title`)}
              </h2>
              <p className="text-[0.8125rem] text-muted-foreground">
                {t(`credentialLanding.groups.${group.id}.note`)}
              </p>
              <span className="ml-auto font-mono text-[0.8125rem] text-muted-foreground">
                {entries.length}
              </span>
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
              {entries.map((tool) => {
                const Icon = ICONS[tool.icon] ?? Key;
                const sample = sampleBySlug.get(tool.slug!);

                return (
                  <motion.li key={tool.id} variants={revealCard} className="list-none">
                    <Link
                      href={`/${locale}/credential-generator/${tool.slug}`}
                      className="group flex h-full flex-col gap-2.5 rounded-xl border border-border bg-card p-4 shadow-card transition-[border-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-action/40 hover:shadow-elevated"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-action-soft text-action">
                          <Icon size={15} aria-hidden="true" />
                        </span>
                        <h3 className="font-heading text-[0.9375rem] font-semibold tracking-tight text-foreground">
                          {tool.label}
                        </h3>
                        <ArrowRight
                          size={14}
                          aria-hidden="true"
                          className="ml-auto shrink-0 text-muted-foreground opacity-0 transition-[opacity,transform] duration-200 group-hover:translate-x-0.5 group-hover:opacity-100"
                        />
                      </div>

                      {/* Straight out of that generator, on the server. Data,
                          not copy — the same in every language. */}
                      {sample && (
                        <code className="rounded-lg bg-muted/60 px-2.5 py-2 font-mono text-xs break-all text-muted-foreground">
                          {sample}
                        </code>
                      )}

                      <p className="mt-auto text-[0.8125rem] leading-relaxed text-muted-foreground">
                        {tool.desc}
                      </p>
                    </Link>
                  </motion.li>
                );
              })}
            </motion.ul>
          </motion.div>
        );
      })}
    </section>
  );
}
