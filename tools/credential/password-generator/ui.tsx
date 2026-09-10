'use client';

import { CredentialClientLoader } from '@/components/dynamic';

export default function PasswordGeneratorUI() {
  return (
    <CredentialClientLoader
      standalone={false}
      initialMode={{ activeTab: 'passwords', passwordMode: 'random' }}
    />
  );
}
