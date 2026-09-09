'use client';

import dynamic from 'next/dynamic';

const BarcodeStudioClientLoader = dynamic(
  () => import('@/components/dynamic/BarcodeStudioClientLoader'),
  { ssr: false },
);

export default function ISSNGeneratorUI() {
  return (
    <BarcodeStudioClientLoader
      standalone={false}
      initialBarcodeType="issn"
    />
  );
}
