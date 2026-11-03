/**
 * Panels layout — wraps protected admin/dev dashboard pages.
 * Add authentication checks and dashboard sidebar here once built.
 */

export default function PanelsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full max-w-full overflow-x-hidden">
      {/* TODO: <DashboardSidebar /> */}
      <main className="flex flex-1 flex-col min-w-0 w-full max-w-full overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
