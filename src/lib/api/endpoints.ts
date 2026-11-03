export const ENDPOINTS = {
  // Authentication & Users (Docs: auth-and-users.md)
  LOGOUT: "/api/auth/logout",
  SIGNIN: "/api/auth/signin",
  SIGNUP_INITIATE: "/api/auth/signup/initiate",
  SIGNUP_COMPLETE: "/api/auth/signup/complete",
  GOOGLE_AUTH: "/api/auth/google",
  FORGOT_PASSWORD: "/api/auth/forgot-password",
  RESET_PASSWORD: "/api/auth/reset-password",
  ME: "/api/auth/me",

  GET_USER: (id: string) => `/api/users/${id}`,
  USER_PROFILE: (id: string) => `/api/users/profile/${id}`,
  USER_COMPLETE_PROFILE: (id: string) => `/api/users/profile/${id}/complete`,
  UPDATE_PROFILE: "/api/users/profile",
  USER_LOCATION: "/api/users/location",
  VERIFY_HOST: "/api/users/verify-host",
  SEND_PHONE_OTP: "/api/users/verify-phone/send-otp",
  VERIFY_PHONE_OTP: "/api/users/verify-phone/verify-otp",
  FRIEND_REQUEST: (id: string) => `/api/users/${id}/friend-request`,
  UNFRIEND_USER: (id: string) => `/api/users/${id}/unfriend`,
  GET_FRIENDS: (id: string) => `/api/users/${id}/friends`,
  ACCEPT_FRIEND: (id: string) => `/api/users/${id}/friend-accept`,
  REJECT_FRIEND: (id: string) => `/api/users/${id}/friend-reject`,
  GET_GUESTS: "/api/users/guests",
  GET_SAVED_POSTS: "/api/users/me/saved",
  GET_TOPRATED_HOSTS: "/api/users/top-rated/hosts",

  // Host Media Grid (Docs: auth-and-users.md)
  HOST_GRID_MEDIA: (hostId: string) => `/api/users/profile/${hostId}/grid-media`,
  GRID_TAB_PREFERENCE: "/api/users/grid-tab-preference",
  PERSONAL_MEDIA: "/api/users/personal-media",
  DELETE_PERSONAL_MEDIA: (id: string) => `/api/users/personal-media/${id}`,
  PIN_PERSONAL_MEDIA: (id: string) => `/api/users/personal-media/${id}/pin`,
  PIN_EXPERIENCE_MEDIA: "/api/users/experience-media/pin",

  // Community Posts (Social Feed)
  COMMUNITY_POSTS: "/api/users/community-posts",
  LIKE_COMMUNITY_POST: (id: string) => `/api/users/community-posts/${id}/like`,
  COMMUNITY_POST_LIKERS: (id: string) => `/api/users/community-posts/${id}/likers`,
  USER_COMMUNITY_POSTS: (userId: string) => `/api/users/profile/${userId}/community-posts`,
  DELETE_COMMUNITY_POST: (id: string) => `/api/users/community-posts/${id}`,

  // Experiences (Docs: experiences.md)
  EXPERIENCES: "/api/experiences",
  EXPERIENCES_ROOT: "/api/experiences",
  GET_EXPERIENCE: (id: string) => `/api/experiences/${id}`,
  GET_EXPERIENCE_REVIEWS: (experienceId: string) => `/api/experiences/reviews/${experienceId}`,
  GET_USER_EXPERIENCES: (userId: string) => `/api/experiences/user/${userId}`,
  GET_MY_EXPERIENCES: "/api/experiences/my/experiences",
  PRESIGNED_URL: "/api/experiences/presigned-url",
  SAVE_EXPERIENCE: (id: string) => `/api/experiences/${id}/save`,
  REQUEST_HIDE_EXPERIENCE: (id: string) => `/api/experiences/${id}/request-hide`,

  GET_FEATURED_EXPERIENCES: (limit = 10, page = 1) =>
    `/api/experiences/featured/list?limit=${limit}&page=${page}`,
  GET_LATEST_EXPERIENCES: (limit = 10, page = 1, sort = "recent") =>
    `/api/experiences/latest?limit=${limit}&page=${page}&sort=${sort}`,
  GET_MOST_LOVED_EXPERIENCES: (limit = 10, page = 1) =>
    `/api/experiences/most-loved?limit=${limit}&page=${page}`,
  GET_NEARBY_TREKS: ({
    latitude,
    longitude,
    limit = 20,
    page = 1,
  }: {
    latitude?: number | null;
    longitude?: number | null;
    limit?: number;
    page?: number;
  }) => {
    let url = `/api/experiences/nearby/treks?limit=${limit}&page=${page}`;
    if (latitude !== undefined && latitude !== null) url += `&latitude=${latitude}`;
    if (longitude !== undefined && longitude !== null) url += `&longitude=${longitude}`;
    return url;
  },
  GET_TOPRATED_TREKS: "/api/experiences/top-rated/treks",
  GET_CATEGORY_ACTIVITY: "/api/experiences/categories/activity",

  // Legacy Aliases for Experiences (backward compatibility)
  POSTS: "/api/experiences",
  POSTS_ROOT: "/api/experiences",
  GET_POST: (id: string) => `/api/experiences/${id}`,
  POST_BY_ID: (id: string) => `/api/experiences/${id}`,
  DELETE_POST: (id: string) => `/api/experiences/${id}`,
  USER_POST: (userId: string) => `/api/experiences/user/${userId}`,
  REACT_POST: (id: string) => `/api/experiences/${id}/react`,
  SAVE_POST: (id: string) => `/api/experiences/${id}/save`,
  REQUEST_HIDE_POST: (id: string) => `/api/experiences/${id}/request-hide`,
  POST_SERVICE: "/api/experiences",
  ALL_SERVICES: "/api/experiences",
  DELETE_SERVICE: (id: string) => `/api/experiences/${id}`,
  GET_SERVICE: (id: string) => `/api/experiences/${id}`,
  USER_SERVICE: (userId: string) => `/api/experiences/user/${userId}`,
  GET_FEATURED_TREKS: (limit = 10, page = 1) =>
    `/api/experiences/featured/list?limit=${limit}&page=${page}`,
  GET_MOST_REACTED_EXPERIENCES: (limit = 10, page = 1) =>
    `/api/experiences/most-loved?limit=${limit}&page=${page}`,

  // Itineraries
  ITINERARIES: "/api/itineraries",
  EXPLORE_ITINERARIES: "/api/itineraries/explore/complete",
  COMBINED_LOCATION: "/api/itineraries/location/combined",
  GET_ITINERARY: (id: string) => `/api/itineraries/${id}`,
  USER_ITINERARIES: (userId: string) => `/api/itineraries/user/${userId}`,
  DELETE_ITINERARY: (id: string) => `/api/itineraries/${id}`,
  REACT_ITINERARY: (id: string) => `/api/itineraries/${id}/react`,
  SAVE_ITINERARY: (id: string) => `/api/itineraries/${id}/save`,

  // Search & Geocoding (Docs: search.md)
  SEARCH: "/api/search",
  SEARCH_ADVANCED: "/api/search/advanced",
  SEARCH_SUGGESTIONS: "/api/search/suggestions",
  SEARCH_BY_LOCATION: "/api/search/by-location",
  GEOCODE_REVERSE: "/api/search/geocode/reverse",
  GEOCODE_SEARCH: "/api/search/geocode/search",

  // Notifications (Docs: notifications.md)
  NOTIFICATIONS: "/api/notifications",
  BOOKING_NOTIFICATIONS: "/api/notifications/bookings",
  FOLLOW_NOTIFICATIONS: "/api/notifications/follows",
  MARK_READ: (id: string) => `/api/notifications/${id}/read`,
  MARK_ALL_READ: "/api/notifications/mark-all/read",
  CLEAR_ALL_NOTIFS: "/api/notifications/clear/all",

  // Bookings & Payments (Docs: bookings.md)
  BOOKINGS: "/api/bookings",
  VERIFY_BOOKING: "/api/bookings/verify",
  HOST_BOOKINGS: "/api/bookings/host/requests",
  GUEST_BOOKINGS: "/api/bookings/guest/my-bookings",
  ACCEPT_BOOKING: (id: string) => `/api/bookings/${id}/accept`,
  DECLINE_BOOKING: (id: string) => `/api/bookings/${id}/decline`,
  GET_BOOKING: (id: string) => `/api/bookings/${id}`,
  CANCEL_BOOKING_REQUEST: (id: string) => `/api/bookings/${id}/request-cancel`,
  APPROVE_CANCELLATION: (id: string) => `/api/bookings/${id}/approve-cancel`,

  // Group Bookings (Docs: group-bookings.md)
  GROUP_BOOKINGS: "/api/group-bookings",
  MY_GROUP_BOOKINGS: "/api/group-bookings/me",
  GROUP_INVITES: "/api/group-bookings/invites",
  RESPOND_GROUP_INVITE: (id: string) => `/api/group-bookings/${id}/respond`,
  GROUP_BOOKING_STATUS: (experienceId: string) => `/api/group-bookings/experience/${experienceId}/status`,
  SEND_FRIEND_INVITE: "/api/group-bookings/send-friend-invite",
  REMOVE_GROUP_FRIEND: (experienceId: string, friendId: string) =>
    `/api/group-bookings/experience/${experienceId}/invite/${friendId}`,

  // Legacy Group Schedules Aliases
  CREATE_SCHEDULE: "/api/group-bookings",
  MY_SCHEDULES: "/api/group-bookings/me",
  SCHEDULE_INVITES: "/api/group-bookings/invites",
  RESPOND_SCHEDULE: (id: string) => `/api/group-bookings/${id}/respond`,
  SCHEDULE_STATUS: (postId: string) => `/api/group-bookings/experience/${postId}/status`,
  REMOVE_FRIEND: (postId: string, friendId: string) =>
    `/api/group-bookings/experience/${postId}/invite/${friendId}`,

  // Wishlist Schedules (Docs: wishlist-schedules.md)
  WISHLIST_SCHEDULES: "/api/wishlist-schedules",
  MY_WISHLIST_SCHEDULES: "/api/wishlist-schedules/me",
  CHECK_WISHLIST_SCHEDULE: (experienceId: string) => `/api/wishlist-schedules/check/${experienceId}`,
  DELETE_WISHLIST_SCHEDULE: (id: string) => `/api/wishlist-schedules/${id}`,

  // Legacy Guest Schedules Aliases
  GUEST_SCHEDULES: "/api/wishlist-schedules",
  MY_GUEST_SCHEDULES: "/api/wishlist-schedules/me",
  CHECK_GUEST_SCHEDULE: (postId: string) => `/api/wishlist-schedules/check/${postId}`,
  DELETE_GUEST_SCHEDULE: (id: string) => `/api/wishlist-schedules/${id}`,

  // Reviews & Ratings (Docs: reviews.md)
  REVIEWS: "/api/reviews",
  LATEST_REVIEWS: "/api/reviews/latest",
  HOST_REVIEWS: (hostId: string) => `/api/reviews/host/${hostId}`,
  REVIEW_ELIGIBILITY: "/api/reviews/check-eligibility",

  // Real-time Chat & Messaging (Docs: chat.md)
  CHAT_CONVERSATIONS: "/api/chat/conversations",
  CHAT_GROUPS: "/api/chat/groups",
  CHAT_MESSAGES: "/api/chat/messages",
  CHAT_ELIGIBILITY: (conversationId: string) => `/api/chat/eligibility/${conversationId}`,

  // Admin Operations (Docs: admin.md)
  ADMIN_STATS: "/api/admin/stats",
  ADMIN_PENDING_EXPERIENCES: "/api/admin/experiences/pending",
  ADMIN_UPDATE_POST_STATUS: (id: string) => `/api/admin/experiences/${id}/status`,
  ADMIN_EXPERIENCE_HIDE: (id: string) => `/api/admin/experiences/${id}/hide`,
  ADMIN_USERS: "/api/admin/users",
  ADMIN_UPDATE_USER: (id: string) => `/api/admin/users/${id}`,
  ADMIN_UPDATE_USER_ROLE: (id: string) => `/api/admin/users/${id}/role`,
  ADMIN_DELETE_USER: (id: string) => `/api/admin/users/${id}`,
  ADMIN_ALL_EXPERIENCES: "/api/admin/experiences",
  ADMIN_UPDATE_EXPERIENCE: (id: string) => `/api/admin/experiences/${id}`,
  ADMIN_DELETE_EXPERIENCE: (id: string) => `/api/admin/experiences/${id}`,
  ADMIN_BOOKINGS: "/api/admin/bookings",
  ADMIN_PENDING_VERIFICATIONS: "/api/admin/hosts/pending",
  ADMIN_UPDATE_VERIFICATION: (userId: string) => `/api/admin/hosts/${userId}/verification`,
  ADMIN_ANALYTICS: "/api/analytics/traffic",
  ADMIN_HOST_HISTORY: "/api/admin/host-history",
  ADMIN_CHAT_ACTIVITY: "/api/admin/chat-activity",
} as const;
