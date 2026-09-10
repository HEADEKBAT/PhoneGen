'use client';

import { BarcodeStudioClientLoader } from '@/components/dynamic';

export default function CodabarGeneratorUI() {
  return (
    <BarcodeStudioClientLoader
      standalone={false}
      initialBarcodeType="codabar"
    />
  );
}
