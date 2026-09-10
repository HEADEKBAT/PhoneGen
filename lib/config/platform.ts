/**
 * Platform Config — single source of truth for GenCore platform metadata.
 *
 * All platform-wide settings (brand, social, SEO, announcement).
 *
 * `stats` and `roadmap` used to live here as hand-written English arrays and
 * were rendered by two home-page sections. Both are gone: the numbers now come
 * from the registries that decide them (the strip claimed "8+ Products" while
 * sixteen were live), and the roadmap is the planned products themselves,
 * read from PRODUCTS and translated like everything else.
 * live here. Components and pages read from this file; never hardcode
 * platform strings outside this file.
 */

export interface PlatformConfig {
  /** Brand name */
  name: string;
  /** Short tagline (shown in hero, meta description) */
  tagline: string;
  /** Full description for meta and about pages */
  description: string;
  /** Production domain (no protocol) */
  domain: string;
  /** GitHub org/repo */
  github: string;
  /** Platform statistics shown on homepage */
  /** Social links */
  social: {
    github: string;
    twitter?: string;
    discord?: string;
  };
  /** Optional announcement bar (null = hidden) */
  announcement: { text: string; href?: string } | null;
  /** Footer section links */
  footerLinks: {
    section: string;
    links: { label: string; href: string }[];
  }[];
  /** SEO defaults */
  seo: {
    defaultTitle: string;
    defaultDescription: string;
    openGraph: {
      title: string;
      description: string;
      siteName: string;
    };
    twitter: {
      card: 'summary' | 'summary_large_image';
      title: string;
      description: string;
    };
  };
}

export const PLATFORM_CONFIG: PlatformConfig = {
  name: 'GenCore',
  tagline: 'Data Generation Platform for Developers',
  description:
    'GenCore helps developers, QA engineers, and testers generate realistic, valid test data. ' +
    'One platform, multiple generators — phone numbers, users, addresses, credentials, and more. ' +
    'Free, fast, and powered by open-source libraries.',
  domain: 'www.gencore.space',
  github: 'gencore',

  social: {
    github: 'https://github.com/gencore',
  },

  announcement: null,

  footerLinks: [
    {
      section: 'Products',
      links: [
        { label: 'Phone Generator', href: '/phone-generator' },
        { label: 'User Generator', href: '/user-generator' },
        { label: 'Credential Generator', href: '/credential-generator' },
        { label: 'Address Generator', href: '/address-generator' },
        { label: 'Email Generator', href: '/email-generator' },
        { label: 'Username Generator', href: '/username-generator' },
        { label: 'Color Studio', href: '/color-generator' },
        { label: 'Company Generator', href: '/company-generator' },
      ],
    },
    {
      section: 'Resources',
      links: [
        { label: 'About', href: '/about' },
        { label: 'Documentation', href: '#' },
        { label: 'GitHub', href: 'https://github.com/gencore' },
      ],
    },
    {
      section: 'Legal',
      links: [
        { label: 'Privacy', href: '#' },
        { label: 'Terms', href: '#' },
      ],
    },
  ],

  seo: {
    defaultTitle: 'GenCore — Data Generation Platform for Developers',
    defaultDescription:
      'Generate realistic, valid test data for development and testing. ' +
      'Free platform with phone numbers, users, addresses, credentials, and more.',
    openGraph: {
      title: 'GenCore — Data Generation Platform',
      description:
        'Generate realistic, valid test data for development and testing. ' +
        'Free platform with multiple generators.',
      siteName: 'GenCore',
    },
    twitter: {
      card: 'summary',
      title: 'GenCore — Data Generation Platform',
      description:
        'Generate realistic, valid test data for development and testing. Free platform with multiple generators.',
    },
  },
};
