'use client';

import type { CredentialLandingConfig } from '@/lib/config/credentialLanding';
import type { HeroSample } from '@/lib/credential/samples';
import { useTranslations } from '@/lib/i18n';
import { LandingHero } from '@/components/product-landing';
import CredentialShowcase from './CredentialShowcase';

interface CredentialHeroProps {
  hero: CredentialLandingConfig['hero'];
  locale: string;
  sample: HeroSample;
}

const FACTS = ['tools', 'crypto', 'inBrowser', 'noAccount'] as const;

/**
 * Hero for the credential landing.
 *
 * What it replaces: a centred headline over three pulsing concentric rings, a
 * five-layer aurora background and a row of badges reading "Cryptographically
 * Secure", "Free Forever", "Open Source" — claims a visitor cannot check, on a
 * page about a property they have every reason to be sceptical of. The panel
 * beside the headline now carries a real passphrase and the three crack times
 * behind it, which is the same argument made in numbers.
 */
export default function CredentialHero({ hero, locale, sample }: CredentialHeroProps) {
  const { t } = useTranslations();

  return (
    <LandingHero
      facts={FACTS.map((fact) => t(`credentialLanding.eyebrow.${fact}`))}
      title={hero.title}
      /* "Passwords, passphrases, keys and tokens" does not fit sixteen. */
      titleWidth="max-w-[18ch]"
      lede={hero.subtitle}
      actions={[
        { label: hero.ctaPrimary, href: `/${locale}/credential-generator/tool` },
        { label: hero.ctaSecondary, href: '#tools' },
      ]}
      showcase={<CredentialShowcase sample={sample} />}
    />
  );
}
