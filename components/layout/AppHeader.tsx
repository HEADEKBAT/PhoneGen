'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, Phone, Users, Key, MapPin, Mail, User, Building, Hash, ChevronDown } from 'lucide-react';
import { ENABLED_PRODUCTS } from '@/lib/config';
import type { Product } from '@/lib/config';
import AnnouncementBar from './AnnouncementBar';
import SearchButton from './SearchButton';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeSwitcher from './ThemeSwitcher';

/**
 * Lucide icon resolver for product icons.
 */
const PRODUCT_ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Phone, Users, Key, MapPin, Mail, User, Building, Hash,
};

/**
 * AppHeader — unified platform header for all GenCore pages.
 *
 * Features:
 *   - Sticky with backdrop blur
 *   - Transparent-to-solid on scroll
 *   - Dynamic product navigation from the Products Registry
 *   - Search placeholder (Ctrl+K)
 *   - Theme switcher
 *   - Language switcher
 *   - Mobile hamburger menu
 */
export default function AppHeader() {
  const { locale } = useParams<{ locale: string }>() ?? { locale: 'en' };
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);

  const products = ENABLED_PRODUCTS.filter((p) => p.status === 'active').slice(0, 8);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <>
      <AnnouncementBar />
      <header
        className={`sticky top-0 z-40 w-full border-b border-border transition-all duration-200 ${
          scrolled
            ? 'bg-background/85 backdrop-blur-xl supports-backdrop-filter:bg-background/60'
            : 'bg-background/50 backdrop-blur-sm'
        }`}
      >
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
          {/* Logo */}
          <Link
            href={`/${locale}`}
            className="flex items-center gap-2 shrink-0"
            aria-label="GenCore Home"
          >
            <div className='relative size-9 overflow-hidden'>
            <img src="/logo.png" alt="" />

            </div>
            <span className="font-heading text-lg font-bold text-foreground tracking-tight">
          <span className='text-accent'>Gen</span><span className="text-primary">Core</span>
            </span>
          </Link>


          {/* Desktop nav — center */}
          <nav className="hidden md:flex items-center gap-1">
            {/* Products dropdown */}
            <div className="relative"
              onMouseEnter={() => setProductsOpen(true)}
              onMouseLeave={() => setProductsOpen(false)}
            >
              <button
                className="inline-flex items-center gap-1 h-9 px-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                Products
                <ChevronDown size={14} className={`transition-transform ${productsOpen ? 'rotate-180' : ''}`} />
              </button>
              {productsOpen && (
                <div className="absolute top-full left-0 mt-1 min-w-56 rounded-xl border border-border bg-card shadow-dropdown overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="p-1.5">
                    {products.map((product) => {
                      const Icon = PRODUCT_ICON_MAP[product.id];
                      return (
                        <Link
                          key={product.id}
                          href={`/${locale}/${product.slug}`}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-foreground hover:bg-muted transition-colors"
                          onClick={() => setProductsOpen(false)}
                        >
                          <span className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">
                            {Icon && <Icon size={14} />}
                          </span>
                          <div>
                            <div className="font-medium">{product.title}</div>
                            <div className="text-xs text-muted-foreground line-clamp-1">{product.description}</div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <Link
              href={`/${locale}/about`}
              className="inline-flex items-center h-9 px-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              About
            </Link>
          </nav>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Right actions */}
          <div className="flex items-center gap-1.5">
            <SearchButton />
            <ThemeSwitcher />
            <LanguageSwitcher />

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Toggle menu"
            >
              <Menu size={18} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border bg-background animate-in fade-in duration-150">
            <div className="px-4 py-3 space-y-1">
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 py-1.5">
                Products
              </div>
              {products.map((product) => {
                const Icon = PRODUCT_ICON_MAP[product.id];
                return (
                  <Link
                    key={product.id}
                    href={`/${locale}/${product.slug}`}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-foreground hover:bg-muted transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    <span className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">
                      {Icon && <Icon size={14} />}
                    </span>
                    {product.title}
                  </Link>
                );
              })}
              <div className="border-t border-border my-2" />
              <Link
                href={`/${locale}/about`}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-foreground hover:bg-muted transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                About
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
