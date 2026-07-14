'use client';

import { SkeletonBlock, SkeletonHeading, SkeletonText, SkeletonCard } from './SkeletonPrimitives';

export default function ProductLandingSkeleton() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* ── Hero skeleton ──────────────────────────────────────────────── */}
      <section className="relative px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <SkeletonHeading className="mb-4" width="50%" />
          <SkeletonText className="mb-2" width="80%" />
          <SkeletonText className="mb-8" width="65%" />
          <div className="flex gap-3">
            <SkeletonBlock className="h-12 w-40 rounded-xl" />
            <SkeletonBlock className="h-12 w-40 rounded-xl" />
          </div>
        </div>
      </section>

      {/* ── Feature grid ───────────────────────────────────────────────── */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-5xl">
          <SkeletonHeading className="mx-auto mb-8 text-center" width="35%" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Example section ─────────────────────────────────────────────── */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-5xl">
          <SkeletonHeading className="mx-auto mb-8 text-center" width="25%" />
          <SkeletonBlock className="mx-auto h-64 w-full max-w-2xl rounded-xl" />
        </div>
      </section>

      {/* ── FAQ skeleton ────────────────────────────────────────────────── */}
      <section className="px-4 py-12">
        <SkeletonHeading className="mx-auto mb-8 text-center" width="30%" />
        <div className="mx-auto max-w-3xl space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonBlock key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      </section>
    </div>
  );
}
