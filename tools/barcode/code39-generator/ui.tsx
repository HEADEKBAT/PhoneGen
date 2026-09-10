'use client';

import { BarcodeStudioClientLoader } from '@/components/dynamic';

export default function Code39GeneratorUI() {
  return (
    <BarcodeStudioClientLoader
      standalone={false}
      initialBarcodeType="code39"
    />
  );
}
