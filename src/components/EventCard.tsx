import { CopyButton } from "@/components/CopyButton";
import { formatUSD, fundraisingEvent as ev } from "@/lib/campaign";

const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${ev.venue}, ${ev.address}`)}`;

/**
 * Banquet invitation styled after the printed ticket (navy, cream, gold).
 * The perforation notches are painted navy-deep to match the section behind it.
 */
export function EventCard() {
  return (
    <article className="relative overflow-hidden rounded-3xl bg-cream text-navy shadow-2xl shadow-black/30">
      <div className="bg-navy px-6 py-5 text-white sm:px-8">
        <p className="text-[0.65rem] uppercase tracking-[0.3em] text-gold">Join us in person</p>
        <h3 className="mt-1 font-display text-3xl">{ev.title}</h3>
      </div>

      {/* Perforation between the ticket body and its header. */}
      <div aria-hidden className="relative h-0 border-t-2 border-dashed border-navy/20">
        <span className="absolute -top-3 -left-3 h-6 w-6 rounded-full bg-navy-deep" />
        <span className="absolute -top-3 -right-3 h-6 w-6 rounded-full bg-navy-deep" />
      </div>

      <div className="grid gap-6 px-6 py-6 sm:grid-cols-[1fr_auto] sm:px-8">
        <dl className="space-y-3 text-sm">
          <div>
            <dt className="sr-only">Date</dt>
            <dd>
              <time dateTime={ev.date} className="font-display text-xl">
                {ev.dateLabel}
              </time>
            </dd>
            <dd className="text-navy/70">{ev.timeLabel}</dd>
          </div>
          <div>
            <dt className="sr-only">Venue</dt>
            <dd className="font-semibold">{ev.venue}</dd>
            <dd>
              <a href={mapsUrl} target="_blank" rel="noreferrer" className="text-navy/70 underline-offset-4 hover:underline">
                {ev.address}
              </a>
            </dd>
          </div>
          <div>
            <dt className="sr-only">Highlights</dt>
            <dd className="flex flex-wrap gap-2 pt-1">
              {ev.highlights.map((h) => (
                <span key={h} className="rounded-full bg-navy/10 px-3 py-1 text-xs font-medium">
                  {h}
                </span>
              ))}
            </dd>
          </div>
        </dl>

        <div className="flex flex-row items-center justify-between gap-4 border-t border-navy/15 pt-5 sm:flex-col sm:items-end sm:justify-start sm:border-t-0 sm:border-l sm:pt-0 sm:pl-6">
          <p className="text-right">
            <span className="block font-display text-5xl leading-none">{formatUSD(ev.price)}</span>
            <span className="text-[0.65rem] uppercase tracking-[0.25em] text-navy/60">per person</span>
          </p>
          <p className="text-right text-xs text-navy/60">
            Pay with Zelle{ev.payment.cash ? " or cash" : ""}
          </p>
        </div>
      </div>

      <div className="border-t border-navy/15 bg-navy/[0.04] px-6 py-5 sm:px-8">
        <p className="text-[0.65rem] uppercase tracking-[0.3em] text-navy/60">Get your ticket</p>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <p className="min-w-0 text-sm">
            Send {formatUSD(ev.price)} per person by <span className="font-semibold">Zelle</span> to
            <span className="block font-semibold [overflow-wrap:anywhere] select-all">{ev.payment.zelle}</span>
          </p>
          <CopyButton
            value={ev.payment.zelle}
            label={`Copy Zelle address ${ev.payment.zelle}`}
            className="shrink-0 rounded-full bg-navy px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-navy/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
          />
        </div>
        {ev.payment.cash && <p className="mt-2 text-sm text-navy/70">Cash is also welcome.</p>}
      </div>
    </article>
  );
}
