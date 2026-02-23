import type { SafariPackage, Booking, User, Payment, Testimonial, Destination } from "@/types";

export const mockDestinations: Destination[] = [
  { id: "d1", name: "Serengeti", country: "Tanzania", description: "Witness the Great Migration across endless plains.", image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800", packageCount: 5 },
  { id: "d2", name: "Masai Mara", country: "Kenya", description: "Big Five safaris in Kenya's iconic reserve.", image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800", packageCount: 4 },
  { id: "d3", name: "Ngorongoro Crater", country: "Tanzania", description: "A natural amphitheatre teeming with wildlife.", image: "https://images.unsplash.com/photo-1621414050946-69c4e6160ea1?w=800", packageCount: 3 },
  { id: "d4", name: "Kruger National Park", country: "South Africa", description: "South Africa's premier safari destination.", image: "https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=800", packageCount: 3 },
];

export const mockPackages: SafariPackage[] = [
  {
    id: "p1", title: "Serengeti Migration Safari", slug: "serengeti-migration", description: "Experience the awe-inspiring Great Migration, where over two million wildebeest, zebras, and gazelles traverse the Serengeti plains in search of greener pastures. This journey offers unparalleled wildlife viewing and photographic opportunities.", shortDescription: "Witness the Great Migration across the Serengeti.", destination: "Serengeti", duration: 7, difficulty: "moderate", price: 3500, groupPrice: 2800, maxGroupSize: 12, images: ["https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800", "https://images.unsplash.com/photo-1549366021-9f761d450615?w=800"], highlights: ["Great Migration river crossings", "Big Five sightings", "Hot air balloon safari", "Maasai village visit"], includes: ["All park fees", "Professional guide", "4x4 safari vehicle", "Full-board accommodation", "Airport transfers"], excludes: ["International flights", "Visa fees", "Travel insurance", "Personal expenses", "Tips"], itinerary: [
      { day: 1, title: "Arrival in Arusha", description: "Meet at Kilimanjaro airport, transfer to lodge.", meals: ["Dinner"], accommodation: "Arusha Coffee Lodge" },
      { day: 2, title: "Serengeti Drive", description: "Game drive through Ngorongoro to Serengeti.", meals: ["Breakfast", "Lunch", "Dinner"], accommodation: "Serengeti Sopa Lodge" },
      { day: 3, title: "Full Day Safari", description: "Full day exploring the Serengeti plains.", meals: ["Breakfast", "Lunch", "Dinner"], accommodation: "Serengeti Sopa Lodge" },
      { day: 4, title: "Migration Chase", description: "Follow the migration herds.", meals: ["Breakfast", "Lunch", "Dinner"], accommodation: "Migration Camp" },
      { day: 5, title: "River Crossings", description: "Witness dramatic river crossings.", meals: ["Breakfast", "Lunch", "Dinner"], accommodation: "Migration Camp" },
      { day: 6, title: "Balloon Safari", description: "Optional hot air balloon ride at dawn.", meals: ["Breakfast", "Lunch", "Dinner"], accommodation: "Serengeti Sopa Lodge" },
      { day: 7, title: "Departure", description: "Final morning drive, fly back to Arusha.", meals: ["Breakfast"], accommodation: "" },
    ], status: "published", rating: 4.9, reviewCount: 124, featured: true, createdAt: "2025-01-15",
  },
  {
    id: "p2", title: "Masai Mara Big Five Expedition", slug: "masai-mara-big-five", description: "Explore Kenya's world-famous Masai Mara for close encounters with lions, elephants, buffaloes, leopards, and rhinos.", shortDescription: "Track the Big Five in Kenya's iconic Masai Mara.", destination: "Masai Mara", duration: 5, difficulty: "easy", price: 2800, groupPrice: 2200, maxGroupSize: 10, images: ["https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800", "https://images.unsplash.com/photo-1535083783855-76ae62b2914e?w=800"], highlights: ["Big Five tracking", "Sunset game drives", "Maasai cultural experience", "Photography workshops"], includes: ["All park fees", "Professional guide", "Safari vehicle", "Luxury tented camp", "All meals"], excludes: ["Flights", "Visa", "Insurance", "Gratuities"], itinerary: [
      { day: 1, title: "Nairobi to Masai Mara", description: "Scenic flight to the Mara.", meals: ["Lunch", "Dinner"], accommodation: "Mara Intrepids Camp" },
      { day: 2, title: "Full Day Safari", description: "Dawn-to-dusk game viewing.", meals: ["Breakfast", "Lunch", "Dinner"], accommodation: "Mara Intrepids Camp" },
      { day: 3, title: "Big Cat Country", description: "Track predators across the plains.", meals: ["Breakfast", "Lunch", "Dinner"], accommodation: "Mara Intrepids Camp" },
      { day: 4, title: "Cultural Visit", description: "Visit Maasai village, evening game drive.", meals: ["Breakfast", "Lunch", "Dinner"], accommodation: "Mara Intrepids Camp" },
      { day: 5, title: "Departure", description: "Morning drive, fly to Nairobi.", meals: ["Breakfast"], accommodation: "" },
    ], status: "published", rating: 4.8, reviewCount: 89, featured: true, createdAt: "2025-02-01",
  },
  {
    id: "p3", title: "Ngorongoro Crater Explorer", slug: "ngorongoro-crater", description: "Descend into the world's largest unbroken caldera for an unforgettable day of wildlife encounters in this UNESCO World Heritage Site.", shortDescription: "Explore the stunning Ngorongoro Crater.", destination: "Ngorongoro Crater", duration: 4, difficulty: "easy", price: 2200, groupPrice: 1800, maxGroupSize: 8, images: ["https://images.unsplash.com/photo-1621414050946-69c4e6160ea1?w=800"], highlights: ["Crater floor game drive", "Flamingo-filled lakes", "Black rhino sightings", "Panoramic crater views"], includes: ["Park fees", "Guide", "Vehicle", "Accommodation", "Meals"], excludes: ["Flights", "Visa", "Insurance", "Tips"], itinerary: [
      { day: 1, title: "Arrival", description: "Arrive Arusha, transfer to crater rim.", meals: ["Dinner"], accommodation: "Ngorongoro Serena Lodge" },
      { day: 2, title: "Crater Descent", description: "Full day on the crater floor.", meals: ["Breakfast", "Lunch", "Dinner"], accommodation: "Ngorongoro Serena Lodge" },
      { day: 3, title: "Highlands Trek", description: "Explore the crater highlands.", meals: ["Breakfast", "Lunch", "Dinner"], accommodation: "Ngorongoro Serena Lodge" },
      { day: 4, title: "Departure", description: "Morning views, transfer to Arusha.", meals: ["Breakfast"], accommodation: "" },
    ], status: "published", rating: 4.7, reviewCount: 67, featured: true, createdAt: "2025-02-10",
  },
  {
    id: "p4", title: "Kruger Wilderness Trail", slug: "kruger-wilderness", description: "Walk through the South African bushveld with experienced rangers on this intimate walking safari through Kruger National Park.", shortDescription: "Walking safari through Kruger National Park.", destination: "Kruger National Park", duration: 6, difficulty: "challenging", price: 4200, maxGroupSize: 6, images: ["https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=800"], highlights: ["Guided bush walks", "Night game drives", "Bird watching", "Stargazing"], includes: ["Park fees", "Armed ranger", "All meals", "Luxury lodge"], excludes: ["Flights", "Transfers", "Insurance"], itinerary: [
      { day: 1, title: "Arrival", description: "Arrive at Kruger, settle in.", meals: ["Dinner"], accommodation: "Kruger Wilderness Lodge" },
      { day: 2, title: "First Walk", description: "Morning bush walk, afternoon drive.", meals: ["Breakfast", "Lunch", "Dinner"], accommodation: "Kruger Wilderness Lodge" },
      { day: 3, title: "Deep Bush", description: "Full day walking trail.", meals: ["Breakfast", "Lunch", "Dinner"], accommodation: "Bush Camp" },
      { day: 4, title: "River Trail", description: "Walk along the river systems.", meals: ["Breakfast", "Lunch", "Dinner"], accommodation: "Bush Camp" },
      { day: 5, title: "Night Safari", description: "Morning walk, night game drive.", meals: ["Breakfast", "Lunch", "Dinner"], accommodation: "Kruger Wilderness Lodge" },
      { day: 6, title: "Departure", description: "Final morning walk, departure.", meals: ["Breakfast"], accommodation: "" },
    ], status: "published", rating: 4.9, reviewCount: 42, featured: false, createdAt: "2025-03-01",
  },
];

export const mockBookings: Booking[] = [
  { id: "b1", bookingRef: "TEM-2025-001", packageId: "p1", packageTitle: "Serengeti Migration Safari", userId: "u2", status: "confirmed", startDate: "2025-07-15", endDate: "2025-07-21", travelers: [{ firstName: "John", lastName: "Smith", email: "john@example.com", phone: "+1234567890" }], totalAmount: 3500, paymentStatus: "paid", createdAt: "2025-04-01" },
  { id: "b2", bookingRef: "TEM-2025-002", packageId: "p2", packageTitle: "Masai Mara Big Five Expedition", userId: "u3", status: "pending", startDate: "2025-08-10", endDate: "2025-08-14", travelers: [{ firstName: "Sarah", lastName: "Johnson", email: "sarah@example.com", phone: "+1987654321" }, { firstName: "Mike", lastName: "Johnson", email: "mike@example.com", phone: "+1987654322" }], totalAmount: 5600, paymentStatus: "pending", createdAt: "2025-04-15" },
  { id: "b3", bookingRef: "TEM-2025-003", packageId: "p3", packageTitle: "Ngorongoro Crater Explorer", userId: "u4", status: "completed", startDate: "2025-03-01", endDate: "2025-03-04", travelers: [{ firstName: "Emma", lastName: "Wilson", email: "emma@example.com", phone: "+1122334455" }], totalAmount: 2200, paymentStatus: "paid", createdAt: "2025-01-20" },
];

export const mockUsers: User[] = [
  { id: "u1", name: "Admin User", email: "admin@tembo.safari", role: "admin", createdAt: "2024-01-01" },
  { id: "u2", name: "John Smith", email: "john@example.com", role: "customer", phone: "+1234567890", createdAt: "2025-03-15" },
  { id: "u3", name: "Sarah Johnson", email: "sarah@example.com", role: "customer", phone: "+1987654321", createdAt: "2025-03-20" },
  { id: "u4", name: "Emma Wilson", email: "emma@example.com", role: "customer", phone: "+1122334455", createdAt: "2025-01-10" },
];

export const mockPayments: Payment[] = [
  { id: "pay1", bookingId: "b1", bookingRef: "TEM-2025-001", amount: 3500, currency: "USD", status: "paid", method: "Credit Card", paidAt: "2025-04-01", createdAt: "2025-04-01" },
  { id: "pay2", bookingId: "b2", bookingRef: "TEM-2025-002", amount: 5600, currency: "USD", status: "pending", method: "Bank Transfer", createdAt: "2025-04-15" },
  { id: "pay3", bookingId: "b3", bookingRef: "TEM-2025-003", amount: 2200, currency: "USD", status: "paid", method: "Credit Card", paidAt: "2025-01-20", createdAt: "2025-01-20" },
];

export const mockTestimonials: Testimonial[] = [
  { id: "t1", name: "David & Lisa Thompson", location: "London, UK", rating: 5, text: "The Serengeti migration safari was the most breathtaking experience of our lives. Our guide was incredibly knowledgeable, and seeing thousands of wildebeest cross the Mara River was unforgettable.", packageTitle: "Serengeti Migration Safari" },
  { id: "t2", name: "Akiko Tanaka", location: "Tokyo, Japan", rating: 5, text: "Tembo Safari exceeded all expectations. The attention to detail, from accommodation to wildlife tracking, was impeccable. I'll be coming back for the Kruger trail next year!", packageTitle: "Masai Mara Big Five Expedition" },
  { id: "t3", name: "Carlos Mendez", location: "Madrid, Spain", rating: 5, text: "Ngorongoro Crater was like stepping into another world. The crater floor is teeming with wildlife and the views from the rim are spectacular. Highly recommended!", packageTitle: "Ngorongoro Crater Explorer" },
];
