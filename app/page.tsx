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
      router.push(`/?country=${country}`);
    }
  }, [mounted, urlCountry, storedCountry, router, setStoredCountry]);

  const handleSelectCountry = (code: string) => {
    setSelectedCountry(code);
    setStoredCountry(code);
    router.push(`/?country=${code}`);
  };

  if (!mounted) {
    return null;
  }

  return (
    <>
      <Header />
      <div className="flex flex-1">
        <Sidebar selectedCountry={selectedCountry} onSelectCountry={handleSelectCountry} />
        <MainContent selectedCountry={selectedCountry} />
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
