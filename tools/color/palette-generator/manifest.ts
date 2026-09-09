/**
 * Palette Generator — Tool Manifest
 */

import { Palette } from 'lucide-react';
import { defineTool } from '@/core';
import PaletteGeneratorUI from './ui';

export const paletteGenerator = defineTool({
  id: 'palette-generator',
  product: 'color',
  name: 'Palette Generator',
  ui: { component: PaletteGeneratorUI, icon: Palette },
  seo: {
    meta: {
      en: { title: 'Palette Generator — Create Color Palettes Online', description: 'Generate color harmonies, shades, tints, and tones. Free online palette generator with export.', keywords: ['palette generator', 'color palette', 'color harmony', 'color scheme'] },
      ru: { title: 'Генератор палитр — Создание цветовых палитр онлайн', description: 'Создавайте цветовые палитры. Бесплатный генератор.' },
      de: { title: 'Paletten-Generator — Farbpaletten online erstellen', description: 'Erstellen Sie Farbpaletten. Kostenloser Generator.' },
      es: { title: 'Generador de paletas — Cree paletas de colores', description: 'Cree paletas de colores. Generador gratuito.' },
      fr: { title: 'Générateur de palettes — Créez des palettes de couleurs', description: 'Créez des palettes de couleurs. Générateur gratuit.' },
      pt: { title: 'Gerador de paletas — Crie paletas de cores', description: 'Crie paletas de cores. Gerador gratuito.' },
    },
  },
  capabilities: { history: true, export: ['csv', 'json'], share: true, favorites: true },
});
