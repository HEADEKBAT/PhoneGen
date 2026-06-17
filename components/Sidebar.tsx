'use client';

import { Search, Globe } from "lucide-react";
import { useState, useMemo } from "react";
import { COUNTRIES } from "@/lib/phoneGenerator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { useCountryStore } from "@/lib/store";
import { useTranslations } from "@/lib/i18n";
import Flag from 'react-world-flags'

export default function Sidebar({
  selectedCountry,
  onSelectCountry,
}: {
  selectedCountry: string;
  onSelectCountry: (code: string) => void;
}) {
  const { t } = useTranslations();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const setStoredCountry = useCountryStore((state) => state.setSelectedCountry);

  const countriesList = useMemo(
    () => Object.values(COUNTRIES).sort((a, b) => a.name.localeCompare(b.name)),
    []
  );

  // Top 5 countries + selected country
  const topCountries = useMemo(() => countriesList.slice(0, 5), [countriesList]);
  const displayedCountries = useMemo(
    () =>
      selectedCountry && !topCountries.find((c) => c.code === selectedCountry)
        ? [...topCountries, COUNTRIES[selectedCountry]]
        : topCountries,
    [countriesList, topCountries, selectedCountry]
  );

  const filteredCountries = useMemo(
    () =>
      countriesList.filter((country) => {
        const translatedName = t("countries." + country.code);
        return (
          translatedName.toLowerCase().includes(search.toLowerCase()) ||
          country.code.toLowerCase().includes(search.toLowerCase())
        );
      }),
    [countriesList, search, t]
  );

  const handleSelectCountry = (code: string) => {
    onSelectCountry(code);
    setStoredCountry(code);
    setDialogOpen(false);
    setSearch("");
  };

  const getCountryCode = (code: string) => {
    const codeMap: Record<string, string> = {
      UK: "GB",
      US: "US",
    };
    return codeMap[code] || code;
  };

  return (
    <aside aria-label={t("sidebar.ariaLabel")} className="w-64 border-r border-gray-200 bg-gray-50 h-full">
      <div className="p-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <label htmlFor="country-search" className="sr-only">{t("sidebar.searchLabel")}</label>
          <Search className="absolute left-3 top-3 text-gray-400" size={18} aria-hidden="true" />
          <input
            id="country-search"
            type="text"
            placeholder={t("sidebar.searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Countries List */}
        <ul className="space-y-2" role="listbox" aria-label={t("sidebar.listboxLabel")}>
          {(search ? filteredCountries : displayedCountries).map((country) => (
            <li key={country.code} role="none">
              <button
                role="option"
                aria-selected={selectedCountry === country.code}
                onClick={() => handleSelectCountry(country.code)}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
                  selectedCountry === country.code
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-200"
                }`}
              >
                <Flag
                  code={getCountryCode(country.code)}
                  style={{
                    width: "26px",
                    height: "18px",
                    borderRadius: "2px",
                    objectFit: "cover",
                  }}
                  title={t("countries." + country.code)}
                />
                <div className="flex justify-between w-full items-center">
                  <div className="font-medium">{t("countries." + country.code)}</div>
                  <div className="text-sm opacity-75">{country.code}</div>
                </div>
              </button>
            </li>
          ))}
        </ul>

        {/* All Countries Button */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          {!search && (
            <button
              onClick={() => setDialogOpen(true)}
              className="w-full border-t border-gray-300 pt-4 text-left px-4 py-3 rounded-lg flex items-center gap-3 text-gray-600 hover:bg-gray-200 transition-colors"
            >
              <Globe size={20} />
              <span>{t("sidebar.allCountries")} ({countriesList.length})</span>
            </button>
          )}

          <DialogContent className="max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{t("sidebar.dialogTitle")}</DialogTitle>
            </DialogHeader>

            <div className="relative mb-4">
              <Search className="absolute left-3 top-3 text-gray-400" size={18} aria-hidden="true" />
              <input
                type="text"
                placeholder={t("sidebar.searchPlaceholder")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </div>

            <ul className="grid grid-cols-2 gap-2 max-h-[60vh] overflow-y-auto" role="listbox">
              {filteredCountries.map((country) => (
                <li key={country.code} role="none">
                  <button
                    role="option"
                    aria-selected={selectedCountry === country.code}
                    onClick={() => handleSelectCountry(country.code)}
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
                      <div className="text-sm opacity-75 max-w-[120px] truncate">
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
    </aside>
  );
}
