'use client';

import { ChevronRight, Globe, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import GeneratorControls from "./GeneratorControls";
import PhoneList from "./PhoneList";
import InfoCard from "./InfoCard";
import { COUNTRIES, generatePhoneNumbers, PhoneFormat } from "@/lib/phoneGenerator";
import { useState, useEffect, useMemo } from "react";
import { useTranslations } from "@/lib/i18n";
import Flag from "react-world-flags";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { useCountryStore, useRecentlyUsedStore } from "@/lib/store";

export default function MainContent({
  selectedCountry,
  onSelectCountry,
  initialCount,
  initialFormat,
}: {
  selectedCountry: string;
  onSelectCountry: (code: string) => void;
  initialCount?: number | null;
  initialFormat?: PhoneFormat | null;
}) {
  const { t } = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const addRecentlyUsed = useRecentlyUsedStore((state) => state.addRecentlyUsed);
  const country = COUNTRIES[selectedCountry] || COUNTRIES["NG"];
  const [quantity, setQuantity] = useState(initialCount || 10);
  const [format, setFormat] = useState<PhoneFormat>(initialFormat || "international");
  const [seed, setSeed] = useState("");
  const [phones, setPhones] = useState<string[]>([]);
  const [mobileDialogOpen, setMobileDialogOpen] = useState(false);
  const [mobileSearch, setMobileSearch] = useState("");
  const setStoredCountry = useCountryStore((state) => state.setSelectedCountry);

  useEffect(() => {
    try {
      const generated = generatePhoneNumbers(selectedCountry, quantity, format, seed || undefined);
      setPhones(generated);
    } catch (error) {
      console.error("Error generating phone numbers:", error);
    }
  }, [selectedCountry, quantity, format, seed]);

  // Track recently used countries
  useEffect(() => {
    addRecentlyUsed(selectedCountry);
  }, [selectedCountry, addRecentlyUsed]);

  // Sync count & format to URL params (avoid loops by checking current values)
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    let changed = false;
    const countStr = String(quantity);
    if (quantity !== 10) {
      if (params.get("count") !== countStr) {
        params.set("count", countStr);
        changed = true;
      }
    } else if (params.has("count")) {
      params.delete("count");
      changed = true;
    }
    if (format !== "international") {
      if (params.get("format") !== format) {
        params.set("format", format);
        changed = true;
      }
    } else if (params.has("format")) {
      params.delete("format");
      changed = true;
    }
    if (changed) {
      router.replace(`/?${params.toString()}`);
    }
  }, [quantity, format, searchParams, router]);

  const countriesList = useMemo(
    () => Object.values(COUNTRIES).sort((a, b) => a.name.localeCompare(b.name)),
    []
  );

  const filteredMobileCountries = useMemo(
    () =>
      countriesList.filter((country) => {
        const translatedName = t("countries." + country.code);
        return (
          translatedName.toLowerCase().includes(mobileSearch.toLowerCase()) ||
          country.code.toLowerCase().includes(mobileSearch.toLowerCase())
        );
      }),
    [countriesList, mobileSearch, t]
  );

  const handleMobileCountrySelect = (code: string) => {
    onSelectCountry(code);
    setStoredCountry(code);
    setMobileDialogOpen(false);
    setMobileSearch("");
  };

  const getCountryCode = (code: string) => {
    const codeMap: Record<string, string> = {
      UK: "GB",
      US: "US",
    };
    return codeMap[code] || code;
  };

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
              code={getCountryCode(country.code)}
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

        {/* Mobile Country Selector */}
        <div className="md:hidden">
          <Dialog open={mobileDialogOpen} onOpenChange={setMobileDialogOpen}>
            <button
              onClick={() => setMobileDialogOpen(true)}
              className="w-full flex items-center gap-3 px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Globe size={20} className="text-gray-400" />
              <span className="font-medium">{t("countries." + country.code)}</span>
              <span className="text-sm text-gray-400 ml-auto">{country.code}</span>
            </button>

            <DialogContent className="max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{t("sidebar.dialogTitle")}</DialogTitle>
              </DialogHeader>

              <div className="relative mb-4">
                <Search className="absolute left-3 top-3 text-gray-400" size={18} aria-hidden="true" />
                <input
                  type="text"
                  placeholder={t("sidebar.searchPlaceholder")}
                  value={mobileSearch}
                  onChange={(e) => setMobileSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              </div>

              <ul className="grid grid-cols-2 gap-2 max-h-[60vh] overflow-y-auto" role="listbox">
                {filteredMobileCountries.map((country) => (
                  <li key={country.code} role="none">
                    <button
                      role="option"
                      aria-selected={selectedCountry === country.code}
                      onClick={() => handleMobileCountrySelect(country.code)}
                      className={`text-left px-4 py-3 rounded-lg flex items-center gap-2 transition-colors border w-full ${
                        selectedCountry === country.code
                          ? "bg-blue-100 border-blue-500 text-blue-900"
                          : "border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      <Flag
                        code={getCountryCode(country.code)}
                        style={{
                          width: "24px",
                          height: "24px",
                          borderRadius: "2px",
                        }}
                        title={t("countries." + country.code)}
                      />
                      <div className="flex w-full items-center gap-1">
                        <div className="text-sm font-medium">{country.code}</div>
                        <div className="text-sm opacity-75 max-w-30 truncate">
                          {t("countries." + country.code)}
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </DialogContent>
          </Dialog>
        </div>

        {/* Controls */}
        <GeneratorControls
          onQuantityChange={setQuantity}
          onFormatChange={setFormat}
          onSeedChange={setSeed}
        />

        {/* Phone List */}
        <PhoneList phones={phones} />

        {/* Info Card */}
        <InfoCard countryCode={selectedCountry} />
      </div>
    </main>
  );
}
