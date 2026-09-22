'use client';

import type { HeroSymbol } from '@/lib/qr/landingSamples';
import { useTranslations } from '@/lib/i18n';
import { LandingHero } from '@/components/product-landing';
import QRSymbol from './QRSymbol';

interface QRHeroProps {
  locale: string;
  symbol: HeroSymbol | null;
  typeCount: number;
}

const FACTS = ['types', 'vector', 'inBrowser', 'noAccount'] as const;

/**
 * Hero for the QR landing.
 *
 * It replaces the shared `ProductHero` — a centred badge over three pulsing
 * rings and a five-layer aurora, the same shape on twenty-odd product pages,
 * describing a product it never showed. A QR generator's first screen should
 * contain a QR code that works, and now it does: real, server-rendered, and
 * scannable off the screen.
 */
export default function QRHero({ locale, symbol, typeCount }: QRHeroProps) {
  const { t } = useTranslations();

  return (
    <LandingHero
      facts={FACTS.map((fact) =>
        t(`qrLanding.eyebrow.${fact}`, { count: String(typeCount) }),
      )}
      title={t('qrLanding.title')}
      lede={t('qrLanding.lede')}
      actions={[
        { label: t('qrLanding.cta.primary'), href: `/${locale}/qr-generator/tool` },
        { label: t('qrLanding.cta.secondary'), href: '#payloads' },
      ]}
      showcase={symbol ? <QRSymbol symbol={symbol} /> : undefined}
    />
  );
}
