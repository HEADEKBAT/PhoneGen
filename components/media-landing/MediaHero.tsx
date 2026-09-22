'use client';

import { useParams } from 'next/navigation';
import { useTranslations } from '@/lib/i18n';
import { LandingHero } from '@/components/product-landing';
import MediaShowcase from './MediaShowcase';

const FACTS = ['formats', 'hls', 'inBrowser', 'noAccount'] as const;

/**
 * Hero for the Media Studio landing.
 *
 * It used to be the generic `ProductHero`: a centred badge, three pulsing
 * rings and a sentence, identical on twenty-three product pages. That shape
 * describes a product; it never shows one, and for a converter the thing worth
 * showing is a conversion.
 */
export default function MediaHero() {
  const { locale } = useParams<{ locale: string }>() ?? { locale: 'en' };
  const { t } = useTranslations();

  return (
    <LandingHero
      facts={FACTS.map((fact) => t(`productLanding.media.eyebrow.${fact}`))}
      title={t('productLanding.media.title')}
      lede={t('productLanding.media.lede')}
      actions={[
        { label: t('productLanding.media.cta.primary'), href: `/${locale}/media-studio/tool` },
        { label: t('productLanding.media.cta.secondary'), href: '#can' },
      ]}
      showcase={<MediaShowcase />}
    />
  );
}
