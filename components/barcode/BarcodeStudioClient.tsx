'use client';

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Scan, QrCode, CheckCircle, AlertCircle, Download, Copy, Check, ChevronDown, ChevronUp, Settings, MoveVertical } from 'lucide-react';
import { generateBarcode } from '@/lib/barcode/engine';
import { detectType, validateBarcode } from '@/lib/barcode/validation';
import { calculateCheckDigit, explainCheckDigit } from '@/lib/barcode/checkDigit';
import { generateBulk, bulkToCSV, bulkToJSON, bulkToTXT } from '@/lib/barcode/bulk';
import { BARCODE_DISPLAY_NAMES, type BarcodeType, type BarcodeResult } from '@/lib/barcode/types';
import {
  BARCODE_STANDARDS,
} from '@/lib/config/barcode';

type TabName = 'product' | 'industrial' | 'validator' | 'bulk' | 'settings';

const ALL_PRODUCT_TYPES: BarcodeType[] = ['ean13', 'ean8', 'upca', 'upce', 'gtin', 'isbn13', 'isbn10', 'issn', 'ismn'];
const ALL_INDUSTRIAL_TYPES: BarcodeType[] = ['code128', 'code39', 'code93', 'codabar', 'itf14', 'gs1-128', 'pharmacode'];

function standardLabel(type: BarcodeType): string {
  const found = BARCODE_STANDARDS.find(s => s.id === type);
  return found?.label || BARCODE_DISPLAY_NAMES[type] || type;
}

/* ── Settings defaults ──────────────────────────────────────────────────── */

interface SettingsState {
  width: number;
  height: number;
  margin: number;
  showText: boolean;
  fontSize: number;
  foreground: string;
  background: string;
}

const DEFAULT_SETTINGS: SettingsState = {
  width: 2,
  height: 80,
  margin: 10,
  showText: true,
  fontSize: 16,
  foreground: '#000000',
  background: '#ffffff',
};

/* ── Helpers ────────────────────────────────────────────────────────────── */

function randomEAN13(): string {
  const prefix = '20';   // "in-store" prefix range
  const body = Array.from({ length: 10 }, () => Math.floor(Math.random() * 10)).join('');
  return prefix + body + calculateCheckDigit(prefix + body, 'ean13');
}

