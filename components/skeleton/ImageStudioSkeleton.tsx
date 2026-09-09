'use client';

import { SkeletonBlock, SkeletonHeading, SkeletonText } from './SkeletonPrimitives';

export default function ImageStudioSkeleton() {
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
        <SkeletonText width="60%" />
      </div>

      {/* ── Tabs / mode selector skeleton ───────────────────────────────── */}
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
        <div className="flex gap-1 border-b border-border pb-2">
          {['Background', 'Object', 'Upscaler', 'Enhancer', 'Converter'].map((_, i) => (
            <SkeletonBlock key={i} className="h-9 w-28 rounded-t-lg" />
          ))}
        </div>
      </div>

      {/* ── Main content: upload zone + controls ─────────────────────────── */}
      <section className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Left — upload / preview area */}
          <div className="space-y-4">
            {/* Large upload zone placeholder with dashed border */}
            <SkeletonBlock className="flex min-h-[320px] w-full items-center justify-center rounded-xl">
              <div className="flex flex-col items-center gap-4">
                <SkeletonBlock className="h-12 w-12 rounded-lg" />
                <SkeletonHeading width="40%" />
                <SkeletonText width="55%" />
                <SkeletonBlock className="mt-2 h-10 w-36 rounded-lg" />
              </div>
            </SkeletonBlock>
            {/* Export / action buttons */}
            <div className="flex gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonBlock key={i} className="h-9 w-28 rounded-lg" />
              ))}
            </div>
          </div>

          {/* Right — controls */}
          <div className="space-y-5">
            {/* Quality selector */}
            <div className="space-y-2">
              <SkeletonText width="20%" />
              <SkeletonBlock className="h-10 w-full rounded-xl" />
            </div>
            {/* Background type selector */}
            <div className="space-y-2">
              <SkeletonText width="25%" />
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <SkeletonBlock key={i} className="h-8 w-20 rounded-lg" />
                ))}
              </div>
            </div>
            {/* Slider control */}
            <div className="space-y-2">
              <SkeletonText width="30%" />
              <SkeletonBlock className="h-10 w-full rounded-xl" />
            </div>
            {/* Checkbox / toggle row */}
            <SkeletonBlock className="flex items-center gap-2 p-2">
              <SkeletonBlock className="h-5 w-5 rounded" />
              <SkeletonBlock className="h-4 flex-1 rounded" />
            </SkeletonBlock>
            {/* Edge refinement section */}
            <div className="space-y-3 rounded-xl border border-border p-4">
              <SkeletonText width="25%" />
              <SkeletonBlock className="h-8 w-full rounded-lg" />
              <SkeletonBlock className="h-8 w-full rounded-lg" />
              <SkeletonBlock className="h-8 w-full rounded-lg" />
            </div>
            {/* Apply button */}
            <SkeletonBlock className="h-11 w-full rounded-xl" />
          </div>
        </div>
      </section>
    </div>
  );
}
