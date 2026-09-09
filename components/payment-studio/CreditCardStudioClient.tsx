'use client';

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import {
  Zap, SlidersHorizontal, Search, LayoutList, Code, Bug,
  Copy, Check, Download, RefreshCw, Loader2, Eye, EyeOff,
  type LucideIcon,
} from 'lucide-react';
import { generateCard, generateNegativeCard, generateBulkCards, generateCardFromBIN, generateFullProfile } from '@/lib/payment/generators';
import { CARD_NETWORKS, NETWORK_MAP, detectNetwork } from '@/lib/payment/cardNetworks';
import { exportCards, exportProfile as exportProfileToStr, getExportMimeType, getExportExtension } from '@/lib/payment/exporters';
import { validateCard, isExpired, validateCVV } from '@/lib/payment/validators';
import { formatDeveloper } from '@/lib/payment/formatters';
import { getGatewayCards, getGateways, GATEWAY_NAMES } from '@/lib/payment/gatewayCards';
import { getProfileIds, getProfile } from '@/lib/payment/profiles';
import type {
  CardData, CardMode, PaymentExportFormat, CardTheme,
  NegativeTestType, BulkProgress, PaymentProfile, GatewayCard,
} from '@/lib/payment/types';

/* ── Constants ────────────────────────────────────────────────────────────────── */

const MODES: { id: CardMode; label: string; icon: LucideIcon }[] = [
  { id: 'quick', label: 'Quick', icon: Zap },
  { id: 'advanced', label: 'Advanced', icon: SlidersHorizontal },
  { id: 'bin', label: 'BIN Lookup', icon: Search },
  { id: 'bulk', label: 'Bulk', icon: LayoutList },
  { id: 'developer', label: 'Developer', icon: Code },
  { id: 'negative-testing', label: 'Negative', icon: Bug },
];

const THEMES: { id: CardTheme; label: string }[] = [
  { id: 'light', label: 'Light' },
  { id: 'dark', label: 'Dark' },
  { id: 'glass', label: 'Glass' },
  { id: 'corporate', label: 'Corporate' },
  { id: 'minimal', label: 'Minimal' },
  { id: 'cyber', label: 'Cyber' },
];

const EXPORT_FORMATS: { id: PaymentExportFormat; label: string }[] = [
  { id: 'txt', label: 'TXT' },
  { id: 'csv', label: 'CSV' },
  { id: 'json', label: 'JSON' },
  { id: 'sql', label: 'SQL' },
  { id: 'xml', label: 'XML' },
  { id: 'yml', label: 'YAML' },
];

const NEGATIVE_TYPES: { id: NegativeTestType; label: string; desc: string }[] = [
  { id: 'invalid-luhn', label: 'Invalid Luhn', desc: 'Check digit fails Luhn validation' },
  { id: 'wrong-length', label: 'Wrong Length', desc: 'Card number has incorrect digit length' },
  { id: 'expired-card', label: 'Expired Card', desc: 'Card has past expiry date' },
  { id: 'invalid-expiry', label: 'Invalid Expiry', desc: 'Month > 12 or malformed date' },
  { id: 'invalid-cvv', label: 'Invalid CVV', desc: 'CVV is too short or missing' },
  { id: 'invalid-bank-code', label: 'Invalid BIN', desc: 'Unknown / unassigned BIN prefix' },
  { id: 'special-chars-pan', label: 'Special Chars', desc: 'PAN contains non-digit characters' },
  { id: 'blank-fields', label: 'Blank Fields', desc: 'Missing holder, CVV, or expiry' },
];

const CARD_NETWORK_OPTIONS = [
  { id: '', label: 'Random (any network)' },
  ...CARD_NETWORKS.map((n) => ({ id: n.id, label: n.name })),
];

const QUANTITY_OPTIONS = [1, 5, 10, 25, 50, 100, 250, 500, 1000];

const GATEWAY_OPTIONS = getGateways();
const PROFILE_OPTIONS = getProfileIds();

/* ── Theme color maps ─────────────────────────────────────────────────────────── */

