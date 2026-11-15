"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checkPassword, endSession, hasSession, isAdminConfigured, startSession } from "@/lib/admin-auth";
import { formatUSD } from "@/lib/campaign";
import { getProgress, setProgress } from "@/lib/progress-store";

export interface FormState {
  error?: string;
  message?: string;
}

const MAX_TOTAL = 100_000_000;

export async function login(_prev: FormState, form: FormData): Promise<FormState> {
  if (!isAdminConfigured()) return { error: "Admin login isn’t set up yet: ADMIN_PASSWORD is missing on the server." };
  if (!checkPassword(String(form.get("password") ?? ""))) {
    // Slow down repeated guessing.
    await new Promise((r) => setTimeout(r, 800));
    return { error: "That password isn’t right." };
  }
  await startSession();
  redirect("/admin");
}

export async function logout() {
  await endSession();
  redirect("/admin/login");
}

/** Parses "$12,500" / "12500" style input into whole dollars, or null. */
function parseDollars(raw: FormDataEntryValue | null): number | null {
  const cleaned = String(raw ?? "").replace(/[$,\s]/g, "");
  if (!/^\d+(\.\d{1,2})?$/.test(cleaned)) return null;
  return Math.round(Number(cleaned));
}

export async function updateRaised(_prev: FormState, form: FormData): Promise<FormState> {
  if (!(await hasSession())) redirect("/admin/login");

  const mode = form.get("mode");
  const amount = parseDollars(form.get("amount"));
  if (amount === null) return { error: "Enter an amount in dollars, like 2500." };

  const current = (await getProgress()).raised;
  const next = mode === "add" ? current + amount : amount;
  if (next > MAX_TOTAL) return { error: `That would make the total ${formatUSD(next)}. Please check the amount.` };

  try {
    await setProgress(next);
  } catch (err) {
    console.error("[admin] save failed:", err);
    return { error: "Couldn’t save the new total. Check the server’s storage settings and try again." };
  }
  revalidatePath("/");
  return {
    message:
      mode === "add"
        ? `Added ${formatUSD(amount)}. New total: ${formatUSD(next)}.`
        : `Total raised set to ${formatUSD(next)}.`,
  };
}
