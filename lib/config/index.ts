export { LOCALES, DEFAULT_LOCALE } from './locales';
export { PLATFORM_CONFIG } from './platform';
export type { PlatformConfig } from './platform';
export {
  PRODUCTS,
  ALL_PRODUCTS,
  ENABLED_PRODUCTS,
  FEATURED_PRODUCTS,
  COMING_SOON_PRODUCTS,
  PRODUCT_SLUGS,
  getProduct,
  getProductsByCategory,
  PRODUCT_ICONS,
} from './products';
export type { Product, ProductCategory } from './products';
export {
  GENERATORS,
  ALL_GENERATORS,
  ACTIVE_GENERATORS,
  getGeneratorsByProduct,
  getFeaturedGenerators,
  getGeneratorsByCategory,
  getGenerator,
} from './generators';
export type { Generator, GeneratorStatus, GeneratorCategory } from './generators';
export {
  HEADER_NAV,
  FOOTER_SECTIONS,
  resolveHref,
  buildBreadcrumbs,
} from './navigation';
export type { NavItem, NavSection } from './navigation';
export { FEATURES, isFeatureEnabled } from './features';
export type { FeatureFlag } from './features';
export {
  getProductLandingConfig,
  LANDING_CONFIGS,
  LANDING_PRODUCT_IDS,
} from './productLanding';
export type { ProductLandingConfig, ToolType, Feature, FAQ } from './productLanding';
export {
  generateMetadata,
  SEO_LOCALES,
  BASE_URL,
} from './seo';
export type { SEOPage, SEOProductPage, SEOGeneratorPage, SEOHomePage, SEOAboutPage, SEOCustomPage } from './seo';
