'use client';

import { CredentialClientLoader } from '@/components/dynamic';

export default function UuidGeneratorUI() {
  return (
    <CredentialClientLoader
      standalone={false}
      initialMode={{ activeTab: 'pins-secrets', secretMode: 'uuid' }}
    />
  );
}
