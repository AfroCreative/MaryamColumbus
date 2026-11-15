// Server-only: password check and signed session cookie for /admin.
//
// ADMIN_PASSWORD (required) is the one shared password for whoever updates
// the total. SESSION_SECRET (optional) signs the cookie; without it the key is
// derived from the password, so changing the password also logs everyone out.

import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "admin_session";
const SESSION_HOURS = 8;

export const isAdminConfigured = () => Boolean(process.env.ADMIN_PASSWORD);

function signingKey() {
  return process.env.SESSION_SECRET || createHash("sha256").update(`session:${process.env.ADMIN_PASSWORD}`).digest("hex");
}

const sign = (payload: string) => createHmac("sha256", signingKey()).update(payload).digest("base64url");

/** Constant-time comparison that also hides the expected length. */
function safeEqual(a: string, b: string) {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export function checkPassword(input: string) {
  const expected = process.env.ADMIN_PASSWORD;
  return Boolean(expected) && safeEqual(input, expected!);
}

export async function startSession() {
  const expires = Date.now() + SESSION_HOURS * 60 * 60 * 1000;
  const payload = String(expires);
  (await cookies()).set(SESSION_COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin",
    expires: new Date(expires),
  });
}

export async function endSession() {
  (await cookies()).delete({ name: SESSION_COOKIE, path: "/admin" });
}

export async function hasSession() {
  if (!isAdminConfigured()) return false;
  const value = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!value) return false;
  const [payload, signature] = value.split(".");
  if (!payload || !signature || !safeEqual(signature, sign(payload))) return false;
  return Number(payload) > Date.now();
}
