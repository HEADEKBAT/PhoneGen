'use client';

import { ColorStudioLoader } from '@/components/dynamic';

export default function DesignTokensUI() {
  return <ColorStudioLoader standalone={false} initialMode="tokens" />;
}
