'use client';

import { useMemo, useState } from 'react';
import { Check, ChevronDown, Search } from 'lucide-react';
import { QR_CONTENT_TYPES } from '@/lib/qr/contentTypes';
import type { QRContentType } from '@/lib/qr/types';
import { useTranslations } from '@/lib/i18n';

interface QRTypePickerProps {
  value: QRContentType;
  onChange: (type: QRContentType) => void;
}

/** The six people arrive for, in the order they arrive for them. */
const QUICK: QRContentType[] = ['url', 'text', 'wifi', 'vcard', 'email', 'phone'];

/**
 * Categories, in the order a person looks for them. The key is the `category`
 * field the content types already carry, so a new type appears here the moment
 * it is defined — the previous hand-written map listed 33 of the 37 and quietly
 * lost skype, facetime, google-maps and gitlab, while listing wifi and vcard
 * twice.
 */
const CATEGORY_ORDER = [
  'url',
  'text',
  'contact',
  'network',
  'social',
  'location',
  'payment',
  'crypto',
  'app',
  'custom',
] as const;

/**
 * What kind of code you are making.
 *
 * ── Why this is a disclosure and not a grid ─────────────────────────────────
 *
 * It used to be thirty-three chips in eight labelled rows, stacked above the
 * form, and it pushed the field you actually type into 984 pixels down a
 * 950-pixel viewport. The first thing a visitor saw was a wall of options and
 * an empty preview, with no way to start; "I can't see where to enter the
 * data" is the correct reaction to that screen.
 *
 * So the studio opens on URL — what nearly everyone wants — with the field
 * right there, six common types one click away, and the other thirty-one
 * behind a search box that only opens when asked.
 */
export default function QRTypePicker({ value, onChange }: QRTypePickerProps) {
  const { t } = useTranslations();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const grouped = useMemo(() => {
    const byCategory = new Map<string, QRContentType[]>();
    for (const [id, config] of Object.entries(QR_CONTENT_TYPES)) {
      const list = byCategory.get(config.category) ?? [];
      list.push(id as QRContentType);
      byCategory.set(config.category, list);
    }

    const needle = query.trim().toLowerCase();
    return CATEGORY_ORDER.map((category) => ({
      category,
      types: (byCategory.get(category) ?? []).filter(
        (id) => !needle || QR_CONTENT_TYPES[id].label.toLowerCase().includes(needle),
      ),
    })).filter((group) => group.types.length > 0);
  }, [query]);

  const chip = (id: QRContentType, active: boolean) => (
    <button
      key={id}
      type="button"
      onClick={() => {
        onChange(id);
        setOpen(false);
        setQuery('');
      }}
      className={`flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-[0.6875rem] font-medium transition-colors ${
        active
          ? 'border-action bg-action-soft text-action'
          : 'border-border bg-background text-muted-foreground hover:border-muted-foreground/30 hover:bg-muted/20'
      }`}
    >
      {active && <Check className="size-3" />}
      {QR_CONTENT_TYPES[id].label}
    </button>
  );

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-1.5">
        {QUICK.map((id) => chip(id, value === id))}

        <button
          type="button"
          onClick={() => setOpen((previous) => !previous)}
          aria-expanded={open}
          className={`ml-auto flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-[0.6875rem] font-medium transition-colors ${
            open || !QUICK.includes(value)
              ? 'border-action bg-action-soft text-action'
              : 'border-border bg-background text-muted-foreground hover:border-muted-foreground/30'
          }`}
        >
          {QUICK.includes(value)
            ? t('qrStudio.type.more', { count: String(Object.keys(QR_CONTENT_TYPES).length) })
            : QR_CONTENT_TYPES[value].label}
          <ChevronDown className={`size-3 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {open && (
        <div className="space-y-3 rounded-xl border border-border bg-muted/20 p-3">
          <div className="relative">
            <Search className="absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={query}
              autoFocus
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t('qrStudio.type.search')}
              className="h-8 w-full rounded-lg border border-input bg-background pr-2.5 pl-8 text-xs text-foreground"
            />
          </div>

          {grouped.map((group) => (
            <div key={group.category}>
              <p className="mb-1.5 ml-1 text-[0.625rem] tracking-wider text-muted-foreground uppercase">
                {t(`qrStudio.type.category.${group.category}`)}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {group.types.map((id) => chip(id, value === id))}
              </div>
            </div>
          ))}

          {grouped.length === 0 && (
            <p className="py-2 text-center text-xs text-muted-foreground">
              {t('qrStudio.type.noMatch')}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
