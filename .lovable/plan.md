

# Full Backend Integration: Supabase Database, Auth, and Real-Time Data

This plan removes all mock/dummy data and connects the entire application to Supabase, adds real user authentication, a customer dashboard, price-range display, full-page CRUD UIs in admin, and notification edge functions.

---

## Phase 1: Database Schema (Supabase Migration)

Create all tables with RLS policies and helper functions.

### Enums
- `app_role` (admin, user)
- `package_status` (draft, published, archived)
- `booking_status` (pending, confirmed, completed, cancelled)
- `payment_status` (pending, paid, refunded)
- `inquiry_status` (new, in_progress, resolved)
- `inquiry_priority` (low, medium, high)
- `review_status` (pending, approved, rejected)
- `difficulty_level` (easy, moderate, challenging)

### Tables

**`profiles`** - linked to `auth.users(id)` ON DELETE CASCADE
- id (uuid, PK, references auth.users), full_name, email, phone, avatar_url, created_at

**`user_roles`** - separate role table (security best practice)
- id, user_id (references auth.users), role (app_role enum)
- `has_role()` security definer function for RLS

**`destinations`**
- id, name, country, description, image_url, created_at, updated_at

**`packages`**
- id, title, slug (unique), description, short_description, destination_id (FK to destinations), duration, difficulty, price_min, price_max, group_price_min, group_price_max, max_group_size, images (text[]), highlights (text[]), tags (text[]), includes (text[]), excludes (text[]), status, rating, review_count, featured, created_at, updated_at

**`package_itinerary`**
- id, package_id (FK), day_number, title, description, meals (text[]), accommodation, created_at

**`bookings`**
- id, booking_ref (unique), package_id (FK), user_id (FK to auth.users), status, start_date, end_date, total_amount, payment_status, special_requests, created_at

**`booking_travelers`**
- id, booking_id (FK), first_name, last_name, email, phone, dietary_needs, special_needs

**`payments`**
- id, booking_id (FK), booking_ref, amount, currency, status, method, paid_at, created_at

**`reviews`**
- id, package_id (FK), user_id (FK), rating, title, text, status, featured, created_at

**`inquiries`**
- id, user_id (nullable FK), name, email, subject, message, status, priority, created_at, resolved_at

**`activity_log`**
- id, action, description, user_id (FK), entity_id, created_at

**`wishlists`** (customer engagement)
- id, user_id (FK), package_id (FK), created_at

**`notifications`**
- id, user_id (FK), title, message, read, type, entity_id, created_at

### Storage
- Create `package-images` public bucket for package/destination image uploads

### RLS Policies
- Packages/destinations/itinerary: public SELECT for published; admin full CRUD
- Bookings/travelers/payments: users see own; admin sees all
- Reviews: public SELECT for approved; users can INSERT own; admin can UPDATE status
- Profiles: users read/update own; admin reads all
- Wishlists/notifications: users manage own only
- Inquiries: authenticated users can INSERT; admin full access
- Activity log: admin only

### Triggers
- Auto-create profile on auth.users insert
- Auto-create user_roles entry with 'user' role on signup
- Update `destinations.package_count` when packages change
- Update `packages.review_count` and `packages.rating` when reviews change

---

## Phase 2: Authentication (Supabase Auth)

### Replace mock auth with real Supabase Auth

**`src/contexts/AuthContext.tsx`** - Complete rewrite
- Use `supabase.auth.onAuthStateChange` + `getSession`
- Fetch profile from `profiles` table
- Check admin role via `user_roles` table using `has_role()` RPC
- Expose: user, profile, isAdmin, isLoading, signUp, signIn, signOut, resetPassword

**New pages:**
- `src/pages/auth/LoginPage.tsx` - Email/password login with "Forgot password?" link
- `src/pages/auth/SignupPage.tsx` - Email/password signup (full_name, email, password)
- `src/pages/auth/ResetPasswordPage.tsx` - Password reset form (at `/reset-password`)
- `src/pages/auth/ForgotPasswordPage.tsx` - Request password reset email

**Booking flow auth gate:**
- Users can browse packages freely
- When clicking "Book Now" or reaching Step 3 of booking, if not logged in, show a login/signup modal
- After authentication, continue booking seamlessly

**Admin login (`/admin`):**
- Use same Supabase auth but check `has_role(uid, 'admin')` server-side
- AdminLayout checks role from AuthContext

---

## Phase 3: Service Layer Rewrite (Mock -> Supabase)

All services in `src/services/` rewritten to use `supabase` client:

- **packageService.ts** - CRUD via `supabase.from('packages')`, joins with destinations and itinerary
- **bookingService.ts** - Insert bookings + travelers, status updates
- **userService.ts** - Query profiles + roles
- **paymentService.ts** - Query/insert payments
- **reviewService.ts** - CRUD reviews with status moderation
- **inquiryService.ts** - CRUD inquiries
- **analyticsService.ts** - Aggregate queries for dashboard KPIs (real data from bookings/payments/packages tables)
- **reportService.ts** - Generate reports from real data
- **destinationService.ts** (new) - CRUD destinations
- **notificationService.ts** (new) - CRUD notifications
- **wishlistService.ts** (new) - Add/remove/list wishlists

React Query hooks in each service for caching and real-time updates.

---

## Phase 4: Price Range Display

### Schema change
- Packages now have `price_min` and `price_max` instead of single `price`
- Same for group pricing: `group_price_min` and `group_price_max`

