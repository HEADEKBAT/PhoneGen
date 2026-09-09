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
      en: { title: 'Background Remover — Remove Image Backgrounds Online Free', description: 'Remove backgrounds from images instantly. Free online background remover with edge refinement.', keywords: ['background remover', 'remove background', 'image background removal', 'transparent background'] },
      ru: { title: 'Удаление фона — Убрать фон с изображения онлайн бесплатно', description: 'Удалите фон с изображений мгновенно. Бесплатный онлайн инструмент с улучшением краев.' },
      de: { title: 'Hintergrund entfernen — Bildhintergrund online kostenlos entfernen', description: 'Entfernen Sie den Hintergrund von Bildern sofort. Kostenloses Online-Tool.' },
      es: { title: 'Eliminar fondo — Quitar fondo de imagen online gratis', description: 'Elimine el fondo de las imágenes al instante. Herramienta gratuita.' },
      fr: { title: 'Supprimer l\'arrière-plan — Enlever le fond d\'image en ligne gratuit', description: 'Supprimez l\'arrière-plan des images instantanément. Outil gratuit.' },
      pt: { title: 'Remover fundo — Tirar fundo de imagem online grátis', description: 'Remova o fundo das imagens instantaneamente. Ferramenta gratuita.' },
    },
  },
  capabilities: { history: false, share: false, favorites: false },
});
