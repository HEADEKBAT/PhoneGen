'use client';

import { ColorStudioLoader } from '@/components/dynamic';

export default function RandomColorGeneratorUI() {
  return <ColorStudioLoader standalone={false} initialMode="random" />;
}
