/**
 * Theme Builder — Tool Manifest
 */

import { Paintbrush } from 'lucide-react';
import { defineTool } from '@/core';
import ThemeBuilderUI from './ui';

export const themeBuilder = defineTool({
  id: 'theme-builder',
  product: 'color',
  name: 'Theme Builder',
  ui: { component: ThemeBuilderUI, icon: Paintbrush },
  seo: {
    meta: {
      en: { title: 'Theme Builder — Create Complete Design Systems', description: 'Build a complete design system from one color. Generate semantic tokens, surfaces, and WCAG-compliant scales.', keywords: ['theme builder', 'design system', 'color theme', 'design tokens'] },
      ru: { title: 'Конструктор тем — Создание дизайн-систем', description: 'Создавайте дизайн-системы из одного цвета.' },
      de: { title: 'Design-System-Builder — Komplette Designsysteme', description: 'Erstellen Sie Designsysteme aus einer Farbe.' },
      es: { title: 'Creador de temas — Sistemas de diseño completos', description: 'Cree sistemas de diseño desde un color.' },
      fr: { title: 'Constructeur de thème — Systèmes de design', description: 'Créez des systèmes de design.' },
      pt: { title: 'Construtor de temas — Sistemas de design', description: 'Crie sistemas de design.' },
    },
  },
  capabilities: { history: false, export: ['json'], share: false, favorites: true },
});
