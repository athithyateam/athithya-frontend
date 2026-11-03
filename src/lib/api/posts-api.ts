import { apiRequest, uploadFileToS3 } from "./client";
import { ENDPOINTS } from "./endpoints";

export { uploadFileToS3 };

export async function getPresignedUrl(
  filename: string,
  fileType: string,
  options: { token?: string; fileSize?: number; type?: string; uploadType?: string } = {}
) {
  const res = await apiRequest(ENDPOINTS.PRESIGNED_URL, {
    method: "GET",
    params: {
      filename,
      fileName: filename,
      fileType,
      fileSize: options.fileSize,
      type: options.type || options.uploadType || "experiences",
      folder: "experiences",
    },
    token: options.token,
  });
  return res.data;
}

export async function createPost(payload: Record<string, any> | FormData) {
  const res = await apiRequest(ENDPOINTS.EXPERIENCES, { method: "POST", body: payload });
  if (!res.ok) throw { success: false, message: res.message, status: res.status };
  return res.data;
}

export async function getPost(id: string) {
  const res = await apiRequest(ENDPOINTS.GET_EXPERIENCE(id), { method: "GET" });
  if (res.ok) return res.data;
  const fallback = await apiRequest(`/api/posts/${id}`, { method: "GET" });
  return fallback.data;
}

export async function listPosts(params: Record<string, any> = {}) {
  const res = await apiRequest(ENDPOINTS.EXPERIENCES, { method: "GET", params });
  return res.data;
}

export async function updatePost(id: string, payload: Record<string, any> | FormData) {
  const res = await apiRequest(ENDPOINTS.GET_EXPERIENCE(id), { method: "PUT", body: payload });
  return res.data;
}

export async function deletePost(id: string) {
  const res = await apiRequest(ENDPOINTS.GET_EXPERIENCE(id), { method: "DELETE" });
  return res.data;
}

export async function requestHideService(
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

export async function reactToPost(id: string, emoji: string) {
  const res = await apiRequest(`/api/experiences/${id}/react`, { method: "PUT", body: { emoji } });
  return res.data;
}

export async function savePostApi(id: string) {
  const res = await apiRequest(ENDPOINTS.SAVE_EXPERIENCE(id), { method: "POST", body: {} });
  return res.data;
}

export async function unsavePostApi(id: string) {
  const res = await apiRequest(ENDPOINTS.SAVE_EXPERIENCE(id), { method: "DELETE" });
  return res.data;
}

export async function getMyExperiencesApi() {
  const res = await apiRequest(ENDPOINTS.GET_MY_EXPERIENCES, { method: "GET" });
  return res.data;
}

export async function getUserExperiencesApi(userId: string) {
  const res = await apiRequest(ENDPOINTS.GET_USER_EXPERIENCES(userId), { method: "GET" });
  return res.data;
}

export async function getExperienceReviewsApi(experienceId: string) {
  const res = await apiRequest(ENDPOINTS.GET_EXPERIENCE_REVIEWS(experienceId), { method: "GET" });
  return res.data;
}

// Backward-compatible Service & Itinerary wrappers
export async function createService(payload: Record<string, any> | FormData) {
  return createPost(payload);
}

export async function getService(id: string) {
  return getPost(id);
}

export async function listServices(params: Record<string, any> = {}) {
  return listPosts(params);
}

export async function updateService(id: string, payload: Record<string, any> | FormData) {
  return updatePost(id, payload);
}

export async function deleteService(id: string) {
  return deletePost(id);
}

export async function createItinerary(payload: Record<string, any> | FormData) {
  const res = await apiRequest(ENDPOINTS.ITINERARIES, { method: "POST", body: payload });
  return res.data;
}

export async function getItinerary(id: string) {
  const res = await apiRequest(ENDPOINTS.GET_ITINERARY(id), { method: "GET" });
  return res.data;
}

export async function listItineraries(params: Record<string, any> = {}) {
  const res = await apiRequest(ENDPOINTS.ITINERARIES, { method: "GET", params });
  return res.data;
}

export async function listExploreItineraries(params: Record<string, any> = {}) {
  const res = await apiRequest(ENDPOINTS.EXPLORE_ITINERARIES, { method: "GET", params });
  return res.data;
}

export async function getCombinedLocationData(params: Record<string, any> = {}) {
  const res = await apiRequest(ENDPOINTS.COMBINED_LOCATION, { method: "GET", params });
  return res.data;
}

export async function updateItinerary(id: string, payload: Record<string, any> | FormData) {
  const res = await apiRequest(ENDPOINTS.GET_ITINERARY(id), { method: "PUT", body: payload });
  return res.data;
}

export async function deleteItinerary(id: string) {
  const res = await apiRequest(ENDPOINTS.DELETE_ITINERARY(id), { method: "DELETE" });
  return res.data;
}

export async function reactToItinerary(id: string, emoji: string) {
  const res = await apiRequest(ENDPOINTS.REACT_ITINERARY(id), { method: "PUT", body: { emoji } });
  return res.data;
}

export async function saveItineraryApi(id: string) {
  const res = await apiRequest(ENDPOINTS.SAVE_ITINERARY(id), { method: "POST", body: {} });
  return res.data;
}

export async function unsaveItineraryApi(id: string) {
  const res = await apiRequest(ENDPOINTS.SAVE_ITINERARY(id), { method: "DELETE" });
  return res.data;
}

// Curated Feeds matching docs/api_docs/experiences.md
export async function getFeaturedExperiences(limit = 16, page = 1, sort = "clicks") {
  const res = await apiRequest(`${ENDPOINTS.GET_FEATURED_EXPERIENCES(limit, page)}&sort=${sort}`);
  return res.data;
}

export async function getFeaturedTreks(limit = 16, page = 1, sort = "clicks") {
  return getFeaturedExperiences(limit, page, sort);
}

export async function getTopRatedTreks(limit = 16, page = 1, sort = "rating") {
  const res = await apiRequest(ENDPOINTS.GET_TOPRATED_TREKS, { params: { limit, page, sort } });
  return res.data;
}

export async function getTopRatedHosts(limit = 16, page = 1) {
  const res = await apiRequest(ENDPOINTS.GET_TOPRATED_HOSTS, { params: { limit, page } });
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

export async function getMostLovedExperiences(limit = 16, page = 1, sort = "bookings") {
  const res = await apiRequest(
    `${ENDPOINTS.GET_MOST_LOVED_EXPERIENCES(limit, page)}&sort=${sort}`
  );
  return res.data;
}

export async function getLatestExperiences(limit = 16, page = 1, sort = "recent") {
  const res = await apiRequest(ENDPOINTS.GET_LATEST_EXPERIENCES(limit, page, sort));
  return res.data;
}

export async function getCategoryActivity() {
  const res = await apiRequest(ENDPOINTS.GET_CATEGORY_ACTIVITY);
  return res.data;
}
