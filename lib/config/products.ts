/**
 * Products Registry — single source of truth for all GenCore products.
 *
 * Every product is a data object. Adding a new product means adding one
 * entry to `PRODUCTS` below. No component changes needed.
 *
 * The registry drives: home page product grid, header navigation, footer,
 * sitemap, SEO metadata, landing pages, and internal linking.
 */

export interface Product {
  /** Unique identifier (e.g. "phone", "user") */
  id: string;
  /** URL path segment (e.g. "phone-generator") */
  slug: string;
  /** Display name */
  title: string;
  /** Short description for cards and meta tags */
  description: string;
  /** Lucide icon name */
  icon: string;
  /** Product category for grouping */
  category: ProductCategory;
  /** Feature flag */
  status: 'active' | 'beta' | 'coming-soon' | 'planned';
  /** Whether to show on homepage featured section */
  featured: boolean;
  /** Locales this product supports (empty = all) */
  supportedLocales: string[];
  /** Whether this product has country-specific pages */
  hasCountries: boolean;
  /** SEO sitemap priority (0.0 – 1.0) */
  seoPriority: number;
  /** Theme accent color */
  themeColor?: string;
}

export type ProductCategory =
  | 'contact'
  | 'identity'
  | 'credentials'
  | 'content'
  | 'finance'
  | 'development'
  | 'vehicle'
  | 'design';

export const PRODUCTS: Record<string, Product> = {
  phone: {
    id: 'phone',
    slug: 'phone-generator',
    title: 'Phone Generator',
    description: 'Generate valid phone numbers that pass libphonenumber-js validation for 245+ countries.',
    icon: 'Phone',
    category: 'contact',
    status: 'active',
    featured: true,
    supportedLocales: [],
    hasCountries: true,
    seoPriority: 1.0,
  },
  user: {
    id: 'user',
    slug: 'user-generator',
    title: 'User Generator',
    description: 'Generate realistic user profiles with names, addresses, email, and phone numbers.',
    icon: 'Users',
    category: 'identity',
    status: 'active',
    featured: true,
    supportedLocales: [],
    hasCountries: true,
    seoPriority: 0.9,
  },
  credential: {
    id: 'credential',
    slug: 'credential-generator',
    title: 'Credential Generator',
    description: 'Generate secure passwords, passphrases, PINs, API keys, credential pairs, and random tokens for authentication testing.',
    icon: 'Key',
    category: 'credentials',
    status: 'active',
    featured: true,
    supportedLocales: [],
    hasCountries: false,
    seoPriority: 0.8,
  },
  address: {
    id: 'address',
    slug: 'address-generator',
    title: 'Address Generator',
    description: 'Generate realistic street addresses, cities, postal codes, and full address details for countries worldwide.',
    icon: 'MapPin',
    category: 'identity',
    status: 'active',
    featured: false,
    supportedLocales: [],
    hasCountries: true,
    seoPriority: 0.8,
  },
  email: {
    id: 'email',
    slug: 'email-generator',
    title: 'Email Generator',
    description: 'Generate realistic email addresses in multiple formats including Gmail-style, custom domain, and disposable email patterns.',
    icon: 'Mail',
    category: 'contact',
    status: 'active',
    featured: false,
    supportedLocales: [],
    hasCountries: false,
    seoPriority: 0.8,
  },
  username: {
    id: 'username',
    slug: 'username-generator',
    title: 'Username Generator',
    description: 'Generate unique usernames for testing authentication systems with configurable patterns, styles, and naming conventions.',
    icon: 'User',
    category: 'identity',
    status: 'active',
    featured: false,
    supportedLocales: [],
    hasCountries: false,
    seoPriority: 0.8,
  },
  company: {
    id: 'company',
    slug: 'company-generator',
    title: 'Company Generator',
    description: 'Generate fictional company profiles with industry data, revenue, employee count, and business information for testing.',
    icon: 'Building',
    category: 'identity',
    status: 'active',
    featured: false,
    supportedLocales: [],
    hasCountries: false,
    seoPriority: 0.8,
  },

  /* ── Future Products (planned / coming-soon) ─────────────────────────── */

  uuid: {
    id: 'uuid',
    slug: 'uuid-generator',
    title: 'UUID Generator',
    description: 'Generate UUID v4, v7, and custom identifiers for database primary keys, API IDs, and distributed system identification.',
    icon: 'Hash',
    category: 'development',
    status: 'active',
    featured: false,
    supportedLocales: [],
    hasCountries: false,
    seoPriority: 0.6,
  },
  lorem: {
    id: 'lorem',
    slug: 'lorem-ipsum-generator',
    title: 'Lorem Ipsum Generator',
    description: 'Generate placeholder text for design and layout mockups.',
    icon: 'TextQuote',
    category: 'content',
    status: 'planned',
    featured: false,
    supportedLocales: [],
    hasCountries: false,
    seoPriority: 0.5,
  },
  qr: {
    id: 'qr',
    slug: 'qr-generator',
    title: 'QR Code Generator',
    description: 'Generate QR codes for URLs, text, and contact data.',
    icon: 'QrCode',
    category: 'development',
    status: 'planned',
    featured: false,
    supportedLocales: [],
    hasCountries: false,
    seoPriority: 0.5,
  },
  barcode: {
    id: 'barcode',
    slug: 'barcode-generator',
    title: 'Barcode Generator',
    description: 'Generate EAN-13, UPC-A, Code 128, and other barcodes. Free online barcode generator.',
    icon: 'Scan',
    category: 'development',
    status: 'active',
    featured: true,
    supportedLocales: [],
    hasCountries: false,
    seoPriority: 0.9,
  },
  creditCard: {
    id: 'creditCard',
    slug: 'credit-card-generator',
    title: 'Credit Card Generator',
    description: 'Generate valid credit card numbers for testing payment systems.',
    icon: 'CreditCard',
    category: 'finance',
    status: 'planned',
    featured: false,
    supportedLocales: [],
    hasCountries: false,
    seoPriority: 0.4,
  },
  iban: {
    id: 'iban',
    slug: 'iban-generator',
    title: 'IBAN Generator',
    description: 'Generate valid IBAN numbers for international bank testing.',
    icon: 'Landmark',
    category: 'finance',
    status: 'planned',
    featured: false,
    supportedLocales: [],
    hasCountries: true,
    seoPriority: 0.4,
  },
  vehicle: {
    id: 'vehicle',
    slug: 'vehicle-generator',
    title: 'Vehicle Generator',
    description: 'Generate realistic vehicle data — VIN, plates, make, model, year.',
    icon: 'Car',
    category: 'vehicle',
    status: 'planned',
    featured: false,
    supportedLocales: [],
    hasCountries: true,
    seoPriority: 0.5,
  },
  cryptoWallet: {
    id: 'cryptoWallet',
    slug: 'crypto-wallet-generator',
    title: 'Crypto Wallet Generator',
    description: 'Generate cryptocurrency wallet addresses for testing.',
    icon: 'Wallet',
    category: 'finance',
    status: 'planned',
    featured: false,
    supportedLocales: [],
    hasCountries: false,
    seoPriority: 0.3,
  },
  licensePlate: {
    id: 'licensePlate',
    slug: 'license-plate-generator',
    title: 'License Plate Generator',
    description: 'Generate realistic license plates for multiple countries.',
    icon: 'FileBadge',
    category: 'vehicle',
    status: 'planned',
    featured: false,
    supportedLocales: [],
    hasCountries: true,
    seoPriority: 0.4,
  },
  mockApi: {
    id: 'mockApi',
    slug: 'mock-api-generator',
    title: 'Mock API Generator',
    description: 'Generate mock REST and GraphQL API endpoints for development.',
    icon: 'Server',
    category: 'development',
    status: 'planned',
    featured: false,
    supportedLocales: [],
    hasCountries: false,
    seoPriority: 0.3,
  },
  json: {
    id: 'json',
    slug: 'json-generator',
    title: 'JSON Generator',
    description: 'Generate realistic JSON data structures for API testing.',
    icon: 'Braces',
    category: 'development',
    status: 'planned',
    featured: false,
    supportedLocales: [],
    hasCountries: false,
    seoPriority: 0.4,
  },
  color: {
    id: 'color',
    slug: 'color-generator',
    title: 'Color Generator',
    description: 'Generate random colors with HEX, RGB, HSL, and CMYK values.',
    icon: 'Palette',
    category: 'design',
    status: 'planned',
    featured: false,
    supportedLocales: [],
    hasCountries: false,
    seoPriority: 0.3,
  },
  text: {
    id: 'text',
    slug: 'text-generator',
    title: 'Text Generator',
    description: 'Generate random text strings, sentences, paragraphs for testing.',
    icon: 'FileText',
    category: 'content',
    status: 'planned',
    featured: false,
    supportedLocales: [],
    hasCountries: false,
    seoPriority: 0.4,
  },
} as const;

