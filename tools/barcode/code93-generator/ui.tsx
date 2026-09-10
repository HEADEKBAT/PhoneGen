'use client';

import { BarcodeStudioClientLoader } from '@/components/dynamic';

export default function Code93GeneratorUI() {
  return (
    <BarcodeStudioClientLoader
      standalone={false}
      initialBarcodeType="code93"
    />
  );
}
