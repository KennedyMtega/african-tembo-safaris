export interface Inquiry {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "new" | "in-progress" | "resolved";
  priority: "low" | "medium" | "high";
  createdAt: string;
  resolvedAt?: string;
}

export interface ActivityLogEntry {
  id: string;
  action: "booking_created" | "booking_updated" | "package_created" | "package_updated" | "payment_received" | "user_registered" | "inquiry_resolved" | "review_approved";
  description: string;
  userId: string;
  userName: string;
  entityId?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  packageId: string;
  packageTitle: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  text: string;
  status: "pending" | "approved" | "rejected";
  featured: boolean;
  createdAt: string;
}

export interface RevenueDataPoint {
  month: string;
  revenue: number;
  bookings: number;
  previousRevenue?: number;
}

export interface DestinationStat {
  name: string;
  bookings: number;
  revenue: number;
  fill: string;
}

export interface PackagePerformance {
  id: string;
  title: string;
  bookings: number;
  revenue: number;
  rating: number;
  conversionRate: number;
}

export interface CompanySettings {
  name: string;
  email: string;
  phone: string;
  address: string;
  currency: string;
  timezone: string;
  logoUrl: string;
  notifyOnBooking: boolean;
  notifyOnPayment: boolean;
  notifyOnInquiry: boolean;
}
