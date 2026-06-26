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
import {
  generateRandomPassword,
  generateHumanPassword,
  generatePassphrase,
  generatePronounceable,
  generatePin,
  generateUUID,
  generateJWTSecret,
  generateApiKey,
  generateWebhookSecret,
  generateHex,
  generateBase64,
  generateDatabasePassword,
  generateCredentialPairs,
  getCharsetSize,
  calculateRandomPasswordEntropy,
  calculatePassphraseEntropy,
  calculateHumanPasswordEntropy,
  calculatePronounceableEntropy,
  scorePassword,
  isCommonPassword,
} from '@/lib/credentialGenerator';
import { SUPPORTED_COUNTRY_CODES, COUNTRY_NAMES } from '@/lib/userGenerator/countryLocaleMap';
import type { PasswordMode, SecretMode } from '@/lib/credentialGenerator/types';
import StrengthMeter from './StrengthMeter';
import CredentialHistory from './CredentialHistory';
import CredentialExportBar from './CredentialExportBar';

/* ── Constants ────────────────────────────────────────────────────────── */

const TABS = [
  { id: 'passwords' as const, label: 'Passwords', icon: Key },
  { id: 'pins-secrets' as const, label: 'PIN & Secrets', icon: Lock },
  { id: 'dev-pairs' as const, label: 'Dev Pairs', icon: Users },
  { id: 'history' as const, label: 'History', icon: Hash },
];

const PASSWORD_MODES: { id: PasswordMode; label: string; desc: string }[] = [
  { id: 'random', label: 'Random', desc: 'Full control' },
  { id: 'human', label: 'Human Password', desc: 'Memorable phrases' },
  { id: 'passphrase', label: 'Passphrase', desc: 'XKCD-style' },
  { id: 'pronounceable', label: 'Pronounceable', desc: 'CVC-based' },
];

const SECRET_MODES: { id: SecretMode; label: string }[] = [
  { id: 'uuid', label: 'UUID v4' },
  { id: 'jwt', label: 'JWT Secret' },
  { id: 'api-key', label: 'API Key' },
  { id: 'webhook', label: 'Webhook Secret' },
  { id: 'hex', label: 'Hex' },
  { id: 'base64', label: 'Base64' },
];

