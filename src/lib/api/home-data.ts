import {
  getLatestExperiences,
  getFeaturedExperiences,
  getMostLovedExperiences,
  getTopRatedTreks,
  getNearbyTreks,
  getTopRatedHosts,
} from "./experiences-api";
import { getLatestReviews } from "./bookings-api";

export function extractList(res: any): any[] {
  return (
    res?.experiences ||
    res?.treks ||
    res?.hosts ||
    res?.reviews ||
    res?.data ||
    (Array.isArray(res) ? res : [])
  );
}

export async function getHomeExploreExperiences(): Promise<any[]> {
  try {
    const res = await getLatestExperiences(16, 1, "recent");
    return extractList(res);
  } catch (err) {
    console.error("Error fetching home explore experiences:", err);
    return [];
  }
}

export async function getHomeFeaturedExperiences(): Promise<any[]> {
  try {
    const res = await getFeaturedExperiences(16, 1, "clicks");
    return extractList(res);
  } catch (err) {
    console.error("Error fetching home featured experiences:", err);
    return [];
  }
}

export async function getHomeMostLovedExperiences(): Promise<any[]> {
  try {
    const res = await getMostLovedExperiences(16, 1, "bookings");
    return extractList(res);
  } catch (err) {
    console.error("Error fetching home most loved experiences:", err);
    return [];
  }
}

export async function getHomeTopRatedExperiences(): Promise<any[]> {
  try {
    const res = await getTopRatedTreks(16, 1, "rating");
    return extractList(res);
  } catch (err) {
    console.error("Error fetching home top rated experiences:", err);
    return [];
  }
}

export async function getHomeNearbyExperiences(): Promise<any[]> {
  try {
    const res = await getNearbyTreks({ limit: 16 });
    return extractList(res);
  } catch (err) {
    console.error("Error fetching home nearby experiences:", err);
    return [];
  }
}

export async function getHomeTopRatedHosts(): Promise<any[]> {
  try {
    const res = await getTopRatedHosts(16, 1);
    return extractList(res);
  } catch (err) {
    console.error("Error fetching home top rated hosts:", err);
    return [];
  }
}

export async function getHomeLatestReviews(): Promise<any[]> {
  try {
    const res = await getLatestReviews(16);
    return extractList(res);
  } catch (err) {
    console.error("Error fetching home latest reviews:", err);
    return [];
  }
}

