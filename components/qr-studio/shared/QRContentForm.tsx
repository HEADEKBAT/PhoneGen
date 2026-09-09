'use client';

import { Suspense, lazy, useMemo } from 'react';
import type { QRContentType } from '@/lib/qr/types';
import { getContentTypeConfig } from '@/lib/qr/contentTypes';
import { Loader2 } from 'lucide-react';

const CONTENT_TYPE_FORMS: Record<string, React.LazyExoticComponent<React.ComponentType<any>>> = {
  url: lazy(() => import('@/components/qr-studio/content-forms/URLForm')),
  text: lazy(() => import('@/components/qr-studio/content-forms/TextForm')),
  email: lazy(() => import('@/components/qr-studio/content-forms/EmailForm')),
  phone: lazy(() => import('@/components/qr-studio/content-forms/PhoneForm')),
  sms: lazy(() => import('@/components/qr-studio/content-forms/SMSForm')),
  whatsapp: lazy(() => import('@/components/qr-studio/content-forms/WhatsAppForm')),
  wifi: lazy(() => import('@/components/qr-studio/content-forms/WiFiForm')),
  vcard: lazy(() => import('@/components/qr-studio/content-forms/VCardForm')),
};

interface QRContentFormProps {
  contentType: string;
  data: Record<string, string>;
  onChange: (data: Record<string, string>) => void;
}

function GenericForm({ fields, data, onChange }: { fields: any[]; data: Record<string, string>; onChange: (d: Record<string, string>) => void }) {
  const update = (id: string, value: string) => onChange({ ...data, [id]: value });

  return (
    <div className="space-y-3">
      {fields.map((field) => (
        <div key={field.id}>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block ml-1">
            {field.label}
            {field.required && <span className="text-destructive ml-0.5">*</span>}
          </label>
          {field.type === 'textarea' ? (
            <textarea
              className="w-full h-20 rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
              placeholder={field.placeholder || ''}
              value={data[field.id] || ''}
              onChange={(e) => update(field.id, e.target.value)}
            />
          ) : field.type === 'select' && field.options ? (
            <select
              className="w-full h-8 rounded-lg border border-input bg-background px-2.5 py-1 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              value={data[field.id] || field.defaultValue || ''}
              onChange={(e) => update(field.id, e.target.value)}
            >
              {field.options.map((opt: any) => (
                <option key={typeof opt === 'string' ? opt : opt.value} value={typeof opt === 'string' ? opt : opt.value}>
                  {typeof opt === 'string' ? opt : opt.label}
                </option>
              ))}
            </select>
          ) : field.type === 'switch' ? (
            <label className="flex items-center gap-2 h-9 px-3 rounded-lg border border-border bg-background cursor-pointer hover:bg-muted/30 transition-colors">
              <input
                type="checkbox"
                className="rounded border-border accent-primary"
                checked={data[field.id] === 'true'}
                onChange={(e) => update(field.id, e.target.checked ? 'true' : 'false')}
              />
              <span className="text-xs text-muted-foreground">{field.placeholder || field.label}</span>
            </label>
          ) : (
            <input
              type={field.type || 'text'}
              className="w-full h-8 rounded-lg border border-input bg-background px-2.5 py-1 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              placeholder={field.placeholder || ''}
              value={data[field.id] || ''}
              onChange={(e) => update(field.id, e.target.value)}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default function QRContentForm({ contentType, data, onChange }: QRContentFormProps) {
  const FormComponent = CONTENT_TYPE_FORMS[contentType];
  const config = getContentTypeConfig(contentType as QRContentType);

  if (FormComponent) {
    return (
      <Suspense fallback={<div className="flex items-center justify-center py-8"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>}>
        <FormComponent data={data} onChange={onChange} />
      </Suspense>
    );
  }

  if (config?.fields && config.fields.length > 0) {
    return <GenericForm fields={config.fields} data={data} onChange={onChange} />;
  }

  return (
    <div className="text-center py-4 text-muted-foreground">
      <p className="text-xs">No configuration available for this content type</p>
    </div>
  );
}
