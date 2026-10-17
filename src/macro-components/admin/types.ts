/**
 * Types for admin macro-component.
 */

import type { BaseEntity } from "@/types/common";

export interface AdminStats extends BaseEntity {
  totalUsers: number;
  totalExperiences: number;
  totalBookings: number;
  revenue: number;
}
