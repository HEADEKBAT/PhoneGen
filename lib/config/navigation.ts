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
  label: string;
  /** Path with optional `{locale}` placeholder, or absolute URL */
  href: string;
  /** Lucide icon name (for header links) */
  icon?: string;
  /** Nested items (for dropdown menus) */
  children?: NavItem[];
}

export interface NavSection {
  /** Section heading (e.g. "Products", "Resources") */
  section: string;
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
    links: [
      { label: 'Phone Generator', href: '/{locale}/phone-generator' },
      { label: 'User Generator', href: '/{locale}/user-generator' },
      { label: 'Credential Generator', href: '/{locale}/credential-generator' },
      { label: 'Address Generator', href: '/{locale}/address-generator' },
      { label: 'Email Generator', href: '/{locale}/email-generator' },
      { label: 'Username Generator', href: '/{locale}/username-generator' },
      { label: 'Barcode Generator', href: '/{locale}/barcode-generator' },
      { label: 'Company Generator', href: '/{locale}/company-generator' },
    ],
  },
  {
    section: 'Resources',
    links: [
      { label: 'About', href: '/{locale}/about' },
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
