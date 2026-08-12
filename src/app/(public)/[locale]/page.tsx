import { Button } from "@/components/ui/button";

export default function PublicHomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-6 p-8">
      <p className="text-sm uppercase tracking-wide text-muted-foreground">
        HG Aluminium Smelters
      </p>
      <h1 className="text-4xl font-semibold tracking-tight">HG — Phase 0</h1>
      <p className="text-lg text-muted-foreground">
        Scaffold ready. Landing UI lands in Phase 1.
      </p>
      <div>
        <Button type="button">Continue to Phase 1</Button>
      </div>
    </main>
  );
}
