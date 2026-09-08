import Link from "next/link";

export default function NotFound() {
  return (
    <main className="bg-bg text-ink flex min-h-svh flex-col items-center justify-center gap-4 p-8">
      <h1 className="font-display text-2xl font-semibold">Page not found</h1>
      <Link href="/" className="text-sm font-semibold underline">
        Back to home
      </Link>
    </main>
  );
}