function downloadFile(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/* ── SVGs to data URL ───────────────────────────────────────────────────── */

function svgToDataURL(svg: string): string {
  return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
}

function dataURLToBlob(url: string): Promise<Blob> {
  return fetch(url).then(r => r.blob());
}

/* ── Tab Definitions ────────────────────────────────────────────────────── */

const TABS: { id: TabName; label: string; icon: typeof Scan }[] = [
  { id: 'product', label: 'Product Barcodes', icon: Scan },
  { id: 'industrial', label: 'Industrial', icon: QrCode },
  { id: 'validator', label: 'Validator', icon: CheckCircle },
  { id: 'bulk', label: 'Bulk', icon: MoveVertical },
  { id: 'settings', label: 'Settings', icon: Settings },
];

/* ── Main Component ─────────────────────────────────────────────────────── */

export default function BarcodeStudioClient() {
  const [activeTab, setActiveTab] = useState<TabName>('product');
  const [barcodeType, setBarcodeType] = useState<BarcodeType>('ean13');
  const [dataInput, setDataInput] = useState('');
  const [settings, setSettings] = useState<SettingsState>(DEFAULT_SETTINGS);
  const [bulkCount, setBulkCount] = useState(10);
  const [bulkPrefix, setBulkPrefix] = useState('');
  const [bulkRandom, setBulkRandom] = useState(false);
  const [bulkRandomLen, setBulkRandomLen] = useState(8);
  const [bulkStartFrom, setBulkStartFrom] = useState(1);
  const [bulkResults, setBulkResults] = useState<BarcodeResult[]>([]);
  const [validatorInput, setValidatorInput] = useState('');
  const [validatorResult, setValidatorResult] = useState<ReturnType<typeof validateBarcode> | null>(null);
  const [copied, setCopied] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  // Generate barcode data
  const barcodeResult = useMemo(() => {
    if (!dataInput) return null;
    try {
      return generateBarcode({
        type: barcodeType,
        data: dataInput,
        ...settings,
      });
    } catch {
      return null;
    }
  }, [barcodeType, dataInput, settings]);

  // Auto-generate a random valid barcode on mount & type change
  useEffect(() => {
    if (!dataInput) {
      const random = randomEAN13();
      setDataInput(random);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const DATA_LENGTH: Partial<Record<BarcodeType, number>> = {
    ean13: 12, ean8: 7, upca: 11, upce: 7, gtin: 12,
    isbn13: 12, isbn10: 9, issn: 7, ismn: 7, itf14: 13,
  };

  const handleTypeChange = useCallback((type: BarcodeType) => {
    setBarcodeType(type);
    // Sync bulk random length so the Bulk tab defaults to the correct digit count
    setBulkRandomLen(DATA_LENGTH[type] ?? 8);

    const productTypes = [...ALL_PRODUCT_TYPES, ...ALL_INDUSTRIAL_TYPES];
    if (productTypes.includes(type)) {
      // Generate a random example
      if (type === 'ean13' || type === 'ean8' || type === 'upca' || type === 'upce' || type === 'gtin' || type === 'isbn13') {
        const prefix = type === 'isbn13' ? '978' : '20';
        const len = DATA_LENGTH[type] ?? 12;
        const body = Array.from({ length: len - prefix.length }, () => Math.floor(Math.random() * 10)).join('');
        const full = prefix + body;
        const cd = calculateCheckDigit(full, type);
        setDataInput(full + cd);
      } else if (type === 'code128') {
        setDataInput('ABC-12345');
      } else if (type === 'code39') {
        setDataInput('CODE39');
      } else if (type === 'code93') {
        setDataInput('CODE93');
      } else if (type === 'codabar') {
        setDataInput('A12345B');
      } else if (type === 'itf14') {
        const len = 13;
        const body = Array.from({ length: len }, () => Math.floor(Math.random() * 10)).join('');
        setDataInput(body + calculateCheckDigit(body, 'itf14'));
      } else if (type === 'pharmacode') {
        setDataInput(String(Math.floor(Math.random() * 9000) + 1000));
      } else {
        setDataInput('123456789012');
      }
    }
  }, []);

  const handleGenerate = useCallback((type: BarcodeType) => {
    handleTypeChange(type);
    setActiveTab(type === 'code128' || type === 'code39' || type === 'code93' || type === 'codabar' || type === 'itf14' || type === 'gs1-128' || type === 'pharmacode' ? 'industrial' : 'product');
  }, [handleTypeChange]);

  // Copy SVG
  const handleCopySVG = useCallback(async () => {
    if (!barcodeResult) return;
    try {
      await navigator.clipboard.writeText(barcodeResult.svg);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* noop */ }
  }, [barcodeResult]);

  // Download PNG
  const handleDownloadPNG = useCallback(() => {
    if (!barcodeResult) return;
    const dataUrl = svgToDataURL(barcodeResult.svg);
    dataURLToBlob(dataUrl).then(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `barcode-${barcodeResult.data}.png`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }, [barcodeResult]);

  // Download SVG
  const handleDownloadSVG = useCallback(() => {
    if (!barcodeResult) return;
    downloadFile(barcodeResult.svg, `barcode-${barcodeResult.data}.svg`, 'image/svg+xml');
  }, [barcodeResult]);

  // Validator
  const handleValidate = useCallback(() => {
    if (!validatorInput.trim()) return;
    const result = validateBarcode(validatorInput.trim());
    setValidatorResult(result);
  }, [validatorInput]);

  // Bulk
  const handleBulkGenerate = useCallback(() => {
    const results = generateBulk({
      type: barcodeType,
      quantity: bulkCount,
      prefix: bulkPrefix,
      startFrom: bulkStartFrom,
      random: bulkRandom,
      randomLength: bulkRandomLen,
    });
    setBulkResults(results);
  }, [barcodeType, bulkCount, bulkPrefix, bulkStartFrom, bulkRandom, bulkRandomLen]);

  const handleBulkExportCSV = useCallback(() => {
    downloadFile(bulkToCSV(bulkResults), 'barcodes.csv', 'text/csv');
  }, [bulkResults]);

  const handleBulkExportJSON = useCallback(() => {
    downloadFile(bulkToJSON(bulkResults), 'barcodes.json', 'application/json');
  }, [bulkResults]);

  const handleBulkExportTXT = useCallback(() => {
    downloadFile(bulkToTXT(bulkResults), 'barcodes.txt', 'text/plain');
  }, [bulkResults]);

  // Check digit info
  const checkDigitInfo = useMemo(() => {
    if (!dataInput || !['ean13', 'ean8', 'upca', 'upce', 'gtin', 'isbn13', 'issn', 'ismn'].includes(barcodeType)) return null;
    const explanation = explainCheckDigit(dataInput, barcodeType);
    return explanation;
  }, [dataInput, barcodeType]);

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
      {/* ── Tabs ───────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-1 mb-6 border-b border-border pb-2">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === tab.id
                  ? 'text-primary border-b-2 border-primary bg-primary/5'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── Left: Barcode Preview ──────────────────────────────────── */}
        <div>
          <div
            ref={previewRef}
            className="flex flex-col items-center justify-center p-8 rounded-xl border border-border bg-card min-h-[250px]"
          >
            {barcodeResult ? (
              <div
                className="max-w-full overflow-auto"
                dangerouslySetInnerHTML={{ __html: barcodeResult.svg }}
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                Enter barcode data to see the preview
              </p>
            )}
          </div>

          {/* Export buttons */}
          {barcodeResult && (
            <div className="flex flex-wrap gap-2 mt-4">
              <button
                onClick={handleDownloadPNG}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-card text-xs font-medium text-foreground hover:bg-muted/50 transition-colors"
              >
                <Download size={14} />
                PNG
              </button>
              <button
                onClick={handleDownloadSVG}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-card text-xs font-medium text-foreground hover:bg-muted/50 transition-colors"
              >
                <Download size={14} />
                SVG
              </button>
              <button
                onClick={handleCopySVG}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-card text-xs font-medium text-foreground hover:bg-muted/50 transition-colors"
              >
                {copied ? <Check size={14} className="text-primary" /> : <Copy size={14} />}
                {copied ? 'Copied!' : 'Copy SVG'}
              </button>
            </div>
          )}

          {/* Barcode Explainer */}
          {barcodeResult && (
            <div className="mt-4 p-4 rounded-xl border border-border bg-card">
              <h3 className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wider">Barcode Details</h3>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <dt className="text-muted-foreground">Type</dt>
                <dd className="text-foreground font-medium">{barcodeResult.metadata.displayType}</dd>

                {barcodeResult.metadata.countryPrefix && (
                  <>
                    <dt className="text-muted-foreground">Country Prefix</dt>
                    <dd className="text-foreground font-mono">{barcodeResult.metadata.countryPrefix}</dd>
                  </>
                )}

                {barcodeResult.metadata.companyPrefix && (
                  <>
                    <dt className="text-muted-foreground">Company Prefix</dt>
                    <dd className="text-foreground font-mono">{barcodeResult.metadata.companyPrefix}</dd>
                  </>
                )}

                {barcodeResult.metadata.productNumber && (
                  <>
                    <dt className="text-muted-foreground">Product Number</dt>
                    <dd className="text-foreground font-mono">{barcodeResult.metadata.productNumber}</dd>
                  </>
                )}

                {barcodeResult.checkDigit && (
                  <>
                    <dt className="text-muted-foreground">Check Digit</dt>
                    <dd className="text-foreground font-mono text-primary font-semibold">{barcodeResult.checkDigit}</dd>
                  </>
                )}

                <dt className="text-muted-foreground">Length</dt>
                <dd className="text-foreground font-mono">{barcodeResult.metadata.length} digits</dd>
              </dl>
            </div>
          )}

          {/* Check Digit Explanation */}
          {checkDigitInfo && (
            <div className="mt-4 p-4 rounded-xl border border-border bg-muted/30">
              <h3 className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wider">Check Digit Calculation</h3>
              <div className="space-y-1">
                {checkDigitInfo.steps.map((step, i) => (
                  <p key={i} className="text-xs text-muted-foreground font-mono leading-relaxed">{step}</p>
                ))}
              </div>
              <p className="mt-2 text-xs font-medium text-primary">
                Full code: {checkDigitInfo.fullCode}
              </p>
            </div>
          )}
        </div>

        {/* ── Right: Controls ─────────────────────────────────────────── */}
        <div className="space-y-6">
          {/* TAB 1 & 2: Generator Controls */}
          {(activeTab === 'product' || activeTab === 'industrial') && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block ml-1">
                  Barcode Type
                </label>
                <select
                  value={barcodeType}
                  onChange={(e) => handleTypeChange(e.target.value as BarcodeType)}
                  className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  {(activeTab === 'product' ? ALL_PRODUCT_TYPES : ALL_INDUSTRIAL_TYPES).map((t) => (
                    <option key={t} value={t}>{standardLabel(t)}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block ml-1">
                  Data to Encode
                </label>
                <input
                  type="text"
                  value={dataInput}
                  onChange={(e) => setDataInput(e.target.value)}
                  className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-primary/40"
                  placeholder="Enter barcode data..."
                />
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Changes update the preview instantly
                </p>
              </div>

              <button
                onClick={() => handleGenerate(barcodeType)}
                className="w-full h-10 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                Generate {barcodeType === 'ean13' ? 'EAN-13' : standardLabel(barcodeType)}
              </button>
            </div>
          )}

          {/* TAB 3: Validator */}
          {activeTab === 'validator' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block ml-1">
                  Paste Barcode
                </label>
                <input
                  type="text"
                  value={validatorInput}
                  onChange={(e) => setValidatorInput(e.target.value)}
                  className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-primary/40"
                  placeholder="e.g. 5901234123457"
                />
              </div>

              <button
                onClick={handleValidate}
                className="w-full h-10 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                Validate Barcode
              </button>

              {validatorResult && (
                <div className={`p-4 rounded-xl border ${
                  validatorResult.valid ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20' :
                  'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    {validatorResult.valid ? (
                      <CheckCircle size={18} className="text-green-600 dark:text-green-400" />
                    ) : (
                      <AlertCircle size={18} className="text-red-600 dark:text-red-400" />
                    )}
                    <span className={`font-semibold text-sm ${
                      validatorResult.valid ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
                    }`}>
                      {validatorResult.valid ? 'Valid Barcode' : 'Invalid Barcode'}
                    </span>
                  </div>

                  <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs mt-3">
                    <dt className="text-muted-foreground">Detected Type</dt>
                    <dd className="font-medium">{validatorResult.detectedType ? standardLabel(validatorResult.detectedType) : 'Unknown'}</dd>

                    <dt className="text-muted-foreground">Length</dt>
                    <dd className="font-mono">{validatorResult.length} chars</dd>

                    {validatorResult.checkDigit && (
                      <>
                        <dt className="text-muted-foreground">Check Digit</dt>
                        <dd className={`font-mono ${validatorResult.checkDigit.valid ? 'text-green-600' : 'text-red-600'}`}>
                          {validatorResult.checkDigit.actual} {validatorResult.checkDigit.valid ? '✓' : `(expected ${validatorResult.checkDigit.expected})`}
                        </dd>
                      </>
                    )}
                  </dl>

                  {validatorResult.errors.length > 0 && (
                    <div className="mt-3 space-y-1">
                      {validatorResult.errors.map((err, i) => (
                        <p key={i} className="text-xs text-red-600 dark:text-red-400">{err}</p>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Bulk Generator */}
          {activeTab === 'bulk' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block ml-1">
                    Barcode Type
                  </label>
                  <select
                    value={barcodeType}
                    onChange={(e) => setBarcodeType(e.target.value as BarcodeType)}
                    className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  >
                    {[...ALL_PRODUCT_TYPES, ...ALL_INDUSTRIAL_TYPES].map((t) => (
                      <option key={t} value={t}>{standardLabel(t)}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block ml-1">
                    Quantity
                  </label>
                  <select
                    value={bulkCount}
                    onChange={(e) => setBulkCount(Number(e.target.value))}
                    className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  >
                    {[5, 10, 25, 50, 100, 500, 1000].map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block ml-1">
                    Prefix
                  </label>
                  <input
                    type="text"
                    value={bulkPrefix}
                    onChange={(e) => setBulkPrefix(e.target.value)}
                    className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/40"
                    placeholder="Optional"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block ml-1">
                    {bulkRandom ? 'Random Length' : 'Start From'}
                  </label>
                  {bulkRandom ? (
                    <select
                      value={bulkRandomLen}
                      onChange={(e) => setBulkRandomLen(Number(e.target.value))}
                      className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    >
                      {[4, 6, 8, 10, 12].map((n) => (
                        <option key={n} value={n}>{n} digits</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="number"
                      value={bulkStartFrom}
                      onChange={(e) => setBulkStartFrom(Number(e.target.value))}
                      className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  )}
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={bulkRandom}
                  onChange={(e) => setBulkRandom(e.target.checked)}
                  className="rounded border-border"
                />
                <span className="text-xs text-muted-foreground">Random numbers</span>
              </label>

              <button
                onClick={handleBulkGenerate}
                className="w-full h-10 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                Generate {bulkCount} Barcodes
              </button>

              {bulkResults.length > 0 && (
                <div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <button onClick={handleBulkExportCSV} className="px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-medium hover:bg-muted/50 transition-colors">
                      Export CSV
                    </button>
                    <button onClick={handleBulkExportJSON} className="px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-medium hover:bg-muted/50 transition-colors">
                      Export JSON
                    </button>
                    <button onClick={handleBulkExportTXT} className="px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-medium hover:bg-muted/50 transition-colors">
                      Export TXT
                    </button>
                  </div>
                  <div className="max-h-48 overflow-auto space-y-1">
                    {bulkResults.map((r, i) => (
                      <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/30 text-xs font-mono">
                        <span className="text-muted-foreground">{i + 1}.</span>
                        <span>{r.data}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: Settings */}
          {activeTab === 'settings' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block ml-1">
                    Bar Width (px)
                  </label>
                  <input
                    type="number"
                    value={settings.width}
                    onChange={(e) => setSettings(s => ({ ...s, width: Number(e.target.value) }))}
                    className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    min={1}
                    max={10}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block ml-1">
                    Height (px)
                  </label>
                  <input
                    type="number"
                    value={settings.height}
                    onChange={(e) => setSettings(s => ({ ...s, height: Number(e.target.value) }))}
                    className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    min={20}
                    max={500}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block ml-1">
                    Margin (px)
                  </label>
                  <input
                    type="number"
                    value={settings.margin}
                    onChange={(e) => setSettings(s => ({ ...s, margin: Number(e.target.value) }))}
                    className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    min={0}
                    max={50}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block ml-1">
                    Font Size (px)
                  </label>
                  <input
                    type="number"
                    value={settings.fontSize}
                    onChange={(e) => setSettings(s => ({ ...s, fontSize: Number(e.target.value) }))}
                    className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    min={8}
                    max={48}
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.showText}
                  onChange={(e) => setSettings(s => ({ ...s, showText: e.target.checked }))}
                  className="rounded border-border"
                />
                <span className="text-xs text-muted-foreground">Show human-readable text</span>
              </label>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block ml-1">
                    Bar Color
                  </label>
                  <input
                    type="color"
                    value={settings.foreground}
                    onChange={(e) => setSettings(s => ({ ...s, foreground: e.target.value }))}
                    className="h-10 w-full rounded-xl border border-border bg-background cursor-pointer"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block ml-1">
                    Background Color
                  </label>
                  <input
                    type="color"
                    value={settings.background}
                    onChange={(e) => setSettings(s => ({ ...s, background: e.target.value }))}
                    className="h-10 w-full rounded-xl border border-border bg-background cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
