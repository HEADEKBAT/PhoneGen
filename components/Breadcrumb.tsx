import { ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';

export interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  /** Optional JSON-LD BreadcrumbList context URL */
  baseUrl?: string;
}

/**
 * Breadcrumb navigation with JSON-LD structured data.
 *
 * Renders a visible trail AND injects a BreadcrumbList schema.org script.
 * The last item is rendered as plain text (not a link).
 */
export default function Breadcrumb({ items, baseUrl }: BreadcrumbProps) {
  if (!items || items.length === 0) return null;

  const schemaItems = items.map((item, i) => ({
    '@type': 'ListItem' as const,
    position: i + 1,
    name: item.label,
    ...(i < items.length - 1 ? { item: `${baseUrl || ''}${item.href}` } : {}),
  }));

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: schemaItems,
          }),
        }}
      />

      {/* Visible trail */}
      <nav aria-label="Breadcrumb" className="mx-auto max-w-4xl px-4 sm:px-6 pt-6">
        <ol className="flex items-center gap-1.5 text-xs text-muted-foreground">
          {items.map((item, i) => {
            const isLast = i === items.length - 1;
            return (
              <li key={i} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight size={12} className="text-muted-foreground/50" />}
                {i === 0 && <Home size={12} className="text-muted-foreground/50" />}
                {isLast ? (
                  <span className="text-foreground font-medium" aria-current="page">
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
