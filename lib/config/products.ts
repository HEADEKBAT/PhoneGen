/**
 * Product registry — single source of truth for all GenCore products.
 *
 * Every product has:
 *   - slug:     URL path segment (e.g. "phone-generator")
 *   - title:    Display name
 *   - enabled:  Feature flag — controls whether the route is accessible
 *   - locales:  Locales this product is available in (empty = all)
 *
 * Usage: menus, navigation, sitemap, routing all read from this registry.
 * Never hardcode product names or paths outside this file.
 */
export interface Product {
  id: string;
  slug: string;
  title: string;
  description: string;
  enabled: boolean;
  locales?: string[];
}

export const PRODUCTS: Record<string, Product> = {
  phone: {
    id: 'phone',
    slug: 'phone-generator',
    title: 'Phone Generator',
    description: 'Generate valid phone numbers that pass libphonenumber-js validation.',
    enabled: true,
  },
  user: {
    id: 'user',
    slug: 'user-generator',
    title: 'User Generator',
    description: 'Generate realistic user profiles with names, addresses, and contacts.',
    enabled: true,
  },
  address: {
    id: 'address',
    slug: 'address-generator',
    title: 'Address Generator',
    description: 'Generate valid addresses for countries worldwide.',
    enabled: true,
  },
  email: {
    id: 'email',
    slug: 'email-generator',
    title: 'Email Generator',
    description: 'Generate realistic email addresses for testing and development.',
    enabled: true,
  },
  username: {
    id: 'username',
    slug: 'username-generator',
    title: 'Username Generator',
    description: 'Generate unique usernames for testing authentication systems.',
    enabled: true,
  },
  company: {
    id: 'company',
    slug: 'company-generator',
    title: 'Company Generator',
    description: 'Generate fictional company profiles with industry data.',
    enabled: true,
  },
  password: {
    id: 'password',
    slug: 'credential-generator',
    title: 'Credential Generator',
    description: 'Generate secure passwords with configurable complexity.',
    enabled: true,
  },
} as const;

/** Array of enabled products, sorted alphabetically by title. */
export const ENABLED_PRODUCTS = Object.values(PRODUCTS)
  .filter((p) => p.enabled)
  .sort((a, b) => a.title.localeCompare(b.title));

/** Array of all product slugs, used for route matching. */
export const PRODUCT_SLUGS = Object.values(PRODUCTS).map((p) => p.slug);
