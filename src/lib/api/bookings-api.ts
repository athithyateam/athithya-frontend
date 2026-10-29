import { apiRequest } from "./client";
import { ENDPOINTS } from "./endpoints";

export async function createBooking(bookingData: Record<string, any>) {
  const res = await apiRequest(ENDPOINTS.BOOKINGS, { method: "POST", body: bookingData });
  if (!res.ok) throw res.data || { message: res.message };
  return res.data;
}

export async function verifyPayment(paymentData: Record<string, any>) {
  const res = await apiRequest(ENDPOINTS.VERIFY_BOOKING, { method: "POST", body: paymentData });
  if (!res.ok) throw res.data || { message: res.message };
  return res.data;
}

export async function getHostBookings(status = "") {
  const res = await apiRequest(ENDPOINTS.HOST_BOOKINGS, {
    params: status ? { status } : undefined,
  });
  return res.data;
}

export async function getGuestBookings() {
  const res = await apiRequest(ENDPOINTS.GUEST_BOOKINGS);
  return res.data;
}

export async function getBookingDetails(bookingId: string) {
  const res = await apiRequest(ENDPOINTS.GET_BOOKING(bookingId));
  return res.data;
}

export async function acceptBooking(bookingId: string, hostResponse = "") {
  const res = await apiRequest(ENDPOINTS.ACCEPT_BOOKING(bookingId), {
    method: "PATCH",
    body: { hostResponse },
  });
  return res.data;
}

export async function declineBooking(bookingId: string, hostResponse = "") {
  const res = await apiRequest(ENDPOINTS.DECLINE_BOOKING(bookingId), {
    method: "PATCH",
    body: { hostResponse },
  });
  return res.data;
}

export async function requestCancellation(bookingId: string, reason = "") {
  const res = await apiRequest(ENDPOINTS.CANCEL_BOOKING_REQUEST(bookingId), {
    method: "PATCH",
    body: { reason },
  });
  return res.data;
}

export async function approveCancellation(bookingId: string) {
  const res = await apiRequest(ENDPOINTS.APPROVE_CANCELLATION(bookingId), { method: "PATCH" });
  return res.data;
}

export async function acceptOrphanedInvite(bookingId: string) {
  const res = await apiRequest(`/api/bookings/${bookingId}/orphaned-accept`, { method: "PATCH" });
  return res.data;
}

export async function rejectOrphanedInvite(bookingId: string) {
  const res = await apiRequest(`/api/bookings/${bookingId}/orphaned-reject`, { method: "PATCH" });
  return res.data;
}

export async function sendStartOTP(bookingId: string) {
  const res = await apiRequest(`/api/bookings/${bookingId}/send-start-otp`, { method: "POST" });
  return res.data;
}

export async function verifyStartOTP(bookingId: string, otp: string) {
  const res = await apiRequest(`/api/bookings/${bookingId}/verify-start-otp`, {
    method: "POST",
    body: { otp },
  });
  return res.data;
}

export async function sendCompletionOTP(bookingId: string) {
  const res = await apiRequest(`/api/bookings/${bookingId}/send-completion-otp`, { method: "POST" });
  return res.data;
}

export async function verifyCompletionOTP(bookingId: string, otp: string) {
  const res = await apiRequest(`/api/bookings/${bookingId}/verify-completion-otp`, {
    method: "POST",
    body: { otp },
  });
  return res.data;
}

export async function createSchedule(scheduleData: Record<string, any>) {
  const res = await apiRequest(ENDPOINTS.CREATE_SCHEDULE, { method: "POST", body: scheduleData });
  return res.data;
}

export async function getMySchedules() {
  const res = await apiRequest(ENDPOINTS.MY_SCHEDULES);
  return res.data;
}

export async function getScheduleInvites() {
  const res = await apiRequest(ENDPOINTS.SCHEDULE_INVITES);
  return res.data;
}

export async function getScheduleStatus(postId: string, scheduleId?: string) {
  const res = await apiRequest(ENDPOINTS.SCHEDULE_STATUS(postId), {
    params: scheduleId ? { scheduleId } : undefined,
  });
  return res.data;
}

export async function respondToScheduleInvite(scheduleId: string, status: "accepted" | "declined") {
  const res = await apiRequest(ENDPOINTS.RESPOND_SCHEDULE(scheduleId), {
    method: "POST",
    body: { status },
  });
  return res.data;
}

export async function deleteSchedule(scheduleId: string) {
  const res = await apiRequest(`/api/schedules/${scheduleId}`, { method: "DELETE" });
  return res.data;
}

export async function inviteFriendDirectly(
  postId: string,
  friendId?: string | null,
  scheduleId?: string | null,
  friendIds?: string[] | null,
  numberOfPeople = 1
) {
  const body: Record<string, any> = { postId, scheduleId, numberOfPeople };
  if (friendIds && friendIds.length > 0) body.friendIds = friendIds;
  else if (friendId) body.friendId = friendId;
  const res = await apiRequest("/api/schedules/send-friend-invite", { method: "POST", body });
  return res.data;
}

export async function removeScheduleFriend(postId: string, friendId: string) {
  const res = await apiRequest(ENDPOINTS.REMOVE_FRIEND(postId, friendId), { method: "POST" });
  return res.data;
}

export async function scheduleExperienceApi(payload: {
  postId: string;
  scheduledDate: string;
  scheduledTime: string;
}) {
  const res = await apiRequest(ENDPOINTS.GUEST_SCHEDULES, { method: "POST", body: payload });
  return res.data;
}

export async function getMyGuestSchedulesApi() {
  const res = await apiRequest(ENDPOINTS.MY_GUEST_SCHEDULES);
  return res.data;
}

export async function checkGuestScheduleApi(postId: string) {
  const res = await apiRequest(ENDPOINTS.CHECK_GUEST_SCHEDULE(postId));
  return res.data;
}

export async function deleteGuestScheduleApi(id: string) {
  const res = await apiRequest(ENDPOINTS.DELETE_GUEST_SCHEDULE(id), { method: "DELETE" });
  return res.data;
}

export async function submitReview(reviewData: Record<string, any>) {
  const res = await apiRequest(ENDPOINTS.REVIEWS, { method: "POST", body: reviewData });
  return res.data;
}

export async function getLatestReviews(limit = 20) {
  const res = await apiRequest(ENDPOINTS.LATEST_REVIEWS, { params: { limit } });
  return res.data || { success: false, reviews: [] };
}

export async function getHostReviewsApi(hostId: string, params: Record<string, any> = {}) {
  const res = await apiRequest(ENDPOINTS.HOST_REVIEWS(hostId), { params });
  return res.data;
}

export async function checkReviewEligibilityApi(postId: string) {
  const res = await apiRequest(ENDPOINTS.REVIEW_ELIGIBILITY, { params: { postId } });
  return res.data;
}

