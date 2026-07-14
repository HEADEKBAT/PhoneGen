'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowRight, Sparkles } from 'lucide-react';
import AnimatedBackground from '@/components/background/AnimatedBackground';
import { PLATFORM_CONFIG } from '@/lib/config';

/**
 * Hero section for the GenCore home page.
 *
 * Editorial/magazine style with enhanced visual depth.
 * Large typography, generous whitespace, and a slow aurora backdrop.
 */
export default function HeroSection() {
  const { locale } = useParams<{ locale: string }>() ?? { locale: 'en' };

  return (
    <section className="relative overflow-hidden bg-linear-to-b from-primary/3 via-primary/1 to-background">
      {/* Enhanced aurora background — larger, slower orbs */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <AnimatedBackground
          aurora={true}
          grid={true}
          stars={true}
          noise={true}
          floatingData={true}
        />
        {/* Extra hero-only aurora orbs for dramatic scale */}
        <div
          className="absolute top-[-20%] left-[-10%] w-200 h-200 rounded-full opacity-[0.08] dark:opacity-[0.06]"
          style={{
            background: 'radial-gradient(ellipse, #22c55e, transparent 70%)',
            filter: 'blur(160px)',
            animation: 'hero-drift-1 45s ease-in-out infinite alternate',
          }}
        />
        <div
          className="absolute bottom-[-15%] right-[10%] w-175 h-175 rounded-full opacity-[0.06] dark:opacity-[0.04]"
          style={{
            background: 'radial-gradient(ellipse, #6366f1, transparent 70%)',
            filter: 'blur(180px)',
            animation: 'hero-drift-2 50s ease-in-out infinite alternate',
          }}
        />
        <style>{`
          @keyframes hero-drift-1 {
            0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
            33% { transform: translate3d(40px, -30px, 0) scale(1.05); }
            66% { transform: translate3d(-20px, 20px, 0) scale(0.95); }
          }
          @keyframes hero-drift-2 {
            0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
            33% { transform: translate3d(-30px, 40px, 0) scale(0.95); }
            66% { transform: translate3d(20px, -20px, 0) scale(1.05); }
          }
        `}</style>
      </div>

      {/* Gradient fade at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-linear-to-t from-background to-transparent pointer-events-none z-1" aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 pt-28 sm:pt-36 pb-32 sm:pb-40 text-center">
        {/* Tagline badge */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/4 backdrop-blur-sm px-4 py-1.5 text-xs font-medium text-primary mb-8"
        >
          <Sparkles size={12} />
          {PLATFORM_CONFIG.tagline}
        </motion.div>

        {/* Main headline — editorial scale */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
          className="font-heading text-5xl sm:text-7xl lg:text-8xl font-bold text-foreground tracking-tight leading-[1.05]"
        >
          Gen
          <span className="text-primary">Core</span>
        </motion.h1>

        {/* Subtitle — larger, more readable */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light"
        >
          {PLATFORM_CONFIG.description}
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            href={`/${locale}/phone-generator`}
            className="group relative inline-flex items-center gap-2 h-14 px-8 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all duration-300 shadow-md hover:shadow-lg active:scale-[0.98]"
          >
            <span>Go to Phone Generator</span>
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
          <Link
            href={`/${locale}/about`}
            className="group inline-flex items-center gap-2 h-14 px-8 rounded-2xl border border-border bg-card/80 backdrop-blur-sm text-foreground font-medium text-sm hover:bg-card hover:border-primary/20 transition-all duration-300 shadow-sm hover:shadow-elevated"
          >
            About GenCore
          </Link>
        </motion.div>

        {/* Subtle scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-20 flex flex-col items-center gap-2 text-muted-foreground/40"
        >
          <div className="w-px h-8 bg-linear-to-b from-primary/30 to-transparent" />
          <span className="text-[10px] font-medium tracking-widest uppercase">Scroll</span>
        </motion.div>
      </div>
    </section>
  );
}
