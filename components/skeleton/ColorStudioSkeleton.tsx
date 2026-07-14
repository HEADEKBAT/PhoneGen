'use client';

import { SkeletonBlock, SkeletonHeading, SkeletonText } from './SkeletonPrimitives';

export default function ColorStudioSkeleton() {
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
        <SkeletonText width="70%" />
      </div>

      {/* ── Tabs skeleton ────────────────────────────────────────────────── */}
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
        <div className="flex gap-1 border-b border-border pb-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonBlock key={i} className="h-9 w-24 rounded-t-lg" />
          ))}
        </div>
      </div>

      {/* ── Main content: color picker + preview ─────────────────────────── */}
      <section className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Left — color preview */}
          <div className="space-y-4">
            <SkeletonBlock className="flex min-h-[280px] w-full items-center justify-center rounded-xl">
              <div className="flex flex-col items-center gap-4">
                {/* Color swatch preview */}
                <div className="flex gap-2">
                  {['#ef4444', '#f97316', '#22c55e', '#3b82f6', '#a855f7'].map((_, i) => (
                    <SkeletonBlock
                      key={i}
                      className="h-16 w-16 rounded-lg"
                    />
                  ))}
                </div>
                <SkeletonText width="50%" />
              </div>
            </SkeletonBlock>
            {/* Export buttons */}
            <div className="flex gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonBlock key={i} className="h-9 w-24 rounded-lg" />
              ))}
            </div>
          </div>

          {/* Right — color controls */}
          <div className="space-y-5">
            <div className="space-y-2">
              <SkeletonText width="20%" />
              <SkeletonBlock className="h-10 w-full rounded-xl" />
            </div>
            <div className="space-y-2">
              <SkeletonText width="25%" />
              <SkeletonBlock className="h-10 w-full rounded-xl" />
            </div>
            <SkeletonBlock className="h-10 w-full rounded-xl" />
            <div className="space-y-2">
              <SkeletonText width="30%" />
              <SkeletonBlock className="flex items-center gap-2 p-2">
                <SkeletonBlock className="h-8 w-8 rounded-lg" />
                <SkeletonBlock className="h-8 flex-1 rounded-lg" />
                <SkeletonBlock className="h-8 w-8 rounded-lg" />
              </SkeletonBlock>
            </div>
            <SkeletonBlock className="h-36 w-full rounded-xl" />
          </div>
        </div>
      </section>
    </div>
  );
}
