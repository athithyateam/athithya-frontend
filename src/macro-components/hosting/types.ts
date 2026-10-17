/**
 * Types for hosting macro-component.
 */

import type { BaseEntity } from "@/types/common";

export interface HostProfile extends BaseEntity {
  userId: string;
  bio: string;
  languages: string[];
  responseRate: number;
  isSuperhost: boolean;
}
