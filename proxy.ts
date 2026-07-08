import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Supported locale codes — duplicated here to keep proxy free of
 * module dependencies (Edge Runtime compatible).
 */
const LOCALES = ['en', 'fr', 'es', 'pt', 'de', 'ru'];
const DEFAULT_LOCALE = 'en';

// ── Helpers ────────────────────────────────────────────────────────────

function getDetectedLocale(request: NextRequest): string {
  /* 1. Saved preference in cookie */
  const cookieLang = request.cookies.get('language')?.value;
  if (cookieLang && LOCALES.includes(cookieLang)) return cookieLang;

  /* 2. Browser's Accept-Language header (first locale matched) */
  const acceptLang = request.headers.get('accept-language');
  if (acceptLang) {
    const preferred = acceptLang
      .split(',')
      .map((s) => s.split(';')[0].trim().split('-')[0].toLowerCase())
      .find((l) => LOCALES.includes(l));
    if (preferred) return preferred;
  }

  /* 3. Fall back to default */
  return DEFAULT_LOCALE;
}

function hasLocalePrefix(pathname: string): boolean {
  return LOCALES.some(
    (loc) => pathname === `/${loc}` || pathname.startsWith(`/${loc}/`),
  );
}

const STATIC_EXT = /\.(?:png|jpg|jpeg|gif|svg|ico|xml|txt|json|webmanifest)$/;

function isStaticAsset(pathname: string): boolean {
  return (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname === '/favicon.ico' ||
    STATIC_EXT.test(pathname)
  );
}

// ── Proxy (formerly Middleware) ─────────────────────────────────────────

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  /* ── Skip static assets ───────────────────────────────────────────── */
  if (isStaticAsset(pathname)) return NextResponse.next();

  /* ── Already on a locale-prefixed route — pass through ────────────── */
  if (hasLocalePrefix(pathname)) return NextResponse.next();

  /* ── Detect locale ────────────────────────────────────────────────── */
  const locale = getDetectedLocale(request);

  /*
   * ── Old route redirects (301 for SEO) ──────────────────────────────
   *
   *   / → /en  (platform homepage)
   *   /?country=US → /en/phone-generator/US
   *   /generate → /en/phone-generator/US
   *   /generate?country=US → /en/phone-generator/US
   *   /about → /en/about
   *
   *   /phone-generator        → /en/phone-generator/US
   *   /phone-generator/DE     → /en/phone-generator/DE
   */
  const country = request.nextUrl.searchParams.get('country');
  const DEFAULT_COUNTRY = 'US';

  let destination: string | null = null;

  // ── `/phone-generator` without locale ────────────────────────────────
  if (pathname === '/phone-generator' || pathname.startsWith('/phone-generator/')) {
    const rest = pathname.replace(/^\/phone-generator\/?/, '');
    const targetCountry = rest && rest.length === 2 ? rest.toUpperCase() : DEFAULT_COUNTRY;
    destination = `/${locale}/phone-generator/${targetCountry}`;
  }

  // ── `/` or `/?country=XX` ────────────────────────────────────────────
  else if (pathname === '/') {
    if (country && country.length === 2) {
      destination = `/${locale}/phone-generator/${country.toUpperCase()}`;
    } else {
      destination = `/${locale}`;
    }
  }

  // ── `/generate` or `/generate?country=XX` ────────────────────────────
  else if (pathname === '/generate') {
    const targetCountry =
      country && country.length === 2
        ? country.toUpperCase()
        : DEFAULT_COUNTRY;
    destination = `/${locale}/phone-generator/${targetCountry}`;
  }

  // ── `/about` ─────────────────────────────────────────────────────────
  else if (pathname === '/about') {
    destination = `/${locale}/about`;
  }

  if (destination) {
    const url = new URL(destination, request.url);
    const response = NextResponse.redirect(url, 301);

    /* Set language cookie on first visit so subsequent requests skip detection */
    if (!request.cookies.has('language')) {
      response.cookies.set('language', locale, {
        path: '/',
        maxAge: 60 * 60 * 24 * 365,
        sameSite: 'lax',
      });
    }

    return response;
  }

  /*
   * ── All other paths — prefix with locale via rewrite ──────────────
   *     e.g. /some-path → /en/some-path (rewrite, not redirect)
   */
  const rewritten = new URL(`/${locale}${pathname}${search}`, request.url);
  const response = NextResponse.rewrite(rewritten);

  if (!request.cookies.has('language')) {
    response.cookies.set('language', locale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
    });
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
