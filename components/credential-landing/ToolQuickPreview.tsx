'use client';

import { useEffect, useState, useCallback } from 'react';
import { Copy, Check, RefreshCw } from 'lucide-react';
import { useTranslations } from '@/lib/i18n';
import {
  generateRandomPassword,
  generatePassphrase,
  generatePin,
  generateUUID,
  generateUUIDv7,
  generateJWTSecret,
  generateApiKey,
  generateWebhookSecret,
  generateRandomToken,
  generateSessionSecret,
  generateOAuthSecret,
  generateHex,
  generateBase64,
} from '@/lib/credentialGenerator';

interface ToolQuickPreviewProps {
  mode: string;
}

type GeneratorFn = () => string;

export default function ToolQuickPreview({ mode }: ToolQuickPreviewProps) {
  const { t } = useTranslations();
  const st = (key: string) => t(`credentialLanding.sections.${key}`);
  const [value, setValue] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = useCallback(() => {
    const generators: Record<string, GeneratorFn> = {
      'random': () => generateRandomPassword({ length: 16, uppercase: true, lowercase: true, numbers: true, symbols: true }),
      'human': () => generateRandomPassword({ length: 12, uppercase: true, lowercase: true, numbers: true, symbols: false }),
      'passphrase': () => generatePassphrase({ wordCount: 4, separator: '-', capitalize: false, includeNumber: true }),
      'pronounceable': () => generateRandomPassword({ length: 10, uppercase: false, lowercase: true, numbers: false, symbols: false }),
      'pin': () => generatePin({ length: 6, noRepeat: false }),
      'uuid': () => generateUUID(),
      'uuid-v7': () => generateUUIDv7(),
      'jwt': () => generateJWTSecret(),
      'api-key': () => generateApiKey('sk_test'),
      'webhook': () => generateWebhookSecret(),
      'token': () => generateRandomToken(32, 'hex'),
      'session': () => generateSessionSecret(),
      'oauth': () => generateOAuthSecret(),
      'hex': () => generateHex(32),
      'base64': () => generateBase64(32),
    };

    const fn = generators[mode] || generators['uuid'];
    setValue(fn());
  }, [mode]);

  useEffect(() => {
    generate();
  }, [generate]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* ignore */ }
  };

  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12 sm:py-16 text-center">
        <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground tracking-tight mb-6">
          {st('live_title')}
        </h2>
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <code className="flex-1 text-sm sm:text-base font-mono text-foreground bg-muted/50 rounded-lg px-4 py-3 min-h-[2.75rem] break-all text-left">
              {value}
            </code>
            <button
              onClick={handleCopy}
              className="shrink-0 size-10 flex items-center justify-center rounded-lg border border-border bg-background hover:bg-muted transition-colors"
              title={st('copy_title')}
            >
              {copied ? <Check size={16} className="text-primary" /> : <Copy size={16} />}
            </button>
            <button
              onClick={generate}
              className="shrink-0 size-10 flex items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              title={st('regenerate_title')}
            >
              <RefreshCw size={16} />
            </button>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            {st('live_hint')}
          </p>
        </div>
      </div>
    </section>
  );
}
