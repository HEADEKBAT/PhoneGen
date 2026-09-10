'use client';

import { BarcodeStudioClientLoader } from '@/components/dynamic';

export default function Code128GeneratorUI() {
  return (
    <BarcodeStudioClientLoader
      standalone={false}
      initialBarcodeType="code128"
    />
  );
}
