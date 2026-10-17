/**
 * Central type definitions and component interfaces for the auth macro-component.
 */

import type { BaseEntity } from "@/types/common";

export type AuthMode = "login" | "register";

export interface User extends BaseEntity {
  email: string;
  displayName: string;
  avatarUrl: string | null;
  role: "guest" | "host" | "admin";
  isVerified: boolean;
}

export interface AuthSession {
  user: User;
  accessToken: string;
  expiresAt: string;
}

export interface AuthSlide {
  imageSrc: string;
  imageAlt: string;
  quotePrefix: string;
  highlightWord: string;
  quoteSuffix: string;
  subtitle: string;
}

export interface AuthHeroBannerProps {
  slides?: AuthSlide[];
  intervalMs?: number;
  className?: string;
}

export interface AuthCardProps {
  slides?: AuthSlide[];
  intervalMs?: number;
  className?: string;
}

export interface SocialAuthButtonsProps {
  mode: AuthMode;
}
