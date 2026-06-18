'use client';

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { PhoneFormat } from "@/lib/phoneGenerator";
import { useTranslations } from "@/lib/i18n";

export default function GeneratorControls({
  onQuantityChange,
  onFormatChange,
  onSeedChange,
}: {
  onQuantityChange: (quantity: number) => void;
  onFormatChange: (format: PhoneFormat) => void;
  onSeedChange?: (seed: string) => void;
}) {
  const { t } = useTranslations();
  const [quantity, setQuantity] = useState(10);
  const [format, setFormat] = useState<PhoneFormat>("international");
  const [seed, setSeed] = useState("");
  const [showSeed, setShowSeed] = useState(false);

  const quantityOptions = [1, 5, 10, 25, 50, 100];
  const formatOptions = [
    { id: "international" as PhoneFormat, label: t("generator.international") },
    { id: "national" as PhoneFormat, label: t("generator.national") },
    { id: "e164" as PhoneFormat, label: t("generator.e164") },
    { id: "rfc3966" as PhoneFormat, label: t("generator.rfc3966") },
  ];

  const handleQuantityChange = (num: number) => {
    setQuantity(num);
    onQuantityChange(num);
  };

  const handleFormatChange = (fmt: PhoneFormat) => {
    setFormat(fmt);
    onFormatChange(fmt);
  };

  const handleSeedChange = (value: string) => {
    setSeed(value);
    onSeedChange?.(value);
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quantity */}
        <fieldset>
          <legend className="font-semibold text-gray-900 mb-3">{t("generator.quantity")}</legend>
          <div className="flex gap-2 flex-wrap" role="radiogroup">
            {quantityOptions.map((num) => (
              <Button
                key={num}
                onClick={() => handleQuantityChange(num)}
                variant={quantity === num ? "default" : "outline"}
                className={quantity === num ? "bg-blue-600 hover:bg-blue-700" : ""}
              >
                {num}
              </Button>
            ))}
          </div>
        </fieldset>

        {/* Format */}
        <fieldset>
          <legend className="font-semibold text-gray-900 mb-3">{t("generator.format")}</legend>
          <div className="flex gap-2 flex-wrap" role="radiogroup">
            {formatOptions.map((option) => (
              <Button
                key={option.id}
                onClick={() => handleFormatChange(option.id)}
                variant={format === option.id ? "default" : "outline"}
                className={format === option.id ? "bg-blue-600 hover:bg-blue-700" : ""}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </fieldset>
      </div>

      {/* Seed toggle + input */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={() => setShowSeed(!showSeed)}
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          {showSeed ? t("generator.hideSeed") : t("generator.seedToggle")}
        </button>
        {showSeed && (
          <div className="mt-2">
            <label htmlFor="seed-input" className="block text-sm font-medium text-gray-700 mb-1">
              {t("generator.seedLabel")}
            </label>
            <Input
              id="seed-input"
              type="text"
              placeholder={t("generator.seedPlaceholder")}
              value={seed}
              onChange={(e) => handleSeedChange(e.target.value)}
              className="max-w-xs"
            />
            <p className="text-xs text-gray-400 mt-1">{t("generator.seedHint")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
