import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { LearnArticle } from '@/lib/config/barcode';

interface LearnSectionProps {
  articles: LearnArticle[];
  title?: string;
  subtitle?: string;
}

export default function LearnSection({ articles, title, subtitle }: LearnSectionProps) {
  return (
    <section className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-20">
        <div className="text-center mb-12">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            {title || 'Learn About Barcodes'}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
            {subtitle || 'Understand the fundamentals of barcode technology'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={article.href}
              className="flex flex-col p-4 rounded-xl border border-border bg-card hover:border-primary/30 hover:shadow-sm transition-all group"
            >
              <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                {article.label}
              </h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed flex-1">
                {article.desc}
              </p>
              <span className="inline-flex items-center gap-1 mt-3 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                Read more <ArrowRight size={12} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
