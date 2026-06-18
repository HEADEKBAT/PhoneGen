'use client';

import { CheckCircle, Grid3x3, Zap, Info } from "lucide-react";
import { COUNTRIES, getCountryInfo } from "@/lib/phoneGenerator";
import { useTranslations } from "@/lib/i18n";
import Flag from 'react-world-flags'
import { useMemo } from "react";

export default function InfoCard({ countryCode }: { countryCode: string }) {
  const { t } = useTranslations();
  const country = COUNTRIES[countryCode];

  const info = useMemo(() => {
    try {
      return getCountryInfo(countryCode);
    } catch {
      return null;
    }
  }, [countryCode]);

  if (!country) return null;

  const adjective = t("countryAdjectives." + countryCode);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
      {/* Flag + Country Info */}
      <div className="space-y-6">
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

        {/* Country Info Details */}
        {info && (
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <Info size={16} className="text-blue-600" />
              {t("infoCard.countryInfo")}
            </h4>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500">{t("infoCard.countryCode")}</dt>
                <dd className="font-medium text-gray-900">{info.countryCode}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">{t("infoCard.numberLength")}</dt>
                <dd className="font-medium text-gray-900">{info.numberLength} {t("infoCard.digits")}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">{t("infoCard.example")}</dt>
                <dd className="font-medium text-gray-900 text-right break-all max-w-50">{info.exampleInternational}</dd>
              </div>
            </dl>
          </div>
        )}
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
