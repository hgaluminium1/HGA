import { Suspense } from "react";

import { LoginForm } from "@/features/admin-desk/components/login-form";

export default function AdminLoginPage() {
  return (
    <main className="bg-bg flex min-h-screen items-center justify-center p-[clamp(1rem,4vw,2rem)]">
      <div className="border-line bg-surface shadow-brand-md w-full max-w-md rounded-[var(--radius-lg)] border p-[clamp(1.5rem,4vw,2rem)]">
        <h1 className="font-display text-2xl font-semibold text-ink">
          HG Admin
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Sign in to edit the website.
        </p>
        <div className="mt-8">
          <Suspense fallback={<p className="text-sm">Loading…</p>}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