const THEME_STYLES: Record<CardTheme, { bg: string; text: string; chip: string; accent: string; gradient: string; border: string; label: string }> = {
  light: {
    bg: 'bg-white',
    text: 'text-gray-900',
    chip: 'bg-gray-100 text-gray-700',
    accent: 'text-gray-500',
    gradient: 'bg-gradient-to-r from-gray-50 to-white',
    border: 'border-gray-200',
    label: 'text-gray-400',
  },
  dark: {
    bg: 'bg-gray-900',
    text: 'text-white',
    chip: 'bg-gray-800 text-gray-300',
    accent: 'text-gray-400',
    gradient: 'bg-gradient-to-r from-gray-800 to-gray-900',
    border: 'border-gray-700',
    label: 'text-gray-500',
  },
  glass: {
    bg: 'bg-white/20 backdrop-blur-md',
    text: 'text-white',
    chip: 'bg-white/30 text-white',
    accent: 'text-white/70',
    gradient: 'bg-gradient-to-r from-purple-500/30 to-emerald-500/30',
    border: 'border-white/30',
    label: 'text-white/60',
  },
  corporate: {
    bg: 'bg-blue-50',
    text: 'text-blue-900',
    chip: 'bg-blue-100 text-blue-700',
    accent: 'text-blue-500',
    gradient: 'bg-gradient-to-r from-blue-50 to-indigo-50',
    border: 'border-blue-200',
    label: 'text-blue-400',
  },
  minimal: {
    bg: 'bg-zinc-50',
    text: 'text-zinc-800',
    chip: 'bg-zinc-200 text-zinc-600',
    accent: 'text-zinc-400',
    gradient: 'bg-gradient-to-r from-zinc-50 to-stone-50',
    border: 'border-zinc-200',
    label: 'text-zinc-400',
  },
  cyber: {
    bg: 'bg-black',
    text: 'text-cyan-300',
    chip: 'bg-cyan-900/50 text-cyan-300',
    accent: 'text-cyan-400',
    gradient: 'bg-gradient-to-r from-cyan-900/30 to-purple-900/30',
    border: 'border-cyan-500/30',
    label: 'text-cyan-700',
  },
};

/* ── Helpers ──────────────────────────────────────────────────────────────────── */

