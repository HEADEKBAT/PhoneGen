/**
 * Generators Registry — the master registry for every generator on the platform.
 *
 * Each generator is a "tool" within a product. For example, the Phone product
 * has generators for mobile, fixed-line, toll-free, and VoIP numbers.
 *
 * This registry is used for:
 *   - Product landing pages (which generators does this product offer?)
 *   - Search (Ctrl+K / Command Palette)
 *   - Sitemap (generator-specific SEO pages)
 *   - Breadcrumbs
 *   - Related / recommended generators
 *   - Internal linking
 *
 * Adding a new generator = one entry in this file. No component changes.
 */

export type GeneratorStatus = 'active' | 'beta' | 'coming-soon' | 'planned';

export type GeneratorCategory =
  | 'phone'
  | 'user'
  | 'email'
  | 'username'
  | 'company'
  | 'address'
  | 'password'
  | 'credential'
  | 'uuid'
  | 'text'
  | 'design'
  | 'finance'
  | 'vehicle'
  | 'development';

export interface Generator {
  /** Unique identifier (e.g. "phone-mobile", "user-profile") */
  id: string;
  /** ID of the parent product (must match a key in PRODUCTS) */
  productId: string;
  /** URL path segment within the product (e.g. "mobile") */
  slug: string;
  /** Human-readable title */
  title: string;
  /** Short description for cards and meta */
  description: string;
  /** Feature flag */
  status: GeneratorStatus;
  /** Whether to show as a featured tool */
  featured: boolean;
  /** SEO priority (0.0 – 1.0) */
  seoPriority: number;
  /** Which country codes this generator supports (empty = no country pages) */
  supportedCountries: string[];
  /** Which locales this generator supports (empty = all) */
  supportedLocales: string[];
  /** Category for grouping and recommendations */
  category: GeneratorCategory;
  /** Lucide icon name */
  icon: string;
  /** Search keywords */
  keywords: string[];
  /** JSON-LD schema type (e.g. "WebApplication", "SoftwareApplication") */
  schemaType: string;
}

