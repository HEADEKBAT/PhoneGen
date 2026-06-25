'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Phone, Users, MapPin, Mail, User, Building, Key, ArrowRight, Sparkles } from 'lucide-react';
import { ENABLED_PRODUCTS, PRODUCTS } from '@/lib/config/products';
import type { Product } from '@/lib/config/products';

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  phone: Phone,
  user: Users,
  address: MapPin,
  email: Mail,
  username: User,
  company: Building,
  password: Key,
};

export default function GenCoreHomePage() {
  const { locale } = useParams<{ locale: string }>() ?? { locale: 'en' };
  const enabledProducts = ENABLED_PRODUCTS;
  const allProducts = Object.values(PRODUCTS);

  return (
    <div className="flex min-h-screen flex-col">
      {/* ── Header ───────────────────────────────────────────────────── */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
          <span className="font-heading text-lg font-bold text-foreground tracking-tight">
            Gen<span className="text-primary">Core</span>
          </span>
          <nav className="flex items-center gap-1">
            <Link
              href={`/${locale}/phone-generator`}
              className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-muted-foreground text-sm font-medium hover:text-foreground hover:bg-muted transition-colors"
            >
              <Phone size={14} />
              Phone Gen
            </Link>
            <Link
              href={`/${locale}/user-generator`}
              className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <Users size={14} />
              User Gen
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* ── Hero ────────────────────────────────────────────────────── */}
        <section className="border-b border-border bg-linear-to-b from-primary/5 via-primary/[0.02] to-background">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 py-20 sm:py-28 text-center">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 text-xs font-medium text-primary mb-6">
              <Sparkles size={12} />
              Data Generation Platform
            </div>
            <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground tracking-tight">
              Gen<span className="text-primary">Core</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed">
              Generate realistic, valid test data for development and testing.
              One platform, multiple generators — starting with phone numbers.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href={`/${locale}/phone-generator`}
                className="inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors shadow-sm"
              >
                Go to Phone Generator
                <ArrowRight size={16} />
              </Link>
              <Link
                href={`/${locale}/about`}
                className="inline-flex items-center gap-2 h-12 px-6 rounded-xl border border-border bg-card text-foreground font-medium text-sm hover:bg-muted transition-colors"
              >
                About GenCore
              </Link>
            </div>
          </div>
        </section>

        {/* ── Products ────────────────────────────────────────────────── */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-16 sm:py-20">
          <div className="text-center mb-10">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
              Our Generators
            </h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
              Choose a generator to get started. New tools added regularly.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {allProducts.map((product) => {
              const isEnabled = enabledProducts.some((p) => p.id === product.id);
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  isEnabled={isEnabled}
                  locale={locale}
                />
              );
            })}
          </div>
        </section>

        {/* ── CTA ─────────────────────────────────────────────────────── */}
        <section className="border-t border-border bg-muted/30">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16 sm:py-20 text-center">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
              Ready to generate?
            </h2>
            <p className="mt-3 text-sm text-muted-foreground max-w-md mx-auto">
              Start with the Phone Generator — create valid phone numbers for 85+ countries in seconds.
            </p>
            <Link
              href={`/${locale}/phone-generator`}
              className="inline-flex items-center gap-2 mt-6 h-12 px-6 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors shadow-sm"
            >
              Get Started
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </main>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <footer className="border-t border-border bg-background">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
          <span className="text-xs text-muted-foreground">
            Gen<span className="text-primary">Core</span>
          </span>
          <div className="flex items-center gap-4">
            <Link
              href={`/${locale}/about`}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </Link>
            <Link
              href={`/${locale}/phone-generator`}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Phone Generator
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ProductCard({
  product,
  isEnabled,
  locale,
}: {
  product: Product;
  isEnabled: boolean;
  locale: string;
}) {
  const Icon = ICON_MAP[product.id] || Sparkles;

  if (isEnabled) {
    return (
      <Link
        href={`/${locale}/${product.slug}`}
        className="group rounded-xl border border-border bg-card p-5 hover:border-primary/40 hover:shadow-sm transition-all"
      >
        <div className="flex items-start justify-between">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary/15 transition-colors">
            <Icon size={18} />
          </div>
          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-medium text-primary">
            Live
          </span>
        </div>
        <h3 className="mt-4 font-heading font-semibold text-foreground text-sm group-hover:text-primary transition-colors">
          {product.title}
        </h3>
        <p className="mt-1 text-xs text-muted-foreground leading-relaxed line-clamp-2">
          {product.description}
        </p>
        <div className="mt-3 flex items-center gap-1 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
          Open
          <ArrowRight size={12} />
        </div>
      </Link>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card/50 p-5 opacity-50 cursor-not-allowed">
      <div className="flex items-start justify-between">
        <div className="flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          <Icon size={18} />
        </div>
        <span className="rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground">
          Coming Soon
        </span>
      </div>
      <h3 className="mt-4 font-heading font-semibold text-muted-foreground text-sm">
        {product.title}
      </h3>
      <p className="mt-1 text-xs text-muted-foreground/60 leading-relaxed line-clamp-2">
        {product.description}
      </p>
    </div>
  );
}
