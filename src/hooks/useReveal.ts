"use client";

import type { RefObject } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

const HIDDEN_BELOW = { autoAlpha: 0, y: 48 };
const HIDDEN_ABOVE = { autoAlpha: 0, y: -32 };

/**
 * Fades and lifts every `[data-reveal]` descendant of `scope` into place as
 * it enters the viewport, and lets it drift away as it scrolls off the top,
 * so copy appears and dissolves with the camera's progress. Each element is
 * triggered on its own position (batched for staggering), which keeps tall
 * sections correct on small screens.
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

      gsap.set(items, HIDDEN_BELOW);
      release();

      const show = (batch: Element[]) =>
        gsap.to(batch, { autoAlpha: 1, y: 0, duration: 1.1, ease: "power3.out", stagger: 0.12, overwrite: true });

      ScrollTrigger.batch(items, {
        start: "top 88%",
        end: "bottom 8%",
        onEnter: show,
        onEnterBack: show,
        onLeave: (batch) =>
          gsap.to(batch, { ...HIDDEN_ABOVE, duration: 0.6, ease: "power2.in", stagger: 0.05, overwrite: true }),
        onLeaveBack: (batch) =>
          gsap.to(batch, { ...HIDDEN_BELOW, duration: 0.6, ease: "power2.in", stagger: 0.05, overwrite: true }),
      });
    },
    { scope },
  );
}
