/**
 * Brand color palettes.
 *
 * A curated collection of well-known brand color palettes
 * for quick access and inspiration.
 */

import type { ColorPalette } from './types';

export const BRAND_PALETTES: ColorPalette[] = [
  {
    name: 'GitHub',
    colors: ['#24292e', '#0366d6', '#28a745', '#d73a49', '#6f42c1', '#f66a0a'],
  },
  {
    name: 'Google',
    colors: ['#4285f4', '#ea4335', '#fbbc05', '#34a853'],
  },
  {
    name: 'Microsoft',
    colors: ['#f25022', '#7fba00', '#00a4ef', '#ffb900'],
  },
  {
    name: 'Apple',
    colors: ['#000000', '#555555', '#a3aaae', '#ffffff'],
  },
  {
    name: 'Twitter / X',
    colors: ['#000000', '#1d9bf0', '#536471', '#eff3f4'],
  },
  {
    name: 'Meta / Facebook',
    colors: ['#1877f2', '#42b72a', '#f0f2f5', '#65676b'],
  },
  {
    name: 'Slack',
    colors: ['#611f69', '#36c5f0', '#2eb67d', '#e01e5a', '#ecb22e'],
  },
  {
    name: 'Stripe',
    colors: ['#635bff', '#00d4aa', '#32325d', '#f6f9fc'],
  },
  {
    name: 'Spotify',
    colors: ['#1db954', '#191414', '#535353', '#b3b3b3'],
  },
  {
    name: 'Netflix',
    colors: ['#e50914', '#221f1f', '#f5f5f1', '#b20710'],
  },
  {
    name: 'Airbnb',
    colors: ['#ff5a5f', '#00a699', '#fc642d', '#484848', '#767676'],
  },
  {
    name: 'Discord',
    colors: ['#5865f2', '#3ba55c', '#ed4245', '#faa61a', '#57f287'],
  },
  {
    name: 'Figma',
    colors: ['#f24e1e', '#ff7262', '#a259ff', '#1abcfe', '#0acf83'],
  },
  {
    name: 'Tailwind CSS',
    colors: ['#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', '#ec4899'],
  },
  {
    name: 'Linear',
    colors: ['#5e6ad2', '#8250df', '#e8725a', '#df4b45'],
  },
  {
    name: 'Vercel',
    colors: ['#000000', '#ffffff', '#666666', '#999999', '#eaeaea'],
  },
  {
    name: 'Shadcn',
    colors: ['#000000', '#ffffff', '#3b82f6', '#e2e8f0', '#94a3b8'],
  },
  {
    name: 'Material Design',
    colors: ['#f44336', '#e91e63', '#9c27b0', '#3f51b5', '#03a9f4', '#009688', '#4caf50', '#ff9800'],
  },
];

/** Lookup brand palettes by name (case-insensitive contains). */
export function searchBrandPalettes(query: string): ColorPalette[] {
  const q = query.toLowerCase();
  return BRAND_PALETTES.filter((p) => p.name.toLowerCase().includes(q));
}
