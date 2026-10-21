"use client";

import { useCallback, useRef, type RefObject } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

export type ProgressListener = (progress: number, velocity: number) => void;

export interface ScrollTimelineOptions {
  /**
   * Fraction of the remaining distance covered per 60fps frame (0–1).
   * Lower = silkier but laggier. 1 disables smoothing.
   */
  smoothing?: number;
  /** ScrollTrigger start/end relative to the trigger element. */
  start?: string;
  end?: string;
}

export interface ScrollTimeline {
  /** Raw scrubbed progress straight from ScrollTrigger (0–1). */
  rawProgress: RefObject<number>;
  /** Interpolated progress the renderer should read every frame (0–1). */
  progress: RefObject<number>;
  /**
   * The scrubbed master timeline (duration 1, linear). Renderers can add
   * their own tweens to it (e.g. camera keyframes) with positions in 0–1.
   */
  timeline: RefObject<gsap.core.Timeline | null>;
  /** Subscribe to smoothed progress updates; returns an unsubscribe fn. */
  subscribe: (fn: ProgressListener) => () => void;
}

/**
 * Binds a GSAP timeline to the scroll position of `trigger` with
 * `scrub: true`, then layers a frame-rate–independent lerp on top so abrupt
 * scrolls (trackpad flicks, scrollbar drags, keyboard jumps) glide instead of
 * snapping. Rendering code reads `progress.current` inside its own frame loop
 * — no React re-renders happen on scroll.
 */
export function useScrollTimeline(
  trigger: RefObject<HTMLElement | null>,
  { smoothing = 0.08, start = "top top", end = "bottom bottom" }: ScrollTimelineOptions = {},
): ScrollTimeline {
  const rawProgress = useRef(0);
  const progress = useRef(0);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const listeners = useRef(new Set<ProgressListener>());

  const subscribe = useCallback((fn: ProgressListener) => {
    listeners.current.add(fn);
    return () => {
      listeners.current.delete(fn);
    };
  }, []);

  useGSAP(
    () => {
      if (!trigger.current) return;

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const lerp = reducedMotion ? 1 : smoothing;

      // A proxy object scrubbed from 0→1; the timeline is the "playhead" of
      // the fly-through. Its duration is 1 so child tweens can be positioned
      // directly in normalized progress units.
      const playhead = { t: 0 };
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: trigger.current,
          start,
          end,
          scrub: true,
          invalidateOnRefresh: true,
        },
        onUpdate: () => {
          rawProgress.current = playhead.t;
        },
      });
      tl.to(playhead, { t: 1, duration: 1 }, 0);
      timeline.current = tl;

      // Start from the current scroll position (e.g. after a reload mid-page)
      // instead of gliding in from 0.
      ScrollTrigger.refresh();
      rawProgress.current = tl.scrollTrigger?.progress ?? 0;
      progress.current = rawProgress.current;

      let last = progress.current;
      const tick = (_time: number, deltaMs: number) => {
        // Frame-rate–independent exponential smoothing.
        const k = 1 - Math.pow(1 - lerp, deltaMs / (1000 / 60));
        const target = rawProgress.current;
        let next = progress.current + (target - progress.current) * k;
        if (Math.abs(target - next) < 1e-5) next = target;
        progress.current = next;

        if (next !== last) {
          const velocity = (next - last) / Math.max(deltaMs, 1);
          last = next;
          listeners.current.forEach((fn) => fn(next, velocity));
        }
      };
      gsap.ticker.add(tick);

      return () => {
        gsap.ticker.remove(tick);
        timeline.current = null;
      };
    },
    { dependencies: [smoothing, start, end], revertOnUpdate: true },
  );

  return { rawProgress, progress, timeline, subscribe };
}
