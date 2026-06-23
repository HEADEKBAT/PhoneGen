'use client';

import { Copy, Check, Download, CopyCheck } from 'lucide-react';
import { useState, useRef, useCallback, useMemo } from 'react';
import { useTranslations } from '@/lib/i18n';
import Flag from 'react-world-flags';
import { COUNTRIES } from '@/lib/phoneGenerator';

interface PhoneNumber {
  id: number;
  number: string;
}

export default function PhoneList({
  phones = [],
  countryCode,
}: {
  phones?: string[];
  countryCode?: string;
}) {
  const { t } = useTranslations();
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [toast, setToast] = useState<{ text: string; visible: boolean } | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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
        setCopiedId(null);
      }, 300);
    }, 1500);
  }, []);

  const handleCopy = (number: string, id: number) => {
    navigator.clipboard.writeText(number);
    setCopiedId(id);
    showToast(t('phoneList.copied'));
  };

  const handleCopyAll = () => {
    const text = phones.join('\n');
    navigator.clipboard.writeText(text);
    showToast(t('phoneList.copiedAll'));
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportTxt = () => {
    downloadFile(phones.join('\n'), 'phone-numbers.txt', 'text/plain');
    showToast('Exported TXT');
  };

  const handleExportCsv = () => {
    const header = 'ID,Phone Number';
    const rows = phones.map((p, i) => `${i + 1},"${p}"`);
    downloadFile([header, ...rows].join('\n'), 'phone-numbers.csv', 'text/csv');
    showToast('Exported CSV');
  };

  const handleExportJson = () => {
    const data = phones.map((p, i) => ({ id: i + 1, number: p }));
    downloadFile(JSON.stringify(data, null, 2), 'phone-numbers.json', 'application/json');
    showToast('Exported JSON');
  };

  const country = countryCode ? COUNTRIES[countryCode] : null;

  const getCountryCode = (code: string) => {
    const codeMap: Record<string, string> = { UK: 'GB', US: 'US' };
    return codeMap[code] || code;
  };

  if (phoneList.length === 0) return null;

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
            </div>
          )}
        </div>
        <div className="flex items-center gap-1">
          {/* Copy All */}
          <button
            onClick={handleCopyAll}
            className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors border border-border"
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

      {/* Phone Number Cards */}
      <div className="divide-y divide-border rounded-xl border border-border bg-card overflow-hidden">
        {phoneList.map((phone) => (
          <div
            key={phone.id}
            className="flex items-center gap-3 px-4 py-3 sm:px-5 sm:py-4 transition-colors hover:bg-muted/30 group"
          >
            {/* Number */}
            <span className="w-6 sm:w-8 text-xs sm:text-sm text-muted-foreground font-mono tabular-nums shrink-0">
              {String(phone.id).padStart(2, '0')}
            </span>

            {/* Phone Number */}
            <span className="flex-1 font-heading text-xl sm:text-2xl tracking-tight text-foreground font-semibold tabular-nums truncate">
              {phone.number}
            </span>

            {/* Copy Button */}
            <button
              onClick={() => handleCopy(phone.number, phone.id)}
              aria-label={
                copiedId === phone.id
                  ? t('phoneList.copiedLabel') + ': ' + phone.number
                  : t('phoneList.copy') + ' ' + phone.number
              }
              className={`shrink-0 flex items-center gap-1.5 h-9 px-3 rounded-lg text-xs font-medium transition-all ${
                copiedId === phone.id
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground sm:opacity-0 sm:group-hover:opacity-100 hover:opacity-100 hover:bg-muted hover:text-foreground border border-transparent hover:border-border'
              }`}
            >
              {copiedId === phone.id ? (
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
        ))}
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
