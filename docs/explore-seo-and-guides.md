# Home Discovery, Dedicated SEO Pages, Places & Travel Guides

Branches: `feat/explore-and-home`, `feat/seo-dedicated-pages`

---

## 1. Home Page Discovery (`src/stores/explore-store.ts` & `src/components/home/`)

* `useExploreStore.fetchHomeData()` loads the Home page carousels in parallel via `Promise.allSettled`:
  * **Explore Experiences** (`getLatestExperiences`)
  * **Featured Experiences** (`getFeaturedExperiences`)
  * **Most Loved Experiences** (`getMostLovedExperiences`)
  * **Top Rated Experiences** (`getTopRatedTreks`)
  * **Nearby Experiences** (`getNearbyTreks`)
  * **Top Rated Local Hosts** (`getTopRatedHosts`)
  * **Activity Category Badges** (`getCategoryActivity` — highlights categories with newly approved experiences in the last 24h)
  * **Traveler Reviews** (`getLatestReviews`)

---

## 2. Dedicated SEO Collection Pages (Single-API per Route)

To follow strict SEO best practices, `ExplorePageView` (`src/components/explore/explore-page-view.tsx`) contains **zero API imports** and **zero conditional API branching**. Instead, each "View All" route is a separate Next.js Server Component page with static `Metadata` (`title`, `description`, `alternates.canonical`, `openGraph`) that renders its own dedicated view in `src/components/explore/section-views.tsx`:

| Route Path | Page File | Client View | Single Backend API Called |
| :--- | :--- | :--- | :--- |
| `/explore-experience` | `src/app/(marketing)/explore-experience/page.tsx` | `LatestExperiencesView` | `GET /api/posts/experiences/latest?sort=latest` |
| `/featured-experience` | `src/app/(marketing)/featured-experience/page.tsx` | `FeaturedExperiencesView` | `GET /api/posts/experiences/featured?sort=clicks` |
| `/most-loved-experience` | `src/app/(marketing)/most-loved-experience/page.tsx` | `MostLovedExperiencesView` | `GET /api/posts/experiences/most-reacted?sort=bookings` |
| `/top-rated-experience` | `src/app/(marketing)/top-rated-experience/page.tsx` | `TopRatedExperiencesView` | `GET /api/posts?sort=rating` |
| `/nearby-experience` | `src/app/(marketing)/nearby-experience/page.tsx` | `NearbyExperiencesView` | `GET /api/posts/treks/nearby` |
| `/top-rated-host` | `src/app/(marketing)/top-rated-host/page.tsx` | `TopRatedHostsView` | `GET /api/posts/hosts/top-rated` |

---

## 3. Dedicated Activity Category Pages

Every activity category has its own separate Next.js route page with static SEO metadata and canonical URL, calling `listServices({ category, limit: 100, page: 1 })`:
* `/bungee-jumping` (`src/app/(marketing)/bungee-jumping/page.tsx`)
* `/paragliding` (`src/app/(marketing)/paragliding/page.tsx`)
* `/trek` (`src/app/(marketing)/trek/page.tsx`)
* `/camping` (`src/app/(marketing)/camping/page.tsx`)
* `/rafting` (`src/app/(marketing)/rafting/page.tsx`)
* `/safari` (`src/app/(marketing)/safari/page.tsx`)
* `/other` (`src/app/(marketing)/other/page.tsx`)
* `/categories` (`src/app/categories/page.tsx` — directory of all activities with live 24h "New" indicators)

---

## 4. Single Place Page & Uttarakhand Travel Guides

* **Single Destination Page (`src/app/place/[city]/page.tsx`)**:
  * Combines curated destination info (`PLACES_DATA`) with live experiences and itineraries from `getCombinedLocationData({ city })`.
* **Uttarakhand Travel Guides (`src/components/guides/guide-layout.tsx` & `src/app/guides/*`)**:
  * `/guides/best-season-to-visit-uttarakhand`
  * `/guides/top-7-himalayan-treks`
  * `/guides/best-treks-uttarakhand`
  * `/guides/uttarakhand-itineraries`
  * `/guides/uttarakhand-travel-cost`
  * `/guides/uttarakhand-packing-list`
  * `/guides/uttarakhand-travel-tips`

