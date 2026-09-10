'use client';

import { BarcodeStudioClientLoader } from '@/components/dynamic';

export default function UPCGeneratorUI() {
  return (
    <BarcodeStudioClientLoader
      standalone={false}
      initialBarcodeType="upca"
    />
  );
}
