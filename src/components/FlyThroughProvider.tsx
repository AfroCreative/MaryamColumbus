"use client";

import { createContext, useContext, useRef, type ReactNode } from "react";
import { useScrollTimeline, type ScrollTimeline } from "@/hooks/useScrollTimeline";

const FlyThroughContext = createContext<ScrollTimeline | null>(null);

/**
 * Wraps the scrolling narrative. The wrapper div is the ScrollTrigger target,
 * so the fly-through runs from the top of the first section to the bottom of
 * the last one. The background stage and any overlay can read the shared
 * scroll timeline through `useFlyThrough()`.
 */
export function FlyThroughProvider({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const scroll = useScrollTimeline(rootRef);

  return (
    <FlyThroughContext.Provider value={scroll}>
      <div ref={rootRef} className="relative">
        {children}
      </div>
    </FlyThroughContext.Provider>
  );
}

export function useFlyThrough(): ScrollTimeline {
  const ctx = useContext(FlyThroughContext);
  if (!ctx) throw new Error("useFlyThrough must be used inside <FlyThroughProvider>");
  return ctx;
}
