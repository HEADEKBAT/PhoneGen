'use client';

import { BarcodeStudioClientLoader } from '@/components/dynamic';

export default function GTINGeneratorUI() {
  return (
    <BarcodeStudioClientLoader
      standalone={false}
      initialBarcodeType="gtin"
    />
  );
}
