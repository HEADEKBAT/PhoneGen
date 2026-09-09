'use client';

import type { ErrorCorrection } from '@/lib/qr/types';
import { Check } from 'lucide-react';

const EC_LEVELS: ErrorCorrection[] = ['L', 'M', 'Q', 'H'];
const EC_LABELS: Record<ErrorCorrection, string> = {
  L: 'Low',
  M: 'Medium',
  Q: 'Quartile',
  H: 'High',
};

const EC_RECOVERY: Record<ErrorCorrection, string> = {
  L: '~7%',
  M: '~15%',
  Q: '~25%',
  H: '~30%',
};

const EC_DESCRIPTIONS: Record<ErrorCorrection, string> = {
  L: 'Recovers up to 7% of damaged data. Best for controlled environments where the QR code won\'t be damaged.',
  M: 'Recovers up to 15% of damaged data. Good balance of capacity and reliability for most use cases.',
  Q: 'Recovers up to 25% of damaged data. Recommended for QR codes on curved surfaces or with logos.',
  H: 'Recovers up to 30% of damaged data. Best for QR codes that may be partially obscured or damaged.',
};

interface ErrorCorrectionSelectorProps {
  value: ErrorCorrection;
  onChange: (level: ErrorCorrection) => void;
  hasLogo?: boolean;
  contentLength?: number;
}

export default function ErrorCorrectionSelector({
  value,
  onChange,
  hasLogo = false,
  contentLength = 0,
}: ErrorCorrectionSelectorProps) {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-4 gap-2">
        {EC_LEVELS.map((level) => {
          return (
            <button
              key={level}
              onClick={() => onChange(level)}
              className={`relative flex flex-col items-center gap-0.5 p-2.5 rounded-xl border transition-all ${
                value === level
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'border-border hover:border-muted-foreground/30 hover:bg-muted/20'
              }`}
            >
              {value === level && (
                <span className="absolute top-1 right-1 text-primary">
                  <Check className="h-3 w-3" />
                </span>
              )}
              <span className="text-sm font-semibold">{level}</span>
              <span className="text-[10px] text-muted-foreground">{EC_LABELS[level]}</span>
              <span className="text-[10px] text-muted-foreground font-mono">
                {EC_RECOVERY[level]}
              </span>
            </button>
          );
        })}
      </div>

      <div className="p-2.5 rounded-xl bg-muted/30 border border-border">
        <p className="text-[11px] text-muted-foreground">
          {EC_DESCRIPTIONS[value]}
        </p>
      </div>

      {hasLogo && value !== 'H' && (
        <p className="text-[11px] text-amber-500">
          Consider using High (H) correction for better readability with logos.
        </p>
      )}
    </div>
  );
}
