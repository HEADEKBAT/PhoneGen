/**
 * Random Color Generator — Tool Manifest
 */

import { Shuffle } from 'lucide-react';
import { defineTool } from '@/core';
import RandomColorGeneratorUI from './ui';

export const randomColorGenerator = defineTool({
  id: 'random-color-generator',
  product: 'color',
  name: 'Random Color Generator',
  ui: { component: RandomColorGeneratorUI, icon: Shuffle },
  seo: {
    meta: {
      en: { title: 'Random Color Generator — Generate Random Hex Colors', description: 'Generate random colors with hex, RGB, HSL values. Free online random color picker with lock and copy.', keywords: ['random color', 'hex color', 'color generator', 'random hex'] },
      ru: { title: 'Генератор случайных цветов — Случайные HEX цвета', description: 'Генерируйте случайные цвета. Бесплатный генератор.' },
      de: { title: 'Zufallsfarben-Generator — Zufällige Hex-Farben', description: 'Generieren Sie zufällige Farben. Kostenloser Generator.' },
      es: { title: 'Generador de colores aleatorios — Colores HEX aleatorios', description: 'Genere colores aleatorios. Generador gratuito.' },
      fr: { title: 'Générateur de couleurs aléatoires — Couleurs HEX', description: 'Générez des couleurs aléatoires. Générateur gratuit.' },
      pt: { title: 'Gerador de cores aleatórias — Cores HEX aleatórias', description: 'Gere cores aleatórias. Gerador gratuito.' },
    },
  },
  capabilities: { history: true, export: ['csv', 'json'], share: true, favorites: true },
});
