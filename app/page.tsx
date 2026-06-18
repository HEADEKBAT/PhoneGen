'use client';

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import MainContent from "@/components/MainContent";
import Footer from "@/components/Footer";
import { COUNTRIES } from "@/lib/phoneGenerator";
import { useCountryStore } from "@/lib/store";

function HomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const storedCountry = useCountryStore((state) => state.selectedCountry);
  const setStoredCountry = useCountryStore((state) => state.setSelectedCountry);

  const urlCountry = searchParams.get("country");
  const urlCount = searchParams.get("count");
  const urlFormat = searchParams.get("format");
  const [selectedCountry, setSelectedCountry] = useState(storedCountry || "NG");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    let country = urlCountry || storedCountry || "NG";

    if (!Object.keys(COUNTRIES).includes(country)) {
      country = "NG";
    }

    setSelectedCountry(country);
    setStoredCountry(country);

    if (urlCountry !== country) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("country", country);
      router.replace(`/?${params.toString()}`);
    }
  }, [mounted, urlCountry, storedCountry, router, setStoredCountry, searchParams]);

  const handleSelectCountry = (code: string) => {
    setSelectedCountry(code);
    setStoredCountry(code);
    const params = new URLSearchParams(searchParams.toString());
    params.set("country", code);
    router.replace(`/?${params.toString()}`);
  };

  const parsedCount = urlCount ? parseInt(urlCount, 10) : null;
  const validCount = parsedCount && [1, 5, 10, 25, 50, 100].includes(parsedCount) ? parsedCount : null;
  const validFormat = urlFormat && ["international", "national", "e164"].includes(urlFormat)
    ? urlFormat as "international" | "national" | "e164"
    : null;

  if (!mounted) {
    return null;
  }

  return (
    <>
      <Header />
      <div className="flex flex-1">
        <div className="hidden md:block">
          <Sidebar selectedCountry={selectedCountry} onSelectCountry={handleSelectCountry} />
        </div>
        <MainContent
          selectedCountry={selectedCountry}
          onSelectCountry={handleSelectCountry}
          initialCount={validCount}
          initialFormat={validFormat}
        />
      </div>
      <Footer />
    </>
  );
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  );
}
