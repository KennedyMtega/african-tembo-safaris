

# Tanzanian Safari Packages + Admin Booking Calendar + CRUD Enhancements

## Overview

Three main deliverables:
1. **Seed 5 Tanzanian safari packages** with real destinations, rich itineraries, 5+ images each (from Unsplash), highlights, includes/excludes, and tags
2. **Add a Booking Calendar view** to the admin panel (calendar-style view of all bookings by date)
3. **Ensure CRUD is smooth** — the existing AdminPackageForm already supports full CRUD; we just need to verify sync and add the calendar route

## Part 1: Seed Data — 5 Tanzanian Destinations + 5 Packages

### Destinations (insert via SQL)
1. Serengeti National Park, Tanzania
2. Ngorongoro Crater, Tanzania  
3. Zanzibar Island, Tanzania
4. Mount Kilimanjaro, Tanzania
5. Tarangire National Park, Tanzania

### Packages (insert via SQL)

**1. Serengeti Great Migration Safari** — 7 days, moderate, $3,200–$4,800
- Witness the wildebeest migration across the Serengeti plains
- 5-day itinerary: Arusha → Tarangire → Serengeti (3 nights) → Ngorongoro → Arusha
- Highlights: Big Five, migration river crossings, hot air balloon option, Maasai village visit
- Includes: Park fees, 4x4 vehicle, lodges, meals, guide
- Excludes: International flights, visa, tips, balloon safari

**2. Ngorongoro Crater & Cultural Experience** — 4 days, easy, $1,800–$2,600
- Descend into the world's largest volcanic caldera teeming with wildlife
- Itinerary: Arusha → Lake Manyara → Ngorongoro (2 nights) → Arusha
- Highlights: Crater floor game drive, flamingos at Lake Manyara, Maasai boma visit

**3. Zanzibar Beach & Spice Island Retreat** — 5 days, easy, $1,200–$2,000
- Tropical paradise with turquoise waters, spice tours, and Stone Town history
- Itinerary: Zanzibar arrival → Stone Town → Spice tour → Beach days → Departure
- Highlights: UNESCO Stone Town, Jozani Forest (red colobus monkeys), sunset dhow cruise, snorkeling

**4. Kilimanjaro Machame Route Trek** — 7 days, challenging, $2,800–$3,800
- Summit Africa's highest peak via the scenic "Whiskey Route"
- Day-by-day: Machame Gate → Shira Camp → Barranco → Karanga → Barafu → Summit → Descent
- Highlights: Uhuru Peak summit, alpine desert, glacier views, rainforest zone

**5. Northern Circuit Grand Safari** — 10 days, moderate, $5,500–$7,500
- The ultimate Tanzania safari combining all major parks plus Zanzibar extension
- Itinerary: Arusha → Tarangire → Lake Manyara → Serengeti (3 nights) → Ngorongoro → Zanzibar (2 nights) → Departure
- Highlights: All Big Five, great migration, crater descent, Zanzibar beaches, cultural immersions

Each package will have:
- 5 high-quality Unsplash image URLs (safari, wildlife, landscape themed)
- 6-8 highlights
- 8-10 includes items
- 5-6 excludes items
- Full day-by-day itinerary with meals and accommodation
- Tags like "wildlife", "migration", "luxury", "adventure", "beach", "trekking"
- Status: `published`, Featured: first 3 set to `true`

## Part 2: Admin Booking Calendar

### New file: `src/pages/admin/AdminBookingCalendar.tsx`

A monthly calendar view showing bookings as colored blocks on their start dates. Features:
- Month navigation (prev/next)
- Grid of days showing booking count badges
- Click a day to see bookings for that date in a side panel
- Color-coded by status (pending=gold, confirmed=green, completed=blue, cancelled=red)
- Uses existing `bookingService.getAll()` data

### Route addition in `App.tsx`
- Add `/admin/bookings/calendar` route

### Sidebar update in `AdminSidebar.tsx`
- Add "Calendar" link under Management section (using `Calendar` icon from lucide)

### Tab integration in `AdminBookings.tsx`
- Add a toggle between "List" and "Calendar" views, or a link to the calendar page

## Part 3: Files Changed

| File | Change |
|------|--------|
| `src/pages/admin/AdminBookingCalendar.tsx` | **New** — Full calendar view component |
| `src/App.tsx` | Add calendar route |
| `src/components/AdminSidebar.tsx` | Add Calendar nav link |
| `src/pages/admin/AdminBookings.tsx` | Add link/button to calendar view |
| SQL migration | Insert 5 destinations + 5 packages + itineraries |

No schema changes needed — all tables already exist with the right columns. The seed data uses `INSERT` statements into `destinations`, `packages`, and `package_itinerary`.

