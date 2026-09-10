'use client';

import { BarcodeStudioClientLoader } from '@/components/dynamic';

export default function EAN13GeneratorUI() {
  return (
    <BarcodeStudioClientLoader
      standalone={false}
      initialBarcodeType="ean13"
    />
  );
}
