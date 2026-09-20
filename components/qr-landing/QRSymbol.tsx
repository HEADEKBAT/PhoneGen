'use client';

import type { HeroSymbol } from '@/lib/qr/landingSamples';
import { useTranslations } from '@/lib/i18n';

/**
 * The hero's panel: an actual, scannable QR code and the four numbers behind it.
 *
 * The symbol is inline SVG produced on the server from the module matrix, so
 * the page ships a working code in its own HTML rather than an encoder to draw
 * one. Point a phone at the screen and it resolves — which is the whole claim
 * this page makes, made in the one form that cannot be faked.
 */
export default function QRSymbol({ symbol }: { symbol: HeroSymbol }) {
  const { t } = useTranslations();

  const facts = [
    {
      label: t('qrLanding.showcase.version'),
      value: t('qrLanding.showcase.modulesValue', {
        version: String(symbol.version),
        modules: String(symbol.modules),
      }),
    },
    {
      label: t('qrLanding.showcase.payload'),
      value: t('qrLanding.showcase.bytesValue', {
        bytes: String(symbol.bytes),
        capacity: String(symbol.capacity),
      }),
    },
    {
      label: t('qrLanding.showcase.recovery'),
      value: t('qrLanding.showcase.recoveryValue', { level: symbol.errorCorrection }),
    },
    {
      label: t('qrLanding.showcase.quietZone'),
      value: t('qrLanding.showcase.quietZoneValue', { modules: String(symbol.quietZone) }),
    },
  ];

  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-8 rounded-[2rem] bg-hero-action/[0.12] blur-3xl"
      />

      <div className="relative rounded-2xl border border-hero-rule bg-hero-panel p-5 shadow-floating backdrop-blur-md sm:p-6">
        <div className="flex items-center gap-2.5">
          <span className="flex items-center gap-1.5 font-mono text-[0.6875rem] text-hero-muted">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-hero-brand opacity-60" />
              <span className="relative inline-flex size-1.5 rounded-full bg-hero-brand" />
            </span>
            {t('qrLanding.showcase.label')}
          </span>
          <code className="ml-auto truncate font-mono text-[0.6875rem] text-hero-muted">
            {symbol.url.replace(/^https?:\/\//, '')}
          </code>
        </div>

        <div className="mt-4 grid place-items-center rounded-xl bg-white p-4">
          {/* Server-rendered from the matrix. The markup is ours, built in
              lib/qr/vector.ts from a numeric grid — no user input reaches it. */}
          <div
            className="w-full max-w-[13rem] [&>svg]:size-full"
            dangerouslySetInnerHTML={{ __html: symbol.svg }}
          />
        </div>

        <p className="mt-3.5 text-[0.8125rem] leading-relaxed text-hero-ink-soft">
          {t('qrLanding.showcase.note')}
        </p>

        <dl className="mt-3.5 grid grid-cols-2 gap-x-4 gap-y-0 border-t border-hero-rule pt-3">
          {facts.map((fact) => (
            <div key={fact.label} className="flex items-baseline justify-between gap-2 py-1">
              <dt className="text-[0.6875rem] text-hero-muted">{fact.label}</dt>
              <dd className="m-0 font-mono text-[0.6875rem] text-hero-ink tabular-nums">
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
