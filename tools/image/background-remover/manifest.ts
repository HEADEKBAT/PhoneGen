/**
 * Background Remover — Tool Manifest
 */

import { Image as ImageIcon } from 'lucide-react';
import { defineTool } from '@/core';
import BackgroundRemoverUI from './ui';

export const backgroundRemover = defineTool({
  id: 'background-remover',
  product: 'image',
  name: 'Background Remover',
  ui: { component: BackgroundRemoverUI, icon: ImageIcon },
  seo: {
    meta: {
      en: { title: 'Background Remover', description: 'Remove backgrounds from images instantly. Free online background remover with edge refinement.', keywords: ['background remover', 'remove background', 'image background removal', 'transparent background'] },
      ru: { title: 'Удаление фона', description: 'Удалите фон с изображений мгновенно. Бесплатный онлайн инструмент с улучшением краев.' },
      de: { title: 'Hintergrund entfernen', description: 'Entfernen Sie den Hintergrund von Bildern sofort. Kostenloses Online-Tool.' },
      es: { title: 'Eliminar fondo', description: 'Elimine el fondo de las imágenes al instante. Herramienta gratuita.' },
      fr: { title: 'Supprimer l\'arrière-plan', description: 'Supprimez l\'arrière-plan des images instantanément. Outil gratuit.' },
      pt: { title: 'Remover fundo', description: 'Remova o fundo das imagens instantaneamente. Ferramenta gratuita.' },
    },
  },
  capabilities: { history: false, share: false, favorites: false },
});
