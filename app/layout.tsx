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

const CANONICAL_URL = "https://www.gencore.space";
const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || CANONICAL_URL;
const siteUrl = rawSiteUrl.startsWith("http") ? rawSiteUrl : `https://${rawSiteUrl}`;

export const metadata: Metadata = {
  title: {
    default: "PhoneGen — Valid Phone Number Generator | libphonenumber Test Data",
    template: "%s | PhoneGen — Valid Phone Number Generator",
  },
  description:
    "Generate valid phone numbers that pass libphonenumber-js validation. Free generator for 85+ countries with international, national, E.164 formats. Official test numbers included. For developers, QA engineers, and testers.",
  keywords: [
    "valid phone number generator",
    "libphonenumber test data",
    "libphonenumber-js validator",
    "phone number validation testing",
    "realistic test phone numbers",
    "generate valid phone numbers",
    "valid E.164 number generator",
    "phone number testing generator",
    "генератор валидных номеров",
    "тестовые номера телефонов",
    "проверка валидации номеров",
  ],
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: CANONICAL_URL,
    languages: {
      ru: CANONICAL_URL + "/",
      en: CANONICAL_URL + "/",
      de: CANONICAL_URL + "/",
      es: CANONICAL_URL + "/",
      fr: CANONICAL_URL + "/",
    },
  },
  openGraph: {
    title: "PhoneGen — Valid Phone Number Generator",
    description:
      "Generate valid phone numbers that pass libphonenumber-js validation. Free generator for 85+ countries with multiple formats. Official test numbers for developers and QA.",
    url: CANONICAL_URL,
    siteName: "PhoneGen",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "PhoneGen — Valid Phone Number Generator",
    description:
      "Generate valid phone numbers that pass libphonenumber-js validation. Free generator for 85+ countries.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },     
    ],
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head />

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
