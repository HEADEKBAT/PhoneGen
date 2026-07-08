'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslations } from '@/lib/i18n';
import { FOOTER_SECTIONS, resolveHref } from '@/lib/config';
import type { NavItem } from '@/lib/config';

/**
 * AppFooter — unified platform footer for all GenCore pages.
 *
 * Sections are driven by the Navigation Registry (FOOTER_SECTIONS).
 * Product links resolve dynamically with the current locale.
 */
export default function AppFooter() {
  const { locale } = useParams<{ locale: string }>() ?? { locale: 'en' };
  const { t } = useTranslations();

  return (
    <footer className="mt-16 border-t border-border bg-background">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
        {/* Top: brand + sections */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          {/* Brand column */}
          <div className="col-span-2 sm:col-span-1">
            <Link href={`/${locale}`} className="font-heading text-lg font-bold text-foreground tracking-tight">
              Gen<span className="text-primary">Core</span>
            </Link>
            <p className="mt-2 text-xs text-muted-foreground max-w-xs leading-relaxed">
              Data generation platform for developers, QA engineers, and testers.
            </p>
          </div>

          {/* Footer sections from registry */}
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.section}>
              <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">
                {section.section}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link: NavItem) => {
                  const href = resolveHref(link, locale);
                  const isExternal = href.startsWith('http');
                  return (
                    <li key={link.href}>
                      {isExternal ? (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          href={href}
                          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            {t('footer.copyright', { year: String(new Date().getFullYear()) })}
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              aria-label="GitHub"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.002 12.002 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
