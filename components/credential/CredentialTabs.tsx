'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import {
  Key,
  Lock,
  Shuffle,
  Copy,
  Check,
  Users,
  RefreshCw,
  Hash,
  Sparkles,
  ChevronDown,
  Globe,
  UserPlus,
} from 'lucide-react';
import { useCredentialGeneratorStore, type CredentialGeneratorStore } from '@/lib/store';
import { useTranslations } from '@/lib/i18n';
import {
  generateRandomPassword,
  generatePassphrase,
  generatePronounceable,
  generatePin,
  generateUUID,
  generateUUIDv7,
  generateJWTSecret,
  generateApiKey,
  generateWebhookSecret,
  generateHex,
  generateBase64,
  generateRandomToken,
  generateSessionSecret,
  generateOAuthSecret,
  generateCredentialPairs,
  calculateRandomPasswordEntropy,
  calculatePassphraseEntropy,
  calculatePinEntropy,
  calculatePronounceableEntropy,
  calculateStringEntropy,
  scorePassword,
  ALPHABET_SIZES,
} from '@/lib/credentialGenerator';
import { SUPPORTED_COUNTRY_CODES, COUNTRY_NAMES } from '@/lib/userGenerator/countryLocaleMap';
import type { PasswordMode, SecretMode } from '@/lib/credentialGenerator/types';
import StrengthMeter from './StrengthMeter';
import CredentialHistory from './CredentialHistory';
import CredentialExportBar from './CredentialExportBar';
import PresetPanel from './PresetPanel';

/* ── Constants ────────────────────────────────────────────────────────── */

/* Labels are translation keys, not words: this tool shipped entirely in
   English on a site that serves six languages, with the `credential.*`
   dictionary sitting unused beside it in all six. */
const TABS = [
  { id: 'passwords' as const, labelKey: 'credential.passwords', icon: Key },
  { id: 'pins-secrets' as const, labelKey: 'credential.pinSecrets', icon: Lock },
  { id: 'dev-pairs' as const, labelKey: 'credential.devPairs', icon: Users },
  { id: 'history' as const, labelKey: 'credential.history', icon: Hash },
];

const PASSWORD_MODES: { id: PasswordMode; labelKey: string; descKey: string }[] = [
  { id: 'random', labelKey: 'credential.random', descKey: 'credential.modeDesc.random' },
  { id: 'passphrase', labelKey: 'credential.passphrase', descKey: 'credential.modeDesc.passphrase' },
  { id: 'pronounceable', labelKey: 'credential.pronounceable', descKey: 'credential.modeDesc.pronounceable' },
];

/* The format names stay as they are written in the specs — UUID v4, JWT, hex,
   base64 are not translated anywhere — while the words around them are. */
const SECRET_MODES: { id: SecretMode; labelKey: string }[] = [
  { id: 'pin', labelKey: 'credential.pin' },
  { id: 'uuid', labelKey: 'credential.uuid' },
  { id: 'uuid-v7', labelKey: 'credential.uuidV7' },
  { id: 'jwt', labelKey: 'credential.jwt' },
  { id: 'api-key', labelKey: 'credential.apiKey' },
  { id: 'webhook', labelKey: 'credential.webhook' },
  { id: 'token', labelKey: 'credential.token' },
  { id: 'session', labelKey: 'credential.session' },
  { id: 'oauth', labelKey: 'credential.oauth' },
  { id: 'hex', labelKey: 'credential.hex' },
  { id: 'base64', labelKey: 'credential.base64' },
];

const QUANTITY_OPTIONS = [1, 5, 10, 25, 50, 100] as const;

/** How many values one click produces on the password and secret tabs. */
const BATCH_SIZE = 5;

/* ── Copied indicator ref ─────────────────────────────────────────────── */

function useCopiedTimer() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(null);

  const copy = useCallback(async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopiedIndex(null), 1500);
    } catch { /* fallback */ }
  }, []);

  return { copiedIndex, copy };
}

/* ── Main Component ───────────────────────────────────────────────────── */

