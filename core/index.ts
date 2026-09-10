/**
 * Core Platform — barrel exports.
 *
 * Usage: import { registry, defineTool, type ToolManifest } from '@/core';
 */

/* ── Types ──────────────────────────────────────────────────────────────────── */

export type {
  ToolManifest,
  ProductManifest,
  ToolCapabilities,
  ToolFAQ,
  SeededFAQ,
  BreadcrumbItem,
  ToolPageBundle,
  SupportedLocale,
  LocaleMap,
  ExportFormat,
} from './types';

/* ── Registry ───────────────────────────────────────────────────────────────── */

export { registry, defineTool, defineProduct } from './registry';

/* ── SEO Engine ─────────────────────────────────────────────────────────────── */

export {
  generateToolMetadata,
  generateProductMetadata,
  generateToolPresetMetadata,
  SEO_LOCALES,
  BASE_URL,
} from './seo-engine';

/* ── Breadcrumbs ────────────────────────────────────────────────────────────── */

export { buildBreadcrumbs, buildToolBreadcrumbs, buildProductBreadcrumbs } from './breadcrumbs';

/* ── Page Factory ───────────────────────────────────────────────────────────── */

export { createToolPage, createPresetPage } from './page-factory';

/* ── Tool Shell ─────────────────────────────────────────────────────────────── */

export { default as ToolShell } from './tool-shell';
export { createLandingPage } from './landing-factory';
export type { LandingPageManifest, LandingLocaleCopy } from './landing-factory';
export { createStudioSEOPage } from './studio-seo-factory';
export type { StudioSEOPageManifest } from './studio-seo-factory';
export { createStudioToolPage } from './studio-tool-factory';
export type {
  StudioToolPageManifest,
  StudioToolLocaleCopy,
} from './studio-tool-factory';
export { createCredentialDeepLinkPage } from './credential-deep-link-factory';
export type {
  CredentialDeepLinkManifest,
  DeepLinkLocaleCopy,
} from './credential-deep-link-factory';
