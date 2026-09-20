'use client';

import { useState, useCallback, useMemo } from 'react';
import type { QRContentType, QROptions } from '@/lib/qr/types';
import { encodeContent, getContentTypeConfig } from '@/lib/qr/contentTypes';
import { Type, Palette, Image as ImageIcon, Settings, ShieldCheck, Download } from 'lucide-react';
import { useTranslations } from '@/lib/i18n';
import { effectiveErrorCorrection } from '@/lib/qr/readiness';
import QRPreview from './shared/QRPreview';
import QRContentForm from './shared/QRContentForm';
import QRTypePicker from './shared/QRTypePicker';
import QRExportPanel from './shared/QRExportPanel';
import QRReadiness from './shared/QRReadiness';
import ModuleStyleSelector from './shared/ModuleStyleSelector';
import EyeStyleSelector from './shared/EyeStyleSelector';
import LogoUploader from './shared/LogoUploader';
import QuietZoneControl from './shared/QuietZoneControl';
import ErrorCorrectionSelector from './shared/ErrorCorrectionSelector';
import ColorPicker from './shared/ColorPicker';
import ResponsivePreview from './shared/ResponsivePreview';

type TabId = 'content' | 'design' | 'logo' | 'settings' | 'check' | 'export';

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: 'content', label: 'Content', icon: <Type className="h-4 w-4" /> },
  { id: 'design', label: 'Design', icon: <Palette className="h-4 w-4" /> },
  { id: 'logo', label: 'Logo', icon: <ImageIcon className="h-4 w-4" /> },
  { id: 'settings', label: 'Settings', icon: <Settings className="h-4 w-4" /> },
  { id: 'check', label: 'Check', icon: <ShieldCheck className="h-4 w-4" /> },
  { id: 'export', label: 'Export', icon: <Download className="h-4 w-4" /> },
];

/*
 * The hand-written category map that stood here is gone. It listed 33 of the
 * 37 content types — skype, facetime, google-maps and gitlab appeared in no
 * category and could not be selected at all — and listed wifi and vcard twice,
 * so they rendered as duplicate chips. QRTypePicker groups by the `category`
 * field the types already carry, which cannot go out of date.
 */

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
  const { t } = useTranslations();
  const [activeTab, setActiveTab] = useState<TabId>('content');
  const [contentType, setContentType] = useState<QRContentType>('url');
  const [contentData, setContentData] = useState<Record<string, string>>({});
  const [options, setOptions] = useState<QROptions>(DEFAULT_OPTIONS);
  const [logo, setLogo] = useState<{ dataUrl: string; size: number } | undefined>(undefined);

  const config = useMemo(() => getContentTypeConfig(contentType), [contentType]);

  const qrOptions: QROptions = useMemo(() => {
    /* `encodeContent` never throws. It used to call `config.encode` straight,
       inside this memo, during render — and eighteen of the thirty-seven
       encoders dereference a field that is undefined until someone types in
       it, so selecting one of those types threw and the error boundary
       replaced the whole studio with a blank page. */
    const encodedContent = encodeContent(contentType, contentData);

    return {
      ...options,
      content: encodedContent,
      logo: logo,
    };
  }, [options, contentType, contentData, config, logo]);

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

        {/* One verdict, in one place. A contrast card used to sit here and
            the preview drew the same verdict again inside itself, both from
            the same WCAG ratio, which could not see the things that actually
            stop a code scanning. */}
        {qrOptions.content && (
          <div className="w-full max-w-sm">
            <QRReadiness options={qrOptions} />
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
              {/*
                The form first, the type picker above it as one compact row.
                What stood here was a grid of thirty-three chips in eight
                labelled rows, and it pushed the field you type into to 984
                pixels down a 950-pixel viewport: the studio opened on a wall
                of options, an empty preview and nowhere to start.
              */}
              <QRTypePicker value={contentType} onChange={handleContentTypeChange} />

              <div className="border-t border-border pt-4">
                <p className="mb-3 ml-1 text-xs font-medium text-foreground">
                  {config?.label || t('qrStudio.type.content')}
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
                /* The level the symbol is built at, not the one the user
                   picked: a logo forces H, and the budget shown here has to
                   be the budget that applies. */
                errorCorrection={effectiveErrorCorrection(qrOptions)}
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
                />
              </div>

              <div className="border-t border-border pt-4">
                <QuietZoneControl
                  value={options.quietZone}
                  onChange={(v) => updateOption('quietZone', v)}
                />
              </div>

              {/* A "QR Version" readout used to sit here, computed as
                  `ceil(length / 100) + 1` — a number with no relationship to
                  anything, contradicting the other estimate on the Scan tab,
                  and both contradicting the symbol the library encoded. The
                  real version is on the Check panel, read off that symbol. */}
            </div>
          )}

          {activeTab === 'check' && <QRReadiness options={qrOptions} />}

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
