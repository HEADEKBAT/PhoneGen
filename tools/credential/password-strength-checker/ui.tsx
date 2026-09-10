'use client';

import { CredentialClientLoader } from '@/components/dynamic';

export default function PasswordStrengthCheckerUI() {
  return (
    <CredentialClientLoader
      standalone={false}
      initialMode={{ activeTab: 'passwords', passwordMode: 'random' }}
    />
  );
}
