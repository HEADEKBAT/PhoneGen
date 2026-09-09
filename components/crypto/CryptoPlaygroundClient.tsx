'use client';

import { useState, useMemo, useCallback } from 'react';
import type { NetworkId, WalletResult, ValidationResult, MnemonicConfig, MnemonicLanguage } from '@/lib/crypto';
import {
  generateWallet,
  generateWallets,
  generateMnemonicPhrase,
  validateAddress,
  validateMultiple,
  ALL_NETWORKS,
} from '@/lib/crypto';
import {
  Wallet,
  Key,
  ShieldCheck,
  Shuffle,
  Network,
  QrCode,
  BookOpen,
  Bug,
  Search,
  Download,
  History,
  RefreshCw,
  FileCode,
  Copy,
  Check,
  AlertTriangle,
} from 'lucide-react';
import {
  DisclaimerBanner,
  NetworkSelector,
  AddressDisplay,
  ExplorerLinks,
  CodeSnippet,
  HistoryPanel,
} from './shared';

type TabId =
  | 'wallet-generator'
  | 'mnemonic'
  | 'validator'
  | 'converter'
  | 'explorer'
  | 'qr'
  | 'network-info'
  | 'playground'
  | 'security'
  | 'negative-testing'
  | 'history';

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: 'wallet-generator', label: 'Wallet Generator', icon: <Wallet className="h-4 w-4" /> },
  { id: 'mnemonic', label: 'Mnemonic', icon: <Key className="h-4 w-4" /> },
  { id: 'validator', label: 'Validator', icon: <ShieldCheck className="h-4 w-4" /> },
  { id: 'explorer', label: 'HD Explorer', icon: <Network className="h-4 w-4" /> },
  { id: 'qr', label: 'QR', icon: <QrCode className="h-4 w-4" /> },
  { id: 'network-info', label: 'Networks', icon: <Search className="h-4 w-4" /> },
  { id: 'playground', label: 'Dev Export', icon: <FileCode className="h-4 w-4" /> },
  { id: 'security', label: 'Learn', icon: <BookOpen className="h-4 w-4" /> },
  { id: 'negative-testing', label: 'QA', icon: <Bug className="h-4 w-4" /> },
  { id: 'history', label: 'History', icon: <History className="h-4 w-4" /> },
];

interface CryptoPlaygroundClientProps {
  standalone?: boolean;
}

