'use client';

import { ColorStudioLoader } from '@/components/dynamic';

export default function ColorContrastCheckerUI() {
  return <ColorStudioLoader standalone={false} initialMode="contrast" />;
}
