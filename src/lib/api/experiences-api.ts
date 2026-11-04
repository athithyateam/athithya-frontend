import { apiRequest, uploadFileToS3 } from "./client";
import { ENDPOINTS } from "./endpoints";

export { uploadFileToS3 };

/**
 * 1. Media Upload Pre-requisite
 * Generate S3 pre-signed URL for direct upload
 */
export async function getPresignedUrl(
  filename: string,
  fileType: string,
  options: { token?: string; fileSize?: number; type?: string; uploadType?: string } = {}
) {
  const res = await apiRequest(ENDPOINTS.PRESIGNED_URL, {
    method: "GET",
    params: {
      fileName: filename,
      fileType,
      fileSize: options.fileSize,
      folder: "experiences",
    },
    token: options.token,
  });
  return res.data;
}

/**
 * 2. Core Experience Operations (Docs: experiences.md)
 */
export async function createExperience(payload: Record<string, any> | FormData) {
  const res = await apiRequest(ENDPOINTS.EXPERIENCES, { method: "POST", body: payload });
  if (!res.ok) throw { success: false, message: res.message, status: res.status };
  return res.data;
}

export async function getExperience(id: string) {
  const res = await apiRequest(ENDPOINTS.GET_EXPERIENCE(id), { method: "GET" });
  return res.data;
}

export async function listExperiences(params: Record<string, any> = {}) {
  const res = await apiRequest(ENDPOINTS.EXPERIENCES, { method: "GET", params });
  return res.data;
}

export async function updateExperience(id: string, payload: Record<string, any> | FormData) {
  const res = await apiRequest(ENDPOINTS.GET_EXPERIENCE(id), { method: "PUT", body: payload });
  return res.data;
}

export async function deleteExperience(id: string) {
  const res = await apiRequest(ENDPOINTS.GET_EXPERIENCE(id), { method: "DELETE" });
  return res.data;
}

export async function requestHideExperience(
  id: string,
  reason?: string,
  action: "request_hide" | "hide" | "request_unhide" | "unhide" = "request_hide"
) {
  const res = await apiRequest(ENDPOINTS.REQUEST_HIDE_EXPERIENCE(id), {
    method: "PATCH",
    body: { action, reason },
  });
  return res.data;
}

/**
 * 3. Bookmarking & Wishlist Endpoints (Docs: experiences.md)
 */
export async function saveExperienceApi(id: string) {
  const res = await apiRequest(ENDPOINTS.SAVE_EXPERIENCE(id), { method: "POST", body: {} });
  return res.data;
}

export async function unsaveExperienceApi(id: string) {
  const res = await apiRequest(ENDPOINTS.SAVE_EXPERIENCE(id), { method: "DELETE" });
  return res.data;
}

/**
 * 4. Experience Reviews (Docs: experiences.md)
 */
export async function getExperienceReviewsApi(experienceId: string) {
  const res = await apiRequest(ENDPOINTS.GET_EXPERIENCE_REVIEWS(experienceId), { method: "GET" });
  return res.data;
}

/**
 * 5. User & Host Specific Lists (Docs: experiences.md)
 */
export async function getUserExperiencesApi(userId: string) {
  const res = await apiRequest(ENDPOINTS.GET_USER_EXPERIENCES(userId), { method: "GET" });
  return res.data;
}

export async function getMyExperiencesApi() {
  const res = await apiRequest(ENDPOINTS.GET_MY_EXPERIENCES, { method: "GET" });
  return res.data;
}

/**
 * 6. Curated & Category Discovery Feeds (Docs: experiences.md)
 */
export async function getFeaturedExperiences(limit = 16, page = 1, sort?: string) {
  const res = await apiRequest(ENDPOINTS.GET_FEATURED_EXPERIENCES(limit, page), {
    params: sort ? { sort } : undefined,
  });
  return res.data;
}

export async function getLatestExperiences(limit = 16, page = 1, sort = "recent") {
  const res = await apiRequest(ENDPOINTS.GET_LATEST_EXPERIENCES(limit, page, sort));
  return res.data;
}

export async function getMostLovedExperiences(limit = 16, page = 1, sort?: string) {
  const res = await apiRequest(ENDPOINTS.GET_MOST_LOVED_EXPERIENCES(limit, page), {
    params: sort ? { sort } : undefined,
  });
  return res.data;
}

export async function getTopRatedTreks(limit = 16, page = 1, sort?: string) {
  const res = await apiRequest(ENDPOINTS.GET_TOPRATED_TREKS, {
    params: { limit, page, ...(sort ? { sort } : {}) },
  });
  return res.data;
}

export async function getNearbyTreks(params: {
  latitude?: number | null;
  longitude?: number | null;
  limit?: number;
  page?: number;
}) {
  const res = await apiRequest(ENDPOINTS.GET_NEARBY_TREKS(params));
  return res.data;
}

export async function getCategoryActivity() {
  const res = await apiRequest(ENDPOINTS.GET_CATEGORY_ACTIVITY);
  return res.data;
}

export async function getTopRatedHosts(limit = 16, page = 1) {
  const res = await apiRequest(ENDPOINTS.GET_TOPRATED_HOSTS, { params: { limit, page } });
  return res.data;
}
