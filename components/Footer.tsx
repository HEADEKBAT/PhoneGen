'use client';

import { Phone } from "lucide-react";
import Link from "next/link";
import { useTranslations, LANGUAGES, SUPPORTED_LANGUAGES } from "@/lib/i18n";
import { useLanguageStore } from "@/lib/store";
import type { SupportedLanguage } from "@/lib/i18n";

export default function Footer() {
  const { t, language } = useTranslations();
  const setLanguage = useLanguageStore((state) => state.setLanguage);

  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="container mx-auto px-4 py-12">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-gray-800">
          {/* Logo & Description */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Phone size={20} className="text-white" />
              </div>
              <span className="text-xl font-bold text-white">PhoneGen</span>
            </div>
            <p className="text-sm text-gray-400">
              {t("footer.description")}
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-white mb-4" id="footer-links">{t("footer.links")}</h4>
            <nav aria-labelledby="footer-links">
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/" className="hover:text-white transition-colors">
                    {t("nav.home")}
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    {t("nav.about")}
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    {t("nav.contacts")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    {t("nav.privacy")}
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          {/* Languages */}
          <div>
            <h4 className="font-semibold text-white mb-4" id="footer-languages">{t("footer.languages")}</h4>
            <nav aria-labelledby="footer-languages">
              <ul className="space-y-2 text-sm">
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <li key={lang}>
                    {language === lang ? (
                      <span className="text-gray-300">{LANGUAGES[lang].name}</span>
                    ) : (
                      <button
                        onClick={() => setLanguage(lang as SupportedLanguage)}
                        className="hover:text-white transition-colors bg-transparent border-none cursor-pointer p-0 text-sm"
                        lang={lang}
                      >
                        {LANGUAGES[lang].name}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Follow */}
          <div>
            <h4 className="font-semibold text-white mb-4" id="footer-follow">{t("footer.followUs")}</h4>
            <a
              href="https://github.com"
              aria-label={t("footer.githubLabel")}
              className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.002 12.002 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>GitHub</span>
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 text-center text-sm text-gray-400">
          <p>{t("footer.copyright", { year: "2024" })}</p>
        </div>
      </div>
    </footer>
  );
}
