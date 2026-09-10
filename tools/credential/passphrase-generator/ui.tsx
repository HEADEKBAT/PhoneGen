'use client';

import { CredentialClientLoader } from '@/components/dynamic';

export default function PassphraseGeneratorUI() {
  return (
    <CredentialClientLoader
      standalone={false}
      initialMode={{ activeTab: 'passwords', passwordMode: 'passphrase' }}
    />
  );
}
