'use client';

import dynamic from 'next/dynamic';
import GeneratorToolSkeleton from '@/components/skeleton/GeneratorToolSkeleton';

interface QRStudioLoaderProps {
  standalone?: boolean;
}

const QRStudioLoader = dynamic(
  () => import(/* webpackChunkName: "qr-studio" */ '@/components/qr-studio/QRStudioClient'),
  { loading: () => <GeneratorToolSkeleton />, ssr: false },
);

export default QRStudioLoader as unknown as React.FC<QRStudioLoaderProps>;
