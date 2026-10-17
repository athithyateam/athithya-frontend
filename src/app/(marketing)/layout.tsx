/**
 * Marketing layout — wraps all public-facing pages (/about, /host, /how-it-works).
 * Add the public Navbar and Footer here once they're built.
 */

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* TODO: <Navbar /> */}
      <main className="flex flex-1 flex-col">{children}</main>
      {/* TODO: <Footer /> */}
    </>
  );
}
