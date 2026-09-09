'use client';

import dynamic from 'next/dynamic';

const QRStudioLoader = dynamic(
  () => import('@/components/dynamic/QRStudioLoader'),
  { ssr: false },
);

export default function QRCodeGeneratorUI() {
  return <QRStudioLoader standalone={false} />;
}
