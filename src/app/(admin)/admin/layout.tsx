export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--color-surface-muted,#f8fafc)]">
      {children}
    </div>
  );
}
