'use client';

import { SkeletonBlock, SkeletonHeading, SkeletonText } from './SkeletonPrimitives';

export default function GeneratorToolSkeleton() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* ── Breadcrumb skeleton ─────────────────────────────────────────── */}
      <div className="mx-auto flex w-full max-w-5xl items-center gap-2 px-4 py-3 sm:px-6">
        <SkeletonBlock className="h-4 w-16 rounded" />
        <SkeletonBlock className="h-3 w-3 rounded-full" />
        <SkeletonBlock className="h-4 w-24 rounded" />
        <SkeletonBlock className="h-3 w-3 rounded-full" />
        <SkeletonBlock className="h-4 w-20 rounded" />
      </div>

      {/* ── Page header ─────────────────────────────────────────────────── */}
      <div className="mx-auto w-full max-w-5xl px-4 pt-6 pb-2 sm:px-6">
        <SkeletonHeading className="mb-2" width="45%" />
        <SkeletonText width="70%" />
      </div>

      {/* ── Controls + preview grid ─────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Left — preview area */}
          <div className="space-y-4">
            <SkeletonBlock className="flex h-64 w-full items-center justify-center rounded-xl">
              <div className="flex flex-col items-center gap-3">
                <SkeletonBlock className="h-24 w-48 rounded" />
                <SkeletonText width="60%" />
              </div>
            </SkeletonBlock>
            {/* Export buttons */}
            <div className="flex gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <SkeletonBlock key={i} className="h-9 w-20 rounded-lg" />
              ))}
            </div>
          </div>

          {/* Right — controls */}
          <div className="space-y-5">
            <div className="space-y-2">
              <SkeletonText width="30%" />
              <SkeletonBlock className="h-10 w-full rounded-xl" />
            </div>
            <div className="space-y-2">
              <SkeletonText width="25%" />
              <SkeletonBlock className="h-10 w-full rounded-xl" />
            </div>
            <SkeletonBlock className="h-10 w-full rounded-xl" />
            <div className="space-y-2">
              <SkeletonText width="40%" />
              <SkeletonBlock className="h-32 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
