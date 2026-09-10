'use client';

import { ColorStudioLoader } from '@/components/dynamic';

export default function PaletteGeneratorUI() {
  return <ColorStudioLoader standalone={false} initialMode="palette" />;
}
