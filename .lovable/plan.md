

# Edge Functions: Booking Notification, Review Notification, Recommendation Engine

Create the 3 remaining Supabase Edge Functions and wire them into the frontend services.

---

## 1. Booking Notification Edge Function

**File:** `supabase/functions/booking-notification/index.ts`

- Accepts POST with `{ bookingId, action }` (action: "created" | "confirmed" | "cancelled" | "completed")
- Uses service role key to bypass RLS
- Looks up the booking (with package title) and user profile
- Inserts a notification for the booking user (e.g., "Your booking TEM-2026-1234 for Serengeti Safari has been confirmed")
- Inserts a notification for all admin users (looked up via `user_roles` where role = 'admin')
- Includes CORS headers and JWT validation via `getClaims()`
- Returns `{ success: true }`

**Frontend integration:** After `bookingService.create()` succeeds, invoke the edge function. Also invoke from `bookingService.updateStatus()`.

---

## 2. Review Notification Edge Function

**File:** `supabase/functions/review-notification/index.ts`

- Accepts POST with `{ reviewId, action }` (action: "submitted" | "approved" | "rejected")
- On "submitted": notifies all admins ("New review submitted for [package] - pending moderation")
- On "approved"/"rejected": notifies the review author ("Your review for [package] has been approved/rejected")
- Uses service role key, CORS headers, JWT validation

**Frontend integration:** Call after `reviewService.updateStatus()` in admin. Call after a user submits a review (if/when that UI exists).

---

## 3. Recommendation Engine Edge Function

**File:** `supabase/functions/recommendation-engine/index.ts`

- Accepts POST with `{ userId }` 
- Queries user's past bookings to find their preferred destinations and difficulty levels
- Finds published packages matching those preferences, excluding already-booked ones
- Falls back to featured/top-rated packages if user has no booking history
- Returns `{ recommendations: Package[] }` (up to 6 packages)
- Uses service role key, CORS headers, JWT validation

**Frontend integration:** Called from `CustomerDashboard.tsx` to populate a "Recommended For You" section. Add a new method to `packageService` or a dedicated function call.

---

## 4. Config Updates

**File:** `supabase/config.toml` - Add `verify_jwt = false` entries for all 3 functions (JWT validated in code)

---

## 5. Frontend Wiring

**Modified files:**
- `src/services/bookingService.ts` - Call `booking-notification` after create/updateStatus
- `src/services/reviewService.ts` - Call `review-notification` after updateStatus
- `src/pages/customer/CustomerDashboard.tsx` - Fetch recommendations from edge function and display as a package grid
- `src/components/Navbar.tsx` - Add notification bell icon with unread count badge and dropdown (uses existing `notificationService`)

---

## 6. Notification RLS Fix

The current `notifications` table only allows admin INSERT. The edge functions use the service role key, so they bypass RLS -- no migration needed.

---

## Technical Notes

- All 3 functions use `createClient` with `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (already in secrets) for privileged DB access
- All 3 validate the caller's JWT via `getClaims()` before processing
- Frontend calls use `supabase.functions.invoke('function-name', { body: {...} })`
- Each function includes proper CORS preflight handling

