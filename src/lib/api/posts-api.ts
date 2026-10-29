import { apiRequest } from "./client";
import { ENDPOINTS } from "./endpoints";

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
      type: options.type || options.uploadType || "posts",
    },
    token: options.token,
  });
  return res.data;
}

export async function createPost(payload: Record<string, any> | FormData) {
  const res = await apiRequest(ENDPOINTS.POSTS, { method: "POST", body: payload });
  if (!res.ok) throw { success: false, message: res.message, status: res.status };
  return res.data;
}

export async function getPost(id: string) {
  const res = await apiRequest(ENDPOINTS.GET_POST(id), { method: "GET" });
  if (res.ok) return res.data;
  const fallback = await apiRequest(ENDPOINTS.POST_BY_ID(id), { method: "GET" });
  return fallback.data;
}

export async function listPosts(params: Record<string, any> = {}) {
  const res = await apiRequest(ENDPOINTS.POSTS, { method: "GET", params });
  return res.data;
}

export async function updatePost(id: string, payload: Record<string, any> | FormData) {
  const res = await apiRequest(ENDPOINTS.GET_POST(id), { method: "PUT", body: payload });
  return res.data;
}

export async function deletePost(id: string) {
  const res = await apiRequest(ENDPOINTS.DELETE_POST(id), { method: "DELETE" });
  return res.data;
}

export async function requestHideService(id: string, reason?: string) {
  const res = await apiRequest(ENDPOINTS.REQUEST_HIDE_POST(id), {
    method: "PATCH",
    body: { reason },
  });
  return res.data;
}

export async function reactToPost(id: string, emoji: string) {
  const res = await apiRequest(ENDPOINTS.REACT_POST(id), { method: "PUT", body: { emoji } });
  return res.data;
}

export async function savePostApi(id: string) {
  const res = await apiRequest(ENDPOINTS.SAVE_POST(id), { method: "POST", body: {} });
  return res.data;
}

export async function unsavePostApi(id: string) {
  const res = await apiRequest(ENDPOINTS.SAVE_POST(id), { method: "DELETE" });
  return res.data;
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

export async function createService(payload: Record<string, any> | FormData) {
  const res = await apiRequest(ENDPOINTS.POST_SERVICE, { method: "POST", body: payload });
  return res.data;
}

export async function getService(id: string) {
  const res = await apiRequest(ENDPOINTS.GET_SERVICE(id), { method: "GET" });
  return res.data;
}

export async function listServices(params: Record<string, any> = {}) {
  const res = await apiRequest(ENDPOINTS.ALL_SERVICES, { method: "GET", params });
  return res.data;
}

export async function updateService(id: string, payload: Record<string, any> | FormData) {
  const res = await apiRequest(`${ENDPOINTS.POST_SERVICE}/${id}`, { method: "PUT", body: payload });
  return res.data;
}

export async function deleteService(id: string) {
  const res = await apiRequest(ENDPOINTS.DELETE_SERVICE(id), { method: "DELETE" });
  return res.data;
}

export async function getFeaturedTreks(limit = 16, page = 1, sort = "clicks") {
  const res = await apiRequest(`${ENDPOINTS.GET_FEATURED_TREKS(limit, page)}&sort=${sort}`);
  return res.data;
}

export async function getFeaturedExperiences(limit = 16, page = 1, sort = "clicks") {
  const res = await apiRequest(`${ENDPOINTS.GET_FEATURED_EXPERIENCES(limit, page)}&sort=${sort}`);
  return res.data;
}

export async function getTopRatedTreks(limit = 16, page = 1, sort = "rating") {
  const res = await apiRequest(ENDPOINTS.POSTS, { params: { limit, page, sort } });
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
    `${ENDPOINTS.GET_MOST_REACTED_EXPERIENCES(limit, page)}&sort=${sort}`
  );
  return res.data;
}

export async function getLatestExperiences(limit = 16, page = 1, sort = "latest") {
  const res = await apiRequest(`${ENDPOINTS.POSTS_ROOT}/experiences/latest`, {
    params: { limit, page, sort },
  });
  return res.data;
}

export async function getCategoryActivity() {
  const res = await apiRequest(ENDPOINTS.GET_CATEGORY_ACTIVITY);
  return res.data;
}
