'use client';

import { CheckCircle, Grid3x3, Zap } from "lucide-react";
import { COUNTRIES } from "@/lib/phoneGenerator";
import { useTranslations } from "@/lib/i18n";
import Flag from 'react-world-flags'

export default function InfoCard({ countryCode }: { countryCode: string }) {
  const { t } = useTranslations();
  const country = COUNTRIES[countryCode];

  if (!country) return null;

  const adjective = t("countryAdjectives." + countryCode);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      {/* Flag */}
      <div className="flex justify-center">
        <div className="w-60 h-56 bg-linear-to-br from-blue-100 to-blue-50 rounded-2xl border-2 flex items-center justify-center">
          <Flag
            className="rounded-2xl"
            code={country.code}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '4px',
              objectFit: 'cover',
            }}
            title={t("countries." + country.code)}
          />
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-gray-900">
          {t("infoCard.title", { adjective })}
        </h3>
        <p className="text-gray-600">
          {t("infoCard.description", { adjective })}
        </p>

        {/* Features */}
        <ul className="space-y-3 pt-4">
          <li className="flex items-start gap-3">
            <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={20} aria-hidden="true" />
            <span className="text-gray-700">{t("infoCard.validNumbers")}</span>
          </li>
          <li className="flex items-start gap-3">
            <Grid3x3 className="text-blue-600 flex-shrink-0 mt-1" size={20} aria-hidden="true" />
            <span className="text-gray-700">{t("infoCard.differentFormats")}</span>
          </li>
          <li className="flex items-start gap-3">
            <Zap className="text-yellow-600 flex-shrink-0 mt-1" size={20} aria-hidden="true" />
            <span className="text-gray-700">{t("infoCard.fastAndSimple")}</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
