/**
 * Navigation Registry — single source of truth for all navigation links.
 *
 * Header, footer, breadcrumbs, and navigation menus all read from
 * this registry. Never hardcode navigation paths outside this file.
 *
 * Links use `{locale}` as a placeholder — call `resolveNav(locale, item)`
 * at render time to substitute the current locale.
 */

/** A single navigation item (header link, footer link, breadcrumb segment). */
export interface NavItem {
  /** English fallback, and what is shown when `labelKey` is absent. */
  label: string;
  /**
   * Dictionary key for the label. The footer rendered `label` directly, so
   * every heading and link in it read English on all six locales — on all
   * 2172 pages. Product links point at `products.<id>.title`, which is already
   * translated; the rest have their own keys under `footer.links`.
   */
  labelKey?: string;
  /** Path with optional `{locale}` placeholder, or absolute URL */
  href: string;
  /** Lucide icon name (for header links) */
  icon?: string;
  /** Nested items (for dropdown menus) */
  children?: NavItem[];
}

export interface NavSection {
  /** Section heading (e.g. "Products", "Resources") — English fallback. */
  section: string;
  /** Dictionary key for the heading. */
  sectionKey?: string;
  links: NavItem[];
}

/** Header navigation items (left side) */
export const HEADER_NAV: NavItem[] = [
  { label: 'Products', href: '/{locale}', children: [] }, // populated dynamically from products
  { label: 'About', href: '/{locale}/about', icon: 'Info' },
  { label: 'GitHub', href: 'https://github.com/gencore', icon: 'Github' },
  { label: 'Documentation', href: '/{locale}/about', icon: 'BookOpen' },
];

/** Products sub-nav — injected dynamically by the renderer from Products Registry */
export const PRODUCT_NAV_PLACEHOLDER = '___PRODUCTS___';

/** Footer navigation sections */
export const FOOTER_SECTIONS: NavSection[] = [
  {
    section: 'Products',
    sectionKey: 'nav.products',
    links: [
      { label: 'Phone Generator', labelKey: 'products.phone.title', href: '/{locale}/phone-generator' },
      { label: 'User Generator', labelKey: 'products.user.title', href: '/{locale}/user-generator' },
      { label: 'Credential Generator', labelKey: 'products.credential.title', href: '/{locale}/credential-generator' },
      { label: 'Address Generator', labelKey: 'products.address.title', href: '/{locale}/address-generator' },
      { label: 'Email Generator', labelKey: 'products.email.title', href: '/{locale}/email-generator' },
      { label: 'Username Generator', labelKey: 'products.username.title', href: '/{locale}/username-generator' },
      { label: 'Barcode Generator', labelKey: 'products.barcode.title', href: '/{locale}/barcode-generator' },
      { label: 'Color Studio', labelKey: 'products.color.title', href: '/{locale}/color-generator' },
      { label: 'Payment Studio', labelKey: 'products.payment.title', href: '/{locale}/payment-studio' },
      { label: 'Company Generator', labelKey: 'products.company.title', href: '/{locale}/company-generator' },
    ],
  },
  {
    section: 'Resources',
    sectionKey: 'footer.links',
    links: [
      { label: 'About', labelKey: 'nav.about', href: '/{locale}/about' },
      { label: 'GitHub', href: 'https://github.com' },
    ],
  },
];

/**
 * Resolve a NavItem's href by substituting `{locale}`.
 * External URLs (http://, https://, mailto:) are returned as-is.
 */
export function resolveHref(item: NavItem, locale: string): string {
  if (item.href.startsWith('http://') || item.href.startsWith('https://') || item.href.startsWith('mailto:')) {
    return item.href;
  }
  return item.href.replace('{locale}', locale);
}

/**
 * Build breadcrumb trail from path segments.
 *
 * Example:
 *   path = '/en/phone-generator/US'
 *   → [
 *       { label: 'Home', href: '/en' },
 *       { label: 'Phone Generator', href: '/en/phone-generator' },
 *       { label: 'US', href: '/en/phone-generator/US' },
 *     ]
 */
export function buildBreadcrumbs(
  locale: string,
  segments: string[],
  labelMap: Record<string, string>,
): { label: string; href: string }[] {
  const crumbs: { label: string; href: string }[] = [];

  // Root
  crumbs.push({ label: 'Home', href: `/${locale}` });

  let accumulated = `/${locale}`;
  for (const segment of segments) {
    accumulated += `/${segment}`;
    const label = labelMap[segment] || segment;
    crumbs.push({ label, href: accumulated });
  }

  return crumbs;
}
