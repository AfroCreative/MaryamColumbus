import { NextResponse } from "next/server";
import { campaign } from "@/lib/campaign";
import { getProgress } from "@/lib/progress-store";

export const dynamic = "force-dynamic";

/** Public, read-only: the live total for the progress card to poll. */
export async function GET() {
  const { raised, updatedAt } = await getProgress();
  return NextResponse.json(
    { raised, goal: campaign.goal, updatedAt },
    { headers: { "Cache-Control": "no-store" } },
  );
}
