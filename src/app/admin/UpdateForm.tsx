"use client";

import { useActionState, useState } from "react";
import { updateRaised, type FormState } from "./actions";

type Mode = "add" | "set";

const modes: { value: Mode; label: string; hint: string }[] = [
  { value: "add", label: "Add a gift", hint: "Adds this amount to the current total." },
  { value: "set", label: "Set the total", hint: "Replaces the total with this amount." },
];

export function UpdateForm() {
  const [mode, setMode] = useState<Mode>("add");
  const [state, action, pending] = useActionState<FormState, FormData>(updateRaised, {});
  const hint = modes.find((m) => m.value === mode)!.hint;

  return (
    <form action={action} className="mt-6 rounded-3xl bg-surface p-6 shadow-sm ring-1 ring-line/10 sm:p-8">
      <h2 className="font-display text-2xl font-semibold">Update the amount raised</h2>

      <fieldset className="mt-5">
        <legend className="sr-only">Update type</legend>
        <div className="grid grid-cols-2 rounded-full bg-subtle p-1">
          {modes.map((m) => (
            <label
              key={m.value}
              className={`cursor-pointer rounded-full py-2 text-center text-sm font-medium transition has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-ink ${
                mode === m.value ? "bg-surface text-ink shadow-sm" : "text-ink/60 hover:text-ink"
              }`}
            >
              <input
                type="radio"
                name="mode"
                value={m.value}
                checked={mode === m.value}
                onChange={() => setMode(m.value)}
                className="sr-only"
              />
              {m.label}
            </label>
          ))}
        </div>
      </fieldset>

      <label htmlFor="amount" className="mt-5 block text-sm font-medium">
        Amount in dollars
      </label>
      <div className="mt-2 flex items-center gap-2 rounded-xl bg-page px-4 ring-1 ring-line/15 focus-within:ring-2 focus-within:ring-ink">
        <span className="text-ink/50">$</span>
        <input
          id="amount"
          name="amount"
          inputMode="decimal"
          required
          placeholder={mode === "add" ? "500" : "125000"}
          aria-describedby="amount-hint"
          className="w-full bg-transparent py-3 text-lg text-ink outline-none placeholder:text-ink/30"
        />
      </div>
      <p id="amount-hint" className="mt-2 text-sm text-ink/60">
        {hint}
      </p>

      <button
        type="submit"
        disabled={pending}
        className="mt-6 w-full rounded-full bg-primary px-6 py-3 font-semibold text-on-primary transition hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:opacity-60"
      >
        {pending ? "Saving…" : mode === "add" ? "Add to total" : "Save total"}
      </button>

      <div aria-live="polite" className="mt-4 min-h-6 text-sm font-medium">
        {state.error && <p className="text-danger">{state.error}</p>}
        {state.message && <p className="text-accent">{state.message}</p>}
      </div>
    </form>
  );
}
