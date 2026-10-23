"use client";

import { useId, useState, type FormEvent } from "react";
import { CopyButton } from "@/components/CopyButton";
import { campaign, church, formatUSD, giving, givingTiers } from "@/lib/campaign";

type Frequency = "once" | "monthly";

/**
 * Gift picker. It doesn't take payment itself. With an online giving page
 * (campaign.givingUrl) it hands the donor over with the chosen amount and
 * frequency; otherwise it shows how to send the gift by Zelle, cash or check.
 */
export function DonationForm() {
  const [frequency, setFrequency] = useState<Frequency>("once");
  const [tier, setTier] = useState<number | "custom">(givingTiers[1].amount);
  const [custom, setCustom] = useState("");
  const [showHowTo, setShowHowTo] = useState(false);
  const customId = useId();

  const amount = tier === "custom" ? Number(custom) : tier;
  const valid = Number.isFinite(amount) && amount >= 1;
  const selected = givingTiers.find((t) => t.amount === tier);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    if (!campaign.givingUrl) {
      setShowHowTo(true);
      return;
    }
    const url = new URL(campaign.givingUrl);
    url.searchParams.set("amount", String(amount));
    url.searchParams.set("frequency", frequency);
    window.location.assign(url.toString());
  };

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-3xl border border-white/10 bg-ink/55 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-8"
    >
      <fieldset>
        <legend className="sr-only">Gift frequency</legend>
        <div className="grid grid-cols-2 rounded-full bg-white/5 p-1 ring-1 ring-white/10">
          {(["once", "monthly"] as const).map((f) => (
            <label
              key={f}
              className={`cursor-pointer rounded-full py-2 text-center text-sm transition has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-gold ${
                frequency === f ? "bg-parchment text-ink" : "text-parchment/70 hover:text-parchment"
              }`}
            >
              <input
                type="radio"
                name="frequency"
                value={f}
                checked={frequency === f}
                onChange={() => setFrequency(f)}
                className="sr-only"
              />
              {f === "once" ? "One-time" : "Monthly"}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-6">
        <legend className="text-xs uppercase tracking-[0.3em] text-gold-soft/80">Choose your gift</legend>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {givingTiers.map((t) => (
            <label
              key={t.amount}
              className={`cursor-pointer rounded-2xl border px-4 py-4 transition has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-gold ${
                tier === t.amount
                  ? "border-gold bg-gold/15 shadow-[inset_0_0_0_1px_var(--color-gold)]"
                  : "border-white/10 bg-white/[0.03] hover:border-white/30"
              }`}
            >
              <input
                type="radio"
                name="tier"
                value={t.amount}
                checked={tier === t.amount}
                onChange={() => setTier(t.amount)}
                className="sr-only"
              />
              <span className="block font-display text-3xl">{formatUSD(t.amount)}</span>
              <span className="mt-1 block text-[0.65rem] uppercase tracking-[0.25em] text-parchment/60">{t.name}</span>
            </label>
          ))}
        </div>

        <label
          htmlFor={customId}
          className={`mt-3 flex items-center gap-2 rounded-2xl border px-4 py-3 transition focus-within:border-gold ${
            tier === "custom" ? "border-gold bg-gold/15" : "border-white/10 bg-white/[0.03]"
          }`}
        >
          <span className="font-display text-2xl text-parchment/60">$</span>
          <input
            id={customId}
            inputMode="numeric"
            placeholder="Other amount"
            value={custom}
            onFocus={() => setTier("custom")}
            onChange={(e) => {
              setTier("custom");
              setCustom(e.target.value.replace(/[^\d]/g, "").slice(0, 7));
            }}
            className="w-full bg-transparent font-display text-2xl text-parchment placeholder:text-parchment/40 focus:outline-none"
            aria-label="Other amount in US dollars"
          />
        </label>
      </fieldset>

      <p className="mt-4 min-h-[2.5rem] text-sm text-parchment/70" aria-live="polite">
        {selected?.note ?? (valid ? "Every gift, of any size, builds this house of light." : "Enter an amount to continue.")}
      </p>

      <button
        type="submit"
        disabled={!valid}
        className="mt-4 w-full rounded-full bg-gold px-6 py-4 text-base font-semibold text-ink shadow-[0_10px_40px_-10px_rgb(212_180_106/0.8)] transition hover:bg-gold-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold disabled:cursor-not-allowed disabled:opacity-50"
      >
        {valid ? `Give ${formatUSD(amount)}${frequency === "monthly" ? " monthly" : ""}` : "Give"}
      </button>

      {showHowTo && valid && (
        <div role="status" className="mt-4 rounded-2xl border border-gold/40 bg-gold/10 p-5 text-sm">
          <p className="font-display text-2xl text-gold-soft">
            Send {formatUSD(amount)}
            {frequency === "monthly" ? " each month" : ""} by Zelle
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-ink/50 px-4 py-3">
            <span className="font-semibold text-parchment select-all">{giving.zelle}</span>
            <CopyButton
              value={giving.zelle}
              label={`Copy Zelle address ${giving.zelle}`}
              className="shrink-0 rounded-full bg-gold px-4 py-1.5 text-xs font-semibold text-ink transition hover:bg-gold-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            />
          </div>
          <p className="mt-3 text-parchment/80">
            In your banking app, choose Zelle and send to this address. Add “{giving.memo}” in the memo so we can record
            your gift.
            {frequency === "monthly" ? " Many banks let you schedule the payment to repeat monthly." : ""}
          </p>
          <p className="mt-3 text-parchment/60">
            You can also give cash in person, or mail a check payable to {church.name}, {church.address.street},{" "}
            {church.address.city}, {church.address.region} {church.address.postal}.
          </p>
        </div>
      )}

      {campaign.givingUrl && (
        <p className="mt-5 text-center text-xs text-parchment/50">You’ll finish your gift on our secure giving page.</p>
      )}
    </form>
  );
}
