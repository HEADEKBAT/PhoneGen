'use client';

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTranslations } from "@/lib/i18n";
import { CheckCircle, Globe, Zap, Users } from "lucide-react";

export default function About() {
  const { t } = useTranslations();

  const countries = [
    { flag: "🇳🇬", code: "NG" },
    { flag: "🇺🇸", code: "US" },
    { flag: "🇷🇺", code: "RU" },
    { flag: "🇩🇪", code: "DE" },
    { flag: "🇬🇧", code: "GB" },
    { flag: "🇫🇷", code: "FR" },
    { flag: "🇮🇹", code: "IT" },
    { flag: "🇪🇸", code: "ES" },
    { flag: "🇳🇱", code: "NL" },
    { flag: "🇨🇦", code: "CA" },
    { flag: "🇦🇺", code: "AU" },
    { flag: "🇯🇵", code: "JP" },
    { flag: "🇨🇳", code: "CN" },
    { flag: "🇮🇳", code: "IN" },
    { flag: "🇧🇷", code: "BR" },
    { flag: "🇲🇽", code: "MX" },
    { flag: "🇿🇦", code: "ZA" },
    { flag: "🇸🇬", code: "SG" },
    { flag: "🇰🇷", code: "KR" },
    { flag: "🇹🇭", code: "TH" },
    { flag: "🇲🇾", code: "MY" },
    { flag: "🇮🇩", code: "ID" },
    { flag: "🇵🇭", code: "PH" },
    { flag: "🇹🇷", code: "TR" },
    { flag: "🇸🇦", code: "SA" },
    { flag: "🇦🇪", code: "AE" },
    { flag: "🇩🇰", code: "DK" },
    { flag: "🇸🇪", code: "SE" },
    { flag: "🇳🇴", code: "NO" },
    { flag: "🇫🇮", code: "FI" },
    { flag: "🇧🇪", code: "BE" },
    { flag: "🇳🇿", code: "NZ" },
    { flag: "🇵🇹", code: "PT" },
  ];

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="bg-linear-to-br from-blue-50 to-indigo-50 border-b border-blue-100">
          <div className="container mx-auto px-4 py-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">{t("about.heroTitle")}</h1>
            <p className="text-xl text-gray-600">
              {t("about.heroDesc")}
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          {/* About Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">{t("about.whatTitle")}</h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-4">
              {t("about.whatDesc1")}
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              {t("about.whatDesc2")}
            </p>
          </section>

          {/* Features Section */}
          <section aria-labelledby="features-heading">
            <h2 id="features-heading" className="text-3xl font-bold text-gray-900 mb-8">{t("about.featuresTitle")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <article className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
                <Globe className="text-blue-600 mb-4" size={32} aria-hidden="true" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t("about.features_35plus_title")}</h3>
                <p className="text-gray-600">{t("about.features_35plus_desc")}</p>
              </article>

              <article className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
                <Zap className="text-yellow-600 mb-4" size={32} aria-hidden="true" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t("about.features_3formats_title")}</h3>
                <p className="text-gray-600">{t("about.features_3formats_desc")}</p>
              </article>

              <article className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
                <CheckCircle className="text-green-600 mb-4" size={32} aria-hidden="true" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t("about.features_valid_title")}</h3>
                <p className="text-gray-600">{t("about.features_valid_desc")}</p>
              </article>

              <article className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
                <Users className="text-purple-600 mb-4" size={32} aria-hidden="true" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t("about.features_free_title")}</h3>
                <p className="text-gray-600">{t("about.features_free_desc")}</p>
              </article>
            </div>
          </section>

          {/* Supported Countries Section */}
          <section aria-labelledby="countries-heading">
            <h2 id="countries-heading" className="text-3xl font-bold text-gray-900 mb-8">{t("about.countriesTitle")}</h2>
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <ul className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {countries.map((country) => (
                  <li key={country.code} className="text-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="text-3xl mb-2" aria-hidden="true">{country.flag}</div>
                    <div className="text-sm font-medium text-gray-900">{t("countries." + country.code)}</div>
                    <div className="text-xs text-gray-500">{country.code}</div>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Use Cases Section */}
          <section aria-labelledby="usecases-heading">
            <h2 id="usecases-heading" className="text-3xl font-bold text-gray-900 mb-8">{t("about.useCasesTitle")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <article className="bg-linear-to-br from-blue-50 to-blue-100 p-8 rounded-lg border border-blue-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{t("about.useCases_dev_title")}</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ {t("about.useCases_dev_1")}</li>
                  <li>✓ {t("about.useCases_dev_2")}</li>
                  <li>✓ {t("about.useCases_dev_3")}</li>
                  <li>✓ {t("about.useCases_dev_4")}</li>
                </ul>
              </article>

              <article className="bg-linear-to-br from-purple-50 to-purple-100 p-8 rounded-lg border border-purple-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{t("about.useCases_qa_title")}</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ {t("about.useCases_qa_1")}</li>
                  <li>✓ {t("about.useCases_qa_2")}</li>
                  <li>✓ {t("about.useCases_qa_3")}</li>
                  <li>✓ {t("about.useCases_qa_4")}</li>
                </ul>
              </article>

              <article className="bg-linear-to-br from-green-50 to-green-100 p-8 rounded-lg border border-green-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{t("about.useCases_analyst_title")}</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ {t("about.useCases_analyst_1")}</li>
                  <li>✓ {t("about.useCases_analyst_2")}</li>
                  <li>✓ {t("about.useCases_analyst_3")}</li>
                  <li>✓ {t("about.useCases_analyst_4")}</li>
                </ul>
              </article>

              <article className="bg-linear-to-br from-orange-50 to-orange-100 p-8 rounded-lg border border-orange-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{t("about.useCases_edu_title")}</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ {t("about.useCases_edu_1")}</li>
                  <li>✓ {t("about.useCases_edu_2")}</li>
                  <li>✓ {t("about.useCases_edu_3")}</li>
                  <li>✓ {t("about.useCases_edu_4")}</li>
                </ul>
              </article>
            </div>
          </section>

          {/* FAQ Section */}
          <section aria-labelledby="faq-heading">
            <h2 id="faq-heading" className="text-3xl font-bold text-gray-900 mb-8">{t("about.faqTitle")}</h2>
            <div className="space-y-4">
              <details className="bg-white p-6 rounded-lg border border-gray-200 group">
                <summary className="text-lg font-semibold text-gray-900 cursor-pointer list-none flex items-center justify-between">
                  <span>{t("about.faq_q1")}</span>
                  <span className="transform transition-transform group-open:rotate-180" aria-hidden="true">▼</span>
                </summary>
                <p className="text-gray-600 mt-3">{t("about.faq_a1")}</p>
              </details>

              <details className="bg-white p-6 rounded-lg border border-gray-200 group">
                <summary className="text-lg font-semibold text-gray-900 cursor-pointer list-none flex items-center justify-between">
                  <span>{t("about.faq_q2")}</span>
                  <span className="transform transition-transform group-open:rotate-180" aria-hidden="true">▼</span>
                </summary>
                <p className="text-gray-600 mt-3">{t("about.faq_a2")}</p>
              </details>

              <details className="bg-white p-6 rounded-lg border border-gray-200 group">
                <summary className="text-lg font-semibold text-gray-900 cursor-pointer list-none flex items-center justify-between">
                  <span>{t("about.faq_q3")}</span>
                  <span className="transform transition-transform group-open:rotate-180" aria-hidden="true">▼</span>
                </summary>
                <p className="text-gray-600 mt-3">{t("about.faq_a3")}</p>
              </details>

              <details className="bg-white p-6 rounded-lg border border-gray-200 group">
                <summary className="text-lg font-semibold text-gray-900 cursor-pointer list-none flex items-center justify-between">
                  <span>{t("about.faq_q4")}</span>
                  <span className="transform transition-transform group-open:rotate-180" aria-hidden="true">▼</span>
                </summary>
                <p className="text-gray-600 mt-3">{t("about.faq_a4")}</p>
              </details>
            </div>
          </section>

          {/* CTA Section */}
          <section aria-label={t("about.ctaTitle")} className="bg-linear-to-r from-blue-600 to-indigo-600 rounded-lg p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">{t("about.ctaTitle")}</h2>
            <p className="text-xl mb-8 opacity-90">
              {t("about.ctaDesc")}
            </p>
            <a
              href="/"
              className="inline-block bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {t("about.ctaButton")}
            </a>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
