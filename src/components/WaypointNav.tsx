"use client";

import { useState } from "react";
import { navLabels, waypoints, type WaypointId } from "@/lib/campaign";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";

/** Side rail of dots marking each waypoint; the active one tracks scroll. */
export function WaypointNav() {
  const [active, setActive] = useState<WaypointId>("hero");

  useGSAP(() => {
    waypoints.forEach(({ id }) => {
      ScrollTrigger.create({
        trigger: `#${id}`,
        start: "top center",
        end: "bottom center",
        onToggle: (self) => self.isActive && setActive(id),
      });
    });
  });

  return (
    <nav aria-label="Sections" className="fixed top-1/2 right-6 z-20 hidden -translate-y-1/2 lg:block">
      <ol className="flex flex-col gap-4">
        {waypoints.map(({ id }) => {
          const isActive = id === active;
          return (
            <li key={id}>
              <a
                href={`#${id}`}
                aria-current={isActive ? "step" : undefined}
                className="group flex items-center justify-end gap-3"
              >
                <span
                  className={`text-[0.65rem] uppercase tracking-[0.25em] transition duration-500 ${
                    isActive ? "text-gold-soft opacity-100" : "text-parchment/60 opacity-0 group-hover:opacity-100"
                  }`}
                >
                  {navLabels[id]}
                </span>
                <span
                  className={`block h-2 rounded-full transition-all duration-500 ${
                    isActive ? "w-6 bg-gold" : "w-2 bg-parchment/40 group-hover:bg-parchment/80"
                  }`}
                />
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
