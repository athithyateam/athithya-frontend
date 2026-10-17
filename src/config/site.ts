/**
 * Central site configuration.
 * Navigation items, metadata, and external links live here
 * so pages and components pull from a single source of truth.
 */

export const siteConfig = {
  name: "Athithya",
  description:
    "Curated cultural and hospitality experiences connecting guests with authentic hosts.",
  url: "https://athithya.app",

  navItems: [
    { label: "Experiences", href: "/experiences" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "Become a Host", href: "/host" },
    { label: "About", href: "/about" },
  ],

  panelItems: [
    { label: "Admin Console", href: "/admin" },
    { label: "Developer Tools", href: "/dev" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
