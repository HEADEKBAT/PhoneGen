/**
 * Color Names — Tool Manifest
 */

import { Bookmark } from 'lucide-react';
import { defineTool } from '@/core';
import ColorNamesUI from './ui';

export const colorNames = defineTool({
  id: 'color-names',
  product: 'color',
  name: 'Color Names',
  ui: { component: ColorNamesUI, icon: Bookmark },
  seo: {
    meta: {
      en: { title: 'Color Names — Browse Named Colors with HEX Codes', description: 'Browse named colors with HEX, RGB, HSL values. Find the perfect named color for your design.', keywords: ['color names', 'named colors', 'CSS colors', 'HEX codes'] },
      ru: { title: 'Названия цветов — Цвета с HEX кодами', description: 'Названия цветов с HEX кодами. Справочник.' },
      de: { title: 'Farbnamen — Benannte Farben mit HEX-Codes', description: 'Durchsuchen Sie benannte Farben.' },
      es: { title: 'Nombres de colores — Colores con códigos HEX', description: 'Explore colores con nombres.' },
      fr: { title: 'Noms de couleurs — Couleurs nommées', description: 'Parcourez les couleurs nommées.' },
      pt: { title: 'Nomes de cores — Cores nomeadas', description: 'Navegue por cores nomeadas.' },
    },
  },
  capabilities: { history: false, export: ['json', 'csv'], share: false, favorites: true },
});
