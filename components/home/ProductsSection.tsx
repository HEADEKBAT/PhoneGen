'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Phone, Users, MapPin, Mail, User, Building, Key, Hash, Sparkles, ArrowRight } from 'lucide-react';
import { ALL_PRODUCTS, ENABLED_PRODUCTS } from '@/lib/config';
import type { Product } from '@/lib/config';

/**
 * Icon map for dynamic product icon resolution.
 */
const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Phone, Users, MapPin, Mail, User, Building, Key, Hash,
};

/**
 * Product grid section for the GenCore home page.
 *
 * Shows all products from the Products Registry.
 * Enabled products link to their landing pages.
 * Disabled/planned products show as "Coming Soon".
 */
export default function ProductsSection() {
  const { locale } = useParams<{ locale: string }>() ?? { locale: 'en' };

  return (
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
        {ALL_PRODUCTS.map((product) => {
          const isEnabled = product.status === 'active' || product.status === 'beta';
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
            {product.status === 'beta' ? 'Beta' : 'Live'}
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
          {product.status === 'planned' ? 'Planned' : 'Coming Soon'}
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
