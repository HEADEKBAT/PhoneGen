'use client';

import dynamic from 'next/dynamic';
import BarcodeSkeleton from '@/components/skeleton/BarcodeSkeleton';

/**
 * Dynamic loader for BarcodeStudioClient.
 *
 * Wraps the heavy barcode studio (which imports jsbarcode) in next/dynamic
 * so its chunk is loaded lazily on the client. Shows a barcode-specific
 * skeleton while the chunk loads.
 *
 * Only renders on the client (ssr: false) — barcode rendering is
 * entirely browser-based and doesn't benefit from SSR.
 */
const BarcodeStudioClientLoader = dynamic(
  () => import(/* webpackChunkName: "barcode-studio" */ '@/components/barcode/BarcodeStudioClient'),
  {
    loading: () => <BarcodeSkeleton />,
    ssr: false,
  },
);

export default BarcodeStudioClientLoader;
