'use client';

import { ColorStudioLoader } from '@/components/dynamic';

export default function ThemeBuilderUI() {
  return <ColorStudioLoader standalone={false} initialMode="theme" />;
}
