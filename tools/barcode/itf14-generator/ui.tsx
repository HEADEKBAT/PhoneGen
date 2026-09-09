'use client';

import dynamic from 'next/dynamic';

const BarcodeStudioClientLoader = dynamic(
  () => import('@/components/dynamic/BarcodeStudioClientLoader'),
  { ssr: false },
);

export default function ITF14GeneratorUI() {
  return (
    <BarcodeStudioClientLoader
      standalone={false}
      initialBarcodeType="itf14"
    />
  );
}
