import { mockReviews } from "@/data/mockAdminData";
import type { Review } from "@/types/admin";

export const reviewService = {
  async getAll(): Promise<Review[]> {
    return mockReviews;
  },
  async updateStatus(id: string, status: Review["status"]): Promise<void> {
    const rev = mockReviews.find((r) => r.id === id);
    if (rev) rev.status = status;
  },
  async toggleFeatured(id: string): Promise<void> {
    const rev = mockReviews.find((r) => r.id === id);
    if (rev) rev.featured = !rev.featured;
  },
};
