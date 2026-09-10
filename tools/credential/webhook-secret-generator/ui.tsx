'use client';

import { CredentialClientLoader } from '@/components/dynamic';

export default function WebhookSecretGeneratorUI() {
  return (
    <CredentialClientLoader
      standalone={false}
      initialMode={{ activeTab: 'pins-secrets', secretMode: 'webhook' }}
    />
  );
}
