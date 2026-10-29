# Athithya Frontend Documentation (Next.js App Router)

Welcome to the comprehensive frontend documentation for **Athithya Frontend** (`athithya-frontend`). This repository rebuilds the Athithya Uttarakhand travel experience platform using **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **Zustand**, integrating 100% of the REST and real-time endpoints provided by `athithya-backend`.

---

## Environments & Proxy Configuration
* **Local Frontend Server**: `http://localhost:3000`
* **Local Backend Proxy Target**: `http://127.0.0.1:5000` (configured via `/api/:path*` and `/socket.io/:path*` rewrites in `next.config.ts`)
* **Production Backend API**: `https://api.athithya.in` (configurable via `NEXT_PUBLIC_API_URL`)

---

## Core Engineering Principles Followed
1. **DRY (Don't Repeat Yourself)**: Shared UI primitives (`Button`, `Badge`, `Skeleton`, `ConfirmModal`, `ExperienceCard`, `HostCard`, `TestimonialCard`) and centralized API helpers eliminate duplication.
2. **Separation of Concerns & SRP**:
   * **API Layer (`src/lib/api/`)**: Pure HTTP & S3 upload functions with zero UI logic.
   * **State Layer (`src/stores/`)**: Zustand stores (`auth-store`, `explore-store`, `notification-store`, `chat-store`, `feedback-store`) prevent prop drilling.
   * **Presentation Layer (`src/components/`)**: Modular, single-responsibility components (reusable components $\le 145$ lines; larger feature views $\le 300$ lines).
3. **SEO-First Dedicated Routes**: Every discovery collection (`/explore-experience`, `/featured-experience`, `/most-loved-experience`, `/top-rated-experience`, `/nearby-experience`, `/top-rated-host`) and every activity category (`/bungee-jumping`, `/paragliding`, `/trek`, `/camping`, `/rafting`, `/safari`, `/other`) has its own separate Next.js route page with static `Metadata`, canonical URLs, and single-endpoint data fetching.

---

## Documentation Directory

| Module | Feature Branch | Documentation File |
| :--- | :--- | :--- |
| **Core Architecture, API Layer & UI Primitives** | `feat/core-foundation` | [architecture-and-core.md](./architecture-and-core.md) |
| **Authentication, Host Verification & Notifications** | `auth` | [auth-and-notifications.md](./auth-and-notifications.md) |
| **Home Discovery, Dedicated SEO Pages, Places & Guides** | `feat/explore-and-home`, `feat/seo-dedicated-pages` | [explore-seo-and-guides.md](./explore-seo-and-guides.md) |
| **Posts, S3 Creation Forms, Bookings & Razorpay** | `feat/posts-and-bookings` | [posts-and-bookings.md](./posts-and-bookings.md) |
| **User/Host Profiles, Media Grid, Stories & Connect** | `feat/profile-and-social` | [profile-and-social.md](./profile-and-social.md) |
| **Real-time Direct & Group Chat & Trip Pins** | `feat/chat` | [chat.md](./chat.md) |
| **Admin Console, KYC Approvals & GA4 Analytics** | `feat/admin` | [admin-and-analytics.md](./admin-and-analytics.md) |

