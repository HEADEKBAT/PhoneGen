import { PLATFORM_CONFIG, BASE_URL } from '@/lib/config';

const siteUrl = BASE_URL;

/**
 * Global JSON-LD structured data — renders Organization + WebSite schema.
 *
 * Injected once in the root layout. Page-specific JSON-LD (FAQ, Breadcrumb,
 * Product) is injected by individual page components.
 */
const schemas = [
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: PLATFORM_CONFIG.name,
    description: PLATFORM_CONFIG.description,
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    sameAs: [
      PLATFORM_CONFIG.social.github,
    ].filter(Boolean),
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: PLATFORM_CONFIG.name,
    description: PLATFORM_CONFIG.description,
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  },
];

export default function JsonLd() {
  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
