'use client';

import { useState, useCallback, useMemo } from 'react';
import type { QRContentType, QROptions } from '@/lib/qr/types';
import { getAllContentTypes, getContentTypeConfig } from '@/lib/qr/contentTypes';
import { Type, Palette, Image as ImageIcon, Settings, ScanLine, Download, Check } from 'lucide-react';
import QRPreview from './shared/QRPreview';
import QRContentForm from './shared/QRContentForm';
import QRExportPanel from './shared/QRExportPanel';
import QRScannerTest from './shared/QRScannerTest';
import QRContrastCheck from './shared/QRContrastCheck';
import ModuleStyleSelector from './shared/ModuleStyleSelector';
import EyeStyleSelector from './shared/EyeStyleSelector';
import LogoUploader from './shared/LogoUploader';
import QuietZoneControl from './shared/QuietZoneControl';
import ErrorCorrectionSelector from './shared/ErrorCorrectionSelector';
import ColorPicker from './shared/ColorPicker';
import ResponsivePreview from './shared/ResponsivePreview';

type TabId = 'content' | 'design' | 'logo' | 'settings' | 'scan' | 'export';

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: 'content', label: 'Content', icon: <Type className="h-4 w-4" /> },
  { id: 'design', label: 'Design', icon: <Palette className="h-4 w-4" /> },
  { id: 'logo', label: 'Logo', icon: <ImageIcon className="h-4 w-4" /> },
  { id: 'settings', label: 'Settings', icon: <Settings className="h-4 w-4" /> },
  { id: 'scan', label: 'Scan Test', icon: <ScanLine className="h-4 w-4" /> },
  { id: 'export', label: 'Export', icon: <Download className="h-4 w-4" /> },
];

const CONTENT_TYPE_CATEGORIES = [
  { id: 'popular', label: 'Popular' },
  { id: 'contact', label: 'Contact' },
  { id: 'network', label: 'Network' },
  { id: 'social', label: 'Social' },
  { id: 'crypto', label: 'Crypto' },
  { id: 'payment', label: 'Payment' },
  { id: 'app', label: 'Apps' },
  { id: 'other', label: 'Other' },
];

const CATEGORY_CONTENT_TYPES: Record<string, QRContentType[]> = {
  popular: ['url', 'text', 'wifi', 'vcard', 'email'],
  contact: ['phone', 'sms', 'whatsapp', 'telegram', 'vcard'],
  network: ['wifi', 'zoom', 'teams'],
  social: ['youtube', 'instagram', 'facebook', 'linkedin', 'tiktok', 'x', 'github', 'discord'],
  crypto: ['bitcoin', 'ethereum', 'litecoin', 'monero'],
  payment: ['paypal', 'upi', 'sepa'],
  app: ['app-store', 'google-play', 'steam', 'epic-games'],
  other: ['location', 'calendar', 'custom-uri'],
};

const DEFAULT_OPTIONS: QROptions = {
  content: '',
  moduleStyle: 'square',
  eyeStyle: 'classic',
  colors: {
    pattern: '#000000',
    eye: '#000000',
    background: '#ffffff',
  },
  background: {
    type: 'solid',
    value: '#ffffff',
  },
  quietZone: 4,
  errorCorrection: 'M',
};

interface QRStudioClientProps {
  standalone?: boolean;
}

