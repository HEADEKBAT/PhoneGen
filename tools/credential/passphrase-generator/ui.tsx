'use client';

import dynamic from 'next/dynamic';

const CredentialClientLoader = dynamic(
  () => import('@/components/dynamic/CredentialClientLoader'),
  { ssr: false },
);

export default function PassphraseGeneratorUI() {
  return (
    <CredentialClientLoader
      standalone={false}
      initialMode={{ activeTab: 'passwords', passwordMode: 'passphrase' }}
    />
  );
}
