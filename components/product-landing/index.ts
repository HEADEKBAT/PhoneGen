/* The redesigned set. Everything new builds on these five. */
export { default as LandingHero } from './LandingHero';
export type { LandingHeroAction } from './LandingHero';
export { default as LandingSection } from './LandingSection';
export { default as LandingCards } from './LandingCards';
export type { LandingCard } from './LandingCards';
export { default as LandingFaq } from './LandingFaq';
export type { LandingFaqItem } from './LandingFaq';
export { default as LandingClosing } from './LandingClosing';

/*
 * The pre-redesign set, on its way out. Each one goes the moment its last
 * importer moves over: ProductHero and FeatureGrid with the landing factory,
 * FAQSection and CTASection with the SEO templates.
 */
export { default as ProductHero } from './ProductHero';
export { default as WhatCanYouGenerate } from './WhatCanYouGenerate';
export { default as PopularCountries } from './PopularCountries';
export { default as FeatureGrid } from './FeatureGrid';
export { default as ExampleSection } from './ExampleSection';
export { default as FAQSection } from './FAQSection';
export { default as CTASection } from './CTASection';
