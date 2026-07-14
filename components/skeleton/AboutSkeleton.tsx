'use client';

import { SkeletonBlock, SkeletonHeading, SkeletonText } from './SkeletonPrimitives';

export default function AboutSkeleton() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* ── Hero skeleton ──────────────────────────────────────────────── */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <SkeletonHeading className="mx-auto mb-4 text-center" width="50%" />
          <SkeletonBlock className="mx-auto mb-8 h-4 w-24 rounded" />
        </div>
      </section>

      {/* ── Content sections ────────────────────────────────────────────── */}
      <section className="px-4 py-8">
        <div className="mx-auto max-w-3xl space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <SkeletonHeading width="40%" />
              <SkeletonText width="100%" />
              <SkeletonText width="100%" />
              <SkeletonText width="90%" />
              <SkeletonText width="75%" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
