'use client';

import { BarcodeStudioClientLoader } from '@/components/dynamic';

export default function GS1128GeneratorUI() {
  return (
    <BarcodeStudioClientLoader
      standalone={false}
      initialBarcodeType="gs1-128"
    />
  );
}
