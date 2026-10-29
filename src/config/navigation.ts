/**
 * Route definitions and navigation menu configuration.
 * Import from here instead of hardcoding paths in components.
 */

export const routes = {
  home: "/",
  experiences: "/experiences",
  experienceDetail: (slug: string) => `/experiences/${slug}` as const,
  exploreExperience: "/explore-experience",
  topRatedExperience: "/top-rated-experience",
  featuredExperience: "/featured-experience",
  mostLovedExperience: "/most-loved-experience",
  nearbyExperience: "/nearby-experience",
  topRatedHost: "/top-rated-host",
  postDetail: (id: string) => `/post/${id}` as const,
  howItWorks: "/how-it-works",
  host: "/host",
  about: "/about",
  safety: "/safety",
  support: "/support",
  mentions: "/mentions",
  creators: "/creators",
  terms: "/terms",
  privacy: "/privacy",
  chat: "/chat",
  auth: "/auth",
  profile: "/profile",
  admin: "/admin",
  dev: "/dev",
} as const;

