'use client';

import { Languages, Check } from 'lucide-react';
import { Button } from './ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations, SUPPORTED_LANGUAGES, LANGUAGES } from '@/lib/i18n';
import { useLanguageStore } from '@/lib/store';
import { useState, useRef, useEffect } from 'react';
import type { SupportedLanguage } from '@/lib/i18n';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  const { t, language } = useTranslations();
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
    setLangOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-xl supports-backdrop-filter:bg-background/60">
      <div className="mx-auto max-w-4xl px-4 lg:px-6">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo + Title */}
          <Link
            href="/"
            aria-label={t('header.ariaLabel')}
            className="flex items-center gap-3 shrink-0"
          >
            <div className="relative size-9  overflow-hidden  ">
              <Image
                src="/logo.png"
                alt="PhoneGen"
                width={36}
                height={36}
                className="object-cover"
                priority
              />
            </div>
            <span className="font-heading text-xl font-bold tracking-tight hidden sm:inline">
              <span className="text-primary">Phone</span><span className="text-accent">Gen</span>
            </span>
          </Link>

          {/* Navigation */}
          <nav aria-label={t('header.navLabel')} className="hidden sm:flex items-center gap-1">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-sm">
                {t('nav.home')}
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="ghost" size="sm" className="text-sm">
                {t('nav.about')}
              </Button>
            </Link>
          </nav>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Language Selector */}
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
          </div>
        </div>
      </div>
    </header>
  );
}
