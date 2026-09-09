'use client';

import { SkeletonBlock, SkeletonHeading, SkeletonText } from './SkeletonPrimitives';

export default function MediaStudioSkeleton() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* ── Breadcrumb skeleton ─────────────────────────────────────────── */}
      <div className="mx-auto flex w-full max-w-5xl items-center gap-2 px-4 py-3 sm:px-6">
        <SkeletonBlock className="h-4 w-16 rounded" />
        <SkeletonBlock className="h-3 w-3 rounded-full" />
        <SkeletonBlock className="h-4 w-28 rounded" />
        <SkeletonBlock className="h-3 w-3 rounded-full" />
        <SkeletonBlock className="h-4 w-24 rounded" />
      </div>

      {/* ── Page header ─────────────────────────────────────────────────── */}
      <div className="mx-auto w-full max-w-5xl px-4 pt-6 pb-2 sm:px-6">
        <SkeletonHeading className="mb-2" width="35%" />
        <SkeletonText width="60%" />
      </div>

      {/* ── Tabs skeleton ───────────────────────────────────────────────── */}
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
        <div className="flex gap-1 border-b border-border pb-2">
          {['Converter', 'Formats', 'Codecs', 'Guide', 'History'].map((_, i) => (
            <SkeletonBlock key={i} className="h-9 w-24 rounded-t-lg" />
          ))}
        </div>
      </div>

      {/* ── Main content: upload zone + controls ─────────────────────────── */}
      <section className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Left — upload / preview area */}
          <div className="space-y-4">
            <SkeletonBlock className="flex min-h-[320px] w-full items-center justify-center rounded-xl">
              <div className="flex flex-col items-center gap-4">
                <SkeletonBlock className="h-12 w-12 rounded-lg" />
                <SkeletonHeading width="40%" />
                <SkeletonText width="55%" />
                <SkeletonBlock className="mt-2 h-10 w-36 rounded-lg" />
              </div>
            </SkeletonBlock>
            {/* Analysis cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonBlock key={i} className="h-20 rounded-xl" />
              ))}
            </div>
          </div>

          {/* Right — controls */}
          <div className="space-y-5">
            {/* Format selector */}
            <div className="space-y-2">
              <SkeletonText width="20%" />
              <div className="grid grid-cols-2 gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <SkeletonBlock key={i} className="h-24 rounded-xl" />
                ))}
              </div>
            </div>
            {/* Presets */}
            <div className="space-y-2">
              <SkeletonText width="15%" />
              <div className="flex gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <SkeletonBlock key={i} className="h-10 flex-1 rounded-lg" />
                ))}
              </div>
            </div>
            {/* Settings */}
            <div className="space-y-2 rounded-xl border border-border p-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonBlock key={i} className="h-8 w-full rounded-lg" />
              ))}
            </div>
            {/* Convert button */}
            <SkeletonBlock className="h-11 w-full rounded-xl" />
          </div>
        </div>
      </section>
    </div>
  );
}
