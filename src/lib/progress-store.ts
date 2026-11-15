// Server-only storage for the live "amount raised". Never import this from a
// client component: it reads environment secrets and the filesystem.
//
// Two backends, picked automatically:
// - Upstash Redis (REST) when UPSTASH_REDIS_REST_URL / _TOKEN (or Vercel's
//   KV_REST_API_URL / _TOKEN) are set. Use this on Vercel and other
//   serverless hosts, whose filesystem can't be written to.
// - Otherwise a JSON file (PROGRESS_FILE, default data/progress.json), which
//   works on any regular Node server (`npm start`).

import { promises as fs } from "node:fs";
import path from "node:path";
import { campaign } from "@/lib/campaign";

export interface Progress {
  raised: number;
  /** ISO timestamp of the last update, or null if never updated. */
  updatedAt: string | null;
}

const KEY = "campaign:progress";

const redisUrl = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
const filePath = path.resolve(process.env.PROGRESS_FILE ?? "data/progress.json");

const fallback: Progress = { raised: campaign.raised, updatedAt: null };

function parse(raw: unknown): Progress | null {
  if (!raw || typeof raw !== "object") return null;
  const { raised, updatedAt } = raw as Record<string, unknown>;
  if (typeof raised !== "number" || !Number.isFinite(raised) || raised < 0) return null;
  return { raised, updatedAt: typeof updatedAt === "string" ? updatedAt : null };
}

async function redis(command: string, ...args: string[]): Promise<unknown> {
  const res = await fetch(`${redisUrl}/${[command, ...args].map(encodeURIComponent).join("/")}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${redisToken}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Redis ${command} failed: HTTP ${res.status}`);
  return ((await res.json()) as { result: unknown }).result;
}

export async function getProgress(): Promise<Progress> {
  try {
    if (redisUrl && redisToken) {
      const value = await redis("get", KEY);
      return (typeof value === "string" && parse(JSON.parse(value))) || fallback;
    }
    return parse(JSON.parse(await fs.readFile(filePath, "utf8"))) || fallback;
  } catch (err) {
    // Missing file / key on first run is normal; anything else is logged but
    // never takes the public page down.
    if ((err as NodeJS.ErrnoException).code !== "ENOENT") console.error("[progress] read failed:", err);
    return fallback;
  }
}

export async function setProgress(raised: number): Promise<Progress> {
  const next: Progress = { raised, updatedAt: new Date().toISOString() };
  const json = JSON.stringify(next);
  if (redisUrl && redisToken) {
    await redis("set", KEY, json);
  } else {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    // Write-then-rename so a crash mid-write never leaves a half file.
    const tmp = `${filePath}.${process.pid}.tmp`;
    await fs.writeFile(tmp, json);
    await fs.rename(tmp, filePath);
  }
  return next;
}
