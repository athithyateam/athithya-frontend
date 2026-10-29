export const ENDPOINTS = {
  LOGOUT: "/api/auth/logout",
  SIGNIN: "/api/auth/signin",
  SIGNUP_INITIATE: "/api/auth/signup/initiate",
  SIGNUP_COMPLETE: "/api/auth/signup/complete",
  GOOGLE_AUTH: "/api/auth/google",
  FORGOT_PASSWORD: "/api/auth/forgot-password",
  RESET_PASSWORD: "/api/auth/reset-password",
  ME: "/api/auth/me",

  POSTS: "/api/posts/experiences",
  POSTS_ROOT: "/api/posts",
  GET_POST: (id: string) => `/api/posts/experiences/${id}`,
  POST_BY_ID: (id: string) => `/api/posts/${id}`,
  DELETE_POST: (id: string) => `/api/posts/experiences/${id}`,
  USER_POST: (userId: string) => `/api/posts/experiences/user/${userId}`,
  REACT_POST: (id: string) => `/api/posts/${id}/react`,
  SAVE_POST: (id: string) => `/api/posts/${id}/save`,
  REQUEST_HIDE_POST: (id: string) => `/api/posts/${id}/request-hide`,
  PRESIGNED_URL: "/api/posts/presigned-url",

  ITINERARIES: "/api/itineraries",
  EXPLORE_ITINERARIES: "/api/itineraries/explore/complete",
  COMBINED_LOCATION: "/api/itineraries/location/combined",
  GET_ITINERARY: (id: string) => `/api/itineraries/${id}`,
  USER_ITINERARIES: (userId: string) => `/api/itineraries/user/${userId}`,
  DELETE_ITINERARY: (id: string) => `/api/itineraries/${id}`,
  REACT_ITINERARY: (id: string) => `/api/itineraries/${id}/react`,
  SAVE_ITINERARY: (id: string) => `/api/itineraries/${id}/save`,

  POST_SERVICE: "/api/posts/services",
  ALL_SERVICES: "/api/posts/services",
  DELETE_SERVICE: (id: string) => `/api/posts/services/${id}`,
  GET_SERVICE: (id: string) => `/api/posts/services/${id}`,
  USER_SERVICE: (userId: string) => `/api/posts/services/user/${userId}`,

  GET_FEATURED_TREKS: (limit = 10, page = 1) =>
    `/api/posts/featured/treks?limit=${limit}&page=${page}`,
  GET_FEATURED_EXPERIENCES: (limit = 10, page = 1) =>
    `/api/posts/experiences/featured/list?limit=${limit}&page=${page}`,
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
    let url = `/api/posts/nearby/treks?limit=${limit}&page=${page}`;
    if (latitude !== undefined && latitude !== null) url += `&latitude=${latitude}`;
    if (longitude !== undefined && longitude !== null) url += `&longitude=${longitude}`;
    return url;
  },
  GET_TOPRATED_TREKS: "/api/posts/top-rated/treks",
  GET_TOPRATED_HOSTS: "/api/users/top-rated/hosts",
  GET_CATEGORY_ACTIVITY: "/api/posts/categories/activity",
  GET_MOST_REACTED_EXPERIENCES: (limit = 10, page = 1) =>
    `/api/posts/most-reacted/experiences?limit=${limit}&page=${page}`,

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

  COMMUNITY_POSTS: "/api/users/community-posts",
  LIKE_COMMUNITY_POST: (id: string) => `/api/users/community-posts/${id}/like`,
  COMMUNITY_POST_LIKERS: (id: string) => `/api/users/community-posts/${id}/likers`,
  USER_COMMUNITY_POSTS: (userId: string) => `/api/users/profile/${userId}/community-posts`,
  DELETE_COMMUNITY_POST: (id: string) => `/api/users/community-posts/${id}`,

  HOST_GRID_MEDIA: (hostId: string) => `/api/users/profile/${hostId}/grid-media`,
  GRID_TAB_PREFERENCE: "/api/users/grid-tab-preference",
  PERSONAL_MEDIA: "/api/users/personal-media",
  DELETE_PERSONAL_MEDIA: (id: string) => `/api/users/personal-media/${id}`,
  PIN_PERSONAL_MEDIA: (id: string) => `/api/users/personal-media/${id}/pin`,
  PIN_EXPERIENCE_MEDIA: "/api/users/experience-media/pin",

  SEARCH: "/api/search",
  SEARCH_ADVANCED: "/api/search/advanced",
  SEARCH_SUGGESTIONS: "/api/search/suggestions",
  SEARCH_BY_LOCATION: "/api/search/by-location",
  GEOCODE_REVERSE: "/api/search/geocode/reverse",
  GEOCODE_SEARCH: "/api/search/geocode/search",

  NOTIFICATIONS: "/api/notifications",
  BOOKING_NOTIFICATIONS: "/api/notifications/bookings",
  FOLLOW_NOTIFICATIONS: "/api/notifications/follows",
  MARK_READ: (id: string) => `/api/notifications/${id}/read`,
  MARK_ALL_READ: "/api/notifications/mark-all/read",
  CLEAR_ALL_NOTIFS: "/api/notifications/clear/all",

  BOOKINGS: "/api/bookings",
  VERIFY_BOOKING: "/api/bookings/verify",
  HOST_BOOKINGS: "/api/bookings/host/requests",
  GUEST_BOOKINGS: "/api/bookings/guest/my-bookings",
  ACCEPT_BOOKING: (id: string) => `/api/bookings/${id}/accept`,
  DECLINE_BOOKING: (id: string) => `/api/bookings/${id}/decline`,
  GET_BOOKING: (id: string) => `/api/bookings/${id}`,
  CANCEL_BOOKING_REQUEST: (id: string) => `/api/bookings/${id}/request-cancel`,
  APPROVE_CANCELLATION: (id: string) => `/api/bookings/${id}/approve-cancel`,

  CREATE_SCHEDULE: "/api/schedules",
  MY_SCHEDULES: "/api/schedules/me",
  SCHEDULE_INVITES: "/api/schedules/invites",
  RESPOND_SCHEDULE: (id: string) => `/api/schedules/${id}/respond`,
  SCHEDULE_STATUS: (postId: string) => `/api/schedules/post/${postId}/status`,
  REMOVE_FRIEND: (postId: string, friendId: string) =>
    `/api/schedules/post/${postId}/invite/${friendId}/remove`,

  GUEST_SCHEDULES: "/api/guest-schedules",
  MY_GUEST_SCHEDULES: "/api/guest-schedules/me",
  CHECK_GUEST_SCHEDULE: (postId: string) => `/api/guest-schedules/check/${postId}`,
  DELETE_GUEST_SCHEDULE: (id: string) => `/api/guest-schedules/${id}`,

  REVIEWS: "/api/reviews",
  LATEST_REVIEWS: "/api/reviews/latest",
  HOST_REVIEWS: (hostId: string) => `/api/reviews/host/${hostId}`,
  REVIEW_ELIGIBILITY: "/api/reviews/check-eligibility",

  CHAT_CONVERSATIONS: "/api/chat/conversations",
  CHAT_GROUPS: "/api/chat/groups",
  CHAT_MESSAGES: "/api/chat/messages",
  CHAT_ELIGIBILITY: (conversationId: string) => `/api/chat/eligibility/${conversationId}`,

  ADMIN_STATS: "/api/admin/stats",
  ADMIN_PENDING_EXPERIENCES: "/api/admin/experiences/pending",
  ADMIN_UPDATE_POST_STATUS: (id: string) => `/api/admin/experiences/${id}/status`,
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