/** Array of all products (sorted by title). */
export const ALL_PRODUCTS = Object.values(PRODUCTS).sort((a, b) =>
  a.title.localeCompare(b.title),
);

/** Array of active/enabled products (status = 'active' or 'beta'). */
export const ENABLED_PRODUCTS = ALL_PRODUCTS.filter(
  (p) => p.status === 'active' || p.status === 'beta',
);

/** Array of featured products. */
export const FEATURED_PRODUCTS = ALL_PRODUCTS.filter(
  (p) => p.featured && (p.status === 'active' || p.status === 'beta'),
);

/** Array of coming-soon products. */
export const COMING_SOON_PRODUCTS = ALL_PRODUCTS.filter(
  (p) => p.status === 'coming-soon' || p.status === 'planned',
);

/** Array of all product slugs. */
export const PRODUCT_SLUGS = ALL_PRODUCTS.map((p) => p.slug);

/** Map of product id → product. */
export function getProduct(id: string): Product | undefined {
  return PRODUCTS[id];
}

/** Get products by category. */
export function getProductsByCategory(category: ProductCategory): Product[] {
  return ALL_PRODUCTS.filter((p) => p.category === category);
}

/** Lucide icon map for dynamic icon resolution. */
export const PRODUCT_ICONS: Record<string, string> = Object.fromEntries(
  ALL_PRODUCTS.map((p) => [p.id, p.icon]),
);
