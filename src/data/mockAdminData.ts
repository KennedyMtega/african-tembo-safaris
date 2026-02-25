import type { Inquiry, ActivityLogEntry, Review, RevenueDataPoint, DestinationStat, PackagePerformance, CompanySettings } from "@/types/admin";

export const mockRevenueData: RevenueDataPoint[] = [
  { month: "Mar", revenue: 2200, bookings: 1, previousRevenue: 1800 },
  { month: "Apr", revenue: 9100, bookings: 2, previousRevenue: 4200 },
  { month: "May", revenue: 7800, bookings: 3, previousRevenue: 5500 },
  { month: "Jun", revenue: 12400, bookings: 4, previousRevenue: 8800 },
  { month: "Jul", revenue: 18200, bookings: 6, previousRevenue: 11200 },
  { month: "Aug", revenue: 22500, bookings: 7, previousRevenue: 15400 },
  { month: "Sep", revenue: 15600, bookings: 5, previousRevenue: 12100 },
  { month: "Oct", revenue: 19800, bookings: 6, previousRevenue: 14300 },
  { month: "Nov", revenue: 8900, bookings: 3, previousRevenue: 7200 },
  { month: "Dec", revenue: 14200, bookings: 4, previousRevenue: 9800 },
  { month: "Jan", revenue: 11300, bookings: 3, previousRevenue: 8400 },
  { month: "Feb", revenue: 16700, bookings: 5, previousRevenue: 12600 },
];

export const mockDestinationStats: DestinationStat[] = [
  { name: "Serengeti", bookings: 18, revenue: 63000, fill: "hsl(var(--primary))" },
  { name: "Masai Mara", bookings: 14, revenue: 39200, fill: "hsl(var(--safari-brown-light))" },
  { name: "Ngorongoro", bookings: 10, revenue: 22000, fill: "hsl(var(--gold-accent))" },
  { name: "Kruger", bookings: 7, revenue: 29400, fill: "hsl(var(--savanna-green))" },
];

export const mockPackagePerformance: PackagePerformance[] = [
  { id: "p1", title: "Serengeti Migration Safari", bookings: 18, revenue: 63000, rating: 4.9, conversionRate: 12.4 },
  { id: "p2", title: "Masai Mara Big Five", bookings: 14, revenue: 39200, rating: 4.8, conversionRate: 10.2 },
  { id: "p3", title: "Ngorongoro Crater Explorer", bookings: 10, revenue: 22000, rating: 4.7, conversionRate: 8.6 },
  { id: "p4", title: "Kruger Wilderness Trail", bookings: 7, revenue: 29400, rating: 4.9, conversionRate: 15.1 },
];

export const mockInquiries: Inquiry[] = [
  { id: "inq1", name: "James Carter", email: "james@example.com", subject: "Group booking discount", message: "We have a group of 8 people interested in the Serengeti safari. Do you offer group discounts?", status: "new", priority: "high", createdAt: "2025-04-20T10:30:00Z" },
  { id: "inq2", name: "Maria Garcia", email: "maria@example.com", subject: "Visa requirements", message: "What are the visa requirements for Tanzania for EU citizens?", status: "in-progress", priority: "medium", createdAt: "2025-04-19T14:15:00Z" },
  { id: "inq3", name: "Robert Kim", email: "robert@example.com", subject: "Custom itinerary", message: "Can you create a custom 10-day itinerary combining Serengeti and Ngorongoro?", status: "new", priority: "high", createdAt: "2025-04-21T08:45:00Z" },
  { id: "inq4", name: "Alice Brown", email: "alice@example.com", subject: "Photography safari", message: "Do you offer specialized photography safaris with hides and equipment?", status: "resolved", priority: "low", createdAt: "2025-04-10T16:00:00Z", resolvedAt: "2025-04-12T09:30:00Z" },
  { id: "inq5", name: "Tom Anderson", email: "tom@example.com", subject: "Accessibility", message: "My partner uses a wheelchair. Are any of your safaris accessible?", status: "in-progress", priority: "high", createdAt: "2025-04-18T11:20:00Z" },
];

