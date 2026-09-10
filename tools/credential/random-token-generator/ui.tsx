'use client';

import { CredentialClientLoader } from '@/components/dynamic';

export default function RandomTokenGeneratorUI() {
  return (
    <CredentialClientLoader
      standalone={false}
      initialMode={{ activeTab: 'pins-secrets', secretMode: 'token' }}
    />
  );
}
