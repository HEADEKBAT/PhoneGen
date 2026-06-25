'use client';

import { Copy, Check, CopyCheck, CheckCircle2, Loader2 } from 'lucide-react';
import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { useTranslations } from '@/lib/i18n';
import Flag from 'react-world-flags';
import { COUNTRIES, GenerationMode } from '@/lib/phoneGenerator';

interface PhoneNumber {
  id: number;
  number: string;
}

export default function PhoneList({
  phones = [],
  countryCode,
  mode = 'valid',
  isPending,
}: {
  phones?: string[];
  countryCode?: string;
  mode?: GenerationMode;
  isPending?: boolean;
}) {
  const { t } = useTranslations();
  const [copiedSet, setCopiedSet] = useState<Set<number>>(new Set());
  const [toast, setToast] = useState<{ text: string; visible: boolean } | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reset copied state when phones change (new generation completed)
  useEffect(() => {
    setCopiedSet(new Set());
  }, [phones]);

  const phoneList = useMemo<PhoneNumber[]>(() => {
    if (!phones || !Array.isArray(phones)) return [];
    return phones.map((number, index) => ({ id: index + 1, number }));
  }, [phones]);

  const showToast = useCallback((text: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ text, visible: true });
    toastTimer.current = setTimeout(() => {
      setToast((prev) => (prev ? { ...prev, visible: false } : null));
      setTimeout(() => {
        setToast(null);
      }, 300);
    }, 1500);
  }, []);

  const handleCopy = useCallback((number: string, id: number) => {
    navigator.clipboard.writeText(number);
    setCopiedSet((prev) => new Set(prev).add(id));
    showToast(t('phoneList.copied'));
  }, [showToast, t]);

  const handleCopyAll = useCallback(() => {
    const text = phones.join('\n');
    navigator.clipboard.writeText(text);
    // Mark all as copied
    setCopiedSet(new Set(phoneList.map((p) => p.id)));
    showToast(t('phoneList.copiedAll'));
  }, [phones, phoneList, showToast, t]);

  const downloadFile = useCallback((content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  const handleExportTxt = useCallback(() => {
    downloadFile(phones.join('\n'), 'phone-numbers.txt', 'text/plain');
    showToast('Exported TXT');
  }, [phones, downloadFile, showToast]);

  const handleExportCsv = useCallback(() => {
    const header = 'ID,Phone Number';
    const rows = phones.map((p, i) => `${i + 1},"${p}"`);
    downloadFile([header, ...rows].join('\n'), 'phone-numbers.csv', 'text/csv');
    showToast('Exported CSV');
  }, [phones, downloadFile, showToast]);

  const handleExportJson = useCallback(() => {
    const data = phones.map((p, i) => ({ id: i + 1, number: p }));
    downloadFile(JSON.stringify(data, null, 2), 'phone-numbers.json', 'application/json');
    showToast('Exported JSON');
  }, [phones, downloadFile, showToast]);

  const country = countryCode ? COUNTRIES[countryCode] : null;

  const getCountryCode = (code: string) => {
    const codeMap: Record<string, string> = { UK: 'GB', US: 'US' };
    return codeMap[code] || code;
  };

  if (phoneList.length === 0) {
    if (isPending) {
      return (
        <div className="flex items-center justify-center py-16">
          <div className="flex items-center gap-2.5 text-muted-foreground">
            <Loader2 size={18} className="animate-spin" />
            <span className="text-sm">{t('generator.generating')}</span>
          </div>
        </div>
      );
    }
    return null;
  }

  const allCopied = phoneList.length > 0 && phoneList.every((p) => copiedSet.has(p.id));

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {country && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Flag
                code={getCountryCode(country.code)}
                style={{ width: '18px', height: '12px', borderRadius: '1px', objectFit: 'cover' }}
                title={t('countries.' + country.code)}
              />
              <span className="font-medium text-foreground">{phoneList.length}</span>
              <span>numbers</span>
              {allCopied && (
                <span className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 font-medium animate-in fade-in duration-200">
                  <Check size={12} />
                  All copied
                </span>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-1">
          {/* Copy All */}
          <button
            onClick={handleCopyAll}
            className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors border border-border"
            disabled={isPending}
          >
            <CopyCheck size={14} />
            <span className="hidden sm:inline">{t('phoneList.copyAll')}</span>
          </button>
          {/* Export */}
          <div className="flex items-center gap-0.5 border border-border rounded-lg p-0.5">
            <button onClick={handleExportTxt} className="h-7 px-2 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">TXT</button>
            <button onClick={handleExportCsv} className="h-7 px-2 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">CSV</button>
            <button onClick={handleExportJson} className="h-7 px-2 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">JSON</button>
          </div>
        </div>
      </div>

      {/* Mode Badge */}
      {(mode === 'valid' || mode === 'example') && (
        <div
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium border transition-opacity duration-300 ${
            isPending ? 'opacity-50' : 'opacity-100'
          } ${
            mode === 'valid'
              ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
              : 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800'
          }`}
        >
          <CheckCircle2 size={14} className="shrink-0" />
          <span>
            {mode === 'valid'
              ? t('phoneList.validBadge')
              : t('phoneList.exampleBadge')}
          </span>
        </div>
      )}

      {/* Phone Number Cards */}
      <div className="divide-y divide-border rounded-xl border border-border bg-card overflow-hidden">
        {phoneList.map((phone) => {
          const isCopied = copiedSet.has(phone.id);
          return (
            <div
              key={phone.id}
              className={`flex items-center gap-3 px-4 py-3 sm:px-5 sm:py-4 transition-all duration-200 group
                ${isCopied
                  ? 'bg-indigo-50/80 dark:bg-indigo-950/20 border-l-2 border-l-indigo-500 dark:border-l-indigo-400'
                  : 'hover:bg-muted/30 border-l-2 border-l-transparent'
                }
                ${isPending ? 'pointer-events-none' : ''}
              `}
            >
              {/* Number + Check icon */}
              <span className="relative w-6 sm:w-8 text-xs sm:text-sm text-muted-foreground font-mono tabular-nums shrink-0">
                {isCopied ? (
                  <span className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400">
                    <Check size={14} className="animate-in zoom-in duration-200" />
                    <span className="text-[10px]">{String(phone.id).padStart(2, '0')}</span>
                  </span>
                ) : (
                  String(phone.id).padStart(2, '0')
                )}
              </span>

              {/* Phone Number */}
              <span className={`flex-1 font-heading text-xl sm:text-2xl tracking-tight font-semibold tabular-nums truncate transition-colors duration-200 ${
                isCopied
                  ? 'text-indigo-700 dark:text-indigo-300'
                  : 'text-foreground'
              }`}>
                {phone.number}
              </span>

              {/* Copy Button */}
              <button
                onClick={() => handleCopy(phone.number, phone.id)}
                disabled={isPending || isCopied}
                aria-label={
                  isCopied
                    ? t('phoneList.copiedLabel') + ': ' + phone.number
                    : t('phoneList.copy') + ' ' + phone.number
                }
                className={`shrink-0 flex items-center gap-1.5 h-9 px-3 rounded-lg text-xs font-medium transition-all duration-200 ${
                  isCopied
                    ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-700'
                    : 'text-muted-foreground sm:opacity-0 sm:group-hover:opacity-100 hover:opacity-100 hover:bg-muted hover:text-foreground border border-transparent hover:border-border'
                } ${isPending ? 'opacity-30' : ''}`}
              >
                {isCopied ? (
                  <>
                    <Check size={14} />
                    <span>{t('phoneList.copiedLabel')}</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    <span className="hidden xs:inline">{t('phoneList.copy')}</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Toast */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`px-4 py-2.5 rounded-xl border border-border bg-card shadow-dropdown flex items-center gap-2 text-sm font-medium transition-all duration-300 ${
            toast.visible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-2 pointer-events-none absolute'
          }`}
        >
          <div className="size-1.5 rounded-full bg-primary" />
          <span>{toast.text}</span>
        </div>
      )}
    </div>
  );
}
