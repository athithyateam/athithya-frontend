import Link from "next/link";
import { routes } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { NavLinks } from "./nav-links";
import { NavActions } from "./nav-actions";

export function Navbar() {
  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0.75rem 1.5rem",
      }}
    >
      <Link
        href={routes.home}
        style={{
          fontWeight: "bold",
          fontSize: "1.125rem",
          textDecoration: "none",
        }}
      >
        {siteConfig.name}
      </Link>

      <nav aria-label="Main Navigation">
        <NavLinks />
      </nav>

      <NavActions />
    </header>
  );
}
