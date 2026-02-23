import { mockPayments } from "@/data/mockData";
import type { Payment } from "@/types";

export const paymentService = {
  async getAll(): Promise<Payment[]> {
    return mockPayments;
  },

  async getByBooking(bookingId: string): Promise<Payment | undefined> {
    return mockPayments.find((p) => p.bookingId === bookingId);
  },
};
