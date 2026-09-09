'use client';

import dynamic from 'next/dynamic';

const CredentialClientLoader = dynamic(
  () => import('@/components/dynamic/CredentialClientLoader'),
  { ssr: false },
);

export default function RandomTokenGeneratorUI() {
  return (
    <CredentialClientLoader
      standalone={false}
      initialMode={{ activeTab: 'pins-secrets', secretMode: 'token' }}
    />
  );
}
