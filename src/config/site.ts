/**
 * Central site configuration.
 * Navigation items, metadata, and external links live here
 * so pages and components pull from a single source of truth.
 */

export const siteConfig = {
  name: "Athithya",
  title: "Athithya | Your Travel Experience Platform",
  description:
    "Explore different travel experiences in Uttarakhand with local hosts, from treks, rafting, and paragliding to camping, safaris, bungee jumping, and much more. Compare experiences, hosts, prices, reviews, and what’s included, all in one place, and find an experience that makes you feel alive.",
  url: "https://athithya.in",
  keywords: [
    "travel experience platform",
    "athithya",
    "travel experiences",
    "local hosts",
    "treks",
    "local activities",
    "tours",
    "adventure travel",
    "authentic travel",
    "uttarakhand travel",
    "rafting in rishikesh",
    "camping in chopta",
    "safari in jim corbett",
    "bungee jumping in rishikesh",
    "paragliding in uttarakhand",
  ],

  navItems: [
    { label: "Experiences", href: "/explore-experience" },
    { label: "Categories", href: "/categories" },
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