export default function CredentialTabs() {
  const { t } = useTranslations();
  const store = useCredentialGeneratorStore();
  const { copiedIndex, copy } = useCopiedTimer();
  const [loading, setLoading] = useState(false);

  /* ── Generate dispatch ─────────────────────────────────────────────── */
  const handleGenerate = useCallback(() => {
    setLoading(true);
    requestAnimationFrame(() => {
      let results: string[] = [];

      switch (store.activeTab) {
        case 'passwords':
          results = generatePasswords(store);
          break;
        case 'pins-secrets':
          results = generatePinsSecrets(store);
          break;
        case 'dev-pairs':
          results = generateDevPairs(store);
          break;
      }

      store.setResults(results);
      results.forEach((r) => {
        if (r.length >= 8) store.addToHistory(r);
      });
      setLoading(false);
    });
  }, [store]);

  /* ── Score for last result ──────────────────────────────────────────── */
  const score = useMemo(() => {
    if (store.results.length === 0) return null;
    if (store.activeTab !== 'passwords' && store.activeTab !== 'pins-secrets') return null;
    const last = store.results[0];

    if (store.activeTab === 'pins-secrets') {
      return scorePassword(last, secretEntropyBits(store));
    }

    /* Entropy comes from the settings, not from the string: it is a property
       of how the value was produced, and every option that narrows the draw —
       the exclusion list included — has to reach the calculation. */
    let bits = 0;
    if (store.passwordMode === 'random') {
      bits = calculateRandomPasswordEntropy({
        length: store.passwordLength,
        uppercase: store.passwordUppercase,
        lowercase: store.passwordLowercase,
        numbers: store.passwordNumbers,
        symbols: store.passwordSymbols,
        excludeChars: store.passwordExcludeChars || undefined,
        avoidAmbiguous: store.passwordAvoidAmbiguous || undefined,
      });
    } else if (store.passwordMode === 'passphrase') {
      bits = calculatePassphraseEntropy(store.passphraseWordCount);
    } else if (store.passwordMode === 'pronounceable') {
      bits = calculatePronounceableEntropy(store.pronounceableSyllables);
    }
    return scorePassword(last, bits);
    /* The whole store, because every setting feeds one branch or another and
       this hook subscribes to all of them anyway: `useCredentialGeneratorStore()`
       without a selector hands back a fresh state object on every change. */
  }, [store]);

  /* ── Render ─────────────────────────────────────────────────────────── */
  return (
    <div className="space-y-6">
      {/* ── Tab bar ──────────────────────────────────────────────────── */}
      <div className="flex border-b border-border overflow-x-auto">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = store.activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => store.setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 sm:px-5 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap shrink-0 ${
                isActive
                  ? 'border-primary text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon size={15} />
              {t(tab.labelKey)}
            </button>
          );
        })}
      </div>

      {/* ── Tab 1: Passwords ──────────────────────────────────────────── */}
      {store.activeTab === 'passwords' && (
        <div className="space-y-5">
          {/* Mode picker */}
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {PASSWORD_MODES.map((mode) => {
              const isActive = store.passwordMode === mode.id;
              return (
                <button
                  key={mode.id}
                  onClick={() => store.setPasswordMode(mode.id)}
                  className={`rounded-xl border p-3 text-left transition-all ${
                    isActive
                      ? 'border-primary bg-primary/5 ring-1 ring-primary/30'
                      : 'border-border bg-card hover:border-muted-foreground/30'
                  }`}
                >
                  <span className={`text-sm font-semibold ${isActive ? 'text-primary' : 'text-foreground'}`}>
                    {t(mode.labelKey)}
                  </span>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{t(mode.descKey)}</p>
                </button>
              );
            })}
          </div>

          {/* Active mode controls */}
          {store.passwordMode === 'random' && <RandomPasswordControls store={store} />}
          {store.passwordMode === 'passphrase' && <PassphraseControls store={store} />}
          {store.passwordMode === 'pronounceable' && <PronounceableControls store={store} />}
        </div>
      )}

      {/* ── Tab 2: PIN & Secrets ──────────────────────────────────────── */}
      {store.activeTab === 'pins-secrets' && (
        <div className="space-y-6">
          {/* Secrets section */}
          <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
            <h3 className="font-heading font-semibold text-foreground text-sm mb-3 flex items-center gap-2">
              <Hash size={14} />
              {t('credential.secrets')}
            </h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {SECRET_MODES.map((mode) => {
                const isActive = store.secretMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    onClick={() => store.setSecretMode(mode.id)}
                    className={`h-8 px-3 rounded-lg border text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'border-border text-muted-foreground hover:text-foreground bg-background'
                    }`}
                  >
                    {t(mode.labelKey)}
                  </button>
                );
              })}
            </div>
            {store.secretMode === 'pin' && (
            <div className="flex flex-wrap gap-3">
              <ControlGroup label={t('credential.length')}>
                <div className="flex gap-1">
                  {([4, 6, 8] as const).map((n) => (
                    <button
                      key={n}
                      onClick={() => store.setPinLength(n)}
                      className={`h-9 px-4 rounded-lg border text-sm font-medium transition-colors ${
                        store.pinLength === n
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'border-border text-muted-foreground hover:text-foreground bg-background'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </ControlGroup>
              <ControlGroup label={t('credential.options')}>
                <label className="flex items-center gap-2 h-9 px-3 rounded-lg border border-border bg-background cursor-pointer hover:bg-muted/30 transition-colors">
                  <input
                    type="checkbox"
                    checked={store.pinNoRepeat}
                    onChange={(e) => store.setPinNoRepeat(e.target.checked)}
                    className="rounded border-border accent-primary"
                  />
                  <span className="text-xs text-muted-foreground">{t('credential.noConsecutiveRepeats')}</span>
                </label>
              </ControlGroup>
            </div>
            )}
            {store.secretMode === 'hex' && (
              <ControlGroup label={t('credential.length')}>
                <input
                  type="number"
                  min={1}
                  max={1024}
                  value={store.hexLength}
                  onChange={(e) => store.setHexLength(Math.max(1, Math.min(1024, Number(e.target.value))))}
                  className="h-9 w-24 rounded-lg border border-border bg-background px-3 text-sm text-foreground"
                />
              </ControlGroup>
            )}
            {store.secretMode === 'base64' && (
              <ControlGroup label={t('credential.length')}>
                <input
                  type="number"
                  min={1}
                  max={1024}
                  value={store.base64Length}
                  onChange={(e) => store.setBase64Length(Math.max(1, Math.min(1024, Number(e.target.value))))}
                  className="h-9 w-24 rounded-lg border border-border bg-background px-3 text-sm text-foreground"
                />
              </ControlGroup>
            )}
            {store.secretMode === 'token' && (
              <div className="flex flex-wrap gap-3">
                <ControlGroup label={t('credential.length')}>
                  <input
                    type="number"
                    min={1}
                    max={1024}
                    value={store.tokenLength}
                    onChange={(e) => store.setTokenLength(Math.max(1, Math.min(1024, Number(e.target.value))))}
                    className="h-9 w-24 rounded-lg border border-border bg-background px-3 text-sm text-foreground"
                  />
                </ControlGroup>
                <ControlGroup label={t('credential.type')}>
                  <div className="flex gap-1">
                    {(['hex', 'base64', 'base64url'] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => store.setTokenType(type)}
                        className={`h-9 px-3 rounded-lg border text-xs font-medium transition-colors ${
                          store.tokenType === type
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'border-border text-muted-foreground hover:text-foreground bg-background'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </ControlGroup>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Tab 3: Dev Pairs ──────────────────────────────────────────── */}
      {store.activeTab === 'dev-pairs' && (
        <div className="space-y-5">
          <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
            <div className="flex flex-wrap gap-3">
              <ControlGroup label={t('credential.quantity')}>
                <select
                  value={store.pairQuantity}
                  onChange={(e) => store.setPairQuantity(Number(e.target.value))}
                  className="h-9 rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  {QUANTITY_OPTIONS.map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </ControlGroup>
              <ControlGroup label={t('credential.country')}>
                <select
                  value={store.pairCountry}
                  onChange={(e) => store.setPairCountry(e.target.value)}
                  className="h-9 rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  {SUPPORTED_COUNTRY_CODES.map((code) => (
                    <option key={code} value={code}>{code} — {COUNTRY_NAMES[code]}</option>
                  ))}
                </select>
              </ControlGroup>
            </div>
          </div>
        </div>
      )}

      {/* ── Tab 4: History ────────────────────────────────────────────── */}
      {store.activeTab === 'history' && <CredentialHistory />}

      {/* ── Presets ───────────────────────────────────────────────────── */}
      {store.activeTab !== 'history' && <PresetPanel />}

      {/* ── Generate button (not shown in History tab) ────────────────── */}
      {store.activeTab !== 'history' && (
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="h-11 px-6 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <RefreshCw size={16} className="animate-spin" />
            ) : (
              <Sparkles size={16} />
            )}
            {loading ? t('credential.generating') : t('credential.generate')}
          </button>

          {store.results.length > 0 && store.activeTab !== 'dev-pairs' && (
            <CredentialExportBar results={store.results} />
          )}
        </div>
      )}

      {/* ── Results ───────────────────────────────────────────────────── */}
      {store.results.length > 0 && store.activeTab !== 'history' && (
        <div className="space-y-3">
          {store.activeTab === 'dev-pairs' && (
            <CredentialExportBar results={store.results} />
          )}

          {/* What the generated value is actually worth. Shown for secrets
              too: a four-digit PIN is 13 bits and the page should say so. */}
          {(store.activeTab === 'passwords' || store.activeTab === 'pins-secrets') && (
            <StrengthMeter score={score} />
          )}

          {/* Result items */}
          <div className="divide-y divide-border rounded-xl border border-border bg-card">
            {store.results.map((result, i) => (
              <div
                key={`${result}-${i}`}
                className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors group"
              >
                <span className="text-xs text-muted-foreground w-6 shrink-0 tabular-nums">
                  #{i + 1}
                </span>
                <code className="text-sm text-foreground font-mono flex-1 min-w-0 break-all">
                  {result}
                </code>
                <button
                  onClick={() => copy(result, i)}
                  className="shrink-0 size-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  title={t('credential.copy')}
                >
                  {copiedIndex === i ? <Check size={14} className="text-primary" /> : <Copy size={14} />}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Generator functions (pure, no hooks) ─────────────────────────────── */

function generatePasswords(store: ReturnType<typeof useCredentialGeneratorStore.getState>): string[] {
  const results: string[] = [];

  for (let i = 0; i < BATCH_SIZE; i++) {
    switch (store.passwordMode) {
      case 'random': {
        results.push(generateRandomPassword({
          length: store.passwordLength,
          uppercase: store.passwordUppercase,
          lowercase: store.passwordLowercase,
          numbers: store.passwordNumbers,
          symbols: store.passwordSymbols,
          excludeChars: store.passwordExcludeChars || undefined,
          avoidAmbiguous: store.passwordAvoidAmbiguous || undefined,
        }));
        break;
      }
      case 'passphrase': {
        results.push(generatePassphrase({
          wordCount: store.passphraseWordCount,
          separator: store.passphraseSeparator,
          capitalize: store.passphraseCapitalize,
          includeNumber: store.passphraseIncludeNumber,
        }));
        break;
      }
      case 'pronounceable': {
        results.push(generatePronounceable({
          syllableCount: store.pronounceableSyllables,
          capitalize: true,
          includeNumber: true,
          includeSymbol: true,
        }));
        break;
      }
    }
  }

  return results;
}

/**
 * Entropy of the selected secret kind, in bits.
 *
 * Every figure here is the size of the space the generator draws from, not a
 * guess from the output string: a UUID v4 carries 122 random bits inside 128,
 * six of which are pinned by the version and variant fields, and a v7 carries
 * 62 — the other 62 are a timestamp and a counter, which an attacker who knows
 * roughly when the value was made does not have to guess. That distinction is
 * the reason a v7 is a fine database key and a poor session token.
 */
function secretEntropyBits(
  store: ReturnType<typeof useCredentialGeneratorStore.getState>,
): number {
  const { alnum, base64url, hex } = ALPHABET_SIZES;

  switch (store.secretMode) {
    case 'pin':
      return calculatePinEntropy(store.pinLength, store.pinNoRepeat);
    case 'uuid':
      return 122;
    case 'uuid-v7':
      return 62;
    case 'jwt':
      return 64 * 8;
    case 'session':
      return 32 * 8;
    case 'api-key':
      return calculateStringEntropy(24, alnum);
    case 'webhook':
    case 'oauth':
      return calculateStringEntropy(32, alnum);
    case 'token':
      return calculateStringEntropy(
        store.tokenLength,
        store.tokenType === 'hex' ? hex : base64url,
      );
    case 'hex':
      return calculateStringEntropy(store.hexLength, hex);
    case 'base64':
      return calculateStringEntropy(store.base64Length, base64url);
    default:
      return 0;
  }
}

/** One secret of the selected kind — the value and nothing else. */
function generateSecretValue(
  store: ReturnType<typeof useCredentialGeneratorStore.getState>,
): string {
  switch (store.secretMode) {
    case 'pin': return generatePin({ length: store.pinLength, noRepeat: store.pinNoRepeat });
    case 'uuid': return generateUUID();
    case 'uuid-v7': return generateUUIDv7();
    case 'jwt': return generateJWTSecret();
    case 'api-key': return generateApiKey('sk_test');
    case 'webhook': return generateWebhookSecret();
    case 'token': return generateRandomToken(store.tokenLength, store.tokenType);
    case 'session': return generateSessionSecret();
    case 'oauth': return generateOAuthSecret();
    case 'hex': return generateHex(store.hexLength);
    case 'base64': return generateBase64(store.base64Length);
    default: return generateUUID();
  }
}

function generatePinsSecrets(
  store: ReturnType<typeof useCredentialGeneratorStore.getState>,
): string[] {
  /* A batch, like the passwords tab — the values are what a fixture file or a
     .env wants, and one at a time made this tab the slow way to fill either. */
  return Array.from({ length: BATCH_SIZE }, () => generateSecretValue(store));
}

function generateDevPairs(store: ReturnType<typeof useCredentialGeneratorStore.getState>): string[] {
  const pairs = generateCredentialPairs({
    quantity: store.pairQuantity,
    country: store.pairCountry,
  });

  return pairs.map((p) => `Username: ${p.username}\nPassword: ${p.password}`);
}

/* ── Sub-controls for each password mode ──────────────────────────────── */

function ControlGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function Toggle({ value, onChange, label }: { value: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center gap-2 h-9 px-3 rounded-lg border border-border bg-background cursor-pointer hover:bg-muted/30 transition-colors">
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
        className="rounded border-border accent-primary"
      />
      <span className="text-xs text-muted-foreground whitespace-nowrap">{label}</span>
    </label>
  );
}

function RandomPasswordControls({ store }: { store: CredentialGeneratorStore }) {
  const { t } = useTranslations();

  return (
    <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
      <div className="flex flex-wrap gap-3">
        <ControlGroup label={t('credential.length')}>
          <input
            type="number"
            min={4}
            max={128}
            value={store.passwordLength}
            onChange={(e) => store.setPasswordLength(Math.max(4, Math.min(128, Number(e.target.value))))}
            className="h-9 w-20 rounded-lg border border-border bg-background px-3 text-sm text-foreground"
          />
        </ControlGroup>
        <ControlGroup label={t('credential.characterTypes')}>
          <div className="flex flex-wrap gap-1.5">
            <Toggle value={store.passwordUppercase} onChange={store.setPasswordUppercase} label="A-Z" />
            <Toggle value={store.passwordLowercase} onChange={store.setPasswordLowercase} label="a-z" />
            <Toggle value={store.passwordNumbers} onChange={store.setPasswordNumbers} label="0-9" />
            <Toggle value={store.passwordSymbols} onChange={store.setPasswordSymbols} label="!@#$" />
          </div>
        </ControlGroup>
        <ControlGroup label={t('credential.excludeChars')}>
          <input
            type="text"
            value={store.passwordExcludeChars}
            onChange={(e) => store.setPasswordExcludeChars(e.target.value)}
            placeholder="e.g. @#$%"
            className="h-9 w-32 rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground/60 font-mono"
          />
        </ControlGroup>
        <ControlGroup label={t('credential.options')}>
          <Toggle value={store.passwordAvoidAmbiguous} onChange={store.setPasswordAvoidAmbiguous} label={t('credential.avoidAmbiguous')} />
        </ControlGroup>
      </div>
    </div>
  );
}

function PassphraseControls({ store }: { store: CredentialGeneratorStore }) {
  const { t } = useTranslations();

  return (
    <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
      <div className="flex flex-wrap gap-3">
        <ControlGroup label={t('credential.wordCount')}>
          <div className="flex gap-1">
            {([3, 4, 5, 6, 7, 8] as const).map((n) => (
              <button
                key={n}
                onClick={() => store.setPassphraseWordCount(n)}
                className={`size-9 rounded-lg border text-sm font-medium transition-colors ${
                  store.passphraseWordCount === n
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-border text-muted-foreground hover:text-foreground bg-background'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </ControlGroup>
        <ControlGroup label={t('credential.separator')}>
          <div className="flex gap-1">
            {(['-', '_', '.', ' '] as const).map((sep) => (
              <button
                key={sep}
                onClick={() => store.setPassphraseSeparator(sep)}
                className={`h-9 w-9 rounded-lg border text-sm font-medium transition-colors ${
                  store.passphraseSeparator === sep
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-border text-muted-foreground hover:text-foreground bg-background'
                }`}
              >
                {sep === ' ' ? '␣' : sep}
              </button>
            ))}
          </div>
        </ControlGroup>
        <Toggle value={store.passphraseCapitalize} onChange={store.setPassphraseCapitalize} label={t('credential.capitalizeWords')} />
        <Toggle value={store.passphraseIncludeNumber} onChange={store.setPassphraseIncludeNumber} label={t('credential.includeNumber')} />
      </div>
    </div>
  );
}

function PronounceableControls({ store }: { store: CredentialGeneratorStore }) {
  const { t } = useTranslations();

  return (
    <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
      <ControlGroup label={t('credential.syllables')}>
        <div className="flex gap-1">
          {([2, 3, 4, 5] as const).map((n) => (
            <button
              key={n}
              onClick={() => store.setPronounceableSyllables(n)}
              className={`h-9 px-4 rounded-lg border text-sm font-medium transition-colors ${
                store.pronounceableSyllables === n
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border text-muted-foreground hover:text-foreground bg-background'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </ControlGroup>
    </div>
  );
}