function downloadFile(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function formatNetworkName(id: string): string {
  return NETWORK_MAP[id]?.name ?? id.charAt(0).toUpperCase() + id.slice(1);
}

function getDefaultExpiry(): { month: string; year: string } {
  const now = new Date();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const y = String(now.getFullYear() + 3);
  return { month: m, year: y };
}

/* ── Card Preview Component ───────────────────────────────────────────────────── */

function CardPreview({ card, theme, networkColor }: { card: CardData; theme: CardTheme; networkColor: string }) {
  const style = THEME_STYLES[theme];
  const isAmex = card.network === 'amex';
  const gradientBg = networkColor
    ? { background: `linear-gradient(135deg, ${networkColor}22, ${networkColor}44)` }
    : {};

  return (
    <div
      className={`relative w-full max-w-sm mx-auto rounded-2xl border ${style.border} ${style.bg} ${style.gradient} shadow-lg overflow-hidden`}
      style={gradientBg}
    >
      {/* Network logo area */}
      <div className="flex items-center justify-between px-5 pt-5 pb-2">
        <div className={`text-[10px] font-semibold uppercase tracking-widest ${style.label}`}>
          {formatNetworkName(card.network)}
        </div>
        <div className="flex items-center gap-1">
          <span className={`inline-block size-5 rounded ${style.chip}`} />
          <span className={`inline-block size-5 rounded-full ${style.chip}`} />
        </div>
      </div>

      {/* Chip */}
      <div className="px-5 mb-3">
        <div className={`w-10 h-7 rounded-md ${style.chip} flex items-center justify-center text-[8px]`}>
          {theme === 'cyber' ? '///' : '◈'}
        </div>
      </div>

      {/* Card number */}
      <div className="px-5 mb-3">
        <p className={`font-mono text-lg sm:text-xl tracking-[3px] ${style.text}`}>
          {card.formattedPan}
        </p>
      </div>

      {/* Expiry + Holder */}
      <div className="flex items-start gap-6 px-5 pb-5">
        <div>
          <p className={`text-[9px] uppercase tracking-wider ${style.label}`}>
            {isAmex ? 'Good Thru' : 'Expires'}
          </p>
          <p className={`font-mono text-sm ${style.text}`}>{card.expiryShort}</p>
        </div>
        <div className="min-w-0 flex-1">
          <p className={`text-[9px] uppercase tracking-wider ${style.label}`}>Holder</p>
          <p className={`font-mono text-sm truncate ${style.text}`}>
            {card.holder || '—'}
          </p>
        </div>
        <div className="text-right">
          <p className={`text-[9px] uppercase tracking-wider ${style.label}`}>
            {isAmex ? 'CID' : 'CVV'}
          </p>
          <p className={`font-mono text-sm ${style.text}`}>{card.cvv || '—'}</p>
        </div>
      </div>

      {/* Luhn badge */}
      <div className={`px-5 py-2 border-t ${style.border} flex items-center justify-between`}>
        <span className={`text-[10px] ${style.label}`}>
          BIN {card.bin} · Last4 {card.last4}
        </span>
        <span className={`text-[10px] font-semibold ${card.luhnValid ? 'text-green-500' : 'text-red-500'}`}>
          {card.luhnValid ? 'Luhn ✓' : 'Luhn ✗'}
        </span>
      </div>
    </div>
  );
}

/* ── Main Component ───────────────────────────────────────────────────────────── */

interface CreditCardStudioClientProps {
  standalone?: boolean;
  initialMode?: CardMode;
}

export default function CreditCardStudioClient({
  standalone = true,
  initialMode,
}: CreditCardStudioClientProps) {
  const [mode, setMode] = useState<CardMode>(initialMode ?? 'quick');
  const [card, setCard] = useState<CardData | null>(null);
  const [cards, setCards] = useState<CardData[]>([]);
  const [profile, setProfile] = useState<PaymentProfile | null>(null);
  const [theme, setTheme] = useState<CardTheme>('light');
  const [networkId, setNetworkId] = useState('');
  const [bulkProgress, setBulkProgress] = useState<BulkProgress | null>(null);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showAllExport, setShowAllExport] = useState(false);

  // Advanced mode
  const [selectedProfile, setSelectedProfile] = useState('us-personal');

  // BIN mode
  const [binInput, setBinInput] = useState('');

  // Negative test mode
  const [negativeType, setNegativeType] = useState<NegativeTestType>('invalid-luhn');

  // Bulk mode
  const [bulkQuantity, setBulkQuantity] = useState(10);

  // Gateway cards
  const [selectedGateway, setSelectedGateway] = useState('stripe');
  const [showGateway, setShowGateway] = useState(false);

  // Live validation
  const [validateInput, setValidateInput] = useState('');
  const [validationResult, setValidationResult] = useState<ReturnType<typeof validateCard> | null>(null);

  const previewRef = useRef<HTMLDivElement>(null);
  const bulkAbortRef = useRef(false);

  // Quick generate
  const handleQuickGenerate = useCallback(() => {
    const newCard = generateCard(networkId || undefined);
    setCard(newCard);
    setProfile(null);
    setCards([]);
  }, [networkId]);

  // Generate on mount
  useEffect(() => {
    if (!card) {
      handleQuickGenerate();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Advanced generate
  const handleAdvancedGenerate = useCallback(() => {
    const full = generateFullProfile(selectedProfile, networkId || undefined);
    if (full) {
      setProfile(full);
      setCard(full.card);
      setCards([]);
    } else {
      const newCard = generateCard(networkId || undefined);
      setCard(newCard);
      setProfile(null);
      setCards([]);
    }
  }, [selectedProfile, networkId]);

  // BIN generate
  const handleBINGenerate = useCallback(() => {
    if (!binInput.trim()) return;
    const newCard = generateCardFromBIN(binInput.trim());
    setCard(newCard);
    setProfile(null);
    setCards([]);
  }, [binInput]);

  // Bulk generate
  const handleBulkGenerate = useCallback(async () => {
    setGenerating(true);
    setBulkProgress({ total: bulkQuantity, completed: 0, failed: 0, status: 'Starting...' });
    bulkAbortRef.current = false;

    try {
      const result = await generateBulkCards(
        bulkQuantity,
        networkId || undefined,
        (progress) => {
          if (!bulkAbortRef.current) {
            setBulkProgress(progress);
          }
        },
      );
      if (!bulkAbortRef.current) {
        setCards(result);
        setCard(null);
        setProfile(null);
        setBulkProgress({ total: bulkQuantity, completed: result.length, failed: 0, status: 'Complete' });
      }
    } catch {
      setBulkProgress((p) => p ? { ...p, status: 'Error' } : null);
    } finally {
      setGenerating(false);
    }
  }, [bulkQuantity, networkId]);

  // Developer generate
  const handleDevGenerate = useCallback(() => {
    const newCard = generateCard(networkId || undefined);
    setCard(newCard);
    setProfile(null);
    setCards([]);
  }, [networkId]);

  // Negative test generate
  const handleNegativeGenerate = useCallback(() => {
    const newCard = generateNegativeCard(negativeType, networkId || undefined);
    setCard(newCard);
    setProfile(null);
    setCards([]);
  }, [negativeType, networkId]);

  // Validate
  const handleValidate = useCallback(() => {
    if (!validateInput.trim()) return;
    const result = validateCard(validateInput.trim());
    setValidationResult(result);
  }, [validateInput]);

  // Export
  const handleExport = useCallback((format: PaymentExportFormat) => {
    let content: string;
    let filename: string;

    if (profile && (format === 'json' || format === 'txt')) {
      // For profile, export full profile JSON
      content = exportProfileToStr(profile);
      filename = `payment-profile.${getExportExtension(format)}`;
    } else if (cards.length > 0) {
      content = exportCards(cards, format);
      filename = `test-cards.${getExportExtension(format)}`;
    } else if (card) {
      content = exportCards([card], format);
      filename = `test-card-${card.last4}.${getExportExtension(format)}`;
    } else return;

    if (format === 'clipboard') {
      navigator.clipboard.writeText(content).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      });
      return;
    }

    downloadFile(content, filename, getExportMimeType(format));
  }, [card, cards, profile]);

  // Copy
  const handleCopy = useCallback(async () => {
    if (!card) return;
    const content = exportCards([card], 'clipboard');
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* noop */ }
  }, [card]);

  // Get network display color
  const networkColor = useMemo(() => {
    if (!card) return '#6b7280';
    return NETWORK_MAP[card.network]?.color ?? '#6b7280';
  }, [card]);

  // Developer info
  const devInfo = useMemo(() => {
    if (!card) return null;
    return formatDeveloper(card);
  }, [card]);

  // Gateway cards for selected gateway
  const gatewayCards = useMemo(() => {
    return getGatewayCards(selectedGateway);
  }, [selectedGateway]);

  // Active card for display
  const displayCard = card;

  return (
    <div className={standalone ? 'mx-auto max-w-5xl px-4 sm:px-6 py-8' : ''}>
      {/* ── Mode Tabs ──────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-1 mb-6 border-b border-border pb-2">
        {MODES.map((m) => {
          const Icon = m.icon;
          return (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors ${
                mode === m.id
                  ? 'text-emerald-500 border-b-2 border-emerald-500 bg-emerald-500/5'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
              }`}
            >
              <Icon size={16} />
              {m.label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── Left: Card Preview ─────────────────────────────────────────── */}
        <div className="space-y-6">
          <div ref={previewRef} className="min-h-55">
            {displayCard ? (
              <CardPreview card={displayCard} theme={theme} networkColor={networkColor} />
            ) : cards.length > 0 ? (
              <div className="flex flex-col items-center justify-center p-8 rounded-xl border border-border bg-card min-h-55">
                <p className="text-sm text-muted-foreground">
                  {cards.length} cards generated. Select an export format below.
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 rounded-xl border border-border bg-card min-h-55">
                <p className="text-sm text-muted-foreground">Generate a card to see the preview</p>
              </div>
            )}
          </div>

          {/* Theme selector */}
          {displayCard && (
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block ml-1">
                Card Theme
              </label>
              <div className="flex flex-wrap gap-1.5">
                {THEMES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      theme === t.id
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500'
                        : 'border-border bg-card text-muted-foreground hover:border-muted-foreground/30'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Exports */}
          {displayCard && (
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block ml-1">
                Export
              </label>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-card text-xs font-medium text-foreground hover:bg-muted/50 transition-colors"
                >
                  {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                {EXPORT_FORMATS.slice(0, showAllExport ? EXPORT_FORMATS.length : 3).map((fmt) => (
                  <button
                    key={fmt.id}
                    onClick={() => handleExport(fmt.id)}
                    className="px-3 py-2 rounded-lg border border-border bg-card text-xs font-medium text-foreground hover:bg-muted/50 transition-colors"
                  >
                    {fmt.label}
                  </button>
                ))}
                <button
                  onClick={() => setShowAllExport((v) => !v)}
                  className="px-3 py-2 rounded-lg border border-border bg-card text-xs font-medium text-muted-foreground hover:bg-muted/50 transition-colors"
                >
                  {showAllExport ? 'Less' : 'More'}
                </button>
              </div>
            </div>
          )}

          {/* Bulk exports */}
          {cards.length > 0 && (
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block ml-1">
                Export All ({cards.length} cards)
              </label>
              <div className="flex flex-wrap gap-1.5">
                {EXPORT_FORMATS.map((fmt) => (
                  <button
                    key={fmt.id}
                    onClick={() => handleExport(fmt.id)}
                    className="px-3 py-2 rounded-lg border border-border bg-card text-xs font-medium text-foreground hover:bg-muted/50 transition-colors"
                  >
                    {fmt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Card details panel */}
          {displayCard && (
            <div className="p-4 rounded-xl border border-border bg-card">
              <h3 className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wider">
                Card Details
              </h3>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <dt className="text-muted-foreground">Network</dt>
                <dd className="font-medium">{formatNetworkName(displayCard.network)}</dd>
                <dt className="text-muted-foreground">Holder</dt>
                <dd className="font-mono text-xs">{displayCard.holder || '—'}</dd>
                <dt className="text-muted-foreground">Expiry</dt>
                <dd className="font-mono">{displayCard.expiryFull}</dd>
                <dt className="text-muted-foreground">CVV</dt>
                <dd className="font-mono">{displayCard.cvv || '—'}</dd>
                <dt className="text-muted-foreground">BIN</dt>
                <dd className="font-mono">{displayCard.bin}</dd>
                <dt className="text-muted-foreground">Last 4</dt>
                <dd className="font-mono">{displayCard.last4}</dd>
                <dt className="text-muted-foreground">Luhn</dt>
                <dd className={`font-mono ${displayCard.luhnValid ? 'text-green-600' : 'text-red-600'}`}>
                  {displayCard.luhnValid ? 'Valid ✓' : 'Invalid ✗'}
                </dd>
              </dl>
            </div>
          )}

          {/* Developer panel */}
          {displayCard && mode === 'developer' && devInfo && (
            <div className="p-4 rounded-xl border border-border bg-card">
              <h3 className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wider">
                Developer Format
              </h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-[11px] text-muted-foreground mb-1">Raw PAN</dt>
                  <dd className="font-mono text-xs bg-muted/30 px-2 py-1 rounded">{devInfo.raw}</dd>
                </div>
                <div>
                  <dt className="text-[11px] text-muted-foreground mb-1">Formatted</dt>
                  <dd className="font-mono text-xs bg-muted/30 px-2 py-1 rounded">{devInfo.formatted}</dd>
                </div>
                <div>
                  <dt className="text-[11px] text-muted-foreground mb-1">Masked</dt>
                  <dd className="font-mono text-xs bg-muted/30 px-2 py-1 rounded">{devInfo.masked}</dd>
                </div>
                <div>
                  <dt className="text-[11px] text-muted-foreground mb-1">Regex Pattern</dt>
                  <dd className="font-mono text-xs bg-muted/30 px-2 py-1 rounded text-emerald-600">{devInfo.regexPattern}</dd>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <dt className="text-[11px] text-muted-foreground mb-1">Length</dt>
                    <dd className="font-mono text-xs">{devInfo.length}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] text-muted-foreground mb-1">BIN</dt>
                    <dd className="font-mono text-xs">{devInfo.bin}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] text-muted-foreground mb-1">Last 4</dt>
                    <dd className="font-mono text-xs">{devInfo.last4}</dd>
                  </div>
                </div>
              </dl>
            </div>
          )}

          {/* Profile panel */}
          {profile && (
            <div className="p-4 rounded-xl border border-border bg-card">
              <h3 className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wider">
                Billing Profile
              </h3>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <dt className="text-muted-foreground">Email</dt>
                <dd className="font-mono text-xs">{profile.email}</dd>
                <dt className="text-muted-foreground">Phone</dt>
                <dd className="font-mono text-xs">{profile.phone}</dd>
                <dt className="text-muted-foreground">Currency</dt>
                <dd className="font-mono">{profile.currency}</dd>
                <dt className="text-muted-foreground">Address</dt>
                <dd className="text-xs">
                  {profile.address.street}, {profile.address.city}, {profile.address.state} {profile.address.zip}
                </dd>
                <dt className="text-muted-foreground">Country</dt>
                <dd className="text-xs">{profile.address.country}</dd>
              </dl>
            </div>
          )}
        </div>

        {/* ── Right: Controls ──────────────────────────────────────────── */}
        <div className="space-y-6">
          {/* -- Quick Mode -- */}
          {mode === 'quick' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block ml-1">
                  Card Network
                </label>
                <select
                  value={networkId}
                  onChange={(e) => setNetworkId(e.target.value)}
                  className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                >
                  {CARD_NETWORK_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleQuickGenerate}
                className="w-full h-11 rounded-xl bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw size={16} />
                Generate Card
              </button>

              <p className="text-xs text-muted-foreground text-center">
                Generates a single test card with random holder, expiry, and CVV.
              </p>
            </div>
          )}

          {/* -- Advanced Mode -- */}
          {mode === 'advanced' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block ml-1">
                  Card Network
                </label>
                <select
                  value={networkId}
                  onChange={(e) => setNetworkId(e.target.value)}
                  className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                >
                  {CARD_NETWORK_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block ml-1">
                  Billing Profile
                </label>
                <select
                  value={selectedProfile}
                  onChange={(e) => setSelectedProfile(e.target.value)}
                  className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                >
                  {PROFILE_OPTIONS.map((id) => {
                    const p = getProfile(id);
                    return (
                      <option key={id} value={id}>
                        {p?.label ?? id}
                      </option>
                    );
                  })}
                </select>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Generates card + holder + address + email + phone + currency
                </p>
              </div>

              <button
                onClick={handleAdvancedGenerate}
                className="w-full h-11 rounded-xl bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw size={16} />
                Generate Full Profile
              </button>
            </div>
          )}

          {/* -- BIN Mode -- */}
          {mode === 'bin' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block ml-1">
                  Enter BIN/IIN Prefix
                </label>
                <input
                  type="text"
                  value={binInput}
                  onChange={(e) => setBinInput(e.target.value.replace(/\D/g, '').slice(0, 8))}
                  className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  placeholder="e.g. 424242"
                />
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Enter 3-8 digits to detect the network
                </p>
              </div>

              {binInput.length >= 3 && (
                <div className="p-3 rounded-xl border border-border bg-card">
                  <span className="text-xs text-muted-foreground">Detected: </span>
                  <span className="text-xs font-semibold">
                    {detectNetwork(binInput)?.name ?? 'Unknown'}
                  </span>
                </div>
              )}

              <button
                onClick={handleBINGenerate}
                disabled={binInput.length < 3}
                className="w-full h-11 rounded-xl bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Search size={16} />
                Lookup & Generate
              </button>

              {displayCard && mode === 'bin' && (
                <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/20">
                  <p className="text-xs text-emerald-700 dark:text-emerald-300">
                    Card generated from BIN <span className="font-mono font-semibold">{binInput}</span>.
                    Full BIN: <span className="font-mono">{displayCard.bin}</span>
                  </p>
                </div>
              )}
            </div>
          )}

          {/* -- Bulk Mode -- */}
          {mode === 'bulk' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block ml-1">
                  Card Network
                </label>
                <select
                  value={networkId}
                  onChange={(e) => setNetworkId(e.target.value)}
                  className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                >
                  {CARD_NETWORK_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block ml-1">
                  Quantity
                </label>
                <select
                  value={bulkQuantity}
                  onChange={(e) => setBulkQuantity(Number(e.target.value))}
                  className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                >
                  {QUANTITY_OPTIONS.map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleBulkGenerate}
                disabled={generating}
                className="w-full h-11 rounded-xl bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {generating ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <LayoutList size={16} />
                )}
                {generating ? 'Generating...' : `Generate ${bulkQuantity} Cards`}
              </button>

              {bulkProgress && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{bulkProgress.status}</span>
                    <span>{bulkProgress.completed}/{bulkProgress.total}</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                      style={{ width: `${(bulkProgress.completed / bulkProgress.total) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {cards.length > 0 && (
                <div className="max-h-40 overflow-auto space-y-1">
                  {cards.map((c, i) => (
                    <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/30 text-xs font-mono">
                      <span className="text-muted-foreground w-6 shrink-0">{i + 1}.</span>
                      <span>{c.formattedPan}</span>
                      <span className="text-[10px] text-muted-foreground ml-auto">
                        {formatNetworkName(c.network)} · {c.expiryShort}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* -- Developer Mode -- */}
          {mode === 'developer' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block ml-1">
                  Card Network
                </label>
                <select
                  value={networkId}
                  onChange={(e) => setNetworkId(e.target.value)}
                  className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                >
                  {CARD_NETWORK_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleDevGenerate}
                className="w-full h-11 rounded-xl bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw size={16} />
                Generate Developer Card
              </button>

              {devInfo && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
                    <Code size={14} className="text-muted-foreground shrink-0" />
                    <span className="text-xs text-muted-foreground">
                      Use these values in your payment integration tests
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* -- Negative Testing Mode -- */}
          {mode === 'negative-testing' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block ml-1">
                  Card Network (for reference)
                </label>
                <select
                  value={networkId}
                  onChange={(e) => setNetworkId(e.target.value)}
                  className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                >
                  {CARD_NETWORK_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block ml-1">
                  Defect Type
                </label>
                <div className="space-y-2">
                  {NEGATIVE_TYPES.map((nt) => (
                    <button
                      key={nt.id}
                      onClick={() => setNegativeType(nt.id)}
                      className={`w-full text-left p-3 rounded-xl border transition-colors ${
                        negativeType === nt.id
                          ? 'border-red-400 bg-red-50 dark:border-red-700 dark:bg-red-950/20'
                          : 'border-border bg-card hover:border-muted-foreground/30'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Bug size={14} className={negativeType === nt.id ? 'text-red-500' : 'text-muted-foreground'} />
                        <span className={`text-sm font-medium ${
                          negativeType === nt.id ? 'text-red-700 dark:text-red-300' : 'text-foreground'
                        }`}>
                          {nt.label}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5 ml-6">{nt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleNegativeGenerate}
                className="w-full h-11 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
              >
                <Bug size={16} />
                Generate Negative Test Card
              </button>

              {displayCard && mode === 'negative-testing' && (
                <div className="p-3 rounded-xl border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20">
                  <p className="text-xs text-red-700 dark:text-red-300">
                    <span className="font-semibold">Defect:</span>{' '}
                    {NEGATIVE_TYPES.find((nt) => nt.id === negativeType)?.desc}
                  </p>
                  <p className="text-xs text-red-600/70 dark:text-red-400/70 mt-1">
                    Expected behavior: Payment gateway should reject this card with an appropriate error.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* -- Gateway Reference Cards (shared across all modes) -- */}
          <div className="border-t border-border pt-4">
            <button
              onClick={() => setShowGateway((v) => !v)}
              className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {showGateway ? <EyeOff size={14} /> : <Eye size={14} />}
              {showGateway ? 'Hide Gateway Cards' : 'Show Gateway Reference Cards'}
            </button>

            {showGateway && (
              <div className="mt-3 space-y-3">
                <select
                  value={selectedGateway}
                  onChange={(e) => setSelectedGateway(e.target.value)}
                  className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                >
                  {GATEWAY_OPTIONS.map((g) => (
                    <option key={g} value={g}>{GATEWAY_NAMES[g] ?? g}</option>
                  ))}
                </select>

                <div className="max-h-48 overflow-auto space-y-1.5">
                  {gatewayCards.map((gc, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        // Format the gateway card as CardData for display
                        const parts = gc.exp.split('/');
                        const month = parts[0]?.padStart(2, '0') ?? '12';
                        const year = parts[1] ? `20${parts[1]}` : '2028';
                        const formatted = gc.number.replace(/(\d{4})(?=\d)/g, '$1 ');
                        const masked = gc.number.slice(0, 4) + ' **** **** ' + gc.number.slice(-4);
                        setCard({
                          pan: gc.number,
                          formattedPan: gc.brand === 'amex'
                            ? gc.number.replace(/(\d{4})(\d{6})(\d{5})/, '$1 $2 $3')
                            : formatted,
                          maskedPan: masked,
                          network: gc.brand,
                          holder: 'Test User',
                          expiryMonth: month,
                          expiryYear: year,
                          expiryShort: `${month}/${year.slice(2)}`,
                          expiryFull: `${month}/${year}`,
                          cvv: gc.cvc,
                          bin: gc.number.slice(0, 6),
                          last4: gc.number.slice(-4),
                          luhnValid: true,
                        });
                        setProfile(null);
                        setCards([]);
                      }}
                      className="cursor-pointer p-2 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-semibold">
                          {gc.number}
                        </span>
                        <span className="text-[10px] text-muted-foreground uppercase">
                          {gc.brand}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-0.5">
                        <span className="text-[10px] text-muted-foreground">{gc.description}</span>
                        <span className="text-[10px] text-muted-foreground font-mono">{gc.cvc} · {gc.exp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* -- Live Validator (shared) -- */}
          <div className="border-t border-border pt-4">
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block ml-1">
              Validate a Card Number
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={validateInput}
                onChange={(e) => {
                  setValidateInput(e.target.value);
                  if (e.target.value.length >= 8) {
                    setValidationResult(validateCard(e.target.value));
                  } else {
                    setValidationResult(null);
                  }
                }}
                className="h-10 flex-1 rounded-xl border border-border bg-background px-3 text-sm font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                placeholder="Enter PAN to validate..."
                maxLength={19}
              />
              <button
                onClick={handleValidate}
                className="h-10 px-4 rounded-xl bg-emerald-500 text-white text-xs font-semibold hover:bg-emerald-600 transition-colors"
              >
                Check
              </button>
            </div>
            {validationResult && (
              <div className={`mt-2 p-3 rounded-xl border text-xs ${
                validationResult.message === 'Valid ✓'
                  ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20 text-green-700 dark:text-green-300'
                  : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20 text-red-700 dark:text-red-300'
              }`}>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">
                    {validationResult.network ? formatNetworkName(validationResult.network) : 'Unknown'}:
                  </span>
                  <span>{validationResult.message}</span>
                </div>
                <div className="flex gap-4 mt-1 text-[11px] text-muted-foreground">
                  <span>Length: {validationResult.lengthValid ? '✓' : '✗'}</span>
                  <span>Luhn: {validationResult.luhnValid ? '✓' : '✗'}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
