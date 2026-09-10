'use client';

import { CredentialClientLoader } from '@/components/dynamic';

export default function UuidV7GeneratorUI() {
  return (
    <CredentialClientLoader
      standalone={false}
      initialMode={{ activeTab: 'pins-secrets', secretMode: 'uuid-v7' }}
    />
  );
}
