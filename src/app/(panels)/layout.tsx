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
    <div className="flex min-h-screen">
      {/* TODO: <DashboardSidebar /> */}
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
