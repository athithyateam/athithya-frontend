import { apiRequest } from "./client";
import { ENDPOINTS } from "./endpoints";

export async function getProfileByIdApi(userId: string, page = 1) {
  const res = await apiRequest(ENDPOINTS.USER_PROFILE(userId), {
    method: "GET",
    params: { page, limit: 12 },
  });
  return res.data;
}

export async function getCompleteProfileApi(userId: string) {
  const res = await apiRequest(ENDPOINTS.USER_COMPLETE_PROFILE(userId), { method: "GET" });
  return res.data;
}

export async function updateProfileApi(payload: Record<string, any> | FormData) {
  const res = await apiRequest(ENDPOINTS.UPDATE_PROFILE, { method: "PUT", body: payload });
  return res.data;
}

export async function updateUserLocationApi(locationData: Record<string, any>) {
  const res = await apiRequest(ENDPOINTS.USER_LOCATION, { method: "PUT", body: locationData });
  return res.data;
}

export async function getUserLocationApi() {
  const res = await apiRequest(ENDPOINTS.USER_LOCATION, { method: "GET" });
  return res.data;
}

export async function getSavedPostsApi() {
  const res = await apiRequest(ENDPOINTS.GET_SAVED_POSTS, { method: "GET" });
  return res.data;
}

export async function deleteAccountApi() {
  const res = await apiRequest(ENDPOINTS.UPDATE_PROFILE, { method: "DELETE" });
  return res.data;
}

export async function getHostGridMediaApi(hostId: string) {
  const res = await apiRequest(ENDPOINTS.HOST_GRID_MEDIA(hostId), { method: "GET" });
  return res.data;
}

export async function updateHostGridTabPreferenceApi(activeGridTab: string) {
  const res = await apiRequest(ENDPOINTS.GRID_TAB_PREFERENCE, {
    method: "PATCH",
    body: { activeGridTab, tab: activeGridTab },
  });
  return res.data;
}

export async function addPersonalMediaApi(items: any[]) {
  const res = await apiRequest(ENDPOINTS.PERSONAL_MEDIA, {
    method: "POST",
    body: { items },
  });
  return res.data;
}

export async function deletePersonalMediaApi(id: string) {
  const res = await apiRequest(ENDPOINTS.DELETE_PERSONAL_MEDIA(id), { method: "DELETE" });
  return res.data;
}

export async function togglePinPersonalMediaApi(id: string) {
  const res = await apiRequest(ENDPOINTS.PIN_PERSONAL_MEDIA(id), { method: "PATCH", body: {} });
  return res.data;
}

export async function togglePinExperienceMediaApi(mediaKey: string) {
  const res = await apiRequest(ENDPOINTS.PIN_EXPERIENCE_MEDIA, {
    method: "PATCH",
    body: { mediaKey },
  });
  return res.data;
}

export async function getUserCommunityPostsApi(userId: string) {
  const res = await apiRequest(ENDPOINTS.USER_COMMUNITY_POSTS(userId), { method: "GET" });
  return res.data;
}

export async function createCommunityPostApi(payload: Record<string, any>) {
  const res = await apiRequest(ENDPOINTS.COMMUNITY_POSTS, { method: "POST", body: payload });
  return res.data;
}

export async function toggleLikeCommunityPostApi(id: string) {
  const res = await apiRequest(ENDPOINTS.LIKE_COMMUNITY_POST(id), { method: "POST", body: {} });
  return res.data;
}

export async function getCommunityPostLikersApi(id: string) {
  const res = await apiRequest(ENDPOINTS.COMMUNITY_POST_LIKERS(id), { method: "GET" });
  return res.data;
}

export async function deleteCommunityPostApi(id: string) {
  const res = await apiRequest(ENDPOINTS.DELETE_COMMUNITY_POST(id), { method: "DELETE" });
  return res.data;
}

export async function friendRequestApi(userId: string) {
  const res = await apiRequest(ENDPOINTS.FRIEND_REQUEST(userId), { method: "POST", body: {} });
  return res.data;
}

export async function unfriendUserApi(userId: string) {
  const res = await apiRequest(ENDPOINTS.UNFRIEND_USER(userId), { method: "POST", body: {} });
  return res.data;
}

export async function getFriendsApi(userId: string) {
  const res = await apiRequest(ENDPOINTS.GET_FRIENDS(userId), { method: "GET" });
  return res.data;
}

export async function acceptFriendRequestApi(userId: string) {
  const res = await apiRequest(ENDPOINTS.ACCEPT_FRIEND(userId), { method: "POST", body: {} });
  return res.data;
}

export async function rejectFriendRequestApi(userId: string) {
  const res = await apiRequest(ENDPOINTS.REJECT_FRIEND(userId), { method: "POST", body: {} });
  return res.data;
}

export async function getGuestsApi({ search = "", page = 1, limit = 10 } = {}) {
  const res = await apiRequest(ENDPOINTS.GET_GUESTS, {
    method: "GET",
    params: { search, page, limit },
  });
  return res.data;
}

