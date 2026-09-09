/**
 * Color Contrast Checker — Tool Manifest
 */

import { Eye } from 'lucide-react';
import { defineTool } from '@/core';
import ColorContrastCheckerUI from './ui';

export const colorContrastChecker = defineTool({
  id: 'color-contrast-checker',
  product: 'color',
  name: 'Color Contrast Checker',
  ui: { component: ColorContrastCheckerUI, icon: Eye },
  seo: {
    meta: {
      en: { title: 'Color Contrast Checker — WCAG Accessibility Checker', description: 'Check color contrast ratios for WCAG AA and AAA compliance. Free online accessibility checker.', keywords: ['contrast checker', 'WCAG', 'accessibility', 'color contrast'] },
      ru: { title: 'Проверка контраста — WCAG доступность', description: 'Проверяйте контрастность цветов. Бесплатно.' },
      de: { title: 'Kontrast-Prüfer — WCAG-Barrierefreiheit', description: 'Prüfen Sie Farbkontraste. Kostenlos.' },
      es: { title: 'Verificador de contraste — Accesibilidad WCAG', description: 'Verifique el contraste. Gratuito.' },
      fr: { title: 'Vérificateur de contraste — Accessibilité WCAG', description: 'Vérifiez les contrastes. Gratuit.' },
      pt: { title: 'Verificador de contraste — Acessibilidade WCAG', description: 'Verifique o contraste. Grátis.' },
    },
  },
  capabilities: { history: false, export: ['json'], share: true, favorites: false },
});
