'use client';

import dynamic from 'next/dynamic';
import GeneratorToolSkeleton from '@/components/skeleton/GeneratorToolSkeleton';

const CryptoPlaygroundClient = dynamic(
  () => import('@/components/crypto/CryptoPlaygroundClient'),
  {
    ssr: false,
    loading: () => <GeneratorToolSkeleton />,
  },
);

export default CryptoPlaygroundClient;
