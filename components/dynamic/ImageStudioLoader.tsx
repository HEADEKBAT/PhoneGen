'use client';

import dynamic from 'next/dynamic';
import ImageStudioSkeleton from '@/components/skeleton/ImageStudioSkeleton';

interface ImageStudioLoaderProps {
  standalone?: boolean;
  initialMode?: string;
}

/**
 * Dynamic loader for ImageStudioClient.
 *
 * Wraps the heavy ImageStudioClient (which imports image-processing libraries)
 * in next/dynamic so its chunk is loaded lazily on the client.
 * Shows an image-themed skeleton while the chunk loads.
 *
 * SSR is disabled — image rendering is entirely browser-based.
 */
const ImageStudioLoader = dynamic(
  () =>
    import(
      /* webpackChunkName: "image-studio" */ '@/components/image-studio/ImageStudioClient'
    ),
  {
    loading: () => <ImageStudioSkeleton />,
    ssr: false,
  },
);

export default ImageStudioLoader as unknown as React.FC<ImageStudioLoaderProps>;
