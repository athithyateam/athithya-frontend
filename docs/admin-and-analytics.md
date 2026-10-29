# Admin Console, KYC Approvals & Google Analytics Dashboard

Branch: `feat/admin`

---

## 1. Admin Console Layout (`src/app/(panels)/admin/page.tsx`)

* Protected by role-based access control (`user.role === "admin"`).
* Collapsible sidebar navigation with live pending approval badge count (`pendingExperiences.length + pendingVerifications.length`).
* Organizes administrative operations into 10 dedicated views powered by 5 modular tab components (`src/components/admin/`).

---

## 2. Admin Modules (`src/components/admin/`)

### 2.1 Overview & KPI Dashboard (`admin-overview-tab.tsx`)
* Fetches platform totals via `getAdminStatsApi` (`GET /api/admin/stats`): Total Users, Hosts vs Guests, Published Experiences, Total Bookings, Revenue, and Pending Approvals.
* Fetches Google Analytics 4 (GA4) summary via `getAdminTrafficAnalyticsApi` (`GET /api/analytics`): Active Users, Page Views, and Sessions.

### 2.2 Approvals & Host KYC Queue (`admin-approvals-tab.tsx`)
* **Pending Posts Sub-tab**:
  * Lists unapproved experiences and pending update requests (`getAdminPendingExperiencesApi` — `GET /api/admin/experiences/pending`).
  * Features **Review Experience** modal (`ReviewExperienceModal`) showing full multi-photo/video media galleries, price/duration breakdown, route endpoints, and description.
  * Direct **Approve** and **Reject** actions synced with backend post lifecycle (`updateAdminExperienceStatusApi` — `PATCH /api/admin/experiences/:id/status` mapping approved $\rightarrow$ `'active'` and rejected $\rightarrow$ `'inactive'` with administrator remarks).
* **Host KYC Sub-tab**:
  * Lists pending host identity applications and profile change requests (`getAdminPendingVerificationsApi` — `GET /api/admin/verifications/pending`).
  * Features **Review Application / Updates** modal (`ReviewVerificationModal`) inspecting government ID cards, selfie/photo proof, address verification, and criminal record declarations.
  * One-click **Approve Host** / **Reject** decisions (`updateAdminVerificationStatusApi` — `PATCH /api/admin/verifications/:userId`).

### 2.3 User Management & Host History (`admin-users-hosts-tab.tsx`)
* **User Management (`mode="users"`)**:
  * Searchable, role-filterable table of all users (`getAdminUsersApi` — `GET /api/admin/users`).
  * **Edit User Modal (`EditUserModal`)**: In-place editor for full name, email, phone, role (`guest`/`host`/`admin`), host verification status (`pending_verification`, `pending_approval`, `approved`, `rejected`), experience years, bio, address, city, district, and pincode (`updateAdminUserApi` — `PATCH /api/admin/users/:id`).
  * Inline role switching (`updateAdminUserRoleApi`) and Verified badge toggle (`verifyBadge.enabled`).
  * User deletion with themed confirmation dialog (`deleteAdminUserApi`) and **Export CSV** download.
* **Host History (`mode="hosts"`)**:
  * Audit log of host onboarding, profile updates, and deleted experiences (`getAdminHostHistoryApi` — `GET /api/admin/host-history`).

### 2.4 Experiences, Bookings & Live Journeys (`admin-experiences-bookings-tab.tsx`)
* **Experiences Catalog (`mode="experiences"`)**:
  * Searchable catalog of all platform experiences (`getAdminExperiencesApi`).
  * **Edit Experience Modal (`EditExperienceModal`)**: In-place editing of title, categories (multi-badge selector), price (`perPerson`, `amount`, `total`), period (`hour`/`day`/`minute`), status (`active`/`inactive`/`pending`/`archived`), home featured flag (`isFeatured`), route starting & ending points, city, address, and descriptions (`updateAdminExperienceApi` — `PATCH /api/admin/experiences/:id`).
  * One-click **Feature / Unfeature** toggle and themed deletion confirmation dialog (`deleteAdminExperienceApi`).
* **Bookings Management (`mode="bookings"`) & Journey Tracking (`mode="journeys"`)**:
  * Lists reservations (`getAdminBookingsApi` — `GET /api/admin/bookings`), inline status transitions (`pending`, `confirmed`, `in_progress`, `completed`, `cancelled` via `updateAdminBookingApi`), and deletion (`deleteAdminBookingApi`).
  * Live Journeys tracking sub-tabs: Active, Upcoming, Completed, and All.

### 2.5 Branded Modal System
* All native browser `confirm()` and `alert()` calls have been eliminated and replaced with the global Athithya `showConfirm` dialog in `useFeedbackStore`, featuring the warning badge, bold titles, and theme-adaptive buttons matching `athithya-app`.

### 2.5 Chat Activity, Traffic & System Health (`admin-system-tab.tsx`)
* **Chat Activity Monitor (`mode="chat"`)**: Monitors active direct and group conversations (`getAdminChatActivityApi` — `GET /api/admin/chat-activity`).
* **Traffic & GA4 (`mode="traffic"`)**: Displays GA4 page views, active visitors, and session metrics (`getAdminTrafficAnalyticsApi`).
* **System Health (`mode="health"`)**: Displays operational diagnostics for MongoDB Atlas, AWS S3, Razorpay Webhooks, and Socket.IO.

