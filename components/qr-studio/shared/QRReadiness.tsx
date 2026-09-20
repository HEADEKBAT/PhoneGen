'use client';

import { useMemo } from 'react';
import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { analyseReadiness, type Issue } from '@/lib/qr/readiness';
import type { QROptions } from '@/lib/qr/types';
import { useTranslations } from '@/lib/i18n';

interface QRReadinessProps {
  options: QROptions;
  /** Physical width the print plan is computed against. */
  widthMm?: number;
}

const VERDICT_STYLE = {
  ready: { icon: CheckCircle2, tone: 'text-primary', ring: 'border-primary/30 bg-primary/5' },
  risky: { icon: AlertTriangle, tone: 'text-amber-500', ring: 'border-amber-500/30 bg-amber-500/5' },
  broken: { icon: XCircle, tone: 'text-destructive', ring: 'border-destructive/30 bg-destructive/5' },
} as const;

/**
 * Whether this code will scan, and the numbers behind the answer.
 *
 * ── What it replaces ────────────────────────────────────────────────────────
 *
 * Two panels that between them knew nothing. One ran a WCAG text-contrast
 * ratio on the two colours — a symmetric formula, so white modules on a black
 * background scored 21:1 and were reported "excellent", which is the one
 * colour combination phone cameras refuse outright. It was rendered twice at
 * once, from the same function, in two different components. The other was
 * labelled a scan test and decoded nothing: it estimated the version from the
 * string length using *numeric-mode* capacity tables while the encoder has
 * always run in Byte mode, so its numbers were out by a factor of three, and
 * its capacity warning was arithmetically unreachable. A green "Readable"
 * badge sat on top of that.
 *
 * This reads the encoded symbol instead. Every figure below — the version, the
 * modules, the bytes, the modules the logo covers — is counted, not guessed,
 * and the issues are the specific reasons a code fails in the field: no quiet
 * zone, inverted colours, a logo past what the error correction can carry, a
 * print size where the modules fall below what a press can hold.
 */
export default function QRReadiness({ options, widthMm = 30 }: QRReadinessProps) {
  const { t } = useTranslations();
  const readiness = useMemo(() => analyseReadiness(options, { widthMm }), [options, widthMm]);

  if (!options.content) return null;

  const { icon: Icon, tone, ring } = VERDICT_STYLE[readiness.verdict];

  const facts: { label: string; value: string }[] = [
    {
      label: t('qrStudio.readiness.version'),
      value: readiness.version ? `${readiness.version} · ${readiness.modules}×${readiness.modules}` : '—',
    },
    {
      label: t('qrStudio.readiness.payload'),
      value: readiness.capacity
        ? t('qrStudio.readiness.bytes', {
            bytes: String(readiness.bytes),
            capacity: String(readiness.capacity),
          })
        : '—',
    },
    {
      label: t('qrStudio.readiness.recovery'),
      value: t('qrStudio.readiness.recoveryValue', {
        level: readiness.errorCorrection,
        percent: String(Math.round(RECOVERY[readiness.errorCorrection] * 100)),
      }),
    },
    {
      label: t('qrStudio.readiness.printSize'),
      value: t('qrStudio.readiness.printValue', {
        width: String(widthMm),
        module: readiness.print.moduleMm.toFixed(2),
      }),
    },
  ];

  if (readiness.logo) {
    facts.push({
      label: t('qrStudio.readiness.logoCover'),
      value: t('qrStudio.readiness.logoValue', {
        percent: String(Math.round(readiness.logo.coverage * 100)),
        covered: String(readiness.logo.covered),
        total: String(readiness.logo.total),
      }),
    });
  }

  return (
    <div className={`space-y-3 rounded-xl border p-4 ${ring}`}>
      <div className="flex items-start gap-2.5">
        <Icon size={16} aria-hidden="true" className={`mt-px shrink-0 ${tone}`} />
        <div className="min-w-0">
          <p className={`font-heading text-sm font-semibold ${tone}`}>
            {t(`qrStudio.readiness.verdict.${readiness.verdict}`)}
          </p>
          <p className="mt-0.5 text-[0.6875rem] leading-relaxed text-muted-foreground">
            {t(`qrStudio.readiness.verdictNote.${readiness.verdict}`)}
          </p>
        </div>
      </div>

      {readiness.issues.length > 0 && (
        <ul className="list-none space-y-1.5 p-0">
          {readiness.issues.map((issue) => (
            <IssueLine key={issue.id} issue={issue} />
          ))}
        </ul>
      )}

      <dl className="grid grid-cols-1 gap-x-4 gap-y-0 border-t border-border/60 pt-2 sm:grid-cols-2">
        {facts.map((fact) => (
          <div key={fact.label} className="flex items-baseline justify-between gap-3 py-1">
            <dt className="text-[0.6875rem] text-muted-foreground">{fact.label}</dt>
            <dd className="m-0 text-right font-mono text-[0.6875rem] text-foreground tabular-nums">
              {fact.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function IssueLine({ issue }: { issue: Issue }) {
  const { t } = useTranslations();
  const values = Object.fromEntries(
    Object.entries(issue.values ?? {}).map(([key, value]) => [key, String(value)]),
  );

  return (
    <li className="flex list-none items-start gap-2 text-[0.6875rem] leading-relaxed">
      <span
        aria-hidden="true"
        className={`mt-1.5 size-1 shrink-0 rounded-full ${
          issue.severity === 'fail' ? 'bg-destructive' : 'bg-amber-500'
        }`}
      />
      <span className={issue.severity === 'fail' ? 'text-destructive' : 'text-amber-600 dark:text-amber-500'}>
        {t(`qrStudio.readiness.issue.${issue.id}`, values)}
      </span>
    </li>
  );
}

/* Duplicated from lib/qr/matrix rather than imported so this file has no
   reason to pull the encoder into a bundle that only renders text. */
const RECOVERY = { L: 0.07, M: 0.15, Q: 0.25, H: 0.3 } as const;
