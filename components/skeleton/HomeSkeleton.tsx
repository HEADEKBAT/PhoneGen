'use client';

import { SkeletonBlock, SkeletonHeading, SkeletonText, SkeletonCard } from './SkeletonPrimitives';

export default function HomeSkeleton() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* ── Hero skeleton ──────────────────────────────────────────────── */}
      <section className="relative flex flex-col items-center justify-center px-4 py-24 text-center">
        <SkeletonBlock className="mx-auto mb-6 h-12 w-72 rounded-lg" />
        <SkeletonBlock className="mx-auto mb-4 h-6 w-96 max-w-full rounded-lg" />
        <SkeletonBlock className="mx-auto h-5 w-80 max-w-full rounded-lg" />
        <div className="mt-8 flex gap-4">
          <SkeletonBlock className="h-12 w-36 rounded-xl" />
          <SkeletonBlock className="h-12 w-36 rounded-xl" />
        </div>
      </section>

      {/* ── Stats skeleton ──────────────────────────────────────────────── */}
      <section className="px-4 py-12">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </section>

      {/* ── Products grid skeleton ──────────────────────────────────────── */}
      <section className="px-4 py-12">
        <SkeletonHeading className="mx-auto mb-8 text-center" width="40%" />
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </section>

      {/* ── FAQ skeleton ────────────────────────────────────────────────── */}
      <section className="px-4 py-12">
        <SkeletonHeading className="mx-auto mb-8 text-center" width="30%" />
        <div className="mx-auto max-w-3xl space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonBlock key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      </section>

      {/* ── CTA skeleton ────────────────────────────────────────────────── */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-2xl">
          <SkeletonBlock className="mx-auto h-16 w-full max-w-lg rounded-2xl" />
        </div>
      </section>
    </div>
  );
}