export const GENERATORS: Record<string, Generator> = {
  /* ── Phone Generators ────────────────────────────────────────────────── */
  'phone-mobile': {
    id: 'phone-mobile',
    productId: 'phone',
    slug: 'mobile',
    title: 'Mobile Phone Numbers',
    description: 'Generate valid mobile phone numbers that pass libphonenumber-js validation.',
    status: 'active',
    featured: true,
    seoPriority: 0.9,
    supportedCountries: [],
    supportedLocales: [],
    category: 'phone',
    icon: 'Smartphone',
    keywords: ['mobile phone', 'cell phone', 'mobile number', 'phone number generator'],
    schemaType: 'WebApplication',
  },
  'phone-fixed-line': {
    id: 'phone-fixed-line',
    productId: 'phone',
    slug: 'fixed-line',
    title: 'Fixed Line Phone Numbers',
    description: 'Generate valid landline phone numbers for any country.',
    status: 'active',
    featured: false,
    seoPriority: 0.8,
    supportedCountries: [],
    supportedLocales: [],
    category: 'phone',
    icon: 'Phone',
    keywords: ['landline', 'fixed line', 'home phone', 'telephone number'],
    schemaType: 'WebApplication',
  },
  'phone-toll-free': {
    id: 'phone-toll-free',
    productId: 'phone',
    slug: 'toll-free',
    title: 'Toll-Free Phone Numbers',
    description: 'Generate valid toll-free numbers including 800, 888, and other prefixes.',
    status: 'active',
    featured: false,
    seoPriority: 0.8,
    supportedCountries: [],
    supportedLocales: [],
    category: 'phone',
    icon: 'PhoneOff',
    keywords: ['toll free', '800 number', 'freephone', 'toll-free number'],
    schemaType: 'WebApplication',
  },
  'phone-voip': {
    id: 'phone-voip',
    productId: 'phone',
    slug: 'voip',
    title: 'VoIP Phone Numbers',
    description: 'Generate valid VoIP phone numbers for internet-based calling.',
    status: 'active',
    featured: false,
    seoPriority: 0.8,
    supportedCountries: [],
    supportedLocales: [],
    category: 'phone',
    icon: 'Radio',
    keywords: ['voip', 'internet phone', 'voice over ip', 'voip number'],
    schemaType: 'WebApplication',
  },

  /* ── User Generators ─────────────────────────────────────────────────── */
  'user-profile': {
    id: 'user-profile',
    productId: 'user',
    slug: 'tool',
    title: 'User Profiles',
    description: 'Generate realistic user profiles with names, email, phone, and addresses.',
    status: 'active',
    featured: true,
    seoPriority: 0.8,
    supportedCountries: [],
    supportedLocales: [],
    category: 'user',
    icon: 'Users',
    keywords: ['user generator', 'fake user', 'test user', 'user profile'],
    schemaType: 'WebApplication',
  },

  /* ── Credential Generators ───────────────────────────────────────────── */
  'credential-password': {
    id: 'credential-password',
    productId: 'credential',
    slug: 'tool',
    title: 'Password Generator',
    description: 'Generate secure random passwords with configurable complexity.',
    status: 'active',
    featured: true,
    seoPriority: 0.8,
    supportedCountries: [],
    supportedLocales: [],
    category: 'password',
    icon: 'Key',
    keywords: ['password generator', 'secure password', 'random password', 'strong password'],
    schemaType: 'WebApplication',
  },
  'credential-passphrase': {
    id: 'credential-passphrase',
    productId: 'credential',
    slug: 'tool',
    title: 'Passphrase Generator',
    description: 'Generate memorable passphrases using word lists.',
    status: 'active',
    featured: false,
    seoPriority: 0.7,
    supportedCountries: [],
    supportedLocales: [],
    category: 'password',
    icon: 'KeyRound',
    keywords: ['passphrase', 'memorable password', 'word list', 'diceware'],
    schemaType: 'WebApplication',
  },
  'credential-pin': {
    id: 'credential-pin',
    productId: 'credential',
    slug: 'tool',
    title: 'PIN Generator',
    description: 'Generate numeric PIN codes of configurable length.',
    status: 'active',
    featured: false,
    seoPriority: 0.6,
    supportedCountries: [],
    supportedLocales: [],
    category: 'credential',
    icon: 'Scan',
    keywords: ['pin code', 'pin generator', 'numeric password', 'atm pin'],
    schemaType: 'WebApplication',
  },

  /* ── Address Generator ───────────────────────────────────────────────── */
  'address-generic': {
    id: 'address-generic',
    productId: 'address',
    slug: 'tool',
    title: 'Address Generator',
    description: 'Generate valid addresses for countries worldwide.',
    status: 'active',
    featured: true,
    seoPriority: 0.8,
    supportedCountries: [],
    supportedLocales: [],
    category: 'address',
    icon: 'MapPin',
    keywords: ['address generator', 'fake address', 'test address', 'street address'],
    schemaType: 'WebApplication',
  },

  /* ── Email Generator ─────────────────────────────────────────────────── */
  'email-generic': {
    id: 'email-generic',
    productId: 'email',
    slug: 'tool',
    title: 'Email Generator',
    description: 'Generate realistic email addresses in multiple formats.',
    status: 'active',
    featured: true,
    seoPriority: 0.8,
    supportedCountries: [],
    supportedLocales: [],
    category: 'email',
    icon: 'Mail',
    keywords: ['email generator', 'fake email', 'test email', 'email address'],
    schemaType: 'WebApplication',
  },

  /* ── Username Generator ──────────────────────────────────────────────── */
  'username-generic': {
    id: 'username-generic',
    productId: 'username',
    slug: 'tool',
    title: 'Username Generator',
    description: 'Generate unique usernames for testing authentication systems.',
    status: 'active',
    featured: true,
    seoPriority: 0.8,
    supportedCountries: [],
    supportedLocales: [],
    category: 'username',
    icon: 'User',
    keywords: ['username generator', 'fake username', 'test username', 'login name'],
    schemaType: 'WebApplication',
  },

  /* ── Company Generator ───────────────────────────────────────────────── */
  'company-generic': {
    id: 'company-generic',
    productId: 'company',
    slug: 'tool',
    title: 'Company Generator',
    description: 'Generate fictional company profiles with industry data.',
    status: 'active',
    featured: true,
    seoPriority: 0.8,
    supportedCountries: [],
    supportedLocales: [],
    category: 'company',
    icon: 'Building',
    keywords: ['company generator', 'fake company', 'business generator', 'test company'],
    schemaType: 'WebApplication',
  },

  /* ── UUID Generator ──────────────────────────────────────────────────── */
  'uuid-generic': {
    id: 'uuid-generic',
    productId: 'uuid',
    slug: 'tool',
    title: 'UUID Generator',
    description: 'Generate UUID v4 and v7 identifiers.',
    status: 'active',
    featured: true,
    seoPriority: 0.7,
    supportedCountries: [],
    supportedLocales: [],
    category: 'uuid',
    icon: 'Hash',
    keywords: ['uuid', 'uuid generator', 'guid', 'unique identifier', 'random id'],
    schemaType: 'WebApplication',
  },

  /* ── Credential: UUID v7 ────────────────────────────────────────────── */
  'credential-uuid-v7': {
    id: 'credential-uuid-v7',
    productId: 'credential',
    slug: 'tool',
    title: 'UUID v7 Generator',
    description: 'Generate time-ordered UUID v7 identifiers per RFC 9562.',
    status: 'active',
    featured: false,
    seoPriority: 0.6,
    supportedCountries: [],
    supportedLocales: [],
    category: 'uuid',
    icon: 'Clock',
    keywords: ['uuid v7', 'uuid v7 generator', 'time-ordered uuid', 'rfc 9562'],
    schemaType: 'WebApplication',
  },

  /* ── Credential: Random Token ────────────────────────────────────────── */
  'credential-random-token': {
    id: 'credential-random-token',
    productId: 'credential',
    slug: 'tool',
    title: 'Random Token Generator',
    description: 'Generate cryptographically random tokens in hex, base64, or base64url.',
    status: 'active',
    featured: false,
    seoPriority: 0.6,
    supportedCountries: [],
    supportedLocales: [],
    category: 'credential',
    icon: 'Shuffle',
    keywords: ['random token', 'token generator', 'one-time code', 'auth token'],
    schemaType: 'WebApplication',
  },

  /* ── Credential: Session Secret ──────────────────────────────────────── */
  'credential-session-secret': {
    id: 'credential-session-secret',
    productId: 'credential',
    slug: 'tool',
    title: 'Session Secret Generator',
    description: 'Generate secure session signing secrets for web applications.',
    status: 'active',
    featured: false,
    seoPriority: 0.6,
    supportedCountries: [],
    supportedLocales: [],
    category: 'credential',
    icon: 'ShieldCheck',
    keywords: ['session secret', 'session key', 'cookie secret', 'session signing'],
    schemaType: 'WebApplication',
  },

  /* ── Credential: OAuth Secret ────────────────────────────────────────── */
  'credential-oauth-secret': {
    id: 'credential-oauth-secret',
    productId: 'credential',
    slug: 'tool',
    title: 'OAuth Secret Generator',
    description: 'Generate OAuth 2.0 client secrets for authentication flows.',
    status: 'active',
    featured: false,
    seoPriority: 0.6,
    supportedCountries: [],
    supportedLocales: [],
    category: 'credential',
    icon: 'Lock',
    keywords: ['oauth secret', 'oauth2', 'client secret', 'oauth client'],
    schemaType: 'WebApplication',
  },
  /* ── Barcode Generators ──────────────────────────────────────────────────── */
  'barcode-ean13': {
    id: 'barcode-ean13',
    productId: 'barcode',
    slug: 'tool',
    title: 'EAN-13 Barcode Generator',
    description: 'Generate EAN-13 barcodes for retail products with automatic check digit calculation.',
    status: 'active',
    featured: true,
    seoPriority: 0.9,
    supportedCountries: [],
    supportedLocales: [],
    category: 'development',
    icon: 'Scan',
    keywords: ['ean13', 'ean-13', 'barcode', 'retail barcode', 'product barcode'],
    schemaType: 'WebApplication',
  },
  'barcode-ean8': {
    id: 'barcode-ean8',
    productId: 'barcode',
    slug: 'tool',
    title: 'EAN-8 Barcode Generator',
    description: 'Generate EAN-8 barcodes for smaller retail products.',
    status: 'active',
    featured: false,
    seoPriority: 0.8,
    supportedCountries: [],
    supportedLocales: [],
    category: 'development',
    icon: 'Scan',
    keywords: ['ean8', 'ean-8', 'barcode', 'retail barcode'],
    schemaType: 'WebApplication',
  },
  'barcode-upca': {
    id: 'barcode-upca',
    productId: 'barcode',
    slug: 'tool',
    title: 'UPC-A Barcode Generator',
    description: 'Generate UPC-A barcodes for North American retail products.',
    status: 'active',
    featured: true,
    seoPriority: 0.9,
    supportedCountries: [],
    supportedLocales: [],
    category: 'development',
    icon: 'Scan',
    keywords: ['upc', 'upc-a', 'barcode', 'north america', 'retail barcode'],
    schemaType: 'WebApplication',
  },
  'barcode-upce': {
    id: 'barcode-upce',
    productId: 'barcode',
    slug: 'tool',
    title: 'UPC-E Barcode Generator',
    description: 'Generate compact UPC-E barcodes for small retail packaging.',
    status: 'active',
    featured: false,
    seoPriority: 0.8,
    supportedCountries: [],
    supportedLocales: [],
    category: 'development',
    icon: 'Scan',
    keywords: ['upc-e', 'upc', 'compact barcode'],
    schemaType: 'WebApplication',
  },
  'barcode-code128': {
    id: 'barcode-code128',
    productId: 'barcode',
    slug: 'tool',
    title: 'Code 128 Barcode Generator',
    description: 'Generate Code 128 barcodes for logistics, shipping, and inventory.',
    status: 'active',
    featured: true,
    seoPriority: 0.9,
    supportedCountries: [],
    supportedLocales: [],
    category: 'development',
    icon: 'Scan',
    keywords: ['code128', 'code 128', 'barcode', 'logistics', 'shipping'],
    schemaType: 'WebApplication',
  },
  'barcode-code39': {
    id: 'barcode-code39',
    productId: 'barcode',
    slug: 'tool',
    title: 'Code 39 Barcode Generator',
    description: 'Generate Code 39 barcodes for industrial and government applications.',
    status: 'active',
    featured: false,
    seoPriority: 0.8,
    supportedCountries: [],
    supportedLocales: [],
    category: 'development',
    icon: 'Scan',
    keywords: ['code39', 'code 39', 'barcode', 'industrial'],
    schemaType: 'WebApplication',
  },
  'barcode-code93': {
    id: 'barcode-code93',
    productId: 'barcode',
    slug: 'tool',
    title: 'Code 93 Barcode Generator',
    description: 'Generate Code 93 barcodes for high-density alphanumeric encoding.',
    status: 'active',
    featured: false,
    seoPriority: 0.8,
    supportedCountries: [],
    supportedLocales: [],
    category: 'development',
    icon: 'Scan',
    keywords: ['code93', 'code 93', 'barcode', 'high-density'],
    schemaType: 'WebApplication',
  },
  'barcode-codabar': {
    id: 'barcode-codabar',
    productId: 'barcode',
    slug: 'tool',
    title: 'Codabar Barcode Generator',
    description: 'Generate Codabar barcodes for libraries, blood banks, and package tracking.',
    status: 'active',
    featured: false,
    seoPriority: 0.8,
    supportedCountries: [],
    supportedLocales: [],
    category: 'development',
    icon: 'Scan',
    keywords: ['codabar', 'barcode', 'library', 'tracking'],
    schemaType: 'WebApplication',
  },
  'barcode-itf14': {
    id: 'barcode-itf14',
    productId: 'barcode',
    slug: 'tool',
    title: 'ITF-14 Barcode Generator',
    description: 'Generate ITF-14 barcodes for shipping cartons and logistics.',
    status: 'active',
    featured: false,
    seoPriority: 0.8,
    supportedCountries: [],
    supportedLocales: [],
    category: 'development',
    icon: 'Box',
    keywords: ['itf14', 'itf-14', 'barcode', 'shipping', 'logistics'],
    schemaType: 'WebApplication',
  },
  'barcode-gs1-128': {
    id: 'barcode-gs1-128',
    productId: 'barcode',
    slug: 'tool',
    title: 'GS1-128 Barcode Generator',
    description: 'Generate GS1-128 barcodes with application identifiers for supply chain.',
    status: 'active',
    featured: false,
    seoPriority: 0.8,
    supportedCountries: [],
    supportedLocales: [],
    category: 'development',
    icon: 'Scan',
    keywords: ['gs1-128', 'ean-128', 'barcode', 'supply chain'],
    schemaType: 'WebApplication',
  },
  'barcode-gtin': {
    id: 'barcode-gtin',
    productId: 'barcode',
    slug: 'tool',
    title: 'GTIN Barcode Generator',
    description: 'Generate GTIN-12, GTIN-13, and GTIN-14 barcodes for global trade items.',
    status: 'active',
    featured: false,
    seoPriority: 0.8,
    supportedCountries: [],
    supportedLocales: [],
    category: 'development',
    icon: 'Globe',
    keywords: ['gtin', 'global trade item number', 'barcode'],
    schemaType: 'WebApplication',
  },
  'barcode-isbn': {
    id: 'barcode-isbn',
    productId: 'barcode',
    slug: 'tool',
    title: 'ISBN Barcode Generator',
    description: 'Generate ISBN barcodes (ISBN-10 and ISBN-13) for books.',
    status: 'active',
    featured: false,
    seoPriority: 0.8,
    supportedCountries: [],
    supportedLocales: [],
    category: 'development',
    icon: 'Book',
    keywords: ['isbn', 'isbn-10', 'isbn-13', 'barcode', 'books'],
    schemaType: 'WebApplication',
  },
  'barcode-issn': {
    id: 'barcode-issn',
    productId: 'barcode',
    slug: 'tool',
    title: 'ISSN Barcode Generator',
    description: 'Generate ISSN barcodes for magazines, journals, and periodicals.',
    status: 'active',
    featured: false,
    seoPriority: 0.8,
    supportedCountries: [],
    supportedLocales: [],
    category: 'development',
    icon: 'Newspaper',
    keywords: ['issn', 'barcode', 'magazine', 'journal', 'periodical'],
    schemaType: 'WebApplication',
  },
  'barcode-ismn': {
    id: 'barcode-ismn',
    productId: 'barcode',
    slug: 'tool',
    title: 'ISMN Barcode Generator',
    description: 'Generate ISMN barcodes for printed music publications.',
    status: 'active',
    featured: false,
    seoPriority: 0.8,
    supportedCountries: [],
    supportedLocales: [],
    category: 'development',
    icon: 'Music',
    keywords: ['ismn', 'barcode', 'music', 'sheet music'],
    schemaType: 'WebApplication',
  },
  'barcode-pharmacode': {
    id: 'barcode-pharmacode',
    productId: 'barcode',
    slug: 'tool',
    title: 'Pharmacode Barcode Generator',
    description: 'Generate Pharmacode barcodes for pharmaceutical packaging and safety.',
    status: 'active',
    featured: false,
    seoPriority: 0.7,
    supportedCountries: [],
    supportedLocales: [],
    category: 'development',
    icon: 'Pill',
    keywords: ['pharmacode', 'pharmaceutical', 'barcode', 'medicine'],
    schemaType: 'WebApplication',
  },

  /* ── Color Studio Generator ─────────────────────────────────────────────── */
  'color-studio': {
    id: 'color-studio',
    productId: 'color',
    slug: 'tool',
    title: 'Color Studio',
    description: 'Professional color tools — palettes, gradients, converters, accessibility checks, and more.',
    status: 'active',
    featured: true,
    seoPriority: 0.9,
    supportedCountries: [],
    supportedLocales: [],
    category: 'design',
    icon: 'Palette',
    keywords: ['color generator', 'color palette', 'gradient generator', 'color converter', 'WCAG', 'design tools'],
    schemaType: 'WebApplication',
  },
} as const;

/** All generators as an array, sorted by title. */
export const ALL_GENERATORS = Object.values(GENERATORS).sort((a, b) =>
  a.title.localeCompare(b.title),
);

/** Active generators (status = active or beta). */
export const ACTIVE_GENERATORS = ALL_GENERATORS.filter(
  (g) => g.status === 'active' || g.status === 'beta',
);

/** Get generators for a specific product. */
export function getGeneratorsByProduct(productId: string): Generator[] {
  return ALL_GENERATORS.filter((g) => g.productId === productId);
}

/** Get featured generators. */
export function getFeaturedGenerators(): Generator[] {
  return ACTIVE_GENERATORS.filter((g) => g.featured);
}

/** Get generators by category. */
export function getGeneratorsByCategory(category: GeneratorCategory): Generator[] {
  return ALL_GENERATORS.filter((g) => g.category === category);
}

/** Get a generator by its ID. */
export function getGenerator(id: string): Generator | undefined {
  return GENERATORS[id];
}
