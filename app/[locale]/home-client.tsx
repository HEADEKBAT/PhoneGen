'use client';

import { motion } from 'framer-motion';
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
    <main className="flex-1 overflow-hidden">
      <HeroSection />

      <SectionWrapper>
        <StatsSection />
      </SectionWrapper>

      <SectionWrapper>
        <ProductsSection />
      </SectionWrapper>

      <SectionWrapper>
        <WhySection />
      </SectionWrapper>

      <SectionWrapper>
        <RoadmapSection />
      </SectionWrapper>

      <SectionWrapper>
        <FAQSection />
      </SectionWrapper>

      <SectionWrapper>
        <CTASection />
      </SectionWrapper>
    </main>
  );
}

/* ── Scroll-triggered entrance animation wrapper ────────────── */

function SectionWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}
