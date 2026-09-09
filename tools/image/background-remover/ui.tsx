'use client';

import dynamic from 'next/dynamic';
import ImageStudioSkeleton from '@/components/skeleton/ImageStudioSkeleton';

/**
 * Dynamic wrapper for the Background Remover tool page.
 *
 * This is imported by the tool manifest and rendered via createToolPage().
 * On the SEO page it renders full-screen; on the /tool page it is rendered
 * inside an ImageStudioClient tab.
 */

const ImageStudioClient = dynamic(
  () =>
    import(
      /* webpackChunkName: "image-studio" */ '@/components/image-studio/ImageStudioClient'
    ),
  {
    loading: () => <ImageStudioSkeleton />,
    ssr: false,
  },
);

interface BackgroundRemoverUIProps {
  standalone?: boolean;
}

export default function BackgroundRemoverUI({ standalone = true }: BackgroundRemoverUIProps) {
  return <ImageStudioClient standalone={standalone} initialMode="background-remover" />;
}
