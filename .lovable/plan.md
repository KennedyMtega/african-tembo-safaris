

# Phase 2: Public Pages + Booking Flow + Admin Dashboard

Building all remaining pages from the approved plan. This is a large phase covering the public website pages, the 3-step booking flow, and the full admin dashboard.

---

## Part A: Public Website Pages

### 1. Package Listing Page (`/packages`)
- Grid of safari package cards with filters (destination, duration, difficulty, price range)
- Sort by price, popularity, or duration
- Responsive grid layout with the existing card design from HomePage

### 2. Package Detail Page (`/packages/:slug`)
- Image gallery with thumbnails
- Full description, day-by-day itinerary with accordion
- Highlights, includes/excludes lists
- Pricing table (per person + group discount)
- "Book Now" button linking to booking flow
- Related packages section

### 3. Booking Flow (`/book/:slug`) - 3 Steps
- **Step 1 - Select:** Pick dates (date picker), number of travelers, room preferences
- **Step 2 - Details:** Traveler information form (name, email, phone, dietary/special needs) for each traveler
- **Step 3 - Review:** Summary of selections, total price, confirm button
- **Confirmation page** with booking reference number

### 4. Supporting Pages
- **About** (`/about`) - Company story, team members grid, mission statement
- **Contact** (`/contact`) - Contact form (name, email, subject, message) + office details
- **Destinations** (`/destinations`) - Destination cards with descriptions and package counts
- **FAQ** (`/faq`) - Accordion-style Q&A
- **Terms** (`/terms`) and **Privacy** (`/privacy`) - Legal text pages

---

## Part B: Admin Dashboard

### 5. Admin Layout & Auth
- Admin login page (`/admin`) with email/password form using mock auth
- Sidebar layout component (`AdminLayout`) with navigation
- Auth context to protect admin routes

### 6. Dashboard Overview (`/admin/dashboard`)
- Metric cards: total bookings, revenue, active packages, new inquiries
- Recent bookings table (last 5)
- Simple charts using Recharts (bookings over time, revenue trend)

### 7. Package Management (`/admin/packages`)
- Table listing all packages with status badges (draft/published/archived)
- Create/edit package form in a dialog or dedicated page (title, description, itinerary builder, pricing, images)
- Publish/archive toggle actions

### 8. Booking Management (`/admin/bookings`)
- Searchable, filterable bookings table
- Booking detail view (traveler info, package, dates, payment status)
- Status update dropdown (pending, confirmed, completed, cancelled)

### 9. User Management (`/admin/users`)
- User table with role badges (admin/customer)
- View user details and their booking history

### 10. Payment Tracking (`/admin/payments`)
- Payments table with status badges (paid, pending, refunded)
- Revenue summary cards at the top

---

## Technical Details

### New Files to Create

**Public Pages:**
- `src/pages/PackagesPage.tsx`
- `src/pages/PackageDetailPage.tsx`
- `src/pages/BookingPage.tsx` (multi-step form)
- `src/pages/BookingConfirmation.tsx`
- `src/pages/AboutPage.tsx`
- `src/pages/ContactPage.tsx`
- `src/pages/DestinationsPage.tsx`
- `src/pages/FaqPage.tsx`
- `src/pages/TermsPage.tsx`
- `src/pages/PrivacyPage.tsx`

**Admin:**
- `src/pages/admin/AdminLogin.tsx`
- `src/pages/admin/AdminDashboard.tsx`
- `src/pages/admin/AdminPackages.tsx`
- `src/pages/admin/AdminBookings.tsx`
- `src/pages/admin/AdminUsers.tsx`
- `src/pages/admin/AdminPayments.tsx`
- `src/components/AdminLayout.tsx`
- `src/components/AdminSidebar.tsx`
- `src/contexts/AuthContext.tsx`

**Shared Components:**
- `src/components/PackageCard.tsx` (reusable card extracted from HomePage)
- `src/components/PackageFilters.tsx`
- `src/components/BookingSteps.tsx` (step indicator)

### Files to Modify
- `src/App.tsx` - Add all new routes (public + admin with protected wrapper)
- `src/components/Navbar.tsx` - Ensure all nav links point to real routes
- `src/services/authService.ts` - Add mock login/logout/session methods

### Patterns & Conventions
- All pages use the existing color tokens (Safari Brown, Warm Cream, Deep Black)
- Framer Motion `fadeUp` animation pattern from HomePage reused across pages
- Service layer pattern maintained -- all data flows through `src/services/`
- Shadcn UI components (Card, Button, Badge, Accordion, Table, Tabs, Dialog) used consistently
- Date picker uses Shadcn Calendar with `pointer-events-auto` class
- Recharts for admin dashboard charts (already installed)
- Mobile-first responsive design throughout

