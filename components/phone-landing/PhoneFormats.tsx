'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Flag from 'react-world-flags';
import type { PhoneCountryExample } from '@/lib/phone/examples';
import { useTranslations } from '@/lib/i18n';
import { REVEAL_VIEWPORT, revealCard, revealUp, stagger } from '@/components/home/motion';

const FORMATS = ['international', 'national', 'e164'] as const;

interface PhoneFormatsProps {
  example: PhoneCountryExample;
}

/**
 * The three output formats, shown as one number written three ways.
 *
 * The section it replaces claimed "Multiple Formats — supports international,
 * national, E.164 and RFC 3966" and printed none of them. A visitor deciding
 * whether this generator fits their fixture file needs to see the strings, and
 * needs to know which one their database column wants; both are cheaper to
 * show than to describe.
 *
 * The number is real and formatted on the server, and the country is named
 * above the cards, because "(201) 555-0123" means nothing without it.
 */
export default function PhoneFormats({ example }: PhoneFormatsProps) {
  const { t } = useTranslations();
  const reduced = useReducedMotion();

  const values: Record<(typeof FORMATS)[number], string> = {
    international: example.international,
    national: example.national,
    e164: example.e164,
  };

  return (
    <section className="border-y border-border bg-muted/20">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <motion.div
          variants={revealUp}
          initial={reduced ? false : 'hidden'}
          whileInView="shown"
          viewport={REVEAL_VIEWPORT}
          className="relative mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-border pb-2.5"
        >
          <h2 className="font-heading text-lg font-semibold tracking-tight text-foreground">
            {t('productLanding.phone.formats.title')}
          </h2>
          <p className="text-[0.8125rem] text-muted-foreground">
            {t('productLanding.phone.formats.note')}
          </p>
          <span className="ml-auto flex items-center gap-1.5 font-mono text-[0.8125rem] text-muted-foreground">
            <Flag
              code={example.iso}
              title={example.name}
              style={{ width: '18px', height: '13px', borderRadius: '2px', objectFit: 'cover' }}
            />
            {example.name}
          </span>
          <span
            aria-hidden="true"
            className="absolute -bottom-px left-0 h-0.5 w-9 rounded-full bg-action"
          />
        </motion.div>

        <motion.dl
          variants={stagger()}
          initial={reduced ? false : 'hidden'}
          whileInView="shown"
          viewport={REVEAL_VIEWPORT}
          className="grid grid-cols-1 gap-3 sm:grid-cols-3"
        >
          {FORMATS.map((format) => (
            <motion.div
              key={format}
              variants={revealCard}
              className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4 shadow-card"
            >
              <dt className="font-mono text-[0.6875rem] tracking-wide text-action uppercase">
                {t(`productLanding.phone.formats.${format}.label`)}
              </dt>
              <dd className="m-0 flex flex-col gap-2">
                <code className="block rounded-lg bg-muted/60 px-2.5 py-2 font-mono text-[0.9375rem] break-all text-foreground tabular-nums">
                  {values[format]}
                </code>
                <span className="text-[0.8125rem] leading-relaxed text-muted-foreground">
                  {t(`productLanding.phone.formats.${format}.note`)}
                </span>
              </dd>
            </motion.div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}
