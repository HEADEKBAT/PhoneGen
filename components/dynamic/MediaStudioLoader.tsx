'use client';

import dynamic from 'next/dynamic';
import MediaStudioSkeleton from '@/components/skeleton/MediaStudioSkeleton';

interface MediaStudioLoaderProps {
  standalone?: boolean;
  initialTab?: string;
}

/**
 * Dynamic loader for MediaStudioClient.
 *
 * Wraps the heavy MediaStudioClient (which imports FFmpeg.wasm)
 * in next/dynamic so its chunk is loaded lazily on the client.
 * Shows a media-themed skeleton while the chunk loads.
 *
 * SSR is disabled — media processing is entirely browser-based.
 */
const MediaStudioLoader = dynamic(
  () =>
    import(
      /* webpackChunkName: "media-studio" */ '@/components/media/MediaStudioClient'
    ),
  {
    loading: () => <MediaStudioSkeleton />,
    ssr: false,
  },
);

export default MediaStudioLoader as unknown as React.FC<MediaStudioLoaderProps>;
