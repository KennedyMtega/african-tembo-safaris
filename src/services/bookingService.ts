import { mockBookings } from "@/data/mockData";
import type { Booking } from "@/types";

export const bookingService = {
  async getAll(): Promise<Booking[]> {
    return mockBookings;
  },

  async getById(id: string): Promise<Booking | undefined> {
    return mockBookings.find((b) => b.id === id);
  },

  async getByUser(userId: string): Promise<Booking[]> {
    return mockBookings.filter((b) => b.userId === userId);
  },

  async create(booking: Omit<Booking, "id" | "bookingRef" | "createdAt">): Promise<Booking> {
    const ref = `TEM-${new Date().getFullYear()}-${String(mockBookings.length + 1).padStart(3, "0")}`;
    const newBooking: Booking = { ...booking, id: `b${Date.now()}`, bookingRef: ref, createdAt: new Date().toISOString() };
    mockBookings.push(newBooking);
    return newBooking;
  },

  async updateStatus(id: string, status: Booking["status"]): Promise<Booking | undefined> {
    const b = mockBookings.find((b) => b.id === id);
    if (b) b.status = status;
    return b;
  },
};
