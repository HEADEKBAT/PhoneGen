'use client';

/**
 * Locale error boundary — catches errors in locale-scoped pages.
 *
 * Unlike the root error.tsx, this renders INSIDE the `[locale]/layout.tsx`,
 * keeping `<AppHeader>` and `<AppFooter>` visible and stable.
 * Only the children slot is replaced by this fallback.
 */

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <div className="mx-auto max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-destructive/10">
            <svg
              className="size-8 text-destructive"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
              />
            </svg>
          </div>
        </div>

        <h1 className="mb-2 text-xl font-bold text-foreground tracking-tight">
          Something went wrong
        </h1>
        <p className="mb-8 text-sm text-muted-foreground">
          An unexpected error occurred on this page. Please try again, or
          refresh if the problem persists.
        </p>

        <button
          onClick={reset}
          className="inline-flex items-center justify-center h-11 px-6 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
