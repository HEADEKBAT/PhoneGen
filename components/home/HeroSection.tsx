'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowRight, Sparkles } from 'lucide-react';
import AnimatedBackground from '@/components/background/AnimatedBackground';
import { PLATFORM_CONFIG } from '@/lib/config';

/**
 * Hero section for the GenCore home page.
 *
 * Uses the existing AnimatedBackground and reads all content
 * from the Platform Config.
 */
export default function HeroSection() {
  const { locale } = useParams<{ locale: string }>() ?? { locale: 'en' };

  return (
    <section className="relative overflow-hidden bg-linear-to-b from-primary/5 via-primary/2 to-background">
      <AnimatedBackground />
      <style>{`
        @keyframes data-ring {
          0% { transform: scale(0.6); opacity: 0.2; }
          50% { transform: scale(1.2);  opacity: 0.04; }
          100% { transform: scale(0.6); opacity: 0.2; }
        }
        @keyframes core-glow {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.3); }
        }
      `}</style>
      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 pt-20 sm:pt-28 pb-28 sm:pb-36 text-center">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 text-xs font-medium text-primary mb-6">
          <Sparkles size={12} />
          {PLATFORM_CONFIG.tagline}
        </div>

        <div className="relative inline-flex items-center justify-center">
          {/* Decorative rings */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
            <div className="absolute w-44 h-44 rounded-full border border-primary/15 animate-[data-ring_5s_ease-in-out_infinite]" />
            <div className="absolute w-56 h-56 rounded-full border border-primary/10 animate-[data-ring_5s_ease-in-out_infinite_0.7s]" />
            <div className="absolute w-68 h-68 rounded-full border border-primary/[0.06] animate-[data-ring_5s_ease-in-out_infinite_1.4s]" />
          </div>

          <h1 className="relative font-heading text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground tracking-tight">
            Gen<span className="text-primary" style={{ animation: 'core-glow 4s ease-in-out infinite' }}>Core</span>
          </h1>
        </div>

        <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed">
          {PLATFORM_CONFIG.description}
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

      {/* Gradient fade overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-linear-to-t from-background to-transparent pointer-events-none z-1" aria-hidden="true" />
    </section>
  );
}
