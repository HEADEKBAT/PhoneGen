import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import LanguageInitializer from "@/components/LanguageInitializer";
import JsonLd from "@/components/JsonLd";
import { Analytics } from "@vercel/analytics/react";
import YandexMetrica from "@/components/YandexMetrica";

const roboto = Roboto({ subsets: ["latin", "cyrillic"], variable: "--font-sans" });

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || "phone-gen.vercel.app";
const siteUrl = rawSiteUrl.startsWith("http") ? rawSiteUrl : `https://${rawSiteUrl}`;

export const metadata: Metadata = {
  title: {
    default: "PhoneGen — Генератор телефонных номеров",
    template: "%s | PhoneGen",
  },
  description:
    "Бесплатный онлайн-генератор валидных телефонных номеров для 100+ стран. Международный, национальный и E.164 форматы. Для разработчиков, тестировщиков и аналитиков.",
  keywords: [
    "генератор телефонных номеров",
    "валидные номера",
    "тестовые номера",
    "phone generator",
    "fake phone numbers",
    "test data",
    "номера для тестирования",
  ],
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
    languages: {
      ru: "/",
      en: "/",
      de: "/",
      es: "/",
      fr: "/",
    },
  },
  openGraph: {
    title: "PhoneGen — Генератор телефонных номеров",
    description:
      "Бесплатный онлайн-генератор валидных телефонных номеров для 100+ стран",
    url: "/",
    siteName: "PhoneGen",
    locale: "ru_RU",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "PhoneGen — Генератор телефонных номеров",
    description:
      "Бесплатный онлайн-генератор валидных телефонных номеров для 100+ стран",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={cn("h-full", "antialiased", "font-sans", roboto.variable)} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-white">
        <LanguageInitializer />
        <JsonLd />
        {children}
        <Analytics />
        <YandexMetrica />
      </body>
    </html>
  );
}
