/**
 * Design Tokens — Tool Manifest
 */

import { Code } from 'lucide-react';
import { defineTool } from '@/core';
import DesignTokensUI from './ui';

export const designTokens = defineTool({
  id: 'design-tokens',
  product: 'color',
  name: 'Design Tokens',
  ui: { component: DesignTokensUI, icon: Code },
  seo: {
    meta: {
      en: { title: 'Design Tokens — Export Colors as CSS, JSON, Tailwind, SCSS', description: 'Export your colors as design tokens — CSS custom properties, Tailwind config, JSON, SCSS variables.', keywords: ['design tokens', 'CSS variables', 'Tailwind', 'color export'] },
      ru: { title: 'Дизайн-токены — Экспорт цветов', description: 'Экспортируйте цвета как дизайн-токены.' },
      de: { title: 'Design-Tokens — Farben exportieren', description: 'Exportieren Sie Farben als Design-Tokens.' },
      es: { title: 'Tokens de diseño — Exporte colores', description: 'Exporte colores como tokens.' },
      fr: { title: 'Design tokens — Exportez les couleurs', description: 'Exportez les couleurs en tokens.' },
      pt: { title: 'Design tokens — Exporte cores', description: 'Exporte cores como tokens.' },
    },
  },
  capabilities: { history: false, export: ['css', 'json', 'tailwind', 'scss'], share: false, favorites: false },
});
