'use client';

import { BarcodeStudioClientLoader } from '@/components/dynamic';

export default function ISBNGeneratorUI() {
  return (
    <BarcodeStudioClientLoader
      standalone={false}
      initialBarcodeType="isbn13"
    />
  );
}
