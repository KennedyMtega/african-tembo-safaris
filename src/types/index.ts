// ===== Package Types =====
export interface SafariPackage {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  destination: string;
  duration: number; // days
  difficulty: "easy" | "moderate" | "challenging";
  price: number;
  groupPrice?: number;
  maxGroupSize: number;
  images: string[];
  highlights: string[];
  includes: string[];
  excludes: string[];
  itinerary: ItineraryDay[];
  status: "draft" | "published" | "archived";
  rating: number;
  reviewCount: number;
  featured: boolean;
  createdAt: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  meals: string[];
  accommodation: string;
}

// ===== Booking Types =====
export interface Booking {
  id: string;
  bookingRef: string;
  packageId: string;
  packageTitle: string;
  userId: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  startDate: string;
  endDate: string;
  travelers: Traveler[];
  totalAmount: number;
  paymentStatus: "pending" | "paid" | "refunded";
  specialRequests?: string;
  createdAt: string;
}

export interface Traveler {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dietaryNeeds?: string;
  specialNeeds?: string;
}

// ===== User Types =====
export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "customer";
  avatar?: string;
  phone?: string;
  createdAt: string;
}

// ===== Payment Types =====
export interface Payment {
  id: string;
  bookingId: string;
  bookingRef: string;
  amount: number;
  currency: string;
  status: "pending" | "paid" | "refunded";
  method: string;
  paidAt?: string;
  createdAt: string;
}

// ===== Testimonial =====
export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  text: string;
  avatar?: string;
  packageTitle: string;
}

// ===== Destination =====
export interface Destination {
  id: string;
  name: string;
  country: string;
  description: string;
  image: string;
  packageCount: number;
}
