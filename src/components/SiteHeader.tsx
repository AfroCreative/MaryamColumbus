"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { church, navLinks } from "@/lib/campaign";

/** Tracks which section is under the header so the menu can highlight it. */
function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const sections = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) setActive(visible[0].target.id);
      },
      // A thin band just below the header: whichever section crosses it is current.
      { rootMargin: "-90px 0px -70% 0px" },
    );
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids]);

  return active;
}

const ids = navLinks.map((l) => l.id);

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const active = useActiveSection(ids);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-navy/10 bg-cream/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <a href="#top" className="flex min-w-0 items-center gap-3" onClick={() => setOpen(false)}>
          <Image src="/debre-brhan-emblem.png" alt="" width={40} height={40} className="h-10 w-10 shrink-0" priority />
          <span className="min-w-0 leading-tight">
            <span className="block truncate font-display text-xl font-semibold text-navy">{church.shortName}</span>
            <span className="block truncate text-xs text-navy/60">
              {church.parish}
              <span className="hidden sm:inline"> · Columbus, Ohio</span>
            </span>
          </span>
        </a>

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {navLinks.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              aria-current={active === l.id ? "location" : undefined}
              className={`rounded-full px-3.5 py-2 text-sm font-medium transition ${
                active === l.id ? "bg-navy/10 text-navy" : "text-navy/70 hover:bg-navy/5 hover:text-navy"
              }`}
            >
              {l.label}
            </a>
          ))}
          <a
            href="#give"
            className="ml-2 rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-navy-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
          >
            Donate
          </a>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <a href="#give" className="rounded-full bg-navy px-4 py-2 text-sm font-semibold text-white">
            Donate
          </a>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-navy ring-1 ring-navy/15 transition hover:bg-navy/5"
          >
            <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
              {open ? (
                <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-menu" aria-label="Main" className="border-t border-navy/10 bg-cream px-4 pt-2 pb-4 md:hidden">
          <ul className="space-y-1">
            {navLinks.map((l) => (
              <li key={l.id}>
                <a
                  href={`#${l.id}`}
                  onClick={() => setOpen(false)}
                  aria-current={active === l.id ? "location" : undefined}
                  className={`block rounded-xl px-4 py-3 text-base font-medium ${
                    active === l.id ? "bg-navy/10 text-navy" : "text-navy/80 hover:bg-navy/5"
                  }`}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
