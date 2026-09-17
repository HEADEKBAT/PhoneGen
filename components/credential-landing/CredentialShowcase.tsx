'use client';

import { KeyRound } from 'lucide-react';
import type { HeroSample } from '@/lib/credential/samples';
import { useTranslations } from '@/lib/i18n';
import { useDurationFormatter } from './useDurationFormatter';

/**
 * The hero's demonstration panel: one real passphrase and what it survives.
 *
 * The three rows are the point. A four-word passphrase holds out longer than
 * anyone will wait against a rate-limited login and against a bcrypt database,
 * and falls to a stolen MD5 table in about twenty minutes — the same secret,
 * three answers, and which one applies is a property of the service rather
 * than of the password. Every competing generator prints one unlabelled
 * number; this panel is the argument for printing three.
 *
 * The value itself comes out of the real generator on the server, so the page
 * cannot show a shape the tool would not produce.
 */
export default function CredentialShowcase({ sample }: { sample: HeroSample }) {
  const { t } = useTranslations();
  const formatDuration = useDurationFormatter();

  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-8 rounded-[2rem] bg-hero-action/[0.12] blur-3xl"
      />

      <div className="relative rounded-2xl border border-hero-rule bg-hero-panel p-5 shadow-floating backdrop-blur-md sm:p-6">
        <div className="flex items-center gap-2.5">
          <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-hero-action-soft text-hero-action">
            <KeyRound size={15} aria-hidden="true" />
          </span>
          <span className="font-heading text-[0.9375rem] font-semibold tracking-tight text-hero-ink">
            {t('credential.passphrase')}
          </span>
          <span className="ml-auto font-mono text-[0.6875rem] text-hero-muted">
            {t('credentialLanding.showcase.label')}
          </span>
        </div>

        <div className="mt-4 rounded-xl bg-hero-well px-4 py-3.5">
          <code className="block font-mono text-base leading-relaxed break-all text-hero-ink sm:text-lg">
            {sample.value}
          </code>
        </div>

        <div className="mt-3.5 flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="rounded bg-hero-brand/15 px-1.5 py-0.5 font-mono text-[0.6875rem] text-hero-brand">
            {t('credential.strength.bits', { bits: String(sample.bits) })}
          </span>
          <span className="text-[0.8125rem] text-hero-ink-soft">
            {t('credentialLanding.showcase.note')}
          </span>
        </div>

        <dl className="mt-4 space-y-1.5 border-t border-hero-rule pt-3.5">
          {sample.estimates.map((estimate) => (
            <div key={estimate.scenario} className="flex items-baseline justify-between gap-3">
              <dt className="text-[0.8125rem] text-hero-muted">
                {t(`credential.strength.scenario.${estimate.scenario}.label`)}
              </dt>
              <dd className="m-0 shrink-0 font-mono text-[0.8125rem] font-medium text-hero-ink tabular-nums">
                {formatDuration(estimate.duration)}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
