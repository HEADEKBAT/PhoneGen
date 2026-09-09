/**
 * Color Converter — Tool Manifest
 */

import { Repeat } from 'lucide-react';
import { defineTool } from '@/core';
import ColorConverterUI from './ui';

export const colorConverter = defineTool({
  id: 'color-converter',
  product: 'color',
  name: 'Color Converter',
  ui: { component: ColorConverterUI, icon: Repeat },
  seo: {
    meta: {
      en: { title: 'Color Converter — Convert Between HEX, RGB, HSL, OKLCH', description: 'Convert colors between HEX, RGB, HSL, OKLCH, LAB, and more. Free online color converter with live preview.', keywords: ['color converter', 'HEX to RGB', 'RGB to HSL', 'color space'] },
      ru: { title: 'Конвертер цветов — HEX, RGB, HSL', description: 'Конвертируйте цвета между форматами. Бесплатно.' },
      de: { title: 'Farbkonverter — HEX, RGB, HSL', description: 'Konvertieren Sie Farben. Kostenlos.' },
      es: { title: 'Conversor de colores — HEX, RGB, HSL', description: 'Convierta colores. Gratuito.' },
      fr: { title: 'Convertisseur de couleurs — HEX, RGB, HSL', description: 'Convertissez les couleurs. Gratuit.' },
      pt: { title: 'Conversor de cores — HEX, RGB, HSL', description: 'Converta cores. Grátis.' },
    },
  },
  capabilities: { history: true, export: ['json'], share: true, favorites: false },
});
