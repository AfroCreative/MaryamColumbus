"use client";

import { useEffect, useRef, useState } from "react";
import { campaign, formatShortUSD, formatUSD, fundraisingEvent } from "@/lib/campaign";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * Shows the launch state until the first gift is recorded, then the live
 * raised-vs-goal meter. Updating `campaign.raised` flips it automatically.
 */
export function ProgressMeter() {
  return campaign.raised > 0 ? <LiveMeter /> : <LaunchMeter />;
}

/**
 * Raised-vs-goal meter. When it scrolls into view the bar fills and the
 * figures count up from zero; numbers are server-rendered at their final
 * values so they're correct without JavaScript.
 */
function LiveMeter() {
  const ref = useRef<HTMLDivElement>(null);
  const { goal, raised } = campaign;
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
        <Milestones />
      </div>
      <MilestoneLabels />

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

function Milestones() {
  const { goal, milestones } = campaign;
  return (
    <>
      {milestones.map((m) => (
        <span
          key={m}
          className="absolute top-1/2 h-5 w-px -translate-y-1/2 bg-parchment/40"
          style={{ left: `${(m / goal) * 100}%` }}
        />
      ))}
    </>
  );
}

function MilestoneLabels() {
  const { goal, milestones } = campaign;
  return (
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
  );
}

// Calendar date (YYYY-MM-DD) in Columbus, so the count ticks over at local
// midnight regardless of the visitor's own time zone.
const columbusDay = (d: Date) => new Date(d.toLocaleDateString("en-CA", { timeZone: "America/New_York" })).getTime();

/** Calendar days from today until the banquet, or null before hydration. */
function useDaysUntil(iso: string) {
  const [days, setDays] = useState<number | null>(null);
  useEffect(() => {
    const update = () => setDays(Math.round((columbusDay(new Date(iso)) - columbusDay(new Date())) / 86_400_000));
    update();
    const id = window.setInterval(update, 60 * 60 * 1000);
    return () => window.clearInterval(id);
  }, [iso]);
  return days;
}

/**
 * Pre-launch state: the goal counts up, the empty track waits with a
 * glowing starting point, and the stats point people to the banquet where
 * the campaign begins.
 */
function LaunchMeter() {
  const ref = useRef<HTMLDivElement>(null);
  const { goal } = campaign;
  const days = useDaysUntil(fundraisingEvent.date);
  const launchDate = new Date(fundraisingEvent.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "America/New_York",
  });

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const el = ref.current?.querySelector<HTMLElement>("[data-goal]");
      const state = { v: 0 };
      const render = () => el && (el.textContent = formatUSD(Math.round(state.v)));
      const tl = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: "top 75%", once: true } });
      tl.fromTo(state, { v: 0 }, { v: goal, duration: 2.2, ease: "power3.inOut", onUpdate: render }, 0)
        .from("[data-milestone]", { autoAlpha: 0, y: 8, stagger: 0.12, duration: 0.6 }, 0.4);
      gsap.to("[data-spark]", { scale: 1.8, autoAlpha: 0.35, duration: 1.4, repeat: -1, yoyo: true, ease: "sine.inOut" });
      render();
    },
    { scope: ref },
  );

  const daysLabel = days === null ? "—" : days > 1 ? String(days) : days === 1 ? "1" : "Today";

  return (
    <div ref={ref} className="w-full">
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-2">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gold-soft/80">Our goal</p>
          <p className="mt-2 font-display text-6xl font-light tabular-nums sm:text-7xl" data-goal>
            {formatUSD(goal)}
          </p>
        </div>
        <p className="pb-3 text-parchment/70">
          Campaign begins <span className="text-parchment">{fundraisingEvent.dateLabel.replace(/^\w+, /, "")}</span>
        </p>
      </div>

      <div
        role="progressbar"
        aria-label="Funds raised toward goal"
        aria-valuemin={0}
        aria-valuemax={goal}
        aria-valuenow={0}
        aria-valuetext={`Campaign not yet started. Goal ${formatUSD(goal)}.`}
        className="relative mt-8 h-3 rounded-full bg-white/10 ring-1 ring-white/10"
      >
        <span
          data-spark
          aria-hidden
          className="absolute top-1/2 left-0 h-3 w-3 -translate-y-1/2 rounded-full bg-gold shadow-[0_0_18px_6px_rgb(212_180_106/0.55)]"
        />
        <Milestones />
      </div>
      <MilestoneLabels />

      <dl className="mt-10 grid grid-cols-3 divide-x divide-white/10 rounded-2xl border border-white/10 bg-ink/40 backdrop-blur-sm">
        {[
          { label: "Goal", value: formatShortUSD(goal) },
          { label: "Launch", value: launchDate },
          { label: "Days to go", value: daysLabel },
        ].map((s) => (
          <div key={s.label} className="min-w-0 px-3 py-4 sm:px-6 sm:py-5">
            <dt className="text-[0.6rem] uppercase tracking-[0.2em] text-parchment/60 sm:text-[0.65rem] sm:tracking-[0.25em]">
              {s.label}
            </dt>
            <dd className="mt-1 font-display text-lg tabular-nums sm:text-3xl">{s.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
