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
 * A server component: it holds no state now that the hero's search is gone, so
 * only the sections that animate or cycle cross into the client. The counts it
 * passes down are read from the registries that decide them, because the strip
 * this page used to carry said "8+ Products" while sixteen were live.
 *
 * `<main>` deliberately has no `overflow-hidden`: it clipped the sections'
 * entrance transforms, and together with reveals that parked content at
 * opacity 0 it could leave whole screens blank.
 */
export default function GenCoreHomePage() {
  const generatorCount = CATALOGUE_PRODUCT_IDS.length;
  const countryCount = getAllRegionCodes().length;

  return (
    <main className="flex-1">
      <HeroSection generatorCount={generatorCount} countryCount={countryCount} />
      <CatalogueSection />
      <PlannedSection />
      <TrustSection />
      <FaqSection />
      <ClosingSection countryCount={countryCount} />
    </main>
  );
}
