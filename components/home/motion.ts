/**
 * Shared motion settings for the home page.
 *
 * ── The rule these encode ───────────────────────────────────────────────────
 *
 * A section may animate in, but it must not be parked invisible waiting for an
 * observer that might never fire. The previous home page wrapped every section
 * in `whileInView` with `viewport={{ margin: '-80px' }}`, which delays the
 * trigger until the section is 80px inside the viewport — and `<main>` carried
 * `overflow-hidden`, so anything that failed to trigger stayed at opacity 0
 * with no way to reveal it. Scrolling fast, or landing on an anchor, left
 * blank screens.
 *
 * `amount: 0` fires the moment a single pixel enters the viewport, and
 * `once: true` means a revealed section stays revealed. Reduced motion turns
 * the whole thing off rather than shortening it.
 */

/** Viewport config for scroll reveals: trigger early, never repeat. */
export const REVEAL_VIEWPORT = { once: true, amount: 0 } as const;

/** The page's single easing curve. */
export const EASE = [0.22, 0.61, 0.36, 1] as const;

/** A section rising into place. */
export const revealUp = {
  hidden: { opacity: 0, y: 14 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
};

/** A list that deals its children out one after another. */
export const stagger = (step = 0.045, delay = 0) => ({
  hidden: {},
  shown: { transition: { staggerChildren: step, delayChildren: delay } },
});

/** One card inside a staggered list. */
export const revealCard = {
  hidden: { opacity: 0, y: 10 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.34, ease: EASE } },
};
