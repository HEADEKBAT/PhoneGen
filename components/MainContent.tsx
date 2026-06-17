'use client';

import { ChevronRight } from "lucide-react";
import GeneratorControls from "./GeneratorControls";
import PhoneList from "./PhoneList";
import InfoCard from "./InfoCard";
import { COUNTRIES, generatePhoneNumbers, PhoneFormat } from "@/lib/phoneGenerator";
import { useState, useEffect } from "react";
import { useTranslations } from "@/lib/i18n";
import Flag from "react-world-flags";

export default function MainContent({
  selectedCountry,
}: {
  selectedCountry: string;
}) {
  const { t } = useTranslations();
  const country = COUNTRIES[selectedCountry] || COUNTRIES["NG"];
  const [quantity, setQuantity] = useState(10);
  const [format, setFormat] = useState<PhoneFormat>("international");
  const [phones, setPhones] = useState<string[]>([]);

  useEffect(() => {
    try {
      const generated = generatePhoneNumbers(selectedCountry, quantity, format);
      setPhones(generated);
    } catch (error) {
      console.error("Error generating phone numbers:", error);
    }
  }, [selectedCountry, quantity, format]);

  return (
    <main className="flex-1">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-3 text-sm text-gray-600">
            <li>
              <a href="/" className="hover:text-gray-900 transition-colors">
                {t("mainContent.breadcrumbHome")}
              </a>
            </li>
            <li aria-hidden="true">
              <ChevronRight size={16} />
            </li>
            <li>
              <span className="text-gray-400" aria-current="page">
                {t("countries." + country.code)}
              </span>
            </li>
          </ol>
        </nav>

        {/* Header Section */}
        <section aria-labelledby="country-heading">
          <div className="flex items-center gap-4">
            <Flag
              code={country.code}
              style={{
                width: "48px",
                height: "36px",
                borderRadius: "4px",
                objectFit: "cover",
              }}
              title={t("countries." + country.code)}
            />
            <div>
              <h1 id="country-heading" className="text-4xl font-bold text-gray-900">
                {t("mainContent.heading", { country: t("countries." + country.code) })}
              </h1>
              <p className="text-gray-600 mt-1">
                {t("mainContent.subtitle", { code: country.code, country: t("countries." + country.code) })}
              </p>
            </div>
          </div>
        </section>

        {/* Controls */}
        <GeneratorControls
          onQuantityChange={setQuantity}
          onFormatChange={setFormat}
        />

        {/* Phone List */}
        <PhoneList phones={phones} />

        {/* Info Card */}
        <InfoCard countryCode={selectedCountry} />
      </div>
    </main>
  );
}
