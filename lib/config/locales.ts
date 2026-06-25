import { SUPPORTED_LANGUAGES, type SupportedLanguage } from '@/lib/i18n/locales';

/**
 * Platform-level locale registry.
 *
 * Used by middleware, sitemap generation, routing, and hreflang tags.
 * Derived from the i18n layer — adding a language there automatically
 * adds it here. No separate list to keep in sync.
 */
export const LOCALES = SUPPORTED_LANGUAGES as readonly string[];
export const DEFAULT_LOCALE: SupportedLanguage = 'en';
