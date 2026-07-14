/**
 * Project type presets.
 *
 * Each preset adjusts theme generation rules to create an appropriate
 * color system for a specific kind of project. For example, a landing
 * page needs bold CTAs and vibrant primary colors, while a dashboard
 * needs calm surfaces and good data readability.
 */

import type { ProjectAdjustments } from './themeBuilder';

export interface ProjectPreset {
  id: string;
  name: string;
  description: string;
  icon: string;
  adjustments: ProjectAdjustments;
}

export const PROJECT_PRESETS: ProjectPreset[] = [
  {
    id: 'landing-page',
    name: 'Landing Page',
    description: 'Bold CTAs, vibrant primary, high contrast — conversion-focused',
    icon: 'LayoutDashboard',
    adjustments: { contrastBoost: 0.15, saturationMod: 1.2, temperatureOffset: 0, surfaceDarkness: 0, accentStrength: 1.3 },
  },
  {
    id: 'saas',
    name: 'SaaS',
    description: 'Professional, balanced, clear hierarchy — subscription products',
    icon: 'Cloud',
    adjustments: { contrastBoost: 0.05, saturationMod: 1.0, temperatureOffset: 0, surfaceDarkness: 0, accentStrength: 1.0 },
  },
  {
    id: 'dashboard',
    name: 'Dashboard',
    description: 'Calm surfaces, neutral backgrounds, great data readability',
    icon: 'BarChart3',
    adjustments: { contrastBoost: 0.08, saturationMod: 0.9, temperatureOffset: -0.05, surfaceDarkness: 0.03, accentStrength: 0.9 },
  },
  {
    id: 'crm',
    name: 'CRM',
    description: 'Highly legible data, muted surfaces, clear status indicators',
    icon: 'Users',
    adjustments: { contrastBoost: 0.1, saturationMod: 0.85, temperatureOffset: -0.05, surfaceDarkness: 0.02, accentStrength: 0.85 },
  },
  {
    id: 'admin-panel',
    name: 'Admin Panel',
    description: 'High info density, strong borders, clear active/disabled states',
    icon: 'Settings',
    adjustments: { contrastBoost: 0.12, saturationMod: 0.9, temperatureOffset: 0, surfaceDarkness: 0.04, accentStrength: 0.9 },
  },
  {
    id: 'analytics',
    name: 'Analytics',
    description: 'Vibrant chart colors, neutral backgrounds, precise data viz',
    icon: 'TrendingUp',
    adjustments: { contrastBoost: 0.05, saturationMod: 1.1, temperatureOffset: 0, surfaceDarkness: 0, accentStrength: 1.2 },
  },
  {
    id: 'mobile-app',
    name: 'Mobile App',
    description: 'Accessible touch targets, clear feedback states, OLED-friendly',
    icon: 'Smartphone',
    adjustments: { contrastBoost: 0.1, saturationMod: 1.0, temperatureOffset: 0, surfaceDarkness: 0.02, accentStrength: 1.1 },
  },
  {
    id: 'portfolio',
    name: 'Portfolio',
    description: 'Creative, expressive, great for showcasing visual work',
    icon: 'Image',
    adjustments: { contrastBoost: 0.05, saturationMod: 1.1, temperatureOffset: 0.1, surfaceDarkness: -0.02, accentStrength: 1.2 },
  },
  {
    id: 'blog',
    name: 'Blog',
    description: 'Excellent readability, muted accents, warm neutrals for long reading',
    icon: 'FileText',
    adjustments: { contrastBoost: 0.12, saturationMod: 0.8, temperatureOffset: 0.1, surfaceDarkness: -0.02, accentStrength: 0.8 },
  },
  {
    id: 'ecommerce',
    name: 'E-Commerce',
    description: 'Conversion-focused, clear CTAs, trust colors, product-forward',
    icon: 'ShoppingCart',
    adjustments: { contrastBoost: 0.1, saturationMod: 1.1, temperatureOffset: 0, surfaceDarkness: 0, accentStrength: 1.2 },
  },
  {
    id: 'marketplace',
    name: 'Marketplace',
    description: 'Neutral, info-dense, clear categories and listing hierarchy',
    icon: 'Store',
    adjustments: { contrastBoost: 0.08, saturationMod: 0.9, temperatureOffset: 0, surfaceDarkness: 0.02, accentStrength: 0.95 },
  },
  {
    id: 'documentation',
    name: 'Documentation',
    description: 'High readability, low visual noise, good code block contrast',
    icon: 'BookOpen',
    adjustments: { contrastBoost: 0.15, saturationMod: 0.75, temperatureOffset: 0.05, surfaceDarkness: 0, accentStrength: 0.8 },
  },
  {
    id: 'ai-product',
    name: 'AI Product',
    description: 'Futuristic, gradient-ready, vibrant accents — cutting-edge feel',
    icon: 'Brain',
    adjustments: { contrastBoost: 0.05, saturationMod: 1.3, temperatureOffset: -0.1, surfaceDarkness: 0, accentStrength: 1.4 },
  },
  {
    id: 'developer-tool',
    name: 'Developer Tool',
    description: 'Functional, clean, high status contrast — built for engineers',
    icon: 'Terminal',
    adjustments: { contrastBoost: 0.1, saturationMod: 0.9, temperatureOffset: -0.05, surfaceDarkness: 0.03, accentStrength: 0.9 },
  },
  {
    id: 'education',
    name: 'Education Platform',
    description: 'Friendly, warm, approachable — great for learning environments',
    icon: 'GraduationCap',
    adjustments: { contrastBoost: 0.05, saturationMod: 0.9, temperatureOffset: 0.15, surfaceDarkness: -0.02, accentStrength: 1.0 },
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    description: 'Soft, trustworthy, low aggression — calm and professional',
    icon: 'HeartPulse',
    adjustments: { contrastBoost: 0.08, saturationMod: 0.75, temperatureOffset: -0.1, surfaceDarkness: 0.02, accentStrength: 0.8 },
  },
  {
    id: 'banking',
    name: 'Banking',
    description: 'Conservative, trusted, clear hierarchy — financial confidence',
    icon: 'Building',
    adjustments: { contrastBoost: 0.1, saturationMod: 0.8, temperatureOffset: -0.1, surfaceDarkness: 0.03, accentStrength: 0.85 },
  },
  {
    id: 'crypto',
    name: 'Crypto / Web3',
    description: 'Bold, digital, high contrast — decentralized aesthetic',
    icon: 'Bitcoin',
    adjustments: { contrastBoost: 0.08, saturationMod: 1.3, temperatureOffset: -0.15, surfaceDarkness: 0.05, accentStrength: 1.4 },
  },
  {
    id: 'social-media',
    name: 'Social Media',
    description: 'Vibrant, engagement-focused, community-driven feel',
    icon: 'MessageCircle',
    adjustments: { contrastBoost: 0.05, saturationMod: 1.2, temperatureOffset: 0.05, surfaceDarkness: 0, accentStrength: 1.3 },
  },
  {
    id: 'streaming',
    name: 'Streaming / Media',
    description: 'Dark-optimized, vibrant thumbnails, cinematic feel',
    icon: 'Play',
    adjustments: { contrastBoost: 0.1, saturationMod: 1.2, temperatureOffset: 0, surfaceDarkness: 0.08, accentStrength: 1.2 },
  },
];

/** Lookup a project preset by ID. */
export function getProjectPreset(id: string): ProjectPreset | undefined {
  return PROJECT_PRESETS.find((p) => p.id === id);
}

/** All project preset IDs. */
export const PROJECT_PRESET_IDS = PROJECT_PRESETS.map((p) => p.id);
