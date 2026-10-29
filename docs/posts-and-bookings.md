# Posts, S3 Creation Forms, Bookings & Razorpay Checkout

Branch: `feat/posts-and-bookings`

---

## 1. Post Detail View (`src/app/post/[id]/page.tsx` & `src/components/post/`)

Supports Experience posts, Host Services (`?type=service`), and Traveler Plans/Itineraries (`?type=plan`).
* **`post-hero-gallery.tsx`**: Multi-image/video grid with fullscreen `MediaLightbox`, share button, bookmark toggle (`savePostApi` / `saveItineraryApi`), emoji reaction bar (`reactToPost` / `reactToItinerary`), and owner edit/delete controls.
* **`booking-widget.tsx`**:
  * Date picker, guest count selector, and automatic group discount tier calculation (`calculatePricingBreakdown`).
  * Optional wallet credit application.
  * Creates a booking order via `createBooking` (`POST /api/bookings`), opens the **Razorpay Checkout SDK**, and verifies payment signature via `verifyPayment` (`POST /api/bookings/verify-payment`).
* **`post-invite-schedule.tsx`**:
  * Allows guests to schedule future experience reminders (`scheduleExperienceApi`, `checkGuestScheduleApi`, `deleteGuestScheduleApi`).
  * Allows inviting connected friends to a group booking schedule (`createSchedule`, `inviteFriendDirectly`, `removeScheduleFriend`, `getScheduleStatus`).
* **`host-reviews-section.tsx`**:
  * Displays verified traveler reviews (`getHostReviewsApi`), checks review eligibility (`checkReviewEligibilityApi`), and submits multi-criteria ratings (`submitReview`).
* **`post-modals.tsx`**:
  * Modals for requesting post hide/deletion (`requestHideService`) and viewing full itinerary day-by-day breakdowns.

---

## 2. Post Creation & Editing (`src/app/post/page.tsx` & `src/components/forms/`)

* **`form-primitives.tsx`**: Reusable form inputs, tag selectors, S3 media dropzones, and discount tier builders.
* **`host-service-form.tsx`**:
  * Used by verified Hosts to create or edit Experiences and Services (`createService`, `updateService`, `createPost`, `updatePost`).
  * Uploads photos and videos directly to AWS S3 using `getPresignedUrl` (`GET /api/posts/presigned-url`) + `uploadFileToS3`.
* **`traveller-plan-form.tsx`**:
  * Used by Guests/Travelers to publish or edit public/collaborative Travel Plans (`createItinerary`, `updateItinerary`).

---

## 3. Booking Detail & OTP Verification (`src/app/bookings/[bookingId]/page.tsx`)

* Fetches full reservation details via `getBookingDetails(bookingId)`.
* **Host Controls**:
  * Accept (`acceptBooking`) or Decline (`declineBooking`) pending booking requests.
  * Approve guest cancellation requests (`approveCancellation`).
  * Trigger & verify **Trip Start OTP** (`sendStartOTP`, `verifyStartOTP`) and **Trip Completion OTP** (`sendCompletionOTP`, `verifyCompletionOTP`).
* **Guest Controls**:
  * View booking status, payment breakdown, and OTP codes; request cancellation (`requestCancellation`); or accept/reject orphaned group invites (`acceptOrphanedInvite`, `rejectOrphanedInvite`).

