'use client';

import { Copy, Check, CopyCheck, Download } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
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
  const [copiedAll, setCopiedAll] = useState(false);
  const [showCopyMessage, setShowCopyMessage] = useState(false);
  const [messageVisible, setMessageVisible] = useState(false);
  const [messageText, setMessageText] = useState("");
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

  const showToast = useCallback((text: string) => {
    if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    setMessageText(text);
    setShowCopyMessage(true);
    requestAnimationFrame(() => setMessageVisible(true));
    copyTimerRef.current = setTimeout(() => {
      setMessageVisible(false);
      setTimeout(() => {
        setShowCopyMessage(false);
        setCopiedId(null);
        setCopiedAll(false);
      }, 500);
    }, 4500);
  }, []);

  const handleCopy = (number: string, id: number) => {
    navigator.clipboard.writeText(number);
    setCopiedId(id);
    showToast(t("phoneList.copied"));
  };

  const handleCopyAll = useCallback(() => {
    const text = phones.join("\n");
    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    showToast(t("phoneList.copiedAll"));
  }, [phones, showToast, t]);

  const downloadFile = useCallback((content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  const handleExportTxt = useCallback(() => {
    const content = phones.join("\n");
    downloadFile(content, "phone-numbers.txt", "text/plain");
    showToast(t("phoneList.exported") + " TXT");
  }, [phones, downloadFile, showToast, t]);

  const handleExportCsv = useCallback(() => {
    const header = "ID,Phone Number";
    const rows = phones.map((p, i) => `${i + 1},"${p}"`);
    const content = [header, ...rows].join("\n");
    downloadFile(content, "phone-numbers.csv", "text/csv");
    showToast(t("phoneList.exported") + " CSV");
  }, [phones, downloadFile, showToast, t]);

  const handleExportJson = useCallback(() => {
    const data = phones.map((p, i) => ({ id: i + 1, number: p }));
    const content = JSON.stringify(data, null, 2);
    downloadFile(content, "phone-numbers.json", "application/json");
    showToast(t("phoneList.exported") + " JSON");
  }, [phones, downloadFile, showToast, t]);

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
        <span>{messageText}</span>
      </div>

      {/* Copy All + Export Buttons */}
      {phoneList.length > 1 && (
        <div className="flex flex-wrap items-center justify-end gap-2">
          <button
            onClick={handleCopyAll}
            aria-label={t("phoneList.copyAllLabel")}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200"
          >
            {copiedAll ? (
              <>
                <Check size={16} aria-hidden="true" />
                <span>{t("phoneList.copiedLabel")}</span>
              </>
            ) : (
              <>
                <CopyCheck size={16} aria-hidden="true" />
                <span>{t("phoneList.copyAll")}</span>
              </>
            )}
          </button>

          <span className="text-gray-300 mx-1" aria-hidden="true">|</span>

          <span className="text-sm text-gray-500 mr-1">{t("phoneList.export")}:</span>
          <button
            onClick={handleExportTxt}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
          >
            <Download size={14} aria-hidden="true" />
            TXT
          </button>
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
          >
            <Download size={14} aria-hidden="true" />
            CSV
          </button>
          <button
            onClick={handleExportJson}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
          >
            <Download size={14} aria-hidden="true" />
            JSON
          </button>
        </div>
      )}

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
