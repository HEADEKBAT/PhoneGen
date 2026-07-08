'use client';

import {
  HeroSection,
  ProductsSection,
  StatsSection,
  WhySection,
  RoadmapSection,
  FAQSection,
  CTASection,
} from '@/components/home';

/**
 * GenCore platform home page.
 *
 * Composed entirely from reusable home section components.
 * All data is driven by Platform Config and Products/Gnerators registries.
 * Header and Footer come from the locale layout.
 */
export default function GenCoreHomePage() {
  return (
    <main className="flex-1">
      <HeroSection />
      <StatsSection />
      <ProductsSection />
      <WhySection />
      <RoadmapSection />
      <FAQSection />
      <CTASection />
    </main>
  );
}
