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
  * **Interactive Map Picker (`map-picker.tsx`)**: Leaflet map integrated with Uttarakhand official boundary GeoJSON (`uttarakhand-boundary.json`), forward Nominatim location search, click-to-pin coordinate positioning with boundary validation, and automatic reverse geocoding to address.
  * **Route Details with Suggestions**: Starting Point and Ending Point inputs with dropdown suggestions covering all major Uttarakhand hubs (*Dehradun, Haridwar, Rishikesh, Haldwani, Nainital, Mussoorie, Almora, Pithoragarh, Uttarkashi, Srinagar, Joshimath, Chopta, Kedarnath, Badrinath, Roorkee, Rudrapur*).
  * **Dual-Tier Group Discounting**: Step 2 features dual tiers (`Group of 2` and `Group of 3`) matching `athithya-app`, with synchronized dual-direction inputs (Discounted Price ₹ and Percentage %), live savings tags, and real-time validation.
  * **Host Rules**: Custom policy input (`PolicyAdder` style) where hosts manually add rules and delete them, with preset suggestion pills removed.
  * **S3 Upload Proxy Architecture**: Uploads photos and videos via `uploadFileToS3`, using a transparent local Next.js server proxy (`/api/s3-upload`) to bypass browser cross-origin preflight restrictions on localhost and avoid console CORS errors.
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

