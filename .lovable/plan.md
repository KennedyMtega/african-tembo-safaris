

# Enterprise Admin Dashboard Overhaul

Transforming the current basic admin panel into a comprehensive, enterprise-grade dashboard with rich analytics, advanced management features, and business-critical tools for a safari tour operator.

---

## What Changes

### 1. Enhanced Dashboard Overview (AdminDashboard.tsx - complete rewrite)

**Metrics Row (8 KPI cards in 2 rows of 4):**
- Total Revenue (with % change indicator)
- Total Bookings (with trend arrow)
- Active Packages
- Pending Bookings
- Average Booking Value
- Conversion Rate
- Customer Satisfaction (avg rating)
- Upcoming Departures (next 30 days)

Each card gets an icon, sparkline trend indicator, and percentage change badge.

**Charts Section (2-column grid):**
- Revenue Over Time (Area chart - 12 months)
- Bookings by Destination (Pie/Donut chart)
- Monthly Bookings Trend (Bar chart)
- Revenue by Package (Horizontal bar chart)

**Activity Feed:**
- Recent activity timeline showing bookings, payments, cancellations with timestamps and action badges

**Quick Actions Panel:**
- Create New Package button
- Export Reports button
- View All Bookings button
- Send Notifications button

---

### 2. Enhanced Sidebar (AdminSidebar.tsx - complete rewrite)

**Collapsible sidebar with sections:**
- Logo + collapse toggle
- **Main:** Dashboard, Analytics
- **Management:** Packages, Bookings, Users, Payments
- **Operations:** Destinations, Reviews, Inquiries
- **System:** Settings, Activity Log, Reports

Includes:
- Active route highlighting
- Badge counters (e.g., "3" pending bookings)
- User avatar and role display at the bottom
- Collapse to icon-only mini mode

---

### 3. Analytics Page (NEW - AdminAnalytics.tsx)

A dedicated analytics page with:
- Date range picker (last 7d, 30d, 90d, 1yr, custom)
- Revenue analytics (line chart with comparison to previous period)
- Booking funnel (visits -> inquiries -> bookings -> completed)
- Top performing packages table with revenue, booking count, rating
- Customer demographics breakdown
- Seasonal trends heatmap-style display
- Exportable data tables

---

### 4. Enhanced Package Management (AdminPackages.tsx - major upgrade)

- Search and filter bar (by status, destination, price range)
- Grid/list view toggle
- Inline editing capability
- Expanded create/edit form in a full dialog with:
  - Image URL management (multiple images)
  - Day-by-day itinerary builder (add/remove days)
  - Includes/excludes checklist builder
  - Featured toggle, difficulty selector
  - Slug auto-generation from title
  - Preview mode before publishing
- Bulk actions (archive multiple, publish multiple)
- Duplicate package action
- Package performance stats (bookings, revenue, rating) shown inline

---

### 5. Enhanced Booking Management (AdminBookings.tsx - major upgrade)

- Date range filter
- Export to CSV button (mock)
- Expandable row detail view showing:
  - All traveler information
  - Payment details
  - Special requests
  - Timeline of status changes
- Booking detail slide-over panel
- Bulk status update capability
- Email notification trigger (mock) for status changes

---

### 6. Enhanced User Management (AdminUsers.tsx - major upgrade)

- Search by name/email
- Filter by role
- User detail slide-over panel showing:
  - Profile info
  - Booking history list
  - Total spend
  - Last active date
- Add new user dialog
- Role management (change role)
- User activity summary cards at top (total users, new this month, active customers)

---

### 7. Enhanced Payment Management (AdminPayments.tsx - major upgrade)

- Date range filter
- Payment method filter
- Revenue charts (pie chart by method, bar by month)
- Refund action button (mock)
- Payment detail expansion
- Export functionality (mock)
- Outstanding balance alerts

---

### 8. Destinations Management (NEW - AdminDestinations.tsx)

- CRUD for safari destinations
- Destination cards with image, country, package count
- Link destinations to packages
- Edit destination details in dialog

---

### 9. Reviews Management (NEW - AdminReviews.tsx)

- List all customer reviews/testimonials
- Approve/reject moderation
- Star rating display
- Filter by package, rating
- Featured review toggle

---

### 10. Customer Inquiries (NEW - AdminInquiries.tsx)

- Inquiry inbox from contact form submissions
- Status tracking (new, in-progress, resolved)
- Reply action (mock)
- Priority tagging

---

### 11. Activity Log (NEW - AdminActivityLog.tsx)

- Chronological feed of all admin actions
- Filter by action type (booking update, package create, payment, etc.)
- Searchable
- Shows who did what and when

---

### 12. Settings Page (NEW - AdminSettings.tsx)

- Company profile (name, logo, contact info)
- Currency settings
- Notification preferences
- System information display

---

### 13. Reports Page (NEW - AdminReports.tsx)

- Pre-built report templates:
  - Revenue Report (by period)
  - Booking Report (by destination/package)
  - Customer Report (demographics, repeat customers)
  - Package Performance Report
- Mock PDF/CSV export buttons
- Date range selection for each report

---

## Technical Details

### New Files to Create
- `src/pages/admin/AdminAnalytics.tsx`
- `src/pages/admin/AdminDestinations.tsx`
- `src/pages/admin/AdminReviews.tsx`
- `src/pages/admin/AdminInquiries.tsx`
- `src/pages/admin/AdminActivityLog.tsx`
- `src/pages/admin/AdminSettings.tsx`
- `src/pages/admin/AdminReports.tsx`
- `src/data/mockAdminData.ts` (additional mock data for inquiries, activity log, reviews, extended chart data)
- `src/services/analyticsService.ts`
- `src/services/inquiryService.ts`
- `src/services/reviewService.ts`
- `src/services/reportService.ts`
- `src/types/admin.ts` (Inquiry, ActivityLogEntry, Review, AnalyticsData types)

### Files to Heavily Modify
- `src/components/AdminSidebar.tsx` - Complete rewrite with collapsible sections, badges, user info
- `src/components/AdminLayout.tsx` - Add top header bar with breadcrumbs, notifications bell, user menu
- `src/pages/admin/AdminDashboard.tsx` - Complete rewrite with KPIs, charts, activity feed
- `src/pages/admin/AdminPackages.tsx` - Add search/filter, grid view, expanded CRUD, bulk actions
- `src/pages/admin/AdminBookings.tsx` - Add date filters, expandable rows, export, detail panel
- `src/pages/admin/AdminUsers.tsx` - Add search, detail panel, role management, stats
- `src/pages/admin/AdminPayments.tsx` - Add charts, filters, refund actions, export
- `src/App.tsx` - Add routes for all new admin pages

### Patterns
- All new pages follow the service layer pattern (new services for analytics, inquiries, reviews, reports)
- Strict color tokenization using existing safari tokens throughout
- Recharts for all chart components (already installed)
- Shadcn UI components (Tabs, Sheet for slide-overs, Accordion, Progress, etc.)
- Framer Motion for subtle page transitions
- Responsive: sidebar collapses on mobile, tables become card layouts on small screens
- Mock data structured to be easily replaceable with real API endpoints

