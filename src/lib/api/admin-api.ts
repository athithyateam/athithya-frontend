import { apiRequest } from "./client";
import { ENDPOINTS } from "./endpoints";

export async function getAdminStatsApi() {
  const res = await apiRequest(ENDPOINTS.ADMIN_STATS);
  return res.data;
}

export async function getAdminUsersApi(params: {
  page?: number;
  limit?: number;
  role?: string;
  search?: string;
} = {}) {
  const res = await apiRequest(ENDPOINTS.ADMIN_USERS, { params });
  return res.data;
}

export async function updateAdminUserApi(id: string, payload: Record<string, any>) {
  const res = await apiRequest(ENDPOINTS.ADMIN_UPDATE_USER(id), {
    method: "PATCH",
    body: payload,
  });
  return res.data;
}

export async function updateAdminUserRoleApi(id: string, role: "guest" | "host" | "admin") {
  const res = await apiRequest(ENDPOINTS.ADMIN_UPDATE_USER_ROLE(id), {
    method: "PATCH",
    body: { role },
  });
  return res.data;
}

export async function deleteAdminUserApi(id: string) {
  const res = await apiRequest(ENDPOINTS.ADMIN_DELETE_USER(id), { method: "DELETE" });
  return res.data;
}

export async function getAdminExperiencesApi(params: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  host?: string;
} = {}) {
  const res = await apiRequest(ENDPOINTS.ADMIN_ALL_EXPERIENCES, { params });
  return res.data;
}

export async function getAdminPendingExperiencesApi() {
  const res = await apiRequest(ENDPOINTS.ADMIN_PENDING_EXPERIENCES);
  return res.data;
}

export async function updateAdminExperienceStatusApi(
  id: string,
  payload: { status: string; remarks?: string; adminComment?: string; rejectionReason?: string }
) {
  const res = await apiRequest(ENDPOINTS.ADMIN_UPDATE_POST_STATUS(id), {
    method: "PATCH",
    body: {
      status: payload.status,
      remarks: payload.remarks || payload.adminComment || payload.rejectionReason || "",
    },
  });
  return res.data;
}

export async function updateAdminExperienceApi(id: string, payload: Record<string, any>) {
  const res = await apiRequest(ENDPOINTS.ADMIN_UPDATE_EXPERIENCE(id), {
    method: "PATCH",
    body: payload,
  });
  return res.data;
}

export async function deleteAdminExperienceApi(id: string) {
  const res = await apiRequest(ENDPOINTS.ADMIN_DELETE_EXPERIENCE(id), { method: "DELETE" });
  return res.data;
}

export async function getAdminBookingsApi(params: {
  page?: number;
  limit?: number;
  search?: string;
} = {}) {
  const res = await apiRequest(ENDPOINTS.ADMIN_BOOKINGS, { params });
  return res.data;
}

export async function updateAdminBookingApi(id: string, payload: Record<string, any>) {
  const res = await apiRequest(`${ENDPOINTS.ADMIN_BOOKINGS}/${id}`, {
    method: "PATCH",
    body: payload,
  });
  return res.data;
}

export async function deleteAdminBookingApi(id: string) {
  const res = await apiRequest(`${ENDPOINTS.ADMIN_BOOKINGS}/${id}`, { method: "DELETE" });
  return res.data;
}

export async function getAdminPendingVerificationsApi() {
  const res = await apiRequest(ENDPOINTS.ADMIN_PENDING_VERIFICATIONS);
  return res.data;
}

export async function updateAdminVerificationStatusApi(
  userId: string,
  payload: { status: "approved" | "rejected"; rejectionReason?: string }
) {
  const res = await apiRequest(ENDPOINTS.ADMIN_UPDATE_VERIFICATION(userId), {
    method: "PATCH",
    body: payload,
  });
  return res.data;
}

export async function getAdminHostHistoryApi() {
  const res = await apiRequest(ENDPOINTS.ADMIN_HOST_HISTORY);
  return res.data;
}

export async function getAdminChatActivityApi() {
  const res = await apiRequest(ENDPOINTS.ADMIN_CHAT_ACTIVITY);
  return res.data;
}

export async function getAdminTrafficAnalyticsApi() {
  const res = await apiRequest(ENDPOINTS.ADMIN_ANALYTICS);
  return res.data;
}

