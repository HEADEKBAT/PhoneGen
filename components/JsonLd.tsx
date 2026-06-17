const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'phone-gen.vercel.app';
const siteUrl = rawSiteUrl.startsWith('http') ? rawSiteUrl : `https://${rawSiteUrl}`;

const schema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'PhoneGen',
  description:
    'Бесплатный онлайн-генератор валидных телефонных номеров для 100+ стран. Международный, национальный и E.164 форматы.',
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