export default function QRStudioClient({ standalone = true }: QRStudioClientProps) {
  const [activeTab, setActiveTab] = useState<TabId>('content');
  const [contentType, setContentType] = useState<QRContentType>('url');
  const [contentData, setContentData] = useState<Record<string, string>>({});
  const [options, setOptions] = useState<QROptions>(DEFAULT_OPTIONS);
  const [logo, setLogo] = useState<{ dataUrl: string; size: number } | undefined>(undefined);

  const allTypes = useMemo(() => getAllContentTypes(), []);
  const config = useMemo(() => getContentTypeConfig(contentType), [contentType]);

  const qrOptions: QROptions = useMemo(() => {
    const encodedContent = config?.encode
      ? config.encode(contentData)
      : (contentData.text || contentData.url || '');

    return {
      ...options,
      content: encodedContent,
      logo: logo,
    };
  }, [options, contentType, contentData, config, logo]);

  const contentLength = useMemo(
    () => qrOptions.content?.length || 0,
    [qrOptions.content]
  );

  const handleContentTypeChange = useCallback((type: QRContentType) => {
    setContentType(type);
    setContentData({});
    setActiveTab('content');
  }, []);

  const handleContentDataChange = useCallback((data: Record<string, string>) => {
    setContentData(data);
  }, []);

  const updateOption = useCallback(<K extends keyof QROptions>(key: K, value: QROptions[K]) => {
    setOptions((prev) => ({ ...prev, [key]: value }));
  }, []);

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full max-w-7xl mx-auto">
      {/* Left Column — Preview */}
      <div className="flex-1 flex flex-col items-center gap-4 lg:sticky lg:top-24 lg:self-start">
        <div className="w-full max-w-sm">
          <QRPreview options={qrOptions} size={280} />
        </div>

        {/* Quick info */}
        {qrOptions.content && (
          <div className="w-full max-w-sm space-y-2">
            <QRContrastCheck
              foreground={options.colors.pattern}
              background={options.colors.background}
            />
          </div>
        )}

        {activeTab === 'export' && (
          <div className="w-full max-w-sm mt-2">
            <ResponsivePreview options={qrOptions} />
          </div>
        )}
      </div>

      {/* Right Column — Controls */}
      <div className="w-full lg:w-[420px] flex-shrink-0">
        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl bg-muted/50 border border-border mb-4 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
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
          {/* Content Tab */}
          {activeTab === 'content' && (
            <div className="space-y-4">
              {/* Content type selector with categories */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block ml-1">
                  Content Type
                </label>
                <div className="space-y-3">
                  {CONTENT_TYPE_CATEGORIES.map((category) => {
                    const types = CATEGORY_CONTENT_TYPES[category.id] || [];
                    const available = types.filter((t) => allTypes.some((at) => at.id === t));
                    if (available.length === 0) return null;
                    return (
                      <div key={category.id}>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5 ml-1">
                          {category.label}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {available.map((typeId) => {
                            const typeCfg = getContentTypeConfig(typeId);
                            if (!typeCfg) return null;
                            const isActive = contentType === typeId;
                            return (
                              <button
                                key={typeId}
                                onClick={() => handleContentTypeChange(typeId)}
                                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium border transition-all ${
                                  isActive
                                    ? 'bg-primary/10 border-primary text-primary'
                                    : 'bg-background border-border text-muted-foreground hover:border-muted-foreground/30 hover:bg-muted/20'
                                }`}
                              >
                                {isActive && <Check className="h-3 w-3" />}
                                {typeCfg.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <p className="text-xs font-medium text-foreground mb-3 ml-1">
                  {config?.label || 'Content'}
                </p>
                <QRContentForm
                  contentType={contentType}
                  data={contentData}
                  onChange={handleContentDataChange}
                />
              </div>
            </div>
          )}

          {/* Design Tab */}
          {activeTab === 'design' && (
            <div className="space-y-5">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block">Module Style</label>
                <ModuleStyleSelector
                  value={options.moduleStyle}
                  onChange={(v) => updateOption('moduleStyle', v)}
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block">Eye Style</label>
                <EyeStyleSelector
                  value={options.eyeStyle}
                  onChange={(v) => updateOption('eyeStyle', v)}
                />
              </div>

              <div className="border-t border-border pt-4 space-y-4">
                <ColorPicker
                  label="Pattern Color"
                  value={options.colors.pattern}
                  onChange={(v) => setOptions((prev) => ({
                    ...prev,
                    colors: { ...prev.colors, pattern: v },
                  }))}
                />
                <ColorPicker
                  label="Eye Color"
                  value={options.colors.eye}
                  onChange={(v) => setOptions((prev) => ({
                    ...prev,
                    colors: { ...prev.colors, eye: v },
                  }))}
                />
                <ColorPicker
                  label="Background Color"
                  value={options.colors.background}
                  onChange={(v) => {
                    setOptions((prev) => ({
                      ...prev,
                      colors: { ...prev.colors, background: v },
                      background: { ...prev.background, value: v },
                    }));
                  }}
                  presetColors={['#ffffff', '#f8f9fa', '#e9ecef', '#dee2e6', '#ced4da', '#adb5bd', '#000000', '#1a1a2e']}
                />
              </div>
            </div>
          )}

          {/* Logo Tab */}
          {activeTab === 'logo' && (
            <div className="space-y-4">
              <LogoUploader
                logo={logo}
                onChange={setLogo}
                errorCorrection={options.errorCorrection}
              />
              {logo && (
                <div className="p-2.5 rounded-xl bg-muted/30 border border-border">
                  <p className="text-[11px] text-muted-foreground">
                    Logo reduces the readable area of the QR code. Use High (H) error correction for best results.
                    Recommended logo size: 15-30% of QR code area.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-5">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block">
                  Error Correction
                </label>
                <ErrorCorrectionSelector
                  value={options.errorCorrection}
                  onChange={(v) => updateOption('errorCorrection', v)}
                  hasLogo={!!logo}
                  contentLength={contentLength}
                />
              </div>

              <div className="border-t border-border pt-4">
                <QuietZoneControl
                  value={options.quietZone}
                  onChange={(v) => updateOption('quietZone', v)}
                />
              </div>

              <div className="border-t border-border pt-4">
                <div className="p-2.5 rounded-xl bg-muted/30 border border-border">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Content length</span>
                    <span className="font-mono text-foreground">{contentLength} chars</span>
                  </div>
                  <div className="flex items-center justify-between text-xs mt-1">
                    <span className="text-muted-foreground">QR Version</span>
                    <span className="font-mono text-foreground">
                      {contentLength > 0 ? `~${Math.ceil(contentLength / 100) + 1}` : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Scan Test Tab */}
          {activeTab === 'scan' && (
            <div>
              <QRScannerTest
                content={qrOptions.content}
                errorCorrection={options.errorCorrection}
                contentLength={contentLength}
              />
            </div>
          )}

          {/* Export Tab */}
          {activeTab === 'export' && (
            <div>
              <QRExportPanel
                options={qrOptions}
                filename={`qr-code-${contentType}`}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
