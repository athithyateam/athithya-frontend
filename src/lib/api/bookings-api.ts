import { apiRequest } from "./client";
import { ENDPOINTS } from "./endpoints";

export async function createBooking(bookingData: {
  experienceId: string;
  numberOfPeople: number;
  startDate?: string;
  endDate?: string;
  selectedTime?: string;
  guestMessage?: string;
  invitedUserIds?: string[];
  groupBookingId?: string;
  useWallet?: boolean;
  [key: string]: any;
}) {
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

// Group Bookings (Docs: group-bookings.md)
export async function createSchedule(scheduleData: {
  experienceId: string;
  numberOfPeople?: number;
  scheduledDate?: string;
  scheduledTime?: string;
  invitedUserIds?: string[];
  [key: string]: any;
}) {
  const res = await apiRequest(ENDPOINTS.GROUP_BOOKINGS, { method: "POST", body: scheduleData });
  return res.data;
}

export async function getMySchedules() {
  const res = await apiRequest(ENDPOINTS.MY_GROUP_BOOKINGS);
  return res.data;
}

export async function getScheduleInvites() {
  const res = await apiRequest(ENDPOINTS.GROUP_INVITES);
  return res.data;
}

export async function getScheduleStatus(experienceId: string, scheduleId?: string) {
  const res = await apiRequest(ENDPOINTS.GROUP_BOOKING_STATUS(experienceId), {
    params: scheduleId ? { scheduleId } : undefined,
  });
  return res.data;
}

export async function respondToScheduleInvite(scheduleId: string, status: "accepted" | "declined" | "rejected") {
  const normalizedStatus = status === "declined" ? "rejected" : status;
  const res = await apiRequest(ENDPOINTS.RESPOND_GROUP_INVITE(scheduleId), {
    method: "POST",
    body: { status: normalizedStatus },
  });
  return res.data;
}

export async function deleteSchedule(scheduleId: string) {
  const res = await apiRequest(`/api/group-bookings/${scheduleId}`, { method: "DELETE" });
  return res.data;
}

export async function inviteFriendDirectly(
  experienceId: string,
  friendId?: string | null,
  scheduleId?: string | null,
  friendIds?: string[] | null,
  numberOfPeople = 1
) {
  const body: Record<string, any> = {
    experienceId,
    groupBookingId: scheduleId,
    numberOfPeople,
  };
  if (friendIds && friendIds.length > 0) body.friendIds = friendIds;
  else if (friendId) body.friendIds = [friendId];
  const res = await apiRequest(ENDPOINTS.SEND_FRIEND_INVITE, { method: "POST", body });
  return res.data;
}

export async function removeScheduleFriend(experienceId: string, friendId: string) {
  const res = await apiRequest(ENDPOINTS.REMOVE_GROUP_FRIEND(experienceId, friendId), { method: "DELETE" });
  return res.data;
}

// Wishlist Schedules (Docs: wishlist-schedules.md)
export async function scheduleExperienceApi(payload: {
  experienceId: string;
  scheduledDate: string;
  scheduledTime: string;
}) {
  const res = await apiRequest(ENDPOINTS.WISHLIST_SCHEDULES, { method: "POST", body: payload });
  return res.data;
}

export async function getMyGuestSchedulesApi() {
  const res = await apiRequest(ENDPOINTS.MY_WISHLIST_SCHEDULES);
  return res.data;
}

export async function checkGuestScheduleApi(experienceId: string) {
  const res = await apiRequest(ENDPOINTS.CHECK_WISHLIST_SCHEDULE(experienceId));
  return res.data;
}

export async function deleteGuestScheduleApi(id: string) {
  const res = await apiRequest(ENDPOINTS.DELETE_WISHLIST_SCHEDULE(id), { method: "DELETE" });
  return res.data;
}

// Reviews & Ratings (Docs: reviews.md)
export async function submitReview(reviewData: {
  hostId?: string;
  experienceId?: string;
  rating: number;
  comment?: string;
  [key: string]: any;
}) {
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

export async function checkReviewEligibilityApi(experienceId: string) {
  const res = await apiRequest(ENDPOINTS.REVIEW_ELIGIBILITY, {
    params: { experienceId },
  });
  return res.data;
}

