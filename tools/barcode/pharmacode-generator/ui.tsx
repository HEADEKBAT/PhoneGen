'use client';

import { BarcodeStudioClientLoader } from '@/components/dynamic';

export default function PharmacodeGeneratorUI() {
  return (
    <BarcodeStudioClientLoader
      standalone={false}
      initialBarcodeType="pharmacode"
    />
  );
}
