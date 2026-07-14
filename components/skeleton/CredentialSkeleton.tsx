'use client';

import { SkeletonBlock, SkeletonHeading, SkeletonText } from './SkeletonPrimitives';

export default function CredentialSkeleton() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* ── Breadcrumb skeleton ─────────────────────────────────────────── */}
      <div className="mx-auto flex w-full max-w-5xl items-center gap-2 px-4 py-3 sm:px-6">
        <SkeletonBlock className="h-4 w-16 rounded" />
        <SkeletonBlock className="h-3 w-3 rounded-full" />
        <SkeletonBlock className="h-4 w-36 rounded" />
        <SkeletonBlock className="h-3 w-3 rounded-full" />
        <SkeletonBlock className="h-4 w-28 rounded" />
      </div>

      {/* ── Page header ─────────────────────────────────────────────────── */}
      <div className="mx-auto w-full max-w-5xl px-4 pt-6 pb-2 sm:px-6">
        <SkeletonHeading className="mb-2" width="35%" />
        <SkeletonText width="65%" />
      </div>

      {/* ── Tabs skeleton ────────────────────────────────────────────────── */}
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
        <div className="flex gap-1 border-b border-border pb-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonBlock key={i} className="h-9 w-32 rounded-t-lg" />
          ))}
        </div>
      </div>

      {/* ── Content: two-column ─────────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Left — results area */}
          <div className="space-y-3">
            <SkeletonBlock className="h-12 w-full rounded-xl" />
            <SkeletonBlock className="h-12 w-full rounded-xl" />
            <SkeletonBlock className="h-12 w-full rounded-xl" />
            <SkeletonBlock className="h-12 w-full rounded-xl" />
            <SkeletonBlock className="h-12 w-full rounded-xl" />
          </div>

          {/* Right — controls */}
          <div className="space-y-5">
            <div className="space-y-2">
              <SkeletonText width="25%" />
              <SkeletonBlock className="h-10 w-full rounded-xl" />
            </div>
            <div className="space-y-2">
              <SkeletonText width="30%" />
              <SkeletonBlock className="h-10 w-full rounded-xl" />
            </div>
            <SkeletonBlock className="h-10 w-full rounded-xl" />
            <SkeletonBlock className="h-10 w-full rounded-xl" />
            <SkeletonBlock className="h-40 w-full rounded-xl" />
          </div>
        </div>
      </section>
    </div>
  );
}
