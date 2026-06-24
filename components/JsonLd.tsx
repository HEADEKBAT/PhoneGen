const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'phone-gen.vercel.app';
const siteUrl = rawSiteUrl.startsWith('http') ? rawSiteUrl : `https://${rawSiteUrl}`;

const schema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'PhoneGen',
  description:
    'Generate valid phone numbers that pass libphonenumber-js validation. Free generator for 85+ countries with international, national, E.164 formats. Official test numbers included.',
  url: siteUrl,
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'All',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  author: {
    '@type': 'Person',
    name: 'PhoneGen',
  },
};

export default function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
