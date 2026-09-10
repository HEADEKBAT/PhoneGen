'use client';

import { PaymentStudioLoader } from '@/components/dynamic';

export default function CreditCardGeneratorUI() {
  return (
    <PaymentStudioLoader
      standalone={false}
      initialMode="quick"
    />
  );
}
