/**
 * Types for experiences macro-component.
 */

import type { BaseEntity } from "@/types/common";

export interface Experience extends BaseEntity {
  title: string;
  slug: string;
  description: string;
  location: string;
  pricePerPerson: number;
  currency: string;
  durationMinutes: number;
  maxGuests: number;
  images: string[];
  hostId: string;
  categories: string[];
  rating: number;
  reviewCount: number;
  isPublished: boolean;
}

export interface ExperienceFilters {
  query?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  sortBy?: "price_asc" | "price_desc" | "rating" | "newest";
  page?: number;
  pageSize?: number;
}
