'use client';

import { CredentialClientLoader } from '@/components/dynamic';

export default function RandomPinGeneratorUI() {
  return (
    <CredentialClientLoader
      standalone={false}
      initialMode={{ activeTab: 'pins-secrets', pinLength: 6 }}
    />
  );
}
