'use client';

import { SkeletonBlock, SkeletonHeading, SkeletonText } from './SkeletonPrimitives';

export default function BarcodeSkeleton() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* ── Breadcrumb skeleton ─────────────────────────────────────────── */}
      <div className="mx-auto flex w-full max-w-5xl items-center gap-2 px-4 py-3 sm:px-6">
        <SkeletonBlock className="h-4 w-16 rounded" />
        <SkeletonBlock className="h-3 w-3 rounded-full" />
        <SkeletonBlock className="h-4 w-32 rounded" />
        <SkeletonBlock className="h-3 w-3 rounded-full" />
        <SkeletonBlock className="h-4 w-24 rounded" />
      </div>

      {/* ── Page header ─────────────────────────────────────────────────── */}
      <div className="mx-auto w-full max-w-5xl px-4 pt-6 pb-2 sm:px-6">
        <SkeletonHeading className="mb-2" width="40%" />
        <SkeletonText width="75%" />
      </div>

      {/* ── Tabs skeleton ────────────────────────────────────────────────── */}
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
        <div className="flex gap-1 border-b border-border pb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonBlock key={i} className="h-9 w-28 rounded-t-lg" />
          ))}
        </div>
      </div>

      {/* ── Main content: preview + controls ─────────────────────────────── */}
      <section className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Left — barcode preview */}
          <div className="space-y-4">
            <SkeletonBlock className="flex min-h-[250px] w-full items-center justify-center rounded-xl">
              <div className="flex flex-col items-center gap-4">
                <SkeletonBlock className="h-24 w-56 rounded" />
                <div className="flex items-center gap-1">
                  {/* Simulated barcode bars — deterministic heights */}
                  {[48, 32, 56, 40, 64, 36, 52, 44, 60, 38, 50, 42, 58, 34, 62, 46, 54, 30, 48, 56].map(
                    (h, i) => (
                      <SkeletonBlock
                        key={i}
                        className="w-1.5 rounded-full"
                        style={{ height: `${h}px` }}
                      />
                    ),
                  )}
                </div>
                <SkeletonText width="70%" />
              </div>
            </SkeletonBlock>
            {/* Export buttons */}
            <div className="flex gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <SkeletonBlock key={i} className="h-9 w-20 rounded-lg" />
              ))}
            </div>
            {/* Details skeleton */}
            <SkeletonBlock className="h-40 w-full rounded-xl" />
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
            <SkeletonBlock className="h-48 w-full rounded-xl" />
          </div>
        </div>
      </section>
    </div>
  );
}
