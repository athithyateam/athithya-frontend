import { cache } from "react";
import { getExperience, listExperiences } from "./experiences-api";
import { getHostReviewsApi } from "./bookings-api";

export interface ExperienceDetailResult {
  experience: Record<string, unknown>;
  similarExperiences: Record<string, unknown>[];
}

/**
 * Cached per-request experience fetcher.
 * Idempotent across generateMetadata and PostDetailPage during a single SSR render cycle.
 */
export const getCachedExperience = cache(
  async (id: string): Promise<ExperienceDetailResult | null> => {
    if (!id) return null;
    try {
      const res = await getExperience(id);
      const experience = (res?.experience || res?.data || res) as
        | Record<string, unknown>
        | null;

      if (!experience || (!experience._id && !experience.id)) {
        return null;
      }

      let similar: Record<string, unknown>[] = (res?.similarExperiences ||
        []) as Record<string, unknown>[];
      const categories = experience.categories;
      if (!similar.length && Array.isArray(categories) && categories.length) {
        try {
          const catRes = await listExperiences({
            categories: categories.join(","),
            limit: 8,
          });
          const list = (catRes?.experiences || catRes?.data ||
            []) as Record<string, unknown>[];
          similar = list.filter(
            (p) =>
              String(p._id || p.id) !== String(id)
          );
        } catch {
          similar = [];
        }
      }

      return {
        experience,
        similarExperiences: similar.slice(0, 4),
      };
    } catch (err) {
      console.error(
        `[getCachedExperience] Failed to fetch experience ${id}:`,
        err
      );
      return null;
    }
  }
);

/**
 * Cached per-request host reviews fetcher for SSR pre-rendering.
 */
export const getCachedHostReviews = cache(
  async (hostId: string): Promise<Record<string, unknown> | null> => {
    if (!hostId) return null;
    try {
      const res = await getHostReviewsApi(hostId);
      if (res?.success) return res as Record<string, unknown>;
      return null;
    } catch {
      return null;
    }
  }
);
