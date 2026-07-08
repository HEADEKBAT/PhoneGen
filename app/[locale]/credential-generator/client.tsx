'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { getPreset } from '@/lib/config/credentialPresets';
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
  const searchParams = useSearchParams();

  useEffect(() => {
    // Preset from URL takes priority
    const presetId = searchParams?.get('preset');
    if (presetId) {
      const preset = getPreset(presetId);
      if (preset) {
        const cfg = preset.config;
        store.setActiveTab(cfg.activeTab);
        if (cfg.passwordMode) store.setPasswordMode(cfg.passwordMode);
        if (cfg.secretMode) store.setSecretMode(cfg.secretMode);
        if (cfg.length) {
          store.setPasswordLength(cfg.length);
          if (cfg.secretMode === 'hex') store.setHexLength(cfg.length);
          if (cfg.secretMode === 'base64') store.setBase64Length(cfg.length);
        }
        if (cfg.wordCount) store.setPassphraseWordCount(cfg.wordCount);
        if (cfg.separator) store.setPassphraseSeparator(cfg.separator);
        if (cfg.uppercase !== undefined) store.setPasswordUppercase(cfg.uppercase);
        if (cfg.lowercase !== undefined) store.setPasswordLowercase(cfg.lowercase);
        if (cfg.numbers !== undefined) store.setPasswordNumbers(cfg.numbers);
        if (cfg.symbols !== undefined) store.setPasswordSymbols(cfg.symbols);
        if (cfg.avoidAmbiguous !== undefined) store.setPasswordAvoidAmbiguous(cfg.avoidAmbiguous);
        return;
      }
    }

    // Mode from URL
    const mode = searchParams?.get('mode');
    if (mode) {
      switch (mode) {
        case 'random':
          store.setActiveTab('passwords');
          store.setPasswordMode('random');
          break;
        case 'human':
          store.setActiveTab('passwords');
          store.setPasswordMode('human');
          break;
        case 'passphrase':
          store.setActiveTab('passwords');
          store.setPasswordMode('passphrase');
          break;
        case 'pronounceable':
          store.setActiveTab('passwords');
          store.setPasswordMode('pronounceable');
          break;
        case 'pin':
          store.setActiveTab('pins-secrets');
          store.setPinLength(6);
          break;
        case 'uuid':
          store.setActiveTab('pins-secrets');
          store.setSecretMode('uuid');
          break;
        case 'jwt':
          store.setActiveTab('pins-secrets');
          store.setSecretMode('jwt');
          break;
        case 'api-key':
          store.setActiveTab('pins-secrets');
          store.setSecretMode('api-key');
          break;
        case 'webhook':
          store.setActiveTab('pins-secrets');
          store.setSecretMode('webhook');
          break;
        case 'hex':
          store.setActiveTab('pins-secrets');
          store.setSecretMode('hex');
          break;
        case 'base64':
          store.setActiveTab('pins-secrets');
          store.setSecretMode('base64');
          break;
        case 'token':
          store.setActiveTab('pins-secrets');
          store.setSecretMode('uuid');
          break;
      }
      return;
    }

    // Fallback to initialMode prop
    if (!initialMode) return;
    if (initialMode.activeTab) store.setActiveTab(initialMode.activeTab);
    if (initialMode.passwordMode) store.setPasswordMode(initialMode.passwordMode);
    if (initialMode.secretMode) store.setSecretMode(initialMode.secretMode);
    if (initialMode.pinLength) store.setPinLength(initialMode.pinLength);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8 sm:py-12">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-foreground">
            Credential Generator
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Generate passwords, PINs, secrets, and developer credentials
          </p>
        </div>
        <CredentialTabs />
      </div>
    </main>
  );
}

export default function CredentialGeneratorClient(props: CredentialClientProps) {
  return (
    <Suspense fallback={null}>
      <CredentialContent {...props} />
    </Suspense>
  );
}