export default function CryptoPlaygroundClient({ standalone = true }: CryptoPlaygroundClientProps) {
  const [activeTab, setActiveTab] = useState<TabId>('wallet-generator');
  const [network, setNetwork] = useState<NetworkId>('bitcoin');
  const [generatedWallet, setGeneratedWallet] = useState<WalletResult | null>(null);
  const [validationInput, setValidationInput] = useState('');
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [mnemonicCount, setMnemonicCount] = useState<MnemonicConfig['wordCount']>(12);
  const [generatedMnemonic, setGeneratedMnemonic] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = useCallback(() => {
    const wallet = generateWallet({ network });
    setGeneratedWallet(wallet);
  }, [network]);

  const handleQuickGenerate = useCallback(() => {
    const wallets = generateWallets({ network, count: 5 });
    setGeneratedWallet(wallets[0] || null);
  }, [network]);

  const handleValidate = useCallback(() => {
    if (!validationInput.trim()) return;
    const result = validateAddress(validationInput.trim());
    setValidationResult(result);
  }, [validationInput]);

  const handleGenerateMnemonic = useCallback(() => {
    const mnemonic = generateMnemonicPhrase({ wordCount: mnemonicCount, language: 'english' });
    setGeneratedMnemonic(mnemonic);
  }, [mnemonicCount]);

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-4">
      <DisclaimerBanner compact />

      <div className="flex flex-col lg:flex-row gap-6 w-full max-w-7xl mx-auto">
        {/* Left Column — Preview / Result */}
        <div className="flex-1 flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-border bg-background p-4 shadow-sm">
            {activeTab === 'wallet-generator' && generatedWallet && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold">Generated Wallet</h3>
                <AddressDisplay
                  address={generatedWallet.address}
                  label={`${ALL_NETWORKS.find(n => n.id === generatedWallet.network)?.name || generatedWallet.network} — ${generatedWallet.format}`}
                  privateKey={generatedWallet.privateKey}
                  publicKey={generatedWallet.publicKey}
                  derivationPath={generatedWallet.derivationPath}
                  mnemonic={generatedWallet.mnemonic}
                />
                <ExplorerLinks network={generatedWallet.network} address={generatedWallet.address} />
              </div>
            )}

            {activeTab === 'wallet-generator' && !generatedWallet && (
              <div className="flex flex-col items-center gap-3 py-12 text-muted-foreground">
                <Wallet className="h-12 w-12" />
                <p className="text-sm">Generate a wallet to see the result</p>
              </div>
            )}

            {activeTab === 'validator' && validationResult && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${validationResult.valid ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-sm font-medium">
                    {validationResult.valid ? 'Valid Address' : 'Invalid Address'}
                  </span>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Network</span>
                    <span className="font-mono">{validationResult.network}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Format</span>
                    <span className="font-mono">{validationResult.format}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Encoding</span>
                    <span className="font-mono">{validationResult.encoding}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Checksum</span>
                    <span className={`font-mono ${validationResult.checksumValid ? 'text-green-500' : 'text-red-500'}`}>
                      {validationResult.checksumValid ? '✅ Valid' : '❌ Invalid'}
                    </span>
                  </div>
                </div>
                {validationResult.warnings.length > 0 && (
                  <div className="space-y-1">
                    {validationResult.warnings.map((w, i) => (
                      <p key={i} className="text-[11px] text-amber-500 flex items-start gap-1">
                        <AlertTriangle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                        {w}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'mnemonic' && generatedMnemonic && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold">Generated Mnemonic</h3>
                <div className="p-3 rounded-xl bg-muted/20 border border-border">
                  <p className="text-sm font-mono leading-relaxed">{generatedMnemonic}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(generatedMnemonic)}
                  className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? 'Copied!' : 'Copy mnemonic'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column — Controls */}
        <div className="w-full lg:w-[420px] flex-shrink-0">
          {/* Tabs */}
          <div className="flex gap-1 p-1 rounded-xl bg-muted/50 border border-border mb-4 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-background text-foreground shadow-sm border border-border'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="rounded-2xl border border-border bg-background p-4 shadow-sm">
            {/* Wallet Generator */}
            {activeTab === 'wallet-generator' && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-2 block">Network</label>
                  <NetworkSelector value={network} onChange={setNetwork} />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleGenerate}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Generate
                  </button>
                  <button
                    onClick={handleQuickGenerate}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-border text-xs font-medium hover:bg-muted/30 transition-colors"
                  >
                    <Shuffle className="h-3.5 w-3.5" />
                    Quick (5)
                  </button>
                </div>

                {/* Format info */}
                <div className="p-2.5 rounded-xl bg-muted/30 border border-border">
                  <p className="text-[11px] text-muted-foreground">
                    Generating a {ALL_NETWORKS.find(n => n.id === network)?.name} wallet.
                    Supported formats: {ALL_NETWORKS.find(n => n.id === network)?.addressFormats.join(', ') || 'N/A'}
                  </p>
                </div>
              </div>
            )}

            {/* Mnemonic */}
            {activeTab === 'mnemonic' && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-2 block">Word Count</label>
                  <div className="grid grid-cols-5 gap-2">
                    {([12, 15, 18, 21, 24] as const).map((count) => (
                      <button
                        key={count}
                        onClick={() => setMnemonicCount(count)}
                        className={`px-2 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                          mnemonicCount === count
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-border text-muted-foreground hover:border-muted-foreground/30'
                        }`}
                      >
                        {count}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleGenerateMnemonic}
                  className="flex items-center justify-center gap-1.5 w-full px-3 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors"
                >
                  <Key className="h-3.5 w-3.5" />
                  Generate Mnemonic
                </button>

                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <p className="text-[11px] text-amber-600 dark:text-amber-400 flex items-start gap-1.5">
                    <AlertTriangle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                    Mnemonics are for testing only. Never use generated mnemonics for real wallets.
                  </p>
                </div>
              </div>
            )}

            {/* Validator */}
            {activeTab === 'validator' && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-2 block">
                    Enter wallet address to validate
                  </label>
                  <textarea
                    value={validationInput}
                    onChange={(e) => setValidationInput(e.target.value)}
                    placeholder="Paste a wallet address..."
                    rows={3}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs font-mono resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <button
                  onClick={handleValidate}
                  disabled={!validationInput.trim()}
                  className="flex items-center justify-center gap-1.5 w-full px-3 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Validate
                </button>

                <div className="p-2.5 rounded-xl bg-muted/30 border border-border">
                  <p className="text-[11px] text-muted-foreground">
                    Detects address type, network, format, checksum validity, and encoding.
                  </p>
                </div>
              </div>
            )}

            {/* HD Explorer */}
            {activeTab === 'explorer' && (
              <div className="space-y-4">
                <p className="text-xs text-muted-foreground">
                  Explore HD wallet derivation paths interactively.
                </p>
                <div className="p-4 rounded-xl bg-muted/20 border border-border text-center">
                  <Network className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">
                    HD Wallet Explorer — coming with full interactive tree visualization.
                  </p>
                  <div className="mt-3 font-mono text-[10px] text-muted-foreground space-y-0.5">
                    <p>m/44&apos;/0&apos;/0&apos;/0/0</p>
                    <p className="text-primary">↓ BIP44 Bitcoin</p>
                    <p>m/44&apos;/60&apos;/0&apos;/0/0</p>
                    <p className="text-primary">↓ BIP44 Ethereum</p>
                  </div>
                </div>
              </div>
            )}

            {/* QR */}
            {activeTab === 'qr' && (
              <div className="space-y-4">
                <p className="text-xs text-muted-foreground">
                  Generate QR codes for crypto payment URIs.
                </p>
                <div className="p-4 rounded-xl bg-muted/20 border border-border text-center">
                  <QrCode className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">
                    Generate a wallet address first, then create its QR payment code.
                  </p>
                </div>
                {generatedWallet && (
                  <div className="p-2.5 rounded-xl bg-muted/30 border border-border">
                    <p className="text-[11px] font-mono text-muted-foreground break-all">
                      bitcoin:{generatedWallet.address}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Network Info */}
            {activeTab === 'network-info' && (
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {ALL_NETWORKS.map((net) => (
                  <div key={net.id} className="p-3 rounded-xl bg-muted/20 border border-border">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">{net.symbol}</span>
                        <span className="text-xs text-muted-foreground">{net.name}</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        BIP44: {net.coinType}
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mb-1.5">{net.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {net.addressFormats.map((fmt) => (
                        <span key={fmt} className="text-[9px] px-1.5 py-0.5 rounded bg-muted/50 text-muted-foreground font-mono">
                          {fmt}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Dev Export */}
            {activeTab === 'playground' && (
              <div className="space-y-4">
                <p className="text-xs text-muted-foreground">
                  Export wallet structures in various programming languages.
                </p>
                {generatedWallet ? (
                  <CodeSnippet
                    code={`// Wallet generated by Crypto Wallet Playground\n// WARNING: For testing only\n\nconst wallet = {\n  network: '${generatedWallet.network}',\n  address: '${generatedWallet.address}',\n  format: '${generatedWallet.format}',\n  publicKey: '${generatedWallet.publicKey}',\n  derivationPath: '${generatedWallet.derivationPath}',\n};`}
                    language="typescript"
                    title="Wallet Export"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 py-6 text-muted-foreground">
                    <FileCode className="h-6 w-6" />
                    <p className="text-xs">Generate a wallet first to see code exports</p>
                  </div>
                )}
              </div>
            )}

            {/* Security Education */}
            {activeTab === 'security' && (
              <div className="space-y-4 max-h-[500px] overflow-y-auto">
                <div className="p-3 rounded-xl bg-muted/20 border border-border">
                  <h3 className="text-xs font-semibold mb-1">Private Key</h3>
                  <p className="text-[11px] text-muted-foreground">
                    A 256-bit random number that must be kept secret. Used to sign transactions.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-muted/20 border border-border">
                  <h3 className="text-xs font-semibold mb-1">Public Key</h3>
                  <p className="text-[11px] text-muted-foreground">
                    Derived from private key via elliptic curve multiplication. Can be shared freely.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-muted/20 border border-border">
                  <h3 className="text-xs font-semibold mb-1">Seed Phrase (BIP39)</h3>
                  <p className="text-[11px] text-muted-foreground">
                    12-24 words encoding wallet entropy. Used for wallet backups and recovery.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-muted/20 border border-border">
                  <h3 className="text-xs font-semibold mb-1">HD Wallet (BIP32/BIP44)</h3>
                  <p className="text-[11px] text-muted-foreground">
                    Derives all keys from one seed. Standardized path: purpose/coin/account/change/index.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-muted/20 border border-border">
                  <h3 className="text-xs font-semibold mb-1">Address Checksum</h3>
                  <p className="text-[11px] text-muted-foreground">
                    Error detection: Base58Check (double SHA-256), bech32 (BCH codes), EIP-55 (Keccak mixed-case).
                  </p>
                </div>
              </div>
            )}

            {/* Negative Testing */}
            {activeTab === 'negative-testing' && (
              <div className="space-y-4">
                <p className="text-xs text-muted-foreground">
                  Generate intentionally invalid addresses for QA testing. Verify your error handling works.
                </p>
                <div className="space-y-2">
                  {[
                    { label: 'Broken Checksum', desc: 'Last character flipped' },
                    { label: 'Wrong Prefix', desc: '1→2, bc1→bd1' },
                    { label: 'Wrong Length', desc: 'Truncated or extended' },
                    { label: 'Invalid Encoding', desc: 'Non-hex characters' },
                  ].map((item) => (
                    <div key={item.label} className="p-2.5 rounded-xl bg-muted/20 border border-border">
                      <p className="text-xs font-medium">{item.label}</p>
                      <p className="text-[10px] text-muted-foreground">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* History */}
            {activeTab === 'history' && (
              <HistoryPanel />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
