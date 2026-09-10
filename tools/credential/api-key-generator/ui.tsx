'use client';

import { CredentialClientLoader } from '@/components/dynamic';

export default function ApiKeyGeneratorUI() {
  return (
    <CredentialClientLoader
      standalone={false}
      initialMode={{ activeTab: 'pins-secrets', secretMode: 'api-key' }}
    />
  );
}
