'use client';

import { SkeletonBlock, SkeletonHeading } from './SkeletonPrimitives';

export default function FaqSkeleton() {
  return (
    <section className="px-4 py-12">
      <SkeletonHeading className="mx-auto mb-8 text-center" width="35%" />
      <div className="mx-auto max-w-3xl space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonBlock key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    </section>
  );
}
