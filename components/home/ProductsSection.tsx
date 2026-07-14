'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Phone, Users, MapPin, Mail, User, Building, Key, Hash, Sparkles, ArrowRight } from 'lucide-react';
import { ALL_PRODUCTS } from '@/lib/config';
import type { Product } from '@/lib/config';

/**
 * Icon map for dynamic product icon resolution.
 */
const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Phone, Users, MapPin, Mail, User, Building, Key, Hash,
};

const STATUS_LABELS: Record<string, string> = {
  active: 'Live',
  beta: 'Beta',
  planned: 'Planned',
  coming_soon: 'Coming Soon',
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
    <section className="mx-auto max-w-5xl px-4 sm:px-6 py-20 sm:py-28">
      <div className="text-center mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="font-heading text-3xl sm:text-4xl font-bold text-foreground tracking-tight"
        >
          Our Generators
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-3 text-base text-muted-foreground max-w-md mx-auto font-light"
        >
          Choose a generator to get started. New tools added regularly.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
      >
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
      </motion.div>
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
  const statusLabel = STATUS_LABELS[product.status] || product.status;

  if (isEnabled) {
    return (
      <motion.div
        whileHover={{ y: -6, transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] } }}
      >
        <Link
          href={`/${locale}/${product.slug}`}
          className="group relative block rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:bg-card hover:shadow-floating hover:border-primary/20"
        >
          {/* Inner glow on hover */}
          <div className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at 50% 0%, rgba(34, 197, 94, 0.04), transparent 70%)',
            }}
          />

          <div className="relative z-10">
            <div className="flex items-start justify-between">
              <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary/15 group-hover:scale-105 transition-all duration-300">
                <Icon size={20} />
              </div>
              <span className="rounded-full bg-primary/8 px-3 py-0.5 text-[10px] font-medium text-primary border border-primary/10">
                {statusLabel}
              </span>
            </div>

            <h3 className="mt-5 font-heading font-semibold text-foreground text-base group-hover:text-primary transition-colors duration-300">
              {product.title}
            </h3>

            <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-2">
              {product.description}
            </p>

            <div className="mt-4 flex items-center gap-1 text-xs font-medium text-primary translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
              Open
              <ArrowRight size={12} className="transition-transform duration-300 group-hover:translate-x-0.5" />
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="relative rounded-2xl border border-border bg-card/50 p-6 opacity-50 cursor-not-allowed select-none">
      <div className="flex items-start justify-between">
        <div className="flex size-11 items-center justify-center rounded-xl bg-muted text-muted-foreground">
          <Icon size={20} />
        </div>
        <span className="rounded-full bg-muted px-3 py-0.5 text-[10px] font-medium text-muted-foreground">
          {statusLabel}
        </span>
      </div>
      <h3 className="mt-5 font-heading font-semibold text-muted-foreground text-base">
        {product.title}
      </h3>
      <p className="mt-2 text-sm text-muted-foreground/60 leading-relaxed line-clamp-2">
        {product.description}
      </p>
    </div>
  );
}
