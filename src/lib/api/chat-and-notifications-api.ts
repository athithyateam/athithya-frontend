import { apiRequest } from "./client";
import { ENDPOINTS } from "./endpoints";

export async function getConversationsApi() {
  const res = await apiRequest(ENDPOINTS.CHAT_CONVERSATIONS);
  return res.data;
}

export async function createOrGetConversationApi(recipientId: string) {
  const res = await apiRequest(ENDPOINTS.CHAT_CONVERSATIONS, {
    method: "POST",
    body: { recipientId },
  });
  return res.data;
}

export async function createGroupChatApi(payload: FormData | Record<string, any>) {
  const res = await apiRequest(ENDPOINTS.CHAT_GROUPS, { method: "POST", body: payload });
  return res.data;
}

export async function updateGroupChatApi(
  conversationId: string,
  payload: FormData | Record<string, any>
) {
  const res = await apiRequest(`${ENDPOINTS.CHAT_CONVERSATIONS}/${conversationId}`, {
    method: "PATCH",
    body: payload,
  });
  return res.data;
}

export async function leaveGroupChatApi(conversationId: string) {
  const res = await apiRequest(`${ENDPOINTS.CHAT_CONVERSATIONS}/${conversationId}/leave`, {
    method: "POST",
  });
  return res.data;
}

export async function deleteConversationApi(conversationId: string) {
  const res = await apiRequest(`${ENDPOINTS.CHAT_CONVERSATIONS}/${conversationId}`, {
    method: "DELETE",
  });
  return res.data;
}

export async function clearConversationMessagesApi(conversationId: string) {
  const res = await apiRequest(`${ENDPOINTS.CHAT_CONVERSATIONS}/${conversationId}/clear`, {
    method: "DELETE",
  });
  return res.data;
}

export async function getConversationMessagesApi(conversationId: string) {
  const res = await apiRequest(`${ENDPOINTS.CHAT_MESSAGES}/${conversationId}`);
  return res.data;
}

export async function sendMessageApi(payload: {
  conversationId: string;
  recipientId?: string;
  text?: string;
  messageType?: "text" | "location" | "system";
  locationData?: { lat: number; lng: number; address?: string };
}) {
  const res = await apiRequest(ENDPOINTS.CHAT_MESSAGES, { method: "POST", body: payload });
  return res.data;
}

export async function sendAttachmentsMessageApi(
  conversationId: string,
  payload: {
    recipientId?: string;
    text?: string;
    attachments: Array<{ url: string; public_id?: string }>;
  }
) {
  const res = await apiRequest(`${ENDPOINTS.CHAT_MESSAGES}/${conversationId}/attachments`, {
    method: "POST",
    body: payload,
  });
  return res.data;
}

export async function markConversationReadApi(conversationId: string) {
  const res = await apiRequest(`${ENDPOINTS.CHAT_CONVERSATIONS}/${conversationId}/read`, {
    method: "PATCH",
  });
  return res.data;
}

export async function deleteMessageApi(messageId: string) {
  const res = await apiRequest(`${ENDPOINTS.CHAT_MESSAGES}/${messageId}`, { method: "DELETE" });
  return res.data;
}

export async function checkChatEligibilityApi(conversationId: string) {
  const res = await apiRequest(ENDPOINTS.CHAT_ELIGIBILITY(conversationId));
  return res.data;
}

export async function updateConversationItineraryPinApi(
  conversationId: string,
  payload: { action: "add" | "remove"; lat?: number; lng?: number; cityName?: string; postId?: string }
) {
  const res = await apiRequest(`${ENDPOINTS.CHAT_CONVERSATIONS}/${conversationId}/itinerary`, {
    method: "POST",
    body: payload,
  });
  return res.data;
}

export async function getNotifications(params: Record<string, any> = {}) {
  const res = await apiRequest(ENDPOINTS.NOTIFICATIONS, { params });
  return res.data;
}

export async function getBookingNotifications(params: Record<string, any> = {}) {
  const res = await apiRequest(ENDPOINTS.BOOKING_NOTIFICATIONS, { params });
  return res.data;
}

export async function getFollowNotifications(params: Record<string, any> = {}) {
  const res = await apiRequest(ENDPOINTS.FOLLOW_NOTIFICATIONS, { params });
  return res.data;
}

export async function markAsRead(id: string) {
  const res = await apiRequest(ENDPOINTS.MARK_READ(id), { method: "PUT", body: {} });
  return res.data;
}

export async function markAllRead() {
  const res = await apiRequest(ENDPOINTS.MARK_ALL_READ, { method: "PUT", body: {} });
  return res.data;
}

export async function clearAllNotifications() {
  const res = await apiRequest(ENDPOINTS.CLEAR_ALL_NOTIFS, { method: "DELETE" });
  return res.data;
}

export async function searchAll(query: string, type = "all", limit = 10) {
  const res = await apiRequest(ENDPOINTS.SEARCH, { params: { q: query, type, limit } });
  return res.data;
}

export async function searchSuggestionsApi(q: string) {
  const res = await apiRequest(ENDPOINTS.SEARCH_SUGGESTIONS, { params: { q } });
  return res.data;
}

export async function geocodeReverseApi(lat: number, lon: number) {
  const res = await apiRequest(ENDPOINTS.GEOCODE_REVERSE, { params: { lat, lon } });
  return res.data;
}

export async function geocodeSearchApi(q: string) {
  const res = await apiRequest(ENDPOINTS.GEOCODE_SEARCH, { params: { q } });
  return res.data;
}
