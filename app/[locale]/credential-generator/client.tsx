'use client';

import { Suspense, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CredentialTabs from '@/components/credential/CredentialTabs';
import { useCredentialGeneratorStore } from '@/lib/store';

export interface CredentialClientProps {
  initialMode?: {
    activeTab?: 'passwords' | 'pins-secrets' | 'dev-pairs' | 'history';
    passwordMode?: 'random' | 'human' | 'passphrase' | 'pronounceable';
    secretMode?: 'uuid' | 'jwt' | 'api-key' | 'webhook' | 'hex' | 'base64';
    pinLength?: 4 | 6 | 8;
  };
}

function CredentialContent({ initialMode }: CredentialClientProps) {
  const store = useCredentialGeneratorStore();

  useEffect(() => {
    if (!initialMode) return;
    if (initialMode.activeTab) store.setActiveTab(initialMode.activeTab);
    if (initialMode.passwordMode) store.setPasswordMode(initialMode.passwordMode);
    if (initialMode.secretMode) store.setSecretMode(initialMode.secretMode);
    if (initialMode.pinLength) store.setPinLength(initialMode.pinLength);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8 sm:py-12">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-foreground">
              Credential Generator
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              Generate passwords, PINs, secrets, and dev pairs
            </p>
          </div>
          <CredentialTabs />
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function CredentialGeneratorClient(props: CredentialClientProps) {
  return (
    <Suspense fallback={null}>
      <CredentialContent {...props} />
    </Suspense>
  );
}
