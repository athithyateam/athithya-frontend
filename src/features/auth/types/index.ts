/**
 * Feature-specific types for auth.
 */

import type { BaseEntity } from "@/types/common";

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
