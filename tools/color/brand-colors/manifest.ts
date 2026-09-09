/**
 * Brand Colors — Tool Manifest
 */

import { Building2 } from 'lucide-react';
import { defineTool } from '@/core';
import BrandColorsUI from './ui';

export const brandColors = defineTool({
  id: 'brand-colors',
  product: 'color',
  name: 'Brand Colors',
  ui: { component: BrandColorsUI, icon: Building2 },
  seo: {
    meta: {
      en: { title: 'Brand Colors — Browse Famous Brand Color Palettes', description: 'Explore color palettes from top brands. Use brand colors in your designs with HEX codes.', keywords: ['brand colors', 'brand palette', 'company colors', 'brand hex'] },
      ru: { title: 'Цвета брендов — Палитры известных брендов', description: 'Палитры цветов известных брендов.' },
      de: { title: 'Markenfarben — Paletten bekannter Marken', description: 'Farbpaletten bekannter Marken.' },
      es: { title: 'Colores de marca — Paletas de marcas famosas', description: 'Paletas de colores de marcas.' },
      fr: { title: 'Couleurs de marques — Palettes de marques', description: 'Palettes de couleurs de marques.' },
      pt: { title: 'Cores de marcas — Paletas de marcas', description: 'Paletas de cores de marcas.' },
    },
  },
  capabilities: { history: false, export: ['json', 'csv'], share: false, favorites: true },
});
