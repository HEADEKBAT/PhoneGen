/**
 * Gradient Generator — Tool Manifest
 */

import { Layers } from 'lucide-react';
import { defineTool } from '@/core';
import GradientGeneratorUI from './ui';

export const gradientGenerator = defineTool({
  id: 'gradient-generator',
  product: 'color',
  name: 'Gradient Generator',
  ui: { component: GradientGeneratorUI, icon: Layers },
  seo: {
    meta: {
      en: { title: 'Gradient Generator — Create CSS Gradients Online', description: 'Create beautiful CSS gradients — linear, radial, conic. Free online gradient generator with live preview and CSS export.', keywords: ['gradient generator', 'CSS gradient', 'linear gradient', 'radial gradient'] },
      ru: { title: 'Генератор градиентов — CSS градиенты онлайн', description: 'Создавайте CSS градиенты. Бесплатный генератор.' },
      de: { title: 'Verlaufs-Generator — CSS-Verläufe online', description: 'Erstellen Sie CSS-Verläufe. Kostenlos.' },
      es: { title: 'Generador de degradados — Degradados CSS', description: 'Cree degradados CSS. Gratuito.' },
      fr: { title: 'Générateur de dégradés — Dégradés CSS', description: 'Créez des dégradés CSS. Gratuit.' },
      pt: { title: 'Gerador de gradientes — Gradientes CSS', description: 'Crie gradientes CSS. Grátis.' },
    },
  },
  capabilities: { history: true, export: ['css', 'json', 'svg'], share: true, favorites: true },
});
