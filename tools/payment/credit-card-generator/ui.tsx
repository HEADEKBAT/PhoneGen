'use client';

import dynamic from 'next/dynamic';

const PaymentStudioClientLoader = dynamic(
  () => import('@/components/dynamic/PaymentStudioLoader'),
  { ssr: false },
);

export default function CreditCardGeneratorUI() {
  return (
    <PaymentStudioClientLoader
      standalone={false}
      initialMode="quick"
    />
  );
}
