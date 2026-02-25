import { mockInquiries } from "@/data/mockAdminData";
import type { Inquiry } from "@/types/admin";

export const inquiryService = {
  async getAll(): Promise<Inquiry[]> {
    return mockInquiries;
  },
  async updateStatus(id: string, status: Inquiry["status"]): Promise<void> {
    const inq = mockInquiries.find((i) => i.id === id);
    if (inq) {
      inq.status = status;
      if (status === "resolved") inq.resolvedAt = new Date().toISOString();
    }
  },
  async updatePriority(id: string, priority: Inquiry["priority"]): Promise<void> {
    const inq = mockInquiries.find((i) => i.id === id);
    if (inq) inq.priority = priority;
  },
};