const QUANTITY_OPTIONS = [1, 5, 10, 25, 50, 100] as const;

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
    if (store.activeTab !== 'passwords' || store.results.length === 0) return null;
    const last = store.results[0];
    let bits = 0;
    // Rough entropy for display
    if (store.passwordMode === 'random') {
      const cs = getCharsetSize({
        uppercase: store.passwordUppercase,
        lowercase: store.passwordLowercase,
        numbers: store.passwordNumbers,
        symbols: store.passwordSymbols,
        avoidAmbiguous: store.passwordAvoidAmbiguous,
      });
      bits = calculateRandomPasswordEntropy(last.length, cs);
    } else if (store.passwordMode === 'human') {
      bits = calculateHumanPasswordEntropy({
        includeNumber: store.humanIncludeNumber,
        includeSymbol: store.humanIncludeSymbol,
      });
    } else if (store.passwordMode === 'passphrase') {
      bits = calculatePassphraseEntropy(store.passphraseWordCount);
    } else if (store.passwordMode === 'pronounceable') {
      bits = calculatePronounceableEntropy(store.pronounceableSyllables);
    }
    return scorePassword(last, bits, store.passwordMode);
  }, [store.results, store.activeTab, store.passwordMode,
      store.passwordUppercase, store.passwordLowercase,
      store.passwordNumbers, store.passwordSymbols,
      store.passwordAvoidAmbiguous, store.humanIncludeNumber,
      store.humanIncludeSymbol, store.passphraseWordCount,
      store.pronounceableSyllables]);

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
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── Tab 1: Passwords ──────────────────────────────────────────── */}
      {store.activeTab === 'passwords' && (
        <div className="space-y-5">
          {/* Mode picker */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
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
                    {mode.label}
                  </span>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{mode.desc}</p>
                </button>
              );
            })}
          </div>

          {/* Active mode controls */}
          {store.passwordMode === 'random' && <RandomPasswordControls store={store} />}
          {store.passwordMode === 'human' && <HumanPasswordControls store={store} />}
          {store.passwordMode === 'passphrase' && <PassphraseControls store={store} />}
          {store.passwordMode === 'pronounceable' && <PronounceableControls store={store} />}
        </div>
      )}

      {/* ── Tab 2: PIN & Secrets ──────────────────────────────────────── */}
      {store.activeTab === 'pins-secrets' && (
        <div className="space-y-6">
          {/* PIN section */}
          <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
            <h3 className="font-heading font-semibold text-foreground text-sm mb-3 flex items-center gap-2">
              <Lock size={14} />
              PIN
            </h3>
            <div className="flex flex-wrap gap-3">
              <ControlGroup label="Length">
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
              <ControlGroup label="Options">
                <label className="flex items-center gap-2 h-9 px-3 rounded-lg border border-border bg-background cursor-pointer hover:bg-muted/30 transition-colors">
                  <input
                    type="checkbox"
                    checked={store.pinNoRepeat}
                    onChange={(e) => store.setPinNoRepeat(e.target.checked)}
                    className="rounded border-border accent-primary"
                  />
                  <span className="text-xs text-muted-foreground">No consecutive repeats</span>
                </label>
              </ControlGroup>
            </div>
          </div>

          {/* Secrets section */}
          <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
            <h3 className="font-heading font-semibold text-foreground text-sm mb-3 flex items-center gap-2">
              <Hash size={14} />
              Secrets
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
                    {mode.label}
                  </button>
                );
              })}
            </div>
            {store.secretMode === 'hex' && (
              <ControlGroup label="Length">
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
              <ControlGroup label="Length">
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
          </div>
        </div>
      )}

      {/* ── Tab 3: Dev Pairs ──────────────────────────────────────────── */}
      {store.activeTab === 'dev-pairs' && (
        <div className="space-y-5">
          <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
            <div className="flex flex-wrap gap-3">
              <ControlGroup label="Quantity">
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
              <ControlGroup label="Country">
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
            {loading ? 'Generating…' : 'Generate'}
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

          {/* Score for passwords */}
          {store.activeTab === 'passwords' && <StrengthMeter score={score} />}

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
                  title="Copy"
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
  const count = 5; // default batch for passwords
  const results: string[] = [];

  for (let i = 0; i < count; i++) {
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
      case 'human': {
        results.push(generateHumanPassword({
          capitalize: store.humanCapitalize,
          includeNumber: store.humanIncludeNumber,
          includeSymbol: store.humanIncludeSymbol,
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

function generatePinsSecrets(store: ReturnType<typeof useCredentialGeneratorStore.getState>): string[] {
  // Always generate one PIN + one Secret
  const pin = generatePin({ length: store.pinLength, noRepeat: store.pinNoRepeat });

  let secret: string;
  switch (store.secretMode) {
    case 'uuid': secret = generateUUID(); break;
    case 'jwt': secret = generateJWTSecret(); break;
    case 'api-key': secret = generateApiKey('sk_test'); break;
    case 'webhook': secret = generateWebhookSecret(); break;
    case 'hex': secret = generateHex(store.hexLength); break;
    case 'base64': secret = generateBase64(store.base64Length); break;
    default: secret = generateUUID();
  }

  return [
    `PIN (${store.pinLength}-digit): ${pin}`,
    `${store.secretMode.toUpperCase()}: ${secret}`,
  ];
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
  return (
    <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
      <div className="flex flex-wrap gap-3">
        <ControlGroup label="Length">
          <input
            type="number"
            min={4}
            max={128}
            value={store.passwordLength}
            onChange={(e) => store.setPasswordLength(Math.max(4, Math.min(128, Number(e.target.value))))}
            className="h-9 w-20 rounded-lg border border-border bg-background px-3 text-sm text-foreground"
          />
        </ControlGroup>
        <ControlGroup label="Character types">
          <div className="flex flex-wrap gap-1.5">
            <Toggle value={store.passwordUppercase} onChange={store.setPasswordUppercase} label="A-Z" />
            <Toggle value={store.passwordLowercase} onChange={store.setPasswordLowercase} label="a-z" />
            <Toggle value={store.passwordNumbers} onChange={store.setPasswordNumbers} label="0-9" />
            <Toggle value={store.passwordSymbols} onChange={store.setPasswordSymbols} label="!@#$" />
          </div>
        </ControlGroup>
        <ControlGroup label="Exclude characters">
          <input
            type="text"
            value={store.passwordExcludeChars}
            onChange={(e) => store.setPasswordExcludeChars(e.target.value)}
            placeholder="e.g. @#$%"
            className="h-9 w-32 rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground/60 font-mono"
          />
        </ControlGroup>
        <ControlGroup label="Options">
          <Toggle value={store.passwordAvoidAmbiguous} onChange={store.setPasswordAvoidAmbiguous} label="Avoid ambiguous" />
        </ControlGroup>
      </div>
    </div>
  );
}

function HumanPasswordControls({ store }: { store: CredentialGeneratorStore }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
      <div className="flex flex-wrap gap-3">
        <Toggle value={store.humanCapitalize} onChange={store.setHumanCapitalize} label="Capitalize first letter" />
        <Toggle value={store.humanIncludeNumber} onChange={store.setHumanIncludeNumber} label="Include number" />
        <Toggle value={store.humanIncludeSymbol} onChange={store.setHumanIncludeSymbol} label="Include symbol" />
      </div>
    </div>
  );
}

function PassphraseControls({ store }: { store: CredentialGeneratorStore }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
      <div className="flex flex-wrap gap-3">
        <ControlGroup label="Word count">
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
        <ControlGroup label="Separator">
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
        <Toggle value={store.passphraseCapitalize} onChange={store.setPassphraseCapitalize} label="Capitalize words" />
        <Toggle value={store.passphraseIncludeNumber} onChange={store.setPassphraseIncludeNumber} label="Include number" />
      </div>
    </div>
  );
}

function PronounceableControls({ store }: { store: CredentialGeneratorStore }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
      <ControlGroup label="Syllables">
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
