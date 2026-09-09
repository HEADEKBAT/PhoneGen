'use client';

import dynamic from 'next/dynamic';

const CredentialClientLoader = dynamic(
  () => import('@/components/dynamic/CredentialClientLoader'),
  { ssr: false },
);

export default function PasswordGeneratorUI() {
  return (
    <CredentialClientLoader
      standalone={false}
      initialMode={{ activeTab: 'passwords', passwordMode: 'random' }}
    />
  );
}
