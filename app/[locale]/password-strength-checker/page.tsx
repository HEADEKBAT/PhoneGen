import { type Metadata } from 'next';
import { generateMetadata as seoGenerateMetadata, type SEOCustomPage } from '@/lib/config';
import { SEO_PAGES } from '@/lib/config/credentialSEOPages';
import SEOLandingPage from '@/components/credential-landing/SEOLandingTemplate';

type Props = {
  params: Promise<{ locale: string }>;
};

const TITLES: Record<string, string> = {
  'en': 'Password Strength Checker — Analyze Password Security',
  'ru': 'Проверка надежности пароля — Анализ безопасности',
  'de': 'Passwort-Stärke-Prüfung — Sicherheitsanalyse',
  'es': 'Comprobador de seguridad de contraseña — Análisis',
  'fr': 'Vérificateur de force de mot de passe — Analyse',
  'pt': 'Verificador de força de senha — Análise de segurança',
};

const DESCRIPTIONS: Record<string, string> = {
  'en': 'Check password strength, calculate entropy, estimate crack time. Free client-side password analyzer.',
  'ru': 'Проверьте надежность пароля. Бесплатный анализатор.',
  'de': 'Prüfen Sie die Passwortstärke. Kostenloser Analysator.',
  'es': 'Compruebe la seguridad de la contraseña. Analizador gratuito.',
  'fr': 'Vérifiez la force du mot de passe. Analyseur gratuit.',
  'pt': 'Verifique a força da senha. Analisador gratuito.',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const title = TITLES[locale] || TITLES.en;
  const description = DESCRIPTIONS[locale] || DESCRIPTIONS.en;

  return seoGenerateMetadata({
    type: 'custom',
    locale,
    path: '/password-strength-checker',
    title,
    description,
  } satisfies SEOCustomPage);
}

export default async function PasswordStrengthCheckerPage({ params }: Props) {
  const { locale } = await params;
  const config = SEO_PAGES['password-strength-checker'];
  return <SEOLandingPage locale={locale} config={config} />;
}
