"use client";

import { useEffect, useState } from "react";
import { campaign, formatShortUSD, formatUSD, fundraisingEvent } from "@/lib/campaign";

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

const POLL_MS = 30_000;

/** Starts from the server's total, then re-checks /api/progress so open pages stay current. */
function useLiveRaised(initial: number) {
  const [raised, setRaised] = useState(initial);
  useEffect(() => {
    let active = true;
    const refresh = async () => {
      if (document.visibilityState !== "visible") return;
      try {
        const res = await fetch("/api/progress", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as { raised?: unknown };
        if (active && typeof data.raised === "number") setRaised(data.raised);
      } catch {
        // Offline or server hiccup: keep showing the last known total.
      }
    };
    const id = window.setInterval(refresh, POLL_MS);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      active = false;
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []);
  return raised;
}

/**
 * Raised-vs-goal card. Before the campaign launches (nothing raised yet and
 * the banquet still ahead) it shows the goal and a countdown to the banquet;
 * after that it shows the live total, which admins update at /admin.
 */
export function ProgressMeter({ initialRaised, eventPassed }: { initialRaised: number; eventPassed: boolean }) {
  const { goal, milestones } = campaign;
  const raised = useLiveRaised(initialRaised);
  const launched = raised > 0 || eventPassed;
  const pct = Math.min(raised / goal, 1);
  const days = useDaysUntil(fundraisingEvent.date);
  const daysLabel = days === null ? "—" : days > 0 ? String(days) : "Today";
  const launchDate = new Date(fundraisingEvent.date);
  const fmt = (o: Intl.DateTimeFormatOptions) =>
    launchDate.toLocaleDateString("en-US", { timeZone: "America/New_York", ...o });

  const stats = launched
    ? [
        { label: "Raised", value: formatShortUSD(raised) },
        { label: "Remaining", value: formatShortUSD(Math.max(goal - raised, 0)) },
        { label: "Complete", value: `${Math.round(pct * 100)}%` },
      ]
    : [
        { label: "Goal", value: formatShortUSD(goal) },
        { label: "Launch", value: fmt({ month: "short", day: "numeric" }) },
        { label: "Days to go", value: daysLabel },
      ];

  return (
    <div className="rounded-3xl bg-surface p-6 shadow-sm ring-1 ring-line/10 sm:p-10">
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-2">
        <div>
          <p className="text-sm font-medium text-accent">{launched ? "Raised so far" : "Our goal"}</p>
          <p className="mt-1 font-display text-5xl font-semibold tabular-nums sm:text-6xl">
            {formatUSD(launched ? raised : goal)}
          </p>
        </div>
        <p className="pb-2 text-ink/70">
          {launched ? (
            <>
              of <span className="font-semibold text-ink">{formatUSD(goal)}</span> goal
            </>
          ) : (
            <>
              Campaign begins <span className="font-semibold text-ink">{fmt({ month: "long", day: "numeric", year: "numeric" })}</span>
            </>
          )}
        </p>
      </div>

      <div
        role="progressbar"
        aria-label="Funds raised toward goal"
        aria-valuemin={0}
        aria-valuemax={goal}
        aria-valuenow={raised}
        aria-valuetext={
          launched ? `${formatUSD(raised)} of ${formatUSD(goal)}` : `Campaign not yet started. Goal ${formatUSD(goal)}.`
        }
        className="relative mt-8 h-4 overflow-hidden rounded-full bg-subtle"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-gold to-accent"
          style={{ width: `${pct * 100}%` }}
        />
        {milestones.map((m) => (
          <span key={m} className="absolute inset-y-0 w-px bg-ink/15" style={{ left: `${(m / goal) * 100}%` }} />
        ))}
      </div>
      <div className="relative mt-2 h-5 text-xs text-ink/60">
        <span className="absolute left-0">$0</span>
        {milestones.map((m) => (
          <span key={m} className="absolute -translate-x-1/2 tabular-nums" style={{ left: `${(m / goal) * 100}%` }}>
            {formatShortUSD(m)}
          </span>
        ))}
        <span className="absolute right-0">{formatShortUSD(goal)}</span>
      </div>

      <dl className="mt-8 grid grid-cols-3 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl bg-page px-3 py-4 text-center ring-1 ring-line/5 sm:px-5">
            <dt className="text-xs font-medium text-ink/60">{s.label}</dt>
            <dd className="mt-1 font-display text-2xl font-semibold tabular-nums sm:text-3xl">{s.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
