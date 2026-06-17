'use client';

import { Copy, Check } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useTranslations } from "@/lib/i18n";

interface PhoneNumber {
  id: number;
  number: string;
}

export default function PhoneList({
  phones = [],
}: {
  phones?: string[];
}) {
  const { t } = useTranslations();
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [showCopyMessage, setShowCopyMessage] = useState(false);
  const [messageVisible, setMessageVisible] = useState(false);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [phoneList, setPhoneList] = useState<PhoneNumber[]>([]);

  useEffect(() => {
    if (phones && Array.isArray(phones)) {
      setPhoneList(
        phones.map((number, index) => ({
          id: index + 1,
          number,
        }))
      );
    }
  }, [phones]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    };
  }, []);

  const handleCopy = (number: string, id: number) => {
    navigator.clipboard.writeText(number);
    setCopiedId(id);

    // Clear any existing timer
    if (copyTimerRef.current) clearTimeout(copyTimerRef.current);

    // Show message with animation
    setShowCopyMessage(true);
    // Trigger enter animation on next frame
    requestAnimationFrame(() => setMessageVisible(true));

    // Hide after 4.5s
    copyTimerRef.current = setTimeout(() => {
      setMessageVisible(false);
      // Wait for exit animation to finish, then unmount
      setTimeout(() => {
        setShowCopyMessage(false);
        setCopiedId(null);
      }, 500);
    }, 4500);
  };

  if (phoneList.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Copy Success Toast */}
      <div
        role="status"
        aria-live="polite"
        className={`bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2 transition-all duration-500 ${
          messageVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-2"
        } ${showCopyMessage ? "pointer-events-auto" : "pointer-events-none"}`}
      >
        <div className="w-2 h-2 bg-green-600 rounded-full" aria-hidden="true"></div>
        <span>{t("phoneList.copied")}</span>
      </div>

      {/* Phone Numbers Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <caption className="sr-only">{t("phoneList.tableCaption")}</caption>
            <thead className="sr-only">
              <tr>
                <th scope="col">{t("phoneList.number")}</th>
                <th scope="col">{t("phoneList.phoneNumber")}</th>
                <th scope="col">{t("phoneList.action")}</th>
              </tr>
            </thead>
            <tbody>
              {phoneList.map((phone) => (
                <tr key={phone.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-gray-500 font-medium w-12">{phone.id}</td>
                  <td className="px-6 py-4 text-gray-900 font-medium text-lg">{phone.number}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleCopy(phone.number, phone.id)}
                      aria-label={
                        copiedId === phone.id
                          ? t("phoneList.copiedLabel") + ": " + phone.number
                          : t("phoneList.copy") + " " + phone.number
                      }
                      className="text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-2 ml-auto"
                    >
                      {copiedId === phone.id ? (
                        <>
                          <Check size={18} aria-hidden="true" />
                          <span>{t("phoneList.copiedLabel")}</span>
                        </>
                      ) : (
                        <>
                          <Copy size={18} aria-hidden="true" />
                          <span>{t("phoneList.copy")}</span>
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
