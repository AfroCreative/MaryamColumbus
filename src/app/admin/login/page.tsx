import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { hasSession, isAdminConfigured } from "@/lib/admin-auth";
import { church } from "@/lib/campaign";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: `Sign in · ${church.shortName} campaign`, robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (await hasSession()) redirect("/admin");

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center text-center">
          <Image src="/debre-brhan-emblem.png" alt="" width={64} height={64} className="h-16 w-16" priority />
          <h1 className="mt-4 font-display text-3xl font-semibold">Campaign admin</h1>
          <p className="mt-1 text-sm text-ink/60">Sign in to update the amount raised.</p>
        </div>

        <div className="mt-8 rounded-3xl bg-surface p-6 shadow-sm ring-1 ring-line/10 sm:p-8">
          {isAdminConfigured() ? (
            <LoginForm />
          ) : (
            <p role="alert" className="text-sm text-ink/80">
              Admin login isn’t set up yet. Add an <code className="font-mono">ADMIN_PASSWORD</code> setting on the
              server, then reload this page.
            </p>
          )}
        </div>

        <p className="mt-6 text-center text-sm">
          <Link href="/" className="text-ink/60 hover:text-ink">
            ← Back to the campaign page
          </Link>
        </p>
      </div>
    </main>
  );
}
