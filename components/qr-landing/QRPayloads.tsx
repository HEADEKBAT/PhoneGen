'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { PAYLOAD_GROUPS, type PayloadSample } from '@/lib/qr/landingSamples';
import { QR_CONTENT_TYPES } from '@/lib/qr/contentTypes';
import { useTranslations } from '@/lib/i18n';
import { REVEAL_VIEWPORT, revealCard, revealUp, stagger } from '@/components/home/motion';

/**
 * What a QR code of each kind actually contains.
 *
 * The page this replaces listed five feature cards — "Multiple content types",
 * "Custom design", "Logo support" — which is a description of a QR generator
 * rather than of this one. A visitor deciding whether the tool speaks their
 * format needs to see `WIFI:T:WPA;S:Office 2F;P:hunter2;H:false;;`, and that
 * string is produced here by the same encoder the studio uses, so the page
 * cannot drift from the product.
 */
export default function QRPayloads({ samples }: { samples: PayloadSample[] }) {
  const { t } = useTranslations();
  const reduced = useReducedMotion();
  const byType = new Map(samples.map((sample) => [sample.type, sample.payload]));

  return (
    <section id="payloads" className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <motion.div
        variants={revealUp}
        initial={reduced ? false : 'hidden'}
        whileInView="shown"
        viewport={REVEAL_VIEWPORT}
        className="relative mb-6 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-border pb-2.5"
      >
        <h2 className="font-heading text-lg font-semibold tracking-tight text-foreground">
          {t('qrLanding.payloads.title')}
        </h2>
        <p className="text-[0.8125rem] text-muted-foreground">{t('qrLanding.payloads.note')}</p>
        <span
          aria-hidden="true"
          className="absolute -bottom-px left-0 h-0.5 w-9 rounded-full bg-action"
        />
      </motion.div>

      {PAYLOAD_GROUPS.map((group) => (
        <motion.div
          key={group.id}
          variants={revealUp}
          initial={reduced ? false : 'hidden'}
          whileInView="shown"
          viewport={REVEAL_VIEWPORT}
          className="mb-8 last:mb-0"
        >
          <div className="mb-3 flex flex-wrap items-baseline gap-x-3">
            <h3 className="font-heading text-[0.9375rem] font-semibold tracking-tight text-foreground">
              {t(`qrLanding.payloads.groups.${group.id}.title`)}
            </h3>
            <p className="text-[0.75rem] text-muted-foreground">
              {t(`qrLanding.payloads.groups.${group.id}.note`)}
            </p>
          </div>

          <motion.ul
            variants={stagger(0.03)}
            initial={reduced ? false : 'hidden'}
            whileInView="shown"
            viewport={REVEAL_VIEWPORT}
            className="grid list-none grid-cols-1 gap-2.5 p-0 sm:grid-cols-2 lg:grid-cols-3"
          >
            {group.types.map((type) => {
              const payload = byType.get(type);
              if (!payload) return null;

              return (
                <motion.li
                  key={type}
                  variants={revealCard}
                  className="list-none rounded-xl border border-border bg-card p-3.5 shadow-card"
                >
                  <p className="font-heading text-[0.8125rem] font-semibold text-foreground">
                    {QR_CONTENT_TYPES[type]?.label ?? type}
                  </p>
                  {/* Data, not copy — identical in every language. */}
                  <code className="mt-2 block overflow-hidden rounded-lg bg-muted/60 px-2.5 py-2 font-mono text-[0.6875rem] leading-relaxed break-all text-muted-foreground">
                    {payload.length > 96 ? `${payload.slice(0, 96)}…` : payload}
                  </code>
                </motion.li>
              );
            })}
          </motion.ul>
        </motion.div>
      ))}
    </section>
  );
}
