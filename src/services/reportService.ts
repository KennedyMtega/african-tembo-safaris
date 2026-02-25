import { mockRevenueData, mockPackagePerformance } from "@/data/mockAdminData";
import { mockBookings, mockUsers } from "@/data/mockData";

export const reportService = {
  async generateRevenueReport(period: string) {
    return { period, data: mockRevenueData, generatedAt: new Date().toISOString() };
  },
  async generateBookingReport(period: string) {
    return { period, bookings: mockBookings, generatedAt: new Date().toISOString() };
  },
  async generateCustomerReport() {
    return { totalCustomers: mockUsers.filter((u) => u.role === "customer").length, users: mockUsers, generatedAt: new Date().toISOString() };
  },
  async generatePackageReport() {
    return { packages: mockPackagePerformance, generatedAt: new Date().toISOString() };
  },
  async exportCSV(reportType: string): Promise<string> {
    return `data:text/csv;charset=utf-8,Report: ${reportType}\nGenerated: ${new Date().toISOString()}\n`;
  },
};
