'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';
import {
  ArrowRight,
  Building,
  CreditCard,
  Hash,
  Image as ImageIcon,
  Key,
  Mail,
  MapPin,
  Palette,
  Phone,
  QrCode,
  Scan,
  User,
  Users,
  Video,
  Wallet,
  type LucideIcon,
} from 'lucide-react';
import { getProduct } from '@/lib/config';
import { CATALOGUE_GROUPS, type CatalogueEntry } from '@/lib/config/homeCatalogue';
import { useTranslations } from '@/lib/i18n';
import { REVEAL_VIEWPORT, revealCard, revealUp, stagger } from './motion';

/**
 * Product icon by the name PRODUCTS declares.
 *
 * The old map held eight entries for twenty-three products, so most cards
 * rendered without an icon at all. This one covers every product the
 * catalogue shows; a miss falls back rather than crashing.
 */
const ICONS: Record<string, LucideIcon> = {
  Phone, Users, MapPin, Mail, User, Building,
  Key, Hash, CreditCard, Wallet, QrCode, Scan,
  Palette, Image: ImageIcon, Video,
};

interface CatalogueSectionProps {
  query: string;
  onClear: () => void;
}

export default function CatalogueSection({ query, onClear }: CatalogueSectionProps) {
  const { locale } = useParams<{ locale: string }>() ?? { locale: 'en' };
  const { t } = useTranslations();
  const reduced = useReducedMotion();

  const needle = query.trim().toLowerCase();

  /* A product matches on its translated title and description as well as its
     keyword list, so searching "senha" works on the Portuguese page. */
  const groups = useMemo(() => {
    const matches = (entry: CatalogueEntry) => {
      if (!needle) return true;
      const haystack = [
        t(`products.${entry.id}.title`),
        t(`products.${entry.id}.description`),
        entry.keywords,
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(needle);
    };

    return CATALOGUE_GROUPS.map((group) => ({
      ...group,
      entries: group.entries.filter(matches),
    })).filter((group) => group.entries.length > 0);
  }, [needle, t]);

  const total = groups.reduce((n, g) => n + g.entries.length, 0);

  if (total === 0) {
    return (
      <section className="mx-auto max-w-5xl px-4 py-20 text-center sm:px-6">
        <p className="text-base text-foreground">
          {t('platformHome.empty', { q: query.trim() })}
        </p>
        <p className="mt-2 text-[0.8125rem] text-muted-foreground">
          {t('platformHome.emptyHint')}
        </p>
        <button
          type="button"
          onClick={onClear}
          className="mt-5 rounded-lg border border-border bg-card px-4 py-2 text-[0.8125rem] font-medium text-foreground transition-colors hover:border-action/40 hover:text-action"
        >
          {t('platformHome.clear')}
        </button>
      </section>
    );
  }

  return (
    <section id="generators" className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      {groups.map((group) => (
        <motion.div
          key={group.id}
          layout={!reduced}
          variants={revealUp}
          initial={reduced ? false : 'hidden'}
          whileInView="shown"
          viewport={REVEAL_VIEWPORT}
          className="mb-12 last:mb-0"
        >
          {/* The short orange bar overlaps the rule, so the second colour
              carries the page's structure and not only its buttons. */}
          <div className="relative mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-border pb-2.5">
            <h2 className="font-heading text-lg font-semibold tracking-tight text-foreground">
              {t(`platformHome.groups.${group.id}.title`)}
            </h2>
            <p className="text-[0.8125rem] text-muted-foreground">
              {t(`platformHome.groups.${group.id}.note`)}
            </p>
            <span className="ml-auto font-mono text-[0.8125rem] text-muted-foreground">
              {group.entries.length}
            </span>
            <span
              aria-hidden="true"
              className="absolute -bottom-px left-0 h-0.5 w-9 rounded-full bg-action"
            />
          </div>

          <motion.ul
            variants={stagger()}
            initial={reduced ? false : 'hidden'}
            whileInView="shown"
            viewport={REVEAL_VIEWPORT}
            className="grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence initial={false}>
              {group.entries.map((entry) => (
                <ProductCard key={entry.id} entry={entry} locale={locale} reduced={!!reduced} />
              ))}
            </AnimatePresence>
          </motion.ul>
        </motion.div>
      ))}
    </section>
  );
}

/* ── Card ─────────────────────────────────────────────────────────────────── */

function ProductCard({
  entry,
  locale,
  reduced,
}: {
  entry: CatalogueEntry;
  locale: string;
  reduced: boolean;
}) {
  const { t } = useTranslations();
  const product = getProduct(entry.id);
  if (!product) return null;

  const Icon = ICONS[product.icon] ?? Hash;

  return (
    <motion.li
      layout={!reduced}
      variants={revealCard}
      exit={reduced ? undefined : { opacity: 0, scale: 0.97 }}
      className="list-none"
    >
      <Link
        href={`/${locale}/${product.slug}`}
        className="group flex h-full flex-col gap-2.5 rounded-xl border border-border bg-card p-4 shadow-card transition-[border-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-action/40 hover:shadow-elevated"
      >
        <span className="flex items-center gap-2.5">
          <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-action-soft text-action transition-transform duration-200 group-hover:scale-105">
            <Icon size={15} aria-hidden="true" />
          </span>
          <span className="font-heading text-[0.9375rem] font-semibold tracking-tight text-foreground">
            {t(`products.${entry.id}.title`)}
          </span>
          <ArrowRight
            size={15}
            aria-hidden="true"
            className="ml-auto shrink-0 text-muted-foreground opacity-0 transition-[opacity,transform] duration-200 group-hover:translate-x-0.5 group-hover:opacity-100"
          />
        </span>

        <span className="text-[0.8125rem] leading-relaxed text-muted-foreground">
          {t(`products.${entry.id}.description`)}
        </span>

        {/* The sample is the point of the card: you see what you get. */}
        <span className="mt-auto flex items-center gap-2 overflow-x-auto rounded-lg bg-muted px-2.5 py-1.5 font-mono text-xs whitespace-nowrap text-muted-foreground">
          {entry.validates && (
            <span className="shrink-0 rounded bg-primary/10 px-1.5 py-0.5 text-primary">
              ✓ {entry.validates}
            </span>
          )}
          <span>{entry.sample}</span>
        </span>
      </Link>
    </motion.li>
  );
}
