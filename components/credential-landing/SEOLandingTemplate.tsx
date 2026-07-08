import Breadcrumb from '@/components/Breadcrumb';
import SEOHero from './SEOHero';
import ToolQuickPreview from './ToolQuickPreview';
import CredentialFAQ from './CredentialFAQ';
import { CTASection } from '@/components/product-landing';
import type { SEOPageConfig } from '@/lib/config/credentialSEOPages';

interface SEOLandingPageProps {
  locale: string;
  config: SEOPageConfig;
}

/**
 * Renders an SEO landing page for a credential generator sub-type.
 */
export default function SEOLandingPage({ locale, config }: SEOLandingPageProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Breadcrumb
        items={[
          { label: 'GenCore', href: `/${locale}` },
          { label: 'Credential Generator', href: `/${locale}/credential-generator` },
          { label: config.heroTitle, href: `/${locale}/${config.slug}` },
        ]}
      />

      <main className="flex-1">
        <SEOHero
          title={config.heroTitle}
          subtitle={config.heroSubtitle}
          ctaHref={`/${locale}/credential-generator/tool?mode=${config.mode}`}
        />

        <ToolQuickPreview mode={config.mode} />

        <CredentialFAQ faqs={config.faqs} title="Frequently Asked Questions" />

        <CTASection
          labelKey={`Generate ${config.heroTitle}`}
          href={`/${locale}/credential-generator/tool?mode=${config.mode}`}
        />
      </main>
    </div>
  );
}
