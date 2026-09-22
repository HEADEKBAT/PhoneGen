'use client';

import type { PhoneCountryExample } from '@/lib/phone/examples';
import { useTranslations } from '@/lib/i18n';
import { LandingHero } from '@/components/product-landing';
import PhoneShowcase from './PhoneShowcase';

interface PhoneHeroProps {
  examples: PhoneCountryExample[];
}

const FACTS = ['countries', 'library', 'inBrowser', 'noAccount'] as const;

/**
 * Hero for the phone generator landing.
 *
 * What was here — a centred h1, one sentence, a dropdown and a green button —
 * was the whole page. For the site's flagship product and its main search
 * query that is thin, and it showed the visitor nothing: a generator's first
 * screen should contain a generated number, which is what the panel is for.
 *
 * The night sky and everything around it now come from `LandingHero`, which
 * three other landings had copied line for line.
 */
export default function PhoneHero({ examples }: PhoneHeroProps) {
  const { t } = useTranslations();

  return (
    <LandingHero
      facts={FACTS.map((fact) => t(`productLanding.phone.eyebrow.${fact}`))}
      title={t('productLanding.phone.title')}
      lede={t('productLanding.phone.lede')}
      /* One button, and it is an anchor rather than a link to a country: the
         country is the choice this product is built around, so picking one for
         the visitor would be picking wrong 244 times. */
      actions={[{ label: t('productLanding.phone.cta.secondary'), href: '#countries' }]}
      showcase={<PhoneShowcase examples={examples} />}
    />
  );
}
