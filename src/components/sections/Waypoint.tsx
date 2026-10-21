"use client";

import { useRef, type ReactNode } from "react";
import { useReveal } from "@/hooks/useReveal";
import type { WaypointId } from "@/lib/campaign";

/**
 * One scroll "stop" of the fly-through. Each waypoint is at least a full
 * viewport tall so the camera has room to travel between them.
 */
export function Waypoint({
  id,
  children,
  className = "",
}: {
  id: WaypointId;
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);

  return (
    <section
      ref={ref}
      id={id}
      data-waypoint={id}
      className={`relative flex min-h-screen items-center px-6 py-24 sm:px-12 lg:px-24 ${className}`}
    >
      {children}
    </section>
  );
}
