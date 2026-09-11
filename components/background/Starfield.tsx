'use client';

import { useEffect, useRef } from 'react';

/**
 * The hero's night sky, drawn on one canvas.
 *
 * ── Why canvas and not divs ─────────────────────────────────────────────────
 *
 * The layer this replaces placed fifty absolutely-positioned spans, each with
 * two infinite CSS animations and `will-change: transform, opacity` — fifty
 * composited layers the compositor repaints forever, on every page that used
 * it. One canvas draws four times as many stars for a fraction of that, and it
 * can stop: the loop pauses when the hero scrolls away or the tab goes to the
 * background, so a home page left open in a tab costs nothing.
 *
 * ── What is in the sky ──────────────────────────────────────────────────────
 *
 * Three depth layers drifting at different speeds, which is what reads as
 * distance. Stars twinkle on their own phase rather than in lockstep. Every
 * few thousand frames one meteor crosses — rare enough that catching one feels
 * like catching one, instead of a loop you start counting.
 *
 * Under `prefers-reduced-motion` the sky is drawn once and left alone: still a
 * starfield, no movement.
 */

interface Star {
  x: number;
  y: number;
  r: number;
  /** Base brightness before the twinkle is applied. */
  a: number;
  /** Pixels per second, downward — the far layer barely moves. */
  vy: number;
  /** Twinkle phase and rate, per star, so nothing pulses in unison. */
  phase: number;
  rate: number;
}

interface Meteor {
  x: number;
  y: number;
  len: number;
  life: number;
}

/** Star count per million device-independent pixels, by layer. */
const DENSITY = [46, 26, 10] as const;
const LAYER_SPEED = [1.4, 3.2, 6.5] as const;
const LAYER_RADIUS = [0.75, 1.1, 1.7] as const;
const LAYER_ALPHA = [0.42, 0.62, 0.85] as const;
const MAX_STARS = 260;

export default function Starfield({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = 0;
    let height = 0;
    let stars: Star[] = [];
    let meteor: Meteor | null = null;
    let nextMeteorIn = 6 + Math.random() * 14;
    let raf = 0;
    let last = 0;
    let running = false;

    /* Lay out a sky for the current size. Deterministic layout is not needed —
       the canvas is never server-rendered, so there is nothing to match. */
    const build = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const megapixels = (width * height) / 1_000_000;
      stars = [];
      for (let layer = 0; layer < 3; layer++) {
        const count = Math.round(DENSITY[layer] * megapixels);
        for (let i = 0; i < count && stars.length < MAX_STARS; i++) {
          stars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            r: LAYER_RADIUS[layer] * (0.7 + Math.random() * 0.6),
            a: LAYER_ALPHA[layer] * (0.6 + Math.random() * 0.4),
            vy: LAYER_SPEED[layer],
            phase: Math.random() * Math.PI * 2,
            rate: 0.25 + Math.random() * 0.5,
          });
        }
      }
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, width, height);

      for (const star of stars) {
        const twinkle = reduced ? 1 : 0.72 + 0.28 * Math.sin(star.phase + t * star.rate);
        ctx.globalAlpha = star.a * twinkle;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fillStyle = '#eaf3ef';
        ctx.fill();
      }

      if (meteor) {
        const fade = Math.sin(Math.PI * (1 - meteor.life));
        const tailX = meteor.x - meteor.len * 0.82;
        const tailY = meteor.y - meteor.len * 0.42;
        const gradient = ctx.createLinearGradient(meteor.x, meteor.y, tailX, tailY);
        gradient.addColorStop(0, `rgba(255, 200, 150, ${0.75 * fade})`);
        gradient.addColorStop(1, 'rgba(255, 200, 150, 0)');
        ctx.globalAlpha = 1;
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(meteor.x, meteor.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
    };

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const seconds = now / 1000;

      for (const star of stars) {
        star.y += star.vy * dt;
        if (star.y - star.r > height) {
          star.y = -star.r;
          star.x = Math.random() * width;
        }
      }

      nextMeteorIn -= dt;
      if (!meteor && nextMeteorIn <= 0) {
        meteor = {
          x: width * (0.35 + Math.random() * 0.6),
          y: height * Math.random() * 0.45,
          len: 90 + Math.random() * 70,
          life: 1,
        };
        nextMeteorIn = 14 + Math.random() * 22;
      }
      if (meteor) {
        meteor.life -= dt * 1.6;
        meteor.x += 260 * dt;
        meteor.y += 135 * dt;
        if (meteor.life <= 0) meteor = null;
      }

      draw(seconds);
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running || reduced) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    build();
    draw(0);

    if (reduced) {
      const onResize = () => {
        build();
        draw(0);
      };
      window.addEventListener('resize', onResize);
      return () => window.removeEventListener('resize', onResize);
    }

    /* Only run while the hero is actually on screen and the tab is in front. */
    const observer = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting && !document.hidden ? start() : stop()),
      { threshold: 0 },
    );
    observer.observe(canvas);

    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVisibility);

    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        build();
        draw(performance.now() / 1000);
      }, 150);
    };
    window.addEventListener('resize', onResize);

    return () => {
      stop();
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('resize', onResize);
      window.clearTimeout(resizeTimer);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className={className} />;
}
