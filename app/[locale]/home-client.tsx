'use client';

import { useState } from 'react';
import {
  CatalogueSection,
  ClosingSection,
  FaqSection,
  HeroSection,
  PlannedSection,
  TrustSection,
} from '@/components/home';
import { CATALOGUE_PRODUCT_IDS } from '@/lib/config/homeCatalogue';
import { getAllRegionCodes } from '@/lib/countryRegistry';

/**
 * GenCore platform home page.
 *
 * ── Why the search state lives here ─────────────────────────────────────────
 *
 * The field is in the hero and the results are in the catalogue, so one of
 * them has to own the query. Keeping it in the page means no context and no
 * store for a single string.
 *
 * ── Why the counts are computed and not written ─────────────────────────────
 *
 * The old page carried a stats strip reading "245+ Countries · 8+ Products".
 * There are sixteen live products, so the second number had been wrong for
 * months — the sort of thing a hand-written figure does. Both numbers now come
 * from the registries that decide them.
 *
 * ── `overflow-hidden` is gone from <main> ───────────────────────────────────
 *
 * It clipped the sections' entrance transforms, and combined with reveals that
 * parked content at opacity 0 it could leave whole screens blank. The reveals
 * now trigger on the first visible pixel (see components/home/motion.ts).
 */
export default function GenCoreHomePage() {
  const [query, setQuery] = useState('');

  const generatorCount = CATALOGUE_PRODUCT_IDS.length;
  const countryCount = getAllRegionCodes().length;

  return (
    <main className="flex-1">
      <HeroSection
        query={query}
        onQuery={setQuery}
        generatorCount={generatorCount}
        countryCount={countryCount}
      />

      <CatalogueSection query={query} onClear={() => setQuery('')} />
      <PlannedSection />
      <TrustSection />
      <FaqSection />
      <ClosingSection countryCount={countryCount} />
    </main>
  );
}
