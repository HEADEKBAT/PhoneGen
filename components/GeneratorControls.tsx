'use client';

import { useState } from "react";
import { Button } from "./ui/button";
import { PhoneFormat } from "@/lib/phoneGenerator";
import { useTranslations } from "@/lib/i18n";

export default function GeneratorControls({
  onQuantityChange,
  onFormatChange,
}: {
  onQuantityChange: (quantity: number) => void;
  onFormatChange: (format: PhoneFormat) => void;
}) {
  const { t } = useTranslations();
  const [quantity, setQuantity] = useState(10);
  const [format, setFormat] = useState<PhoneFormat>("international");

  const quantityOptions = [5, 10, 20, 50];
  const formatOptions = [
    { id: "international" as PhoneFormat, label: t("generator.international") },
    { id: "national" as PhoneFormat, label: t("generator.national") },
    { id: "e164" as PhoneFormat, label: t("generator.e164") },
  ];

  const handleQuantityChange = (num: number) => {
    setQuantity(num);
    onQuantityChange(num);
  };

  const handleFormatChange = (fmt: PhoneFormat) => {
    setFormat(fmt);
    onFormatChange(fmt);
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="grid grid-cols-2 gap-6">
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
    </div>
  );
}
