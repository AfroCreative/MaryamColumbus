"use client";

import Image from "next/image";
import { useState } from "react";
import { church } from "@/lib/campaign";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useGSAP(() => {
    ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => setScrolled(self.scroll() > 80),
      onRefresh: (self) => setScrolled(self.scroll() > 80),
    });
  });

  return (
    <header
      className={`fixed inset-x-0 top-0 z-30 transition-[background-color,backdrop-filter,border-color] duration-500 ${
        scrolled ? "border-b border-white/10 bg-ink/60 backdrop-blur-md" : "border-b border-transparent"
      } px-6 sm:px-12 lg:px-24`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 py-3">
        <a href="#hero" className="flex min-w-0 items-center gap-3">
          <Image src="/debre-brhan-emblem.png" alt="" width={40} height={40} className="h-10 w-10 shrink-0" priority />
          <span className="min-w-0 leading-tight">
            <span className="block truncate font-display text-lg text-parchment">{church.shortName}</span>
            <span className="block truncate text-[0.65rem] uppercase tracking-[0.25em] text-gold-soft/80">
              {church.parish}
              <span className="hidden sm:inline"> · Columbus</span>
            </span>
          </span>
        </a>
        <a
          href="#give"
          className="shrink-0 rounded-full bg-gold px-5 py-2 text-sm font-medium text-ink transition hover:bg-gold-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          Give now
        </a>
      </div>
    </header>
  );
}
