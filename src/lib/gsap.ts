"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Register plugins exactly once, client-side only. Every component that needs
// GSAP should import from here rather than from "gsap" directly so the plugin
// registration and global defaults are always applied.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);

  gsap.defaults({ ease: "power3.out", duration: 1 });

  ScrollTrigger.config({
    // Avoid a full refresh when the mobile URL bar shows/hides, which would
    // otherwise cause the fly-through to jump.
    ignoreMobileResize: true,
  });

  // Lag smoothing keeps the ticker from "catching up" with a huge delta after a
  // dropped frame, which would make the smoothed scroll value lurch.
  gsap.ticker.lagSmoothing(500, 33);
}

export { gsap, ScrollTrigger, useGSAP };
