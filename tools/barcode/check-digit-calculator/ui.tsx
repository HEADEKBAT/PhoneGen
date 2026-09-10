'use client';

import { BarcodeStudioClientLoader } from '@/components/dynamic';

export default function CheckDigitCalculatorUI() {
  return (
    <BarcodeStudioClientLoader
      standalone={false}
      initialBarcodeType="ean13"
      initialTab="validator"
    />
  );
}
