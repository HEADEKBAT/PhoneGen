/**
 * Locale loading boundary — shown during navigation between locale pages.
 *
 * The `<AppHeader>` and `<AppFooter>` from the parent layout remain
 * visible and stable. Only the children slot is replaced by this skeleton.
 */
import { SkeletonBlock, SkeletonHeading, SkeletonText } from '@/components/skeleton/SkeletonPrimitives';

export default function LocaleLoading() {
  return (
    <div className="flex min-h-[60vh] flex-col">
      {/* ── Breadcrumb placeholder ──────────────────────────────────────── */}
      <div className="mx-auto flex w-full max-w-5xl items-center gap-2 px-4 py-3 sm:px-6">
        <SkeletonBlock className="h-4 w-16 rounded" />
        <SkeletonBlock className="h-3 w-3 rounded-full" />
        <SkeletonBlock className="h-4 w-24 rounded" />
      </div>

      {/* ── Hero or header area ─────────────────────────────────────────── */}
      <section className="px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <SkeletonHeading className="mb-4" width="55%" />
          <SkeletonText className="mb-2" width="80%" />
          <SkeletonText width="60%" />
        </div>
      </section>

      {/* ── Content grid ────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl border border-border bg-card p-6 space-y-4"
              >
                <div className="flex items-center gap-3">
                  <SkeletonBlock className="h-10 w-10 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <SkeletonBlock className="h-5 w-3/4 rounded" />
                    <SkeletonBlock className="h-3 w-1/2 rounded" />
                  </div>
                </div>
                <div className="space-y-2">
                  <SkeletonText width="100%" />
                  <SkeletonText width="85%" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom spacing ──────────────────────────────────────────────── */}
      <div className="flex-1" />
    </div>
  );
}
