"use client";

import { useState } from "react";

/** Copies `value` to the clipboard and briefly confirms. */
export function CopyButton({ value, label, className = "" }: { value: string; label: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked (e.g. insecure context): the address stays visible
      // and selectable next to the button.
    }
  };

  return (
    <button type="button" onClick={copy} aria-label={label} className={className}>
      <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}
