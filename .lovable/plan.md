

# African Tembo Safari — Frontend MVP Plan

## Design System & Branding
- Color tokens: **Safari Brown** `#7A4A2B` (primary), **Warm Cream** `#F7F3EE` (background), **Deep Black** `#111111` (text/foreground)
- Your Tembo Safari logo integrated throughout
- Warm, premium safari aesthetic with elegant typography
- Fully responsive (mobile-first)

---

## Public Website (Customer-Facing)

### 1. Homepage
- Hero section with large safari imagery and a compelling tagline
- Smart search bar (destination, dates, travelers)
- Featured packages carousel
- "Why Choose Us" highlights section
- Testimonials section
- Call-to-action for booking
- Footer with links, contact info, social media

### 2. Package Listing Page
- Grid/list view of safari packages with filters (destination, duration, difficulty, price range)
- Sort options (price, popularity, duration)
- Package cards showing image, title, price, duration, and difficulty badge

### 3. Package Detail Page
- Image gallery
- Full description, itinerary (day-by-day), highlights
- Includes/excludes list
- Pricing table (per person, group discounts)
- "Book Now" call-to-action
- Related packages

### 4. 3-Step Booking Flow
- **Step 1:** Select dates, travelers, room preferences
- **Step 2:** Traveler details form (names, contacts, dietary/special needs)
- **Step 3:** Review & confirm (summary + payment placeholder)
- Confirmation page with booking reference

### 5. Supporting Pages
- **About / Team** — Company story, team members, mission
- **Destination Guides** — Safari destination info pages
- **Contact** — Contact form + map + office details
- **FAQ** — Accordion-style frequently asked questions
- **Terms & Privacy** — Legal pages

### 6. Navigation
- Sticky top navigation bar with logo, main links, and "Book Now" button
- Mobile hamburger menu

---

## Admin Dashboard

### 7. Admin Login
- Dedicated `/admin` login page with email/password form
- Mock authentication (easily replaceable with your auth microservice)

### 8. Dashboard Overview
- Key metrics cards: total bookings, revenue, active packages, new inquiries
- Recent bookings table
- Quick charts (bookings over time, revenue trends)

### 9. Package Management
- Table listing all packages with status badges (draft/published/archived)
- Create/edit package form (title, description, itinerary builder, pricing, images)
- Publish/archive actions

### 10. Booking Management
- Searchable/filterable bookings table
- Booking detail view (traveler info, package, dates, payment status)
- Status updates (pending → confirmed → completed)

### 11. User Management
- User listing table with role badges
- View user details and their booking history

### 12. Payment Tracking
- Payments table with status (paid, pending, refunded)
- Revenue summary cards

---

## Architecture (Frontend-Ready for Microservices)

All data will come through a **centralized API service layer** with mock data. Each "service" (packages, bookings, users, payments) will have its own module, mapping directly to your microservice endpoints. When you export to GitHub, you simply swap the mock implementations for real API calls to your Kong Gateway.

- `services/packageService.ts` → maps to your Package Service
- `services/bookingService.ts` → maps to your Booking Service
- `services/userService.ts` → maps to your User Service
- `services/paymentService.ts` → maps to your Payment Service
- `services/authService.ts` → maps to your User/Auth Service

This gives you a production-ready frontend that plugs directly into your microservice architecture.

