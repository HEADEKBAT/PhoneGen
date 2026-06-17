'use client';

import { Languages, Phone, Check } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { useTranslations, SUPPORTED_LANGUAGES, LANGUAGES } from "@/lib/i18n";
import { useLanguageStore } from "@/lib/store";
import { useState, useRef, useEffect } from "react";
import type { SupportedLanguage } from "@/lib/i18n";

export default function Header() {
  const { t, language } = useTranslations();
  const setLanguage = useLanguageStore((state) => state.setLanguage);
  const [langOpen, setLangOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    if (!langOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [langOpen]);

  const handleLangChange = (lang: SupportedLanguage) => {
    setLanguage(lang);
    setLangOpen(false);
  };

  return (
    <header className="border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" aria-label={t("header.ariaLabel")} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="bg-blue-600 text-white p-2 rounded-lg" aria-hidden="true">
              <Phone size={24} />
            </div>
            <span className="text-2xl font-bold">PhoneGen</span>
          </Link>

          {/* Navigation */}
          <nav aria-label={t("header.navLabel")}>
            <div className="flex gap-2">
              <Link href="/" aria-current="page">
                <Button variant="ghost">{t("nav.home")}</Button>
              </Link>
              <Link href="/about">
                <Button variant="ghost">{t("nav.about")}</Button>
              </Link>
            </div>
          </nav>

          {/* Language selector */}
          <div className="relative" ref={menuRef}>
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => setLangOpen(!langOpen)}
              aria-expanded={langOpen}
              aria-haspopup="listbox"
            >
              <Languages size={18} />
              {LANGUAGES[language].name}
            </Button>

            {langOpen && (
              <div
                role="listbox"
                aria-label={t("footer.languages")}
                className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[180px] overflow-hidden"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang}
                    role="option"
                    aria-selected={language === lang}
                    onClick={() => handleLangChange(lang)}
                    className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${
                      language === lang
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <span className="text-lg">{LANGUAGES[lang].flag}</span>
                    <span className="flex-1">{LANGUAGES[lang].name}</span>
                    {language === lang && (
                      <Check size={16} className="text-blue-600" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
