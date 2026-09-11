/**
 * Server-side dictionary lookup.
 *
 * SERVER ONLY. This module statically imports all six locale files, which is
 * the right trade on the server and the wrong one in a browser — importing it
 * from a client component would put every language in that page's bundle.
 * `lib/i18n/server.ts` (the `getT` helper) has the same property and the same
 * rule.
 *
 * The locale layout reads one dictionary here and hands it to
 * TranslationsProvider, so React serialises exactly one language into the RSC
 * payload and the client never fetches a locale file at all.
 */

import en from './en.json';
import ru from './ru.json';
import de from './de.json';
import es from './es.json';
import fr from './fr.json';
import pt from './pt.json';

import { DEFAULT_LANGUAGE, type SupportedLanguage } from './locales';

export type Dictionary = Record<string, unknown>;

const DICTIONARIES: Record<SupportedLanguage, Dictionary> = { en, ru, de, es, fr, pt };

/** Narrows an unvalidated route segment to a language we actually have. */
export function isSupportedLocale(locale: string): locale is SupportedLanguage {
  return Object.prototype.hasOwnProperty.call(DICTIONARIES, locale);
}

/** The route segment as a language, or English when it is not one. */
export function toLocale(locale: string): SupportedLanguage {
  return isSupportedLocale(locale) ? locale : DEFAULT_LANGUAGE;
}

/** The dictionary for `locale`, falling back to English for anything unknown. */
export function getDictionary(locale: string): Dictionary {
  return DICTIONARIES[toLocale(locale)];
}
