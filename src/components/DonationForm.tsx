"use client";

import { useId, useState, type FormEvent } from "react";
import { CopyButton } from "@/components/CopyButton";
import { church, formatUSD, giving, givingTiers } from "@/lib/campaign";

type Frequency = "once" | "monthly";

/**
 * Gift picker. It doesn't take payment itself: once an amount is chosen it
 * shows how to pay it, by card on the SwipeSimple page (giving.cardUrl) or by
 * Zelle, with cash and check as alternatives.
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
    setShowHowTo(true);
  };

  const focusRing = "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-navy";

  return (
    <form onSubmit={onSubmit} className="rounded-3xl bg-surface p-6 shadow-sm ring-1 ring-line/10 sm:p-8">
      <h3 className="font-display text-3xl font-semibold">Make a gift</h3>
      <p className="mt-1 text-sm text-ink/70">Choose an amount, then follow the steps to send it.</p>

      <fieldset className="mt-6">
        <legend className="sr-only">Gift frequency</legend>
        <div className="grid grid-cols-2 rounded-full bg-subtle p-1">
          {(["once", "monthly"] as const).map((f) => (
            <label
              key={f}
              className={`cursor-pointer rounded-full py-2 text-center text-sm font-medium transition ${focusRing} ${
                frequency === f ? "bg-surface text-ink shadow-sm" : "text-ink/60 hover:text-ink"
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
        <legend className="text-sm font-medium text-ink">Amount</legend>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {givingTiers.map((t) => (
            <label
              key={t.amount}
              className={`cursor-pointer rounded-2xl px-4 py-3.5 ring-1 transition ${focusRing} ${
                tier === t.amount ? "bg-primary text-on-primary ring-primary" : "bg-page ring-line/10 hover:ring-line/30"
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
              <span className="block font-display text-2xl font-semibold">{formatUSD(t.amount)}</span>
              <span className={`block text-xs ${tier === t.amount ? "text-on-primary/70" : "text-ink/60"}`}>{t.name}</span>
            </label>
          ))}
        </div>

        <label
          htmlFor={customId}
          className={`mt-3 flex items-center gap-2 rounded-2xl px-4 py-3 ring-1 transition focus-within:ring-2 focus-within:ring-ink ${
            tier === "custom" ? "bg-surface ring-ink" : "bg-page ring-line/10"
          }`}
        >
          <span className="font-display text-2xl text-ink/50">$</span>
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
            className="w-full bg-transparent font-display text-2xl text-ink placeholder:text-ink/40 focus:outline-none"
            aria-label="Other amount in US dollars"
          />
        </label>
      </fieldset>

      <p className="mt-4 min-h-[2.5rem] text-sm text-ink/70" aria-live="polite">
        {selected?.note ?? (valid ? "Every gift, of any size, builds this house of light." : "Enter an amount to continue.")}
      </p>

      <button
        type="submit"
        disabled={!valid}
        className="mt-2 w-full rounded-full bg-gold px-6 py-4 text-base font-semibold text-navy-deep shadow-sm transition hover:bg-gold-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:cursor-not-allowed disabled:opacity-50"
      >
        {valid ? `Give ${formatUSD(amount)}${frequency === "monthly" ? " monthly" : ""}` : "Give"}
      </button>

      {showHowTo && valid && (
        <div role="status" className="mt-5 space-y-4 text-sm">
          {giving.cardUrl && (
            <div className="rounded-2xl bg-navy p-5 text-white">
              <p className="font-display text-2xl font-semibold">Pay {formatUSD(amount)} by card</p>
              <p className="mt-1 text-white/75">
                Opens our secure payment page in a new tab. Enter {formatUSD(amount)} as the amount.
              </p>
              <a
                href={giving.cardUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 text-base font-semibold text-navy-deep transition hover:bg-gold-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              >
                Pay by credit or debit card
                <span className="sr-only">(opens in a new tab)</span>
              </a>
              {frequency === "monthly" && (
                <p className="mt-3 text-white/70">
                  For a monthly gift, make a card payment each month, or set up a recurring Zelle payment below.
                </p>
              )}
            </div>
          )}

          <div className="rounded-2xl bg-page p-5 ring-1 ring-gold/50">
            <p className="font-display text-2xl font-semibold">
              {giving.cardUrl ? "Or send" : "Send"} {formatUSD(amount)}
              {frequency === "monthly" ? " each month" : ""} by Zelle
            </p>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-surface px-4 py-3 ring-1 ring-line/10">
              <span className="font-semibold select-all">{giving.zelle}</span>
              <CopyButton
                value={giving.zelle}
                label={`Copy Zelle address ${giving.zelle}`}
                className="shrink-0 rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-on-primary transition hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              />
            </div>
            <ol className="mt-4 list-decimal space-y-1 pl-5 text-ink/80">
              <li>Open your banking app and choose Zelle.</li>
              <li>Send {formatUSD(amount)} to the address above.</li>
              <li>Add “{giving.memo}” in the memo so we can record your gift.</li>
            </ol>
            {frequency === "monthly" && (
              <p className="mt-3 text-ink/70">Many banks let you schedule the payment to repeat monthly.</p>
            )}
          </div>

          <p className="text-ink/60">
            You can also give cash in person, or mail a check payable to {church.name}, {church.address.street},{" "}
            {church.address.city}, {church.address.region} {church.address.postal}.
          </p>
        </div>
      )}
    </form>
  );
}
