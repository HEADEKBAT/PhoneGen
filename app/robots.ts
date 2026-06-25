import type { MetadataRoute } from 'next';

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'www.gencore.space';
const siteUrl = rawSiteUrl.startsWith('http') ? rawSiteUrl : `https://${rawSiteUrl}`;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
