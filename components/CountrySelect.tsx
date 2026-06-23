'use client';

import { Search, ChevronDown, Star } from 'lucide-react';
import { useState, useMemo, useRef, useEffect } from 'react';
import { COUNTRIES } from '@/lib/phoneGenerator';
import { useFavoritesStore } from '@/lib/store';
import { useTranslations } from '@/lib/i18n';
import Flag from 'react-world-flags';

interface CountrySelectProps {
  selectedCountry: string;
  onSelectCountry: (code: string) => void;
}

export default function CountrySelect({ selectedCountry, onSelectCountry }: CountrySelectProps) {
  const { t } = useTranslations();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const { favorites, toggleFavorite, isFavorite } = useFavoritesStore();

  const sortedCountries = useMemo(() => {
    const all = Object.values(COUNTRIES).sort((a, b) => a.name.localeCompare(b.name));
    // Sort: favorites first, then alphabetically
    return all.sort((a, b) => {
      const aFav = isFavorite(a.code) ? 0 : 1;
      const bFav = isFavorite(b.code) ? 0 : 1;
      if (aFav !== bFav) return aFav - bFav;
      return a.name.localeCompare(b.name);
    });
  }, [isFavorite]);

  const filteredCountries = useMemo(() => {
    if (!search) return sortedCountries;
    const q = search.toLowerCase();
    return sortedCountries.filter((c) => {
      const name = t('countries.' + c.code).toLowerCase();
      return name.includes(q) || c.code.toLowerCase().includes(q);
    });
  }, [sortedCountries, search, t]);

  const selected = COUNTRIES[selectedCountry];

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
      setHighlightedIndex(-1);
    }
  }, [open]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll('[data-index]');
      const item = items[highlightedIndex] as HTMLElement;
      if (item) {
        item.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === 'Enter' || e.key === 'ArrowDown') {
        setOpen(true);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredCountries.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredCountries.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredCountries.length) {
          onSelectCountry(filteredCountries[highlightedIndex].code);
          setOpen(false);
          setSearch('');
        }
        break;
      case 'Escape':
        setOpen(false);
        setSearch('');
        break;
    }
  };

  const getCountryCode = (code: string) => {
    const codeMap: Record<string, string> = { UK: 'GB', US: 'US' };
    return codeMap[code] || code;
  };

  return (
    <div ref={containerRef} className="relative w-full" onKeyDown={handleKeyDown}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="w-full h-12 flex items-center gap-3 px-4 rounded-xl border border-input bg-card hover:bg-muted/50 transition-colors text-left cursor-pointer"
      >
        {selected && (
          <>
            <Flag
              code={getCountryCode(selected.code)}
              style={{ width: '24px', height: '18px', borderRadius: '2px', objectFit: 'cover' }}
              title={t('countries.' + selected.code)}
            />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-foreground truncate">
                {t('countries.' + selected.code)}
              </div>
              <div className="text-xs text-muted-foreground">
                {selected.countryCode} · {selected.code}
              </div>
            </div>
          </>
        )}
        <ChevronDown
          size={16}
          className={`text-muted-foreground transition-transform shrink-0 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 rounded-xl border border-border bg-card shadow-dropdown overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Search */}
          <div className="relative p-2 border-b border-border">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              placeholder={t('sidebar.searchPlaceholder')}
              value={search}
              onChange={(e) => { setSearch(e.target.value); setHighlightedIndex(0); }}
              className="w-full h-10 pl-8 pr-3 rounded-lg bg-muted text-foreground text-sm placeholder:text-muted-foreground border-none outline-none ring-1 ring-transparent focus:ring-ring"
              role="combobox"
              aria-expanded
              aria-autocomplete="list"
            />
          </div>

          {/* Country List */}
          <div
            ref={listRef}
            role="listbox"
            className="max-h-64 overflow-y-auto no-scrollbar p-1"
          >
            {filteredCountries.length === 0 ? (
              <div className="px-3 py-8 text-center text-sm text-muted-foreground">
                {t('sidebar.searchPlaceholder')}
              </div>
            ) : (
              filteredCountries.map((country, i) => {
                const isSelected = selectedCountry === country.code;
                const fav = isFavorite(country.code);
                return (
                  <div
                    key={country.code}
                    data-index={i}
                    role="option"
                    aria-selected={isSelected}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-primary/10 text-foreground'
                        : highlightedIndex === i
                          ? 'bg-muted text-foreground'
                          : 'text-foreground hover:bg-muted'
                    }`}
                    onClick={() => { onSelectCountry(country.code); setOpen(false); setSearch(''); }}
                    onMouseEnter={() => setHighlightedIndex(i)}
                  >
                    <Flag
                      code={getCountryCode(country.code)}
                      style={{ width: '22px', height: '16px', borderRadius: '2px', objectFit: 'cover', flexShrink: 0 }}
                      title={t('countries.' + country.code)}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{t('countries.' + country.code)}</div>
                      <div className="text-xs text-muted-foreground">{country.countryCode} · {country.code}</div>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(country.code); }}
                      aria-label={fav ? t('sidebar.removeFromFavorites') : t('sidebar.addToFavorites')}
                      className="flex-shrink-0 p-1 rounded-md hover:bg-background/50 transition-colors cursor-pointer"
                    >
                      <Star
                        size={14}
                        className={fav ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground'}
                      />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="px-3 py-2 border-t border-border text-xs text-muted-foreground text-center">
            {filteredCountries.length} {filteredCountries.length === 1 ? 'country' : 'countries'}
          </div>
        </div>
      )}
    </div>
  );
}