export const mockActivityLog: ActivityLogEntry[] = [
  { id: "act1", action: "booking_created", description: "New booking TEM-2025-002 created for Masai Mara Big Five Expedition", userId: "u3", userName: "Sarah Johnson", createdAt: "2025-04-15T09:00:00Z" },
  { id: "act2", action: "payment_received", description: "Payment of $3,500 received for TEM-2025-001", userId: "u2", userName: "John Smith", createdAt: "2025-04-01T12:30:00Z" },
  { id: "act3", action: "package_updated", description: "Serengeti Migration Safari updated — price changed", userId: "u1", userName: "Admin User", createdAt: "2025-03-28T15:45:00Z" },
  { id: "act4", action: "review_approved", description: "Review by David & Lisa Thompson approved", userId: "u1", userName: "Admin User", createdAt: "2025-03-25T10:00:00Z" },
  { id: "act5", action: "user_registered", description: "New customer Emma Wilson registered", userId: "u4", userName: "Emma Wilson", createdAt: "2025-01-10T08:15:00Z" },
  { id: "act6", action: "booking_updated", description: "Booking TEM-2025-003 status changed to completed", userId: "u1", userName: "Admin User", createdAt: "2025-03-05T14:20:00Z" },
  { id: "act7", action: "inquiry_resolved", description: "Inquiry from Alice Brown about photography safari resolved", userId: "u1", userName: "Admin User", createdAt: "2025-04-12T09:30:00Z" },
  { id: "act8", action: "package_created", description: "New package Kruger Wilderness Trail created", userId: "u1", userName: "Admin User", createdAt: "2025-03-01T11:00:00Z" },
];

export const mockReviews: Review[] = [
  { id: "rev1", packageId: "p1", packageTitle: "Serengeti Migration Safari", userId: "u2", userName: "John Smith", rating: 5, title: "Life-changing experience", text: "The migration was absolutely breathtaking. Our guide knew exactly where to find the best crossings.", status: "approved", featured: true, createdAt: "2025-03-20T10:00:00Z" },
  { id: "rev2", packageId: "p2", packageTitle: "Masai Mara Big Five Expedition", userId: "u3", userName: "Sarah Johnson", rating: 4, title: "Amazing wildlife", text: "Saw all of the Big Five within the first two days. The camp was luxurious and comfortable.", status: "approved", featured: false, createdAt: "2025-03-15T14:00:00Z" },
  { id: "rev3", packageId: "p3", packageTitle: "Ngorongoro Crater Explorer", userId: "u4", userName: "Emma Wilson", rating: 5, title: "Stunning crater views", text: "The crater is unlike anything I've ever seen. The density of wildlife on the floor is incredible.", status: "approved", featured: true, createdAt: "2025-02-28T09:00:00Z" },
  { id: "rev4", packageId: "p1", packageTitle: "Serengeti Migration Safari", userId: "u4", userName: "Emma Wilson", rating: 3, title: "Good but crowded", text: "The safari was good but some areas felt very crowded with too many vehicles.", status: "pending", featured: false, createdAt: "2025-04-18T16:30:00Z" },
  { id: "rev5", packageId: "p4", packageTitle: "Kruger Wilderness Trail", userId: "u2", userName: "John Smith", rating: 5, title: "Incredible walking safari", text: "Walking through the bush with armed rangers was thrilling. Saw rhinos up close!", status: "pending", featured: false, createdAt: "2025-04-20T11:00:00Z" },
];

export const mockCompanySettings: CompanySettings = {
  name: "Tembo Safari Co.",
  email: "info@tembo.safari",
  phone: "+255 123 456 789",
  address: "123 Safari Drive, Arusha, Tanzania",
  currency: "USD",
  timezone: "Africa/Dar_es_Salaam",
  logoUrl: "",
  notifyOnBooking: true,
  notifyOnPayment: true,
  notifyOnInquiry: true,
};
