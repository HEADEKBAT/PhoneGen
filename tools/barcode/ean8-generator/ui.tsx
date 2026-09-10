'use client';

import { BarcodeStudioClientLoader } from '@/components/dynamic';

export default function EAN8GeneratorUI() {
  return (
    <BarcodeStudioClientLoader
      standalone={false}
      initialBarcodeType="ean8"
    />
  );
}
