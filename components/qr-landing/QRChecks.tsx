'use client';

import { Contrast, Frame, Ruler, Stamp, type LucideIcon } from 'lucide-react';
import { useTranslations } from '@/lib/i18n';
import { LandingCards, LandingSection } from '@/components/product-landing';

const CHECKS: { id: string; icon: LucideIcon }[] = [
  { id: 'quietZone', icon: Frame },
  { id: 'inverted', icon: Contrast },
  { id: 'logo', icon: Stamp },
  { id: 'print', icon: Ruler },
];

/**
 * The four things the studio checks before it will hand over a file.
 *
 * This is the part of the product nobody else has. Every generator in the
 * field — and the field is large — gives you a PNG and finds out with you;
 * the one decoder anyone ships is a separate page you upload a finished image
 * to. Saying so plainly, with the specific failures named, is worth more than
 * another row of "fast, free, unlimited".
 */
export default function QRChecks() {
  const { t } = useTranslations();

  return (
    <LandingSection
      tone="muted"
      title={t('qrLanding.checks.title')}
      note={t('qrLanding.checks.note')}
    >
      <LandingCards
        items={CHECKS.map(({ id, icon }) => ({
          id,
          icon,
          title: t(`qrLanding.checks.${id}.title`),
          desc: t(`qrLanding.checks.${id}.desc`),
        }))}
      />
    </LandingSection>
  );
}
