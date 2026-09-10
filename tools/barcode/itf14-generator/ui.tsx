'use client';

import { BarcodeStudioClientLoader } from '@/components/dynamic';

export default function ITF14GeneratorUI() {
  return (
    <BarcodeStudioClientLoader
      standalone={false}
      initialBarcodeType="itf14"
    />
  );
}
