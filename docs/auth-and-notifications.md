# Authentication, Host Verification & Live Notifications

Branch: `auth`

---

## 1. Authentication State (`src/stores/auth-store.ts`)

`useAuthStore` manages the active user session, JWT persistence (`localStorage.getItem("auth_token")`), and global auth modals:
* `user`: Normalized `UserSession` (`id`, `firstname`, `lastname`, `email`, `role`, `avatar`, `hostStatus`, `savedPosts`, `verifyBadge`, `profileTheme`).
* `fetchUser()`: Calls `getUserDetailsApi()` (`/api/auth/me` with fallback to `/api/users/profile/:userId`) on app initialization.
* `openAuthModal(tab, role)` / `closeAuthModal()`: Controls the Login/Register modal from any page or protected action.
* `setShowVerificationModal()` / `setShowHostStatusModal()`: Controls Host KYC onboarding and approval status modals.
* `logout()`: Calls `logoutApi()`, clears `auth_token`, and resets session state.

---

## 2. Authentication Components (`src/components/auth/`)

* **`login-form.tsx`**:
  * Email + password sign-in (`signinApi`).
  * Multi-step Forgot Password & OTP Password Reset flow (`forgotPasswordApi`, `resetPasswordApi`).
* **`register-form.tsx`**:
  * Role selection (`Traveler / Guest` vs `Local Host`).
  * Two-step email OTP verification (`signupInitiateApi` $\rightarrow$ `signupCompleteApi`).
  * Automatically triggers `HostVerificationModal` when a new Host completes registration.
* **`host-verification-modal.tsx`**:
  * Collects Host KYC details (Government ID type/number, S3 document upload via `getPresignedUrl` + `uploadFileToS3`, experience years, address) and submits to `submitHostVerificationApi` (`POST /api/users/verify-host`).
* **`host-status-modal.tsx`**:
  * Displays current host application status (`pending_verification`, `pending_approval`, `rejected`) and allows re-opening the verification modal if needed.

---

## 3. Notifications Store & Dropdown (`src/stores/notification-store.ts`)

* **`useNotificationStore`**:
  * Fetches general notifications (`getNotifications`), booking alerts (`getBookingNotifications`), and follow/friend requests (`getFollowNotifications`).
  * Tracks `unreadCount` and provides `markRead(id)`, `markAllRead()`, and `clearAll()`.
* **`src/components/navigation/notification-dropdown.tsx`**:
  * Integrated into `Navbar` (`src/components/navigation/navbar.tsx`).
  * Supports inline **Accept / Decline** actions for friend requests (`acceptFriendRequestApi`, `rejectFriendRequestApi`) and group schedule invites (`respondToScheduleInvite`), plus deep-linking to booking details.

