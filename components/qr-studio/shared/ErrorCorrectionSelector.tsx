'use client';

import { Check, Lock } from 'lucide-react';
import { EC_RECOVERY } from '@/lib/qr/matrix';
import type { ErrorCorrection } from '@/lib/qr/types';
import { useTranslations } from '@/lib/i18n';

const LEVELS: ErrorCorrection[] = ['L', 'M', 'Q', 'H'];

interface ErrorCorrectionSelectorProps {
  value: ErrorCorrection;
  onChange: (level: ErrorCorrection) => void;
  /** When true the level is forced to H and the choice is shown as taken. */
  hasLogo?: boolean;
}

/**
 * How much of the symbol can be destroyed and still read.
 *
 * With a logo the answer is not a preference: the studio builds at H and says
 * so here, rather than leaving the user on M with a warning underneath, which
 * is what this did — and which is also how the market's biggest generator
 * handles it, behind a checkbox in a three-dot menu.
 */
export default function ErrorCorrectionSelector({
  value,
  onChange,
  hasLogo = false,
}: ErrorCorrectionSelectorProps) {
  const { t } = useTranslations();
  const effective: ErrorCorrection = hasLogo ? 'H' : value;

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-4 gap-2">
        {LEVELS.map((level) => {
          const active = effective === level;
          const locked = hasLogo && level !== 'H';

          return (
            <button
              key={level}
              type="button"
              onClick={() => onChange(level)}
              disabled={locked}
              className={`relative flex flex-col items-center gap-0.5 rounded-xl border p-2.5 transition-colors ${
                active
                  ? 'border-action bg-action-soft'
                  : locked
                    ? 'cursor-not-allowed border-border opacity-40'
                    : 'border-border hover:border-muted-foreground/30 hover:bg-muted/20'
              }`}
            >
              {active && (
                <span className="absolute top-1 right-1 text-action">
                  {hasLogo ? <Lock className="size-3" /> : <Check className="size-3" />}
                </span>
              )}
              <span className="text-sm font-semibold text-foreground">{level}</span>
              <span className="text-[0.625rem] text-muted-foreground">
                {t(`qrStudio.ec.name.${level}`)}
              </span>
              <span className="font-mono text-[0.625rem] text-muted-foreground">
                {Math.round(EC_RECOVERY[level] * 100)}%
              </span>
            </button>
          );
        })}
      </div>

      <p className="rounded-xl border border-border bg-muted/30 p-2.5 text-[0.6875rem] leading-relaxed text-muted-foreground">
        {hasLogo ? t('qrStudio.ec.lockedByLogo') : t(`qrStudio.ec.desc.${value}`)}
      </p>
    </div>
  );
}
