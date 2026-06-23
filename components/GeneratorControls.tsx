'use client';

import { useState } from "react";
import {
  FlaskConical,
  ChevronDown,
  ChevronUp,
  CircleHelp,
  Copy,
  Check,
  RefreshCw,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { PhoneFormat } from "@/lib/phoneGenerator";
import { useTranslations } from "@/lib/i18n";

export default function GeneratorControls({
  onQuantityChange,
  onFormatChange,
  onSeedChange,
  onRegenerate,
  phones,
}: {
  onQuantityChange: (quantity: number) => void;
  onFormatChange: (format: PhoneFormat) => void;
  onSeedChange?: (seed: string) => void;
  onRegenerate?: () => void;
  phones?: string[];
}) {
  const { t } = useTranslations();
  const [quantity, setQuantity] = useState(10);
  const [format, setFormat] = useState<PhoneFormat>("international");
  const [seed, setSeed] = useState("");
  const [showSeed, setShowSeed] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);

  const quantityOptions = [1, 5, 10, 25, 50, 100];
  const formatOptions = [
    { id: "international" as PhoneFormat, label: t("generator.international") },
    { id: "national" as PhoneFormat, label: t("generator.national") },
    { id: "e164" as PhoneFormat, label: t("generator.e164") },
    { id: "rfc3966" as PhoneFormat, label: t("generator.rfc3966") },
  ];

  const handleQuantityChange = (value: string) => {
    const num = parseInt(value, 10);
    setQuantity(num);
    onQuantityChange(num);
  };

  const handleFormatChange = (value: string) => {
    const fmt = value as PhoneFormat;
    setFormat(fmt);
    onFormatChange(fmt);
  };

  const handleSeedChange = (value: string) => {
    setSeed(value);
    onSeedChange?.(value);
  };

  const handleCopyAll = () => {
    if (!phones?.length) return;
    navigator.clipboard.writeText(phones.join("\n"));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Quantity */}
        <fieldset>
          <legend className="font-semibold text-gray-900 mb-2 text-sm">
            {t("generator.quantity")}
          </legend>
          <Select
            value={String(quantity)}
            onValueChange={handleQuantityChange}
          >
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {quantityOptions.map((num) => (
                <SelectItem key={num} value={String(num)}>
                  {num}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </fieldset>

        {/* Format */}
        <fieldset>
          <legend className="font-semibold text-gray-900 mb-2 text-sm">
            {t("generator.format")}
          </legend>
          <Select value={format} onValueChange={handleFormatChange}>
            <SelectTrigger className="w-full sm:w-56">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {formatOptions.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </fieldset>
      </div>

      {/* Bottom row: Seed + Action buttons */}
      <div className="mt-5 pt-4 border-t border-gray-100">
        <TooltipProvider delayDuration={100}>
          <div className="flex flex-wrap items-center gap-2">
            {/* Seed toggle */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowSeed(!showSeed)}
              className={`gap-1.5 transition-all ${
                showSeed
                  ? "border-violet-300 bg-violet-50 text-violet-700 hover:bg-violet-100 hover:text-violet-800"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <FlaskConical size={15} className={showSeed ? "text-violet-500" : ""} />
              <span>{showSeed ? t("generator.hideSeed") : t("generator.seedToggle")}</span>
              {showSeed ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </Button>

            {/* Seed hint tooltip */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 size-5 transition-colors cursor-pointer"
                  aria-label={t("generator.seedHint")}
                >
                  <CircleHelp size={14} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-60">
                {t("generator.seedHint")}
              </TooltipContent>
            </Tooltip>

            {/* Spacer */}
            <span className="hidden sm:block w-px h-5 bg-gray-200 mx-1" aria-hidden="true" />

            {/* Copy all */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopyAll}
              disabled={!phones?.length}
              className={`gap-1.5 transition-all ${
                copiedAll
                  ? "border-green-300 bg-green-50 text-green-700"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {copiedAll ? (
                <>
                  <Check size={15} className="text-green-500" />
                  <span>{t("phoneList.copiedLabel")}</span>
                </>
              ) : (
                <>
                  <Copy size={15} />
                  <span>{t("generator.copyAll")}</span>
                </>
              )}
            </Button>

            {/* Regenerate */}
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={() => onRegenerate?.()}
              className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <RefreshCw size={15} />
              <span>{t("generator.regenerate")}</span>
            </Button>
          </div>

          {/* Seed input (collapsible) */}
          {showSeed && (
            <div className="mt-3 animate-in slide-in-from-top-1 duration-200">
              <label
                htmlFor="seed-input"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                {t("generator.seedLabel")}
              </label>
              <div className="relative max-w-xs">
                <FlaskConical
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-violet-400 pointer-events-none"
                />
                <Input
                  id="seed-input"
                  type="text"
                  placeholder={t("generator.seedPlaceholder")}
                  value={seed}
                  onChange={(e) => handleSeedChange(e.target.value)}
                  className="pl-8 border-violet-200 focus-visible:border-violet-400 focus-visible:ring-violet-200/50"
                />
              </div>
            </div>
          )}
        </TooltipProvider>
      </div>
    </div>
  );
}
