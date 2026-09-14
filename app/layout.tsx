import type { ReactNode } from 'react';
import './globals.css';
import { FONT_CLASSES } from './fonts';

/**
 * Root layout.
 *
 * Next requires <html> and <body> in the topmost layout, and the topmost
 * layout is this one — `app/[locale]/layout.tsx` does not take that role just
 * because this file is absent; removing it 404s the entire locale tree.
 *
 * Which leaves the `lang` problem this file used to get wrong: a root layout
 * cannot see a route param nested below it, so it cannot know the locale. It
 * no longer guesses. `lang` is set from the URL by LocaleLang inside the
 * locale layout, which runs before hydration.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html className={FONT_CLASSES} suppressHydrationWarning>
      <head />
      <body className="min-h-screen flex flex-col grain-overlay">{children}</body>
    </html>
  );
}
