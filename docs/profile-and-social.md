# User/Host Profiles, Media Grid, Community Stories & Connect Directory

Branch: `feat/profile-and-social`

---

## 1. Profile View (`src/app/profile/page.tsx`, `src/app/profile/[id]/page.tsx` & `src/components/profile/profile-view.tsx`)

* Renders both **My Profile** (`/profile`) and **Public User/Host Profiles** (`/profile/[id]`).
* Fetches profile data and authored experiences via `getProfileByIdApi(userId)` (`GET /api/users/profile/:userId`) and saved wishlist posts via `getSavedPostsApi()` (`GET /api/users/me/saved`).
* Applies customizable banner themes from `PROFILE_THEMES` (`src/data/profile-themes.ts`).
* **Social Friendship Controls**:
  * Send friend request (`friendRequestApi`), accept incoming request (`acceptFriendRequestApi`), or unfriend (`unfriendUserApi`).
  * Deep-link button (`Message`) to open a 1-on-1 conversation in `/chat?userId=:id`.

---

## 2. Profile Sub-Components (`src/components/profile/`)

* **`edit-profile-modal.tsx`**:
  * S3 Avatar upload (`getPresignedUrl` with `uploadType: "avatars"` + `uploadFileToS3`).
  * Updates name, bio, city/state location, host experience years, and `profileTheme` (`updateProfileApi`).
  * Includes Phone OTP verification (`sendPhoneOtpApi`, `verifyPhoneOtpApi`).
* **`profile-grid-tab.tsx`**:
  * 3-column Instagram-style gallery for Hosts (`getHostGridMediaApi`).
  * Sub-tabs for **Experience Shots** and **Host Gallery (Personal Media)**.
  * Supports multi-file S3 uploads (`addPersonalMediaApi`), media deletion with custom themed confirmation modal (`deletePersonalMediaApi`), and pinning (`togglePinPersonalMediaApi`, `togglePinExperienceMediaApi`).
* **`community-posts-tab.tsx`**:
  * Displays user's community travel stories (`getUserCommunityPostsApi`).
  * Allows publishing new stories with S3 photo upload and location tag (`createCommunityPostApi`), liking stories (`toggleLikeCommunityPostApi`), and deleting own posts (`deleteCommunityPostApi`).
* **`profile-bookings-tab.tsx` & `host-experience-table.tsx`**:
  * **Host Experience Table**: Searchable datatable of host experiences with single and bulk deletion, hide/unhide requests, and live status badges, all backed by themed confirmation dialogs (`ConfirmModal` / `showConfirm`).
  * **My Bookings / Booking Requests**: Lists guest reservations (`getGuestBookings`) or host requests (`getHostBookings`) with inline Accept/Decline/Approve-Cancel actions and links to `/bookings/[bookingId]`.
  * **Scheduled Trips**: Lists guest experience reminders (`getMyGuestSchedulesApi`) with delete support (`deleteGuestScheduleApi`).

---

## 3. Connect Directory (`src/app/connect/page.tsx`)

* **Open Travel Plans Tab**: Lists public traveler itineraries (`listExploreItineraries`) with destination, dates, and author links.
* **Travelers Directory Tab**: Searchable directory of travelers (`getGuestsApi` — `GET /api/users/guests`) with one-click **Connect** (`friendRequestApi`) and **Message** (`/chat?userId=:id`) actions.

