'use client';

import { useCallback } from 'react';
import { Wifi, Code, Database, Container, Lock, Key, ShieldCheck, Sparkles, type LucideIcon } from 'lucide-react';
import { useCredentialGeneratorStore, type CredentialGeneratorStore } from '@/lib/store';
import { ALL_PRESETS, type Preset } from '@/lib/config/credentialPresets';

interface PresetPanelProps {
  onClose?: () => void;
}

const ICON_MAP: Record<string, LucideIcon> = {
  Wifi, Code, Database, Container, Lock, Key, ShieldCheck,
};

/**
 * Applies a preset's configuration to the store.
 */
function applyPreset(preset: Preset, store: CredentialGeneratorStore): void {
  const cfg = preset.config;

  // Set active tab
  if (cfg.activeTab) store.setActiveTab(cfg.activeTab);

  // Password mode
  if (cfg.passwordMode) {
    store.setPasswordMode(cfg.passwordMode);
  }

  // Secret mode
  if (cfg.secretMode) {
    store.setSecretMode(cfg.secretMode);
  }

  // Length
  if (cfg.length) {
    store.setPasswordLength(cfg.length);
    if (cfg.secretMode === 'hex') store.setHexLength(cfg.length);
    if (cfg.secretMode === 'base64') store.setBase64Length(cfg.length);
  }

  // Word count / separator
  if (cfg.wordCount) store.setPassphraseWordCount(cfg.wordCount);
  if (cfg.separator) store.setPassphraseSeparator(cfg.separator);

  // Character type toggles
  if (cfg.uppercase !== undefined) store.setPasswordUppercase(cfg.uppercase);
  if (cfg.lowercase !== undefined) store.setPasswordLowercase(cfg.lowercase);
  if (cfg.numbers !== undefined) store.setPasswordNumbers(cfg.numbers);
  if (cfg.symbols !== undefined) store.setPasswordSymbols(cfg.symbols);
  if (cfg.avoidAmbiguous !== undefined) store.setPasswordAvoidAmbiguous(cfg.avoidAmbiguous);
}

export default function PresetPanel({ onClose }: PresetPanelProps) {
  const store = useCredentialGeneratorStore();

  const handlePreset = useCallback((preset: Preset) => {
    applyPreset(preset, store);
    // Auto-generate after preset is applied
    store.setResults([]);
    onClose?.();
  }, [store, onClose]);

  return (
    <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles size={14} className="text-primary" />
        <h3 className="font-heading font-semibold text-foreground text-sm">Quick Presets</h3>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {ALL_PRESETS.map((preset) => {
          const Icon = ICON_MAP[preset.icon] || Lock;
          return (
            <button
              key={preset.id}
              onClick={() => handlePreset(preset)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-background hover:border-primary/30 hover:bg-primary/[0.02] transition-colors whitespace-nowrap shrink-0"
              title={preset.service}
            >
              <Icon size={14} className="text-primary shrink-0" />
              <span className="text-xs font-medium text-foreground">{preset.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
