'use client';

import { CredentialClientLoader } from '@/components/dynamic';

export default function JwtSecretGeneratorUI() {
  return (
    <CredentialClientLoader
      standalone={false}
      initialMode={{ activeTab: 'pins-secrets', secretMode: 'jwt' }}
    />
  );
}
