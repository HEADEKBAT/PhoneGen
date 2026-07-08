'use client';

import { Languages, Check } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useTranslations, SUPPORTED_LANGUAGES, LANGUAGES } from '@/lib/i18n';
import { useLanguageStore } from '@/lib/store';
import type { SupportedLanguage } from '@/lib/i18n';

const KNOWN_LOCALES = new Set(SUPPORTED_LANGUAGES);

/**
 * Language switcher — detects current locale from the URL and
 * switches to the selected locale preserving the current route.
 *
 * Extracted from the original Header.tsx for reuse across the platform.
 */
export default function LanguageSwitcher() {
  const { t, language } = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const setLanguage = useLanguageStore((state) => state.setLanguage);
  const [langOpen, setLangOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!langOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [langOpen]);

  const handleLangChange = (lang: SupportedLanguage) => {
    setLanguage(lang);
    try {
      localStorage.setItem('language', lang);
      document.cookie = `language=${lang};path=/;max-age=${365 * 24 * 60 * 60}`;
    } catch {
      /* noop */
    }
    setLangOpen(false);

    const segments = pathname.split('/').filter(Boolean);

    if (segments.length > 0 && KNOWN_LOCALES.has(segments[0] as SupportedLanguage)) {
      segments[0] = lang;
      router.push('/' + segments.join('/'));
    } else {
      router.push(`/${lang}${pathname === '/' ? '' : pathname}`);
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <Button
        variant="ghost"
        size="sm"
        className="gap-1.5 text-muted-foreground hover:text-foreground"
        onClick={() => setLangOpen(!langOpen)}
        aria-expanded={langOpen}
        aria-haspopup="listbox"
      >
        <Languages size={16} />
        <span className="text-sm hidden xs:inline">{LANGUAGES[language].flag}</span>
      </Button>

      {langOpen && (
        <div
          role="listbox"
          aria-label={t('footer.languages')}
          className="absolute right-0 top-full mt-2 min-w-40 rounded-xl border border-border bg-card shadow-dropdown overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150"
        >
          {SUPPORTED_LANGUAGES.map((lang) => (
            <button
              key={lang}
              role="option"
              aria-selected={language === lang}
              onClick={() => handleLangChange(lang)}
              className={`w-full text-left px-4 py-2.5 flex items-center gap-3 text-sm transition-colors ${
                language === lang
                  ? 'bg-primary/10 text-foreground font-medium'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <span className="text-base">{LANGUAGES[lang].flag}</span>
              <span className="flex-1">{LANGUAGES[lang].name}</span>
              {language === lang && <Check size={14} className="text-primary" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
