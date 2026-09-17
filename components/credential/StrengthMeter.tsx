'use client';

import { ShieldCheck, ShieldX, TriangleAlert } from 'lucide-react';
import type { PasswordScore, StrengthNote } from '@/lib/credentialGenerator';
import { useTranslations } from '@/lib/i18n';
import { useDurationFormatter } from '@/components/credential-landing/useDurationFormatter';

interface StrengthMeterProps {
  score: PasswordScore | null;
}

/** Bar colour by band. Green is the site's brand; the warm end is the warning. */
const BAND_COLOR: Record<string, string> = {
  veryWeak: 'bg-red-500',
  weak: 'bg-orange-500',
  moderate: 'bg-amber-400',
  strong: 'bg-lime-500',
  veryStrong: 'bg-primary',
};

/**
 * Entropy, three attack scenarios, and what the credential does and does not
 * survive.
 *
 * ── Why three rows and not one number ───────────────────────────────────────
 *
 * This used to print "Offline crack: 3.2 hours" with no mention of what was
 * doing the hashing. The same password falls in seconds against unsalted MD5
 * and holds for longer than the universe against argon2id — six orders of
 * magnitude apart — and which one applies is a property of the service, not of
 * the password. A single unlabelled figure is not a simplification of that, it
 * is a guess presented as a measurement.
 *
 * ── Why Intl and not a table of words ───────────────────────────────────────
 *
 * Durations are formatted with `Intl.NumberFormat`'s unit style, so "2 года"
 * and "5 лет" come out of the platform's own plural rules rather than from six
 * hand-written translations that would each need three plural forms.
 */
export default function StrengthMeter({ score }: StrengthMeterProps) {
  const { t } = useTranslations();

  const formatDuration = useDurationFormatter();

  if (!score) return null;

  const { score: value, bits, band, estimates, isCommon, resistant, weak } = score;

  const noteLabel = (note: StrengthNote) => t(`credential.strength.note.${note}`);

  return (
    <div className="space-y-4 rounded-xl border border-border bg-card p-4">
      {/* ── Bar ───────────────────────────────────────────────────────── */}
      <div>
        <div className="flex items-baseline justify-between gap-3">
          <span className="font-heading text-sm font-semibold text-foreground">
            {t(`credential.${band}`)}
          </span>
          <span className="font-mono text-xs text-muted-foreground tabular-nums">
            {t('credential.strength.bits', { bits: String(bits) })}
          </span>
        </div>
        <div
          className="mt-2 h-2 overflow-hidden rounded-full bg-muted"
          role="meter"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={t('credential.strength.title')}
        >
          <div
            className={`h-full rounded-full transition-[width,background-color] duration-300 ${BAND_COLOR[band] ?? 'bg-muted-foreground'}`}
            style={{ width: `${Math.max(2, value)}%` }}
          />
        </div>
      </div>

      {/* ── How long it holds, and against what ───────────────────────── */}
      <dl className="space-y-1.5">
        {estimates.map((estimate) => (
          <div
            key={estimate.scenario}
            className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 rounded-lg bg-muted/50 px-3 py-2"
          >
            <dt className="text-xs text-foreground">
              {t(`credential.strength.scenario.${estimate.scenario}.label`)}
              <span className="ml-2 text-[0.6875rem] text-muted-foreground">
                {t(`credential.strength.scenario.${estimate.scenario}.hint`)}
              </span>
            </dt>
            <dd className="m-0 font-mono text-xs font-medium text-foreground tabular-nums">
              {formatDuration(estimate.duration)}
            </dd>
          </div>
        ))}
      </dl>

      {/* ── Checklists ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {resistant.length > 0 && (
          <div>
            <p className="mb-1 flex items-center gap-1.5 text-[0.6875rem] font-medium tracking-wide text-primary uppercase">
              <ShieldCheck size={12} aria-hidden="true" />
              {t('credential.strength.holds')}
            </p>
            <ul className="list-none space-y-0.5 p-0">
              {resistant.map((note) => (
                <li key={note} className="list-none text-xs text-muted-foreground">
                  {noteLabel(note)}
                </li>
              ))}
            </ul>
          </div>
        )}

        {weak.length > 0 && (
          <div>
            <p className="mb-1 flex items-center gap-1.5 text-[0.6875rem] font-medium tracking-wide text-destructive uppercase">
              <ShieldX size={12} aria-hidden="true" />
              {t('credential.strength.falls')}
            </p>
            <ul className="list-none space-y-0.5 p-0">
              {weak.map((note) => (
                <li key={note} className="list-none text-xs text-muted-foreground">
                  {noteLabel(note)}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {isCommon && (
        <p className="flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-xs text-destructive">
          <TriangleAlert size={14} aria-hidden="true" className="mt-px shrink-0" />
          {t('credential.commonPasswordWarning')}
        </p>
      )}
    </div>
  );
}
