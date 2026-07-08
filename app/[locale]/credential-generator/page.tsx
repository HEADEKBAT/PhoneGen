import { type Metadata } from 'next';
import { getProduct, generateMetadata as seoGenerateMetadata, type SEOProductPage } from '@/lib/config';
import { CREDENTIAL_LANDING, getLocalizedCredentialLanding, getLocalizedFAQs } from '@/lib/config/credentialLanding';
import { ALL_PRESETS } from '@/lib/config/credentialPresets';
import { getT } from '@/lib/i18n/server';
import Breadcrumb from '@/components/Breadcrumb';
import {
  CredentialHero,
  AudienceSection,
  ToolGrid,
  PresetSection,
  SecuritySection,
  SupportedFormats,
  UseCases,
  LearnSection,
  TrustSection,
  EcosystemSection,
  CredentialFAQ,
} from '@/components/credential-landing';
import { CTASection } from '@/components/product-landing';

type Props = {
  params: Promise<{ locale: string }>;
};

const TITLES: Record<string, string> = {
  en: 'Credential Generator — Password, PIN, Secret & API Key Generator',
  fr: 'Générateur de mots de passe — PIN, secrets et clés API',
  es: 'Generador de credenciales — Contraseñas, PIN, secretos y claves API',
  pt: 'Gerador de credenciais — Senhas, PIN, segredos e chaves de API',
  de: 'Passwort-Generator — PIN, Geheimnisse und API-Schlüssel',
  ru: 'Генератор учетных данных — Пароли, PIN, секреты и API ключи',
};

const DESCRIPTIONS: Record<string, string> = {
  en: 'Generate secure passwords, memorable passphrases, PIN codes, API keys, JWT secrets, UUIDs, and more. Free client-side credential generator.',
  fr: 'Générez des mots de passe sécurisés, phrases de passe, codes PIN, clés API, secrets JWT, UUID et plus. Générateur côté client gratuit.',
  es: 'Genere contraseñas seguras, frases de contraseña, códigos PIN, claves API, secretos JWT, UUID y más. Generador gratuito.',
  pt: 'Gere senhas seguras, frases secretas, códigos PIN, chaves de API, segredos JWT, UUID e muito mais. Gerador gratuito.',
  de: 'Generieren Sie sichere Passwörter, Passphrasen, PIN-Codes, API-Schlüssel, JWT-Geheimnisse, UUIDs und mehr. Kostenloser Generator.',
  ru: 'Генерируйте безопасные пароли, запоминающиеся фразы, PIN-коды, API ключи, JWT секреты, UUID и многое другое. Бесплатный генератор.',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const product = getProduct('credential')!;

  return seoGenerateMetadata({
    type: 'product',
    locale,
    product,
    title: TITLES[locale] || TITLES.en,
    description: DESCRIPTIONS[locale] || DESCRIPTIONS.en,
  } satisfies SEOProductPage);
}

export default async function CredentialGeneratorLanding({ params }: Props) {
  const { locale } = await params;
  const { hero, audience, tools, security, formats, useCases, learnArticles, trust, ecosystem } = getLocalizedCredentialLanding(locale);
  const faqs = getLocalizedFAQs(locale);
  const t = getT(locale);
  const st = (key: string) => t(`credentialLanding.sections.${key}`);

  return (
    <div className="flex min-h-screen flex-col">
      <Breadcrumb
        items={[
          { label: t('nav.home'), href: `/${locale}` },
          { label: hero.title, href: `/${locale}/credential-generator` },
        ]}
      />

      <main className="flex-1">
        {/* 1. Hero */}
        <CredentialHero hero={hero} locale={locale} />

        {/* 2. Who Is It For */}
        <AudienceSection audience={audience} title={st('audience_title')} subtitle={st('audience_subtitle')} />

        {/* 3. Popular Tools */}
        <ToolGrid tools={tools} locale={locale} title={st('tools_title')} subtitle={st('tools_subtitle')} />

        {/* 4. Quick Presets */}
        <PresetSection presets={ALL_PRESETS} locale={locale} title={st('presets_title')} subtitle={st('presets_subtitle')} />

        {/* 5. Security */}
        <SecuritySection items={security} title={st('security_title')} subtitle={st('security_subtitle')} />

        {/* 6. Supported Formats */}
        <SupportedFormats formats={formats} title={st('formats_title')} subtitle={st('formats_subtitle')} />

        {/* 7. Use Cases */}
        <UseCases useCases={useCases} locale={locale} title={st('use_cases_title')} subtitle={st('use_cases_subtitle')} />

        {/* 8. Learn */}
        <LearnSection articles={learnArticles} title={st('learn_title')} subtitle={st('learn_subtitle')} />

        {/* 9. Trust */}
        <TrustSection items={trust} title={st('trust_title')} />

        {/* 10. Ecosystem */}
        <EcosystemSection links={ecosystem} locale={locale} title={st('ecosystem_title')} subtitle={st('ecosystem_subtitle')} flowTitle={st('flow_title')} />

        {/* 11. FAQ */}
        <CredentialFAQ faqs={faqs} />

        {/* 12. CTA */}
        <CTASection
          labelKey="productLanding.credential.ctaLabel"
          href={`/${locale}/credential-generator/tool`}
        />
      </main>
    </div>
  );
}
