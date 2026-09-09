'use client';

import dynamic from 'next/dynamic';
import GeneratorToolSkeleton from '@/components/skeleton/GeneratorToolSkeleton';

const PaymentStudioLoader = dynamic(
  () => import(/* webpackChunkName: "payment-studio" */ '@/components/payment-studio/CreditCardStudioClient'),
  {
    loading: () => <GeneratorToolSkeleton />,
    ssr: false,
  },
);

export default PaymentStudioLoader;
