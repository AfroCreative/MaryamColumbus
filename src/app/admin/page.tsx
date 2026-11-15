import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { hasSession } from "@/lib/admin-auth";
import { campaign, church, formatUSD } from "@/lib/campaign";
import { getProgress } from "@/lib/progress-store";
import { logout } from "./actions";
import { UpdateForm } from "./UpdateForm";

export const metadata: Metadata = { title: `Admin · ${church.shortName} campaign`, robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await hasSession())) redirect("/admin/login");

  const { raised, updatedAt } = await getProgress();
  const pct = Math.min(raised / campaign.goal, 1);
  const updated = updatedAt
    ? new Date(updatedAt).toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "America/New_York",
      })
    : null;

  return (
    <main className="mx-auto max-w-2xl px-4 py-10 sm:py-16">
      <header className="flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/debre-brhan-emblem.png" alt="" width={40} height={40} className="h-10 w-10" />
          <span className="leading-tight">
            <span className="block font-display text-xl font-semibold">Campaign admin</span>
            <span className="block text-xs text-ink/60">{church.shortName} · view the public page</span>
          </span>
        </Link>
        <form action={logout}>
          <button
            type="submit"
            className="rounded-full px-4 py-2 text-sm font-medium ring-1 ring-line/15 transition hover:bg-ink/5"
          >
            Sign out
          </button>
        </form>
      </header>

      <section aria-labelledby="current" className="mt-10 rounded-3xl bg-surface p-6 shadow-sm ring-1 ring-line/10 sm:p-8">
        <h1 id="current" className="text-sm font-medium text-accent">
          Raised so far
        </h1>
        <p className="mt-1 font-display text-5xl font-semibold tabular-nums">{formatUSD(raised)}</p>
        <p className="mt-1 text-ink/70">
          of {formatUSD(campaign.goal)} goal · {Math.round(pct * 100)}%
        </p>
        <div className="mt-5 h-3 overflow-hidden rounded-full bg-subtle">
          <div className="h-full rounded-full bg-gradient-to-r from-gold to-accent" style={{ width: `${pct * 100}%` }} />
        </div>
        <p className="mt-3 text-xs text-ink/50">{updated ? `Last updated ${updated}` : "Not updated yet"}</p>
      </section>

      <UpdateForm />

      <p className="mt-8 text-sm text-ink/60">
        Changes appear on the public page right away. Pages that are already open refresh the total within 30
        seconds.
      </p>
    </main>
  );
}
