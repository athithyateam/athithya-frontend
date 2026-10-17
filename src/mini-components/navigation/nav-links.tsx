import Link from "next/link";
import { routes } from "@/config/navigation";
import type { NavItem, NavLinksProps } from "./types";

export const defaultNavItems: NavItem[] = [
  { label: "Experiences", href: routes.experiences },
  { label: "Become a Host", href: routes.host },
  { label: "How It Works", href: routes.howItWorks },
  { label: "About", href: routes.about },
];

export function NavLinks({ items = defaultNavItems }: { items?: NavItem[] }) {
  return (
    <ul
      style={{
        display: "flex",
        gap: "1.25rem",
        listStyle: "none",
        margin: 0,
        padding: 0,
      }}
    >
      {items.map((item) => (
        <li key={item.href}>
          <Link href={item.href} style={{ textDecoration: "none" }}>
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
