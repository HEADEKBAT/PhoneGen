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
    default: "GenCore — Free Online Generator Suite | Phone, Barcode & Credential Tools",
    template: "%s | GenCore — Free Online Generator Suite",
  },
  description:
    "GenCore is a free online generator suite with tools for phone numbers, barcodes, passwords, credentials, and more. Generate valid test data for developers, QA engineers, and professionals.",
  keywords: [
    "online generator suite",
    "phone number generator",
    "barcode generator",
    "password generator",
    "test data generator",
    "developer tools",
    "free online tools",
    "генератор номеров",
    "генератор штрихкодов",
    "генератор паролей",
  ],
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: CANONICAL_URL,
    languages: {
      en: CANONICAL_URL + "/",
      ru: CANONICAL_URL + "/",
      de: CANONICAL_URL + "/",
      es: CANONICAL_URL + "/",
      fr: CANONICAL_URL + "/",
      pt: CANONICAL_URL + "/",
    },
  },
  openGraph: {
    title: "GenCore — Free Online Generator Suite",
    description:
      "Free online generator suite — phone numbers, barcodes, passwords, credentials, and more. For developers, QA engineers, and professionals.",
    url: CANONICAL_URL,
    siteName: "GenCore",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "GenCore — Free Online Generator Suite",
    description:
      "Free online generator suite — phone numbers, barcodes, passwords, credentials, and more. For developers, QA engineers, and professionals.",
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

      <body className="min-h-screen flex flex-col grain-overlay">
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
