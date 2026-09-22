import { type Metadata } from 'next';
import { getProduct, generateMetadata as seoGenerateMetadata, type SEOProductPage } from '@/lib/config';
import { getLocalizedCredentialLanding, getLocalizedFAQs } from '@/lib/config/credentialLanding';
import { ALL_PRESETS } from '@/lib/config/credentialPresets';
import { getHeroSample, getToolSamples } from '@/lib/credential/samples';
import { getT } from '@/lib/i18n/server';
import Breadcrumb from '@/components/Breadcrumb';
import {
  CredentialHero,
  CredentialTools,
  CredentialPresets,
  CredentialSecurity,
  CredentialEcosystem,
  CredentialUseCases,
} from '@/components/credential-landing';
import { LandingClosing, LandingFaq } from '@/components/product-landing';

type Props = {
  params: Promise<{ locale: string }>;
};

const TITLES: Record<string, string> = {
  en: 'Credential Generator',
  fr: 'Générateur de mots de passe',
  es: 'Generador de credenciales',
  pt: 'Gerador de credenciais',
  de: 'Passwort-Generator',
  ru: 'Генератор учетных данных',
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
  const { hero, tools, useCases, ecosystem } = getLocalizedCredentialLanding(locale);
  const faqs = getLocalizedFAQs(locale);
  const t = getT(locale);
  const st = (key: string) => t(`credentialLanding.sections.${key}`);

  /* Generated here, by the real generators, so the page cannot show a shape
     the tool would not produce. See lib/credential/samples.ts. */
  const heroSample = getHeroSample();
  const toolSamples = getToolSamples();

  return (
    <div className="flex min-h-screen flex-col">
      <Breadcrumb
        items={[
          { label: t('nav.home'), href: `/${locale}` },
          { label: hero.title, href: `/${locale}/credential-generator` },
        ]}
      />

      <main className="flex-1">
        <CredentialHero hero={hero} locale={locale} sample={heroSample} />

        <CredentialTools tools={tools} samples={toolSamples} locale={locale} />

        <CredentialSecurity title={st('security_title')} subtitle={st('security_subtitle')} />

        <CredentialPresets
          presets={ALL_PRESETS}
          locale={locale}
          title={st('presets_title')}
          subtitle={st('presets_subtitle')}
          ctaLabel={st('view_all')}
        />

        <CredentialUseCases
          useCases={useCases}
          locale={locale}
          title={st('use_cases_title')}
          subtitle={st('use_cases_subtitle')}
          ctaLabel={st('generate_cta')}
        />

        <CredentialEcosystem
          links={ecosystem}
          locale={locale}
          title={st('ecosystem_title')}
          subtitle={st('ecosystem_subtitle')}
        />

        <LandingFaq
          title={t('productLanding.faqTitle')}
          items={faqs.map((_faq, i) => ({
            question: t(`credentialLanding.faqs.${i}.q`),
            answer: t(`credentialLanding.faqs.${i}.a`),
          }))}
        />

        <LandingClosing
          title={t('credentialLanding.closing.title')}
          body={t('credentialLanding.closing.body')}
          cta={t('credentialLanding.hero.ctaPrimary')}
          href={`/${locale}/credential-generator/tool`}
        />
      </main>
    </div>
  );
}

/*
 * Four sections are gone, and none of them are coming back as they were.
 *
 * "Who is it for" — four emoji cards labelled Developers, QA, DevOps and
 * Everyone, each with a list of chips. It told a visitor which of four boxes
 * they fell into and nothing about the product.
 *
 * "Supported formats" — twelve badges with no links and no content behind
 * them, decorating a list the tools section already spells out.
 *
 * "Trusted by developers worldwide" — six unsourced assertions under a
 * headline that is a claim about popularity with nothing behind it.
 *
 * "Learn about credential security" — ten cards, every href a "#".
 *
 * What replaced them is one section that shows what each of the eleven
 * generators actually emits, and one that makes four claims a visitor can
 * check from this page.
 */
