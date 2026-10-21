"use client";

import { useRef } from "react";
import { campaign, formatShortUSD, formatUSD } from "@/lib/campaign";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * Raised-vs-goal meter. When it scrolls into view the bar fills and the
 * figures count up from zero; numbers are server-rendered at their final
 * values so they're correct without JavaScript.
 */
export function ProgressMeter() {
  const ref = useRef<HTMLDivElement>(null);
  const { goal, raised, milestones } = campaign;
  const pct = Math.min(raised / goal, 1);
  const remaining = Math.max(goal - raised, 0);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;

      const counters = gsap.utils.toArray<HTMLElement>("[data-count]");
      const state = { p: 0 };
      const render = () => {
        counters.forEach((el) => {
          const target = Number(el.dataset.count);
          const value = target * state.p;
          el.textContent = el.dataset.format === "pct" ? `${Math.round(value)}%` : formatUSD(Math.round(value));
        });
      };

      const tl = gsap.timeline({
        scrollTrigger: { trigger: ref.current, start: "top 75%", once: true },
      });
      tl.fromTo("[data-bar]", { scaleX: 0 }, { scaleX: pct, duration: 2.2, ease: "power3.inOut" }, 0)
        .fromTo(state, { p: 0 }, { p: 1, duration: 2.2, ease: "power3.inOut", onUpdate: render }, 0)
        .from("[data-milestone]", { autoAlpha: 0, y: 8, stagger: 0.12, duration: 0.6 }, 0.4);
      render();
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="w-full">
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-2">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gold-soft/80">Raised so far</p>
          <p className="mt-2 font-display text-6xl font-light tabular-nums sm:text-7xl" data-count={raised}>
            {formatUSD(raised)}
          </p>
        </div>
        <p className="pb-3 text-parchment/70">
          of <span className="text-parchment">{formatUSD(goal)}</span> goal
        </p>
      </div>

      <div
        role="progressbar"
        aria-label="Funds raised toward goal"
        aria-valuemin={0}
        aria-valuemax={goal}
        aria-valuenow={raised}
        aria-valuetext={`${formatUSD(raised)} of ${formatUSD(goal)}`}
        className="relative mt-8 h-3 rounded-full bg-white/10 ring-1 ring-white/10"
      >
        <div
          data-bar
          className="absolute inset-y-0 left-0 w-full origin-left rounded-full bg-gradient-to-r from-gold/70 via-gold to-gold-soft shadow-[0_0_24px_rgb(212_180_106/0.55)]"
          style={{ transform: `scaleX(${pct})` }}
        />
        {milestones.map((m) => (
          <span
            key={m}
            className="absolute top-1/2 h-5 w-px -translate-y-1/2 bg-parchment/40"
            style={{ left: `${(m / goal) * 100}%` }}
          />
        ))}
      </div>
      <div className="relative mt-3 h-5 text-xs text-parchment/60">
        {milestones.map((m) => (
          <span
            key={m}
            data-milestone
            className="absolute -translate-x-1/2 tabular-nums"
            style={{ left: `${(m / goal) * 100}%` }}
          >
            {formatShortUSD(m)}
          </span>
        ))}
      </div>

      <dl className="mt-10 grid grid-cols-3 divide-x divide-white/10 rounded-2xl border border-white/10 bg-ink/40 backdrop-blur-sm">
        {[
          { label: "Complete", value: Math.round(pct * 100), format: "pct" },
          { label: "Remaining", value: remaining, format: "usd" },
          { label: "Goal", value: goal, format: "usd", static: true },
        ].map((s) => (
          <div key={s.label} className="min-w-0 px-3 py-4 sm:px-6 sm:py-5">
            <dt className="text-[0.6rem] uppercase tracking-[0.2em] text-parchment/60 sm:text-[0.65rem] sm:tracking-[0.25em]">{s.label}</dt>
            <dd
              className="mt-1 font-display text-lg tabular-nums sm:text-3xl"
              {...(s.static ? {} : { "data-count": s.value, "data-format": s.format })}
            >
              {s.format === "pct" ? `${s.value}%` : formatUSD(s.value)}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
