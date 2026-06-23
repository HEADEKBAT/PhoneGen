import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import LanguageInitializer from "@/components/LanguageInitializer";
import JsonLd from "@/components/JsonLd";
import { Analytics } from "@vercel/analytics/react";
import YandexMetrica from "@/components/YandexMetrica";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin", "latin-ext"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "cyrillic", "latin-ext"],
  variable: "--font-sans",
  display: "swap",
});

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
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${spaceGrotesk.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Prevent FOUC — apply dark class before paint if needed */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (theme === 'dark' || (!theme && systemDark)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <ThemeProvider>
          <LanguageInitializer />
          <JsonLd />
          {children}
          <Analytics />
          <YandexMetrica />
        </ThemeProvider>
      </body>
    </html>
  );
}
