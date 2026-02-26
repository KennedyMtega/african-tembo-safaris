// ===== Package Types =====
export interface SafariPackage {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  destination: string;
  destinationId?: string;
  duration: number;
  difficulty: "easy" | "moderate" | "challenging";
  priceMin: number;
  priceMax: number;
  groupPriceMin?: number;
  groupPriceMax?: number;
  maxGroupSize: number;
  images: string[];
  highlights: string[];
  tags: string[];
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
  id?: string;
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
  packageTitle?: string;
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

// ===== User / Profile Types =====
export interface Profile {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  createdAt: string;
}

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
  imageUrl: string;
  packageCount: number;
}