### UI changes across all pages
- **PackageCard**: Display as `$X,XXX - $X,XXX` instead of single price
- **PackageDetailPage**: Pricing sidebar shows range with "From $X,XXX to $X,XXX per person"
- **BookingPage**: Calculate total based on selected options within range
- **Admin package form**: Two price fields (min/max) for both standard and group pricing
- **Filters**: Price range slider filter on PackagesPage

---

## Phase 5: Admin Package Creation - Full Page UI

### Replace dialog with dedicated full-page form

**`src/pages/admin/AdminPackageForm.tsx`** (new) - Multi-section form page
- **Basic Info section**: Title (auto-generates slug), short description, full description
- **Destination & Details**: Destination dropdown (from DB), duration, difficulty selector, max group size
- **Pricing section**: Price min/max fields, group price min/max, displayed as visual range preview
- **Images section**: Upload images via Supabase Storage with drag-and-drop area, preview thumbnails, reorder capability
- **Tags & Highlights section**: Tag input with chips (add/remove), highlights list builder
- **Includes/Excludes section**: Two-column list builder with add/remove items
- **Itinerary Builder section**: Add days with title, description, meals checkboxes, accommodation field; drag to reorder
- **Settings section**: Status (draft/published/archived), featured toggle
- **Action bar**: Save as Draft, Publish, Preview buttons (sticky at bottom)

Routes: `/admin/packages/new` and `/admin/packages/:id/edit`

---

## Phase 6: Customer Dashboard

### New route: `/dashboard` (protected, requires auth)

**`src/pages/customer/CustomerDashboard.tsx`**
- Welcome banner with user name and avatar
- Quick stats: total trips, upcoming trips, total spent

**`src/pages/customer/CustomerBookings.tsx`**
- List of all user bookings with status badges
- View booking details (travelers, dates, payment status)
- Cancel booking action (if status is pending)

**`src/pages/customer/CustomerWishlist.tsx`**
- Saved/wishlisted packages grid
- Remove from wishlist, "Book Now" action

**`src/pages/customer/CustomerProfile.tsx`**
- Edit profile (name, phone, avatar upload)
- Change password
- Notification preferences

**`src/components/CustomerLayout.tsx`** - Layout with sidebar navigation for customer area

### Engagement features
- "Add to Wishlist" heart icon on all package cards
- "Recommended for You" section on customer dashboard (based on past bookings destination/difficulty)
- "Recently Viewed" packages tracked in local storage
- Booking calendar view showing upcoming trips

---

## Phase 7: Edge Functions for Notifications

### `supabase/functions/booking-notification/index.ts`
- Triggered when a booking is created/updated
- Sends notification to user (stored in notifications table)
- Sends notification to admin

### `supabase/functions/review-notification/index.ts`
- When a review is submitted, notify admin for moderation
- When review is approved, notify the user

### `supabase/functions/recommendation-engine/index.ts`
- Takes user_id, returns recommended package IDs
- Based on: past booking destinations, difficulty level, similar users' bookings
- Called from customer dashboard

### Notification bell in Navbar
- Show unread count badge
- Dropdown with recent notifications
- Mark as read functionality

---

## Phase 8: Admin Dashboard Sync with Real Data

### AdminDashboard.tsx
- All KPI cards computed from real Supabase aggregates (SUM, COUNT, AVG on bookings/payments)
- Charts pull from real booking/payment data grouped by month
- Activity feed from activity_log table
- Destination stats computed from actual booking counts

### All admin management pages
- Remove all mock data imports
- Use React Query hooks to fetch from Supabase
- Real-time updates where applicable (bookings, inquiries)

---

## Phase 9: Cleanup

- Delete `src/data/mockData.ts` and `src/data/mockAdminData.ts`
- Remove all `import { mock... }` references
- Update `src/App.tsx` with new auth routes, customer dashboard routes, package form route
- Update Navbar with auth state (show Login/Signup or User menu with Dashboard link)

---

## Files Summary

### New Files (~20)
- `src/pages/auth/LoginPage.tsx`, `SignupPage.tsx`, `ResetPasswordPage.tsx`, `ForgotPasswordPage.tsx`
- `src/pages/customer/CustomerDashboard.tsx`, `CustomerBookings.tsx`, `CustomerWishlist.tsx`, `CustomerProfile.tsx`
- `src/components/CustomerLayout.tsx`
- `src/pages/admin/AdminPackageForm.tsx`
- `src/services/destinationService.ts`, `notificationService.ts`, `wishlistService.ts`
- `supabase/functions/booking-notification/index.ts`
- `supabase/functions/review-notification/index.ts`
- `supabase/functions/recommendation-engine/index.ts`

### Major Rewrites (~15)
- `src/contexts/AuthContext.tsx` - Supabase auth
- All 7 service files - mock to Supabase
- `src/pages/HomePage.tsx`, `PackagesPage.tsx`, `PackageDetailPage.tsx`, `BookingPage.tsx` - remove mock imports, use services + price ranges
- `src/components/PackageCard.tsx` - price range display
- `src/components/Navbar.tsx` - auth-aware nav
- All admin pages - remove mock data, use real queries

### Delete
- `src/data/mockData.ts`
- `src/data/mockAdminData.ts`

### Database
- 1 large migration with all tables, enums, RLS policies, triggers, functions
- 1 storage bucket creation

