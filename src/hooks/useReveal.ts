"use client";

import type { RefObject } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * Fades and lifts every `[data-reveal]` descendant of `scope` into place when
 * the section enters the viewport, and reverses when scrolling back up.
 * Elements may set `data-reveal-delay` (seconds) to fine-tune the stagger.
 */
export function useReveal(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const items = gsap.utils.toArray<HTMLElement>("[data-reveal]");
      if (!items.length) return;

      // Content is hidden by CSS until GSAP has taken control of it.
      const release = () => document.documentElement.classList.remove("js-reveal-pending");

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(items, { autoAlpha: 1, y: 0 });
        release();
        return;
      }

      gsap.set(items, { autoAlpha: 0, y: 48 });
      release();
      gsap.to(items, {
        autoAlpha: 1,
        y: 0,
        duration: 1.1,
        ease: "power3.out",
        stagger: (i, el) => Number((el as HTMLElement).dataset.revealDelay ?? i * 0.12),
        scrollTrigger: {
          trigger: scope.current,
          start: "top 65%",
          end: "bottom 35%",
          toggleActions: "play reverse play reverse",
        },
      });
    },
    { scope },
  );
}
