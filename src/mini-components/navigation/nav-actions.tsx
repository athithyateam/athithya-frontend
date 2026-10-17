import Link from "next/link";
import { routes } from "@/config/navigation";

export function NavActions() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
      }}
    >
      <Link href={routes.auth} style={{ textDecoration: "none" }}>
        Sign In
      </Link>
    </div>
  );
}
