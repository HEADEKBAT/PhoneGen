'use client';

import dynamic from 'next/dynamic';
import ColorStudioSkeleton from '@/components/skeleton/ColorStudioSkeleton';

/**
 * Dynamic loader for ColorStudioClient.
 *
 * Wraps the heavy ColorStudioClient (which imports color-science libraries)
 * in next/dynamic so its chunk is loaded lazily on the client.
 * Shows a color-themed skeleton while the chunk loads.
 *
 * SSR is disabled — color rendering is entirely browser-based.
 */
const ColorStudioLoader = dynamic(
  () =>
    import(
      /* webpackChunkName: "color-studio" */ '@/components/color-studio/ColorStudioClient'
    ),
  {
    loading: () => <ColorStudioSkeleton />,
    ssr: false,
  },
);

export default ColorStudioLoader;
