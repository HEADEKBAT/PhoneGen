/**
 * The platform's two typefaces.
 *
 * `next/font` must be called at module scope, and the class names it returns
 * belong on <html>. That element moved into app/[locale]/layout.tsx so its
 * `lang` can come from the URL, so the fonts live here where both that layout
 * and the dev dashboard's own shell can import them.
 */
import { Space_Grotesk, Inter } from 'next/font/google';

export const spaceGrotesk = Space_Grotesk({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-heading',
  display: 'swap',
});

export const inter = Inter({
  subsets: ['latin', 'cyrillic', 'latin-ext'],
  variable: '--font-sans',
  display: 'swap',
});

/** Classes every <html> in the app needs. */
export const FONT_CLASSES = `${spaceGrotesk.variable} ${inter.variable} h-full antialiased`;
