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
* **Pending Posts Sub-tab**: Lists unapproved experiences (`getAdminPendingExperiencesApi` — `GET /api/admin/experiences/pending`) with Preview links and **Approve / Reject** actions (`updateAdminExperienceStatusApi` — `PATCH /api/admin/posts/:id/status`).
* **Host KYC Sub-tab**: Lists pending host identity verifications (`getAdminPendingVerificationsApi` — `GET /api/admin/verifications/pending`) with **Approve Host / Reject** actions (`updateAdminVerificationStatusApi` — `PATCH /api/admin/verifications/:userId`).

### 2.3 User Management & Host History (`admin-users-hosts-tab.tsx`)
* **User Management (`mode="users"`)**:
  * Searchable, role-filterable table of all users (`getAdminUsersApi` — `GET /api/admin/users`).
  * Inline role switching (`guest` / `host` / `admin` via `updateAdminUserRoleApi`).
  * Verified badge toggle (`verifyBadge.enabled` via `updateAdminUserApi`).
  * User deletion (`deleteAdminUserApi`) and **Export CSV** download.
* **Host History (`mode="hosts"`)**:
  * Audit log of host onboarding and verification history (`getAdminHostHistoryApi` — `GET /api/admin/host-history`).

### 2.4 Experiences, Bookings & Live Journeys (`admin-experiences-bookings-tab.tsx`)
* **Experiences Catalog (`mode="experiences"`)**:
  * Searchable list of all experiences (`getAdminExperiencesApi`), one-click **Feature / Unfeature** toggle (`updateAdminExperienceApi`), preview link, and deletion (`deleteAdminExperienceApi`).
* **Bookings Management (`mode="bookings"`) & Journey Tracking (`mode="journeys"`)**:
  * Lists reservations (`getAdminBookingsApi` — `GET /api/admin/bookings`), inline status updates (`pending`, `confirmed`, `in_progress`, `completed`, `cancelled` via `updateAdminBookingApi`), and deletion (`deleteAdminBookingApi`).

### 2.5 Chat Activity, Traffic & System Health (`admin-system-tab.tsx`)
* **Chat Activity Monitor (`mode="chat"`)**: Monitors active direct and group conversations (`getAdminChatActivityApi` — `GET /api/admin/chat-activity`).
* **Traffic & GA4 (`mode="traffic"`)**: Displays GA4 page views, active visitors, and session metrics (`getAdminTrafficAnalyticsApi`).
* **System Health (`mode="health"`)**: Displays operational diagnostics for MongoDB Atlas, AWS S3, Razorpay Webhooks, and Socket.IO.

