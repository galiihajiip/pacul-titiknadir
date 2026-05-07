// TODO: Dashboard layout with Sidebar & Navbar — BLOK layout

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-bg">
      {/* TODO: Sidebar component */}
      <aside className="w-64 bg-primary text-white" />
      <main className="flex-1 flex flex-col">
        {/* TODO: Navbar component */}
        <header className="h-16 border-b border-border bg-white" />
        <div className="flex-1 p-6">{children}</div>
      </main>
    </div>
  );
}
