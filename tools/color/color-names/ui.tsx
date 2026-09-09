'use client';

import dynamic from 'next/dynamic';

const ColorStudioLoader = dynamic(
  () => import('@/components/dynamic/ColorStudioLoader'),
  { ssr: false },
);

export default function ColorNamesUI() {
  return <ColorStudioLoader standalone={false} initialMode="names" />;
}
