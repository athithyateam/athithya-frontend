/**
 * Route definitions and navigation menu configuration.
 * Import from here instead of hardcoding paths in components.
 */

export const routes = {
  home: "/",
  experiences: "/experiences",
  experienceDetail: (slug: string) => `/experiences/${slug}` as const,
  howItWorks: "/how-it-works",
  host: "/host",
  about: "/about",
  auth: "/auth",
  profile: "/profile",
  admin: "/admin",
  dev: "/dev",
} as const;
