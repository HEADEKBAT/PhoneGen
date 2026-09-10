'use client';

import { BarcodeStudioClientLoader } from '@/components/dynamic';

export default function ISSNGeneratorUI() {
  return (
    <BarcodeStudioClientLoader
      standalone={false}
      initialBarcodeType="issn"
    />
  );
}
