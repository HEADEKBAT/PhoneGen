'use client';

import dynamic from 'next/dynamic';

const BarcodeStudioClientLoader = dynamic(
  () => import('@/components/dynamic/BarcodeStudioClientLoader'),
  { ssr: false },
);

export default function GTINGeneratorUI() {
  return (
    <BarcodeStudioClientLoader
      standalone={false}
      initialBarcodeType="gtin"
    />
  );
}
