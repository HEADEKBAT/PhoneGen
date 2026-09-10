'use client';

import { ColorStudioLoader } from '@/components/dynamic';

export default function GradientGeneratorUI() {
  return <ColorStudioLoader standalone={false} initialMode="gradient" />;
}
