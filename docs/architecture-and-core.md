# Core Architecture, Typed API Client & Reusable UI Primitives

Branch: `feat/core-foundation`

---

## 1. Next.js Configuration (`next.config.ts`)
* **API & WebSocket Rewrites**:
  * `/api/:path*` $\rightarrow$ `${BACKEND_ORIGIN}/api/:path*`
  * `/socket.io/:path*` $\rightarrow$ `${BACKEND_ORIGIN}/socket.io/:path*`
* **Image Optimization**: Configured `remotePatterns` to allow AWS S3 (`athithya-app-bucket.s3.eu-north-1.amazonaws.com`), Unsplash, and external avatar providers.

---

## 2. Typed API Layer (`src/lib/api/`)

All HTTP communication is centralized in `src/lib/api/` so UI components never construct raw `fetch` URLs or headers manually.

| File | Responsibility |
| :--- | :--- |
| `client.ts` | Core `apiRequest<T>()` wrapper (attaches `Authorization: Bearer <token>`, credentials, query params, and dispatches `auth:unauthorized` on 401) + `uploadFileToS3()` with local server proxy fallback (`/api/s3-upload`) to bypass browser cross-origin CORS limitations. |
| `endpoints.ts` | Single source of truth for all backend REST route paths (`ENDPOINTS`). |
| `auth-api.ts` | Signup initiate/complete, signin, Google OAuth, forgot/reset password, `/me` session fetch, host verification, and phone OTP endpoints. |
| `users-api.ts` | Public/complete profiles, profile updates, saved posts, host grid media, personal media upload/pin/delete, community posts, friendships, and guest directory. |
| `posts-api.ts` | S3 presigned URLs, CRUD for posts/services/itineraries, reactions, bookmarks, and discovery feeds (`getLatestExperiences`, `getFeaturedExperiences`, `getMostLovedExperiences`, `getTopRatedTreks`, `getNearbyTreks`, `getTopRatedHosts`, `getCategoryActivity`). |
| `bookings-api.ts` | Razorpay order creation & payment signature verification, guest/host bookings, accept/decline/cancel flows, start/completion OTPs, group schedules, guest experience reminders, and host reviews. |
| `chat-and-notifications-api.ts` | Direct & group conversations, messages, S3 attachments, collaborative itinerary pins, notifications, global search, and Nominatim geocoding. |
| `admin-api.ts` | Platform KPIs, user/role/badge management, experience/post approval queue, host KYC review, bookings & journey tracking, chat monitor, and GA4 traffic analytics. |

---

## 3. Shared Helpers & Static Data (`src/lib/` & `src/data/`)

* `src/lib/pricing.ts`: Calculates GST, platform fees, group discount tiers, and per-person vs total amounts.
* `src/lib/duration-helper.ts`: Normalizes duration objects/strings into human-readable labels (`"3 Days / 2 Nights"`, `"4 Hours"`).
* `src/lib/experience-helpers.ts`: Extracts normalized card metadata (`extractExperienceCardMeta`) for `ExperienceCard` across posts, services, treks, and plans.
* `src/lib/image-helper.ts`: Resolves S3/external image URLs and generates fallback initials avatars.
* `src/data/location-data.ts`: Uttarakhand districts, cities, and coordinates.
* `src/data/places.ts`: Curated Uttarakhand destination metadata (`PLACES_DATA`) for `/place/[city]`.
* `src/data/profile-themes.ts`: Banner themes (`PROFILE_THEMES`) for customizable user/host profiles.

---

## 4. Reusable UI & Card Primitives (`src/components/ui/` & `src/components/cards/`)

All reusable components strictly adhere to the $\le 130\text{--}150$ line limit:
* `src/components/ui/button.tsx`: Configurable button with variant, size, and loading state props.
* `src/components/ui/badge.tsx`: Configurable status and category badges.
* `src/components/ui/skeleton.tsx`: Shimmer skeleton loaders for cards and lists.
* `src/components/ui/toast-container.tsx`: Global toast notifications and Athithya branded `showConfirm` modal dialog powered by `useFeedbackStore`.
* `src/components/ui/modal.tsx`: `ConfirmModal`, `SuccessModal`, and `DiscountInfoModal`.
* `src/components/ui/rating-stars.tsx`: Interactive and read-only star rating component.
* `src/components/ui/media-lightbox.tsx`: Fullscreen image/video lightbox viewer.
* `src/components/ui/map-picker.tsx` & `map-viewer.tsx`: Interactive coordinate selector and OpenStreetMap viewer.
* `src/components/cards/experience-card.tsx`: Unified card for experiences, treks, services, and travel plans with bookmarking, discount tags, and owner edit/delete actions.
* `src/components/cards/host-card.tsx`: Verified host card with rating, trip count, and profile navigation.
* `src/components/cards/testimonial-card.tsx`: Traveler review card with rating breakdown.

