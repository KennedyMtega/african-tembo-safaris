import { mockRevenueData, mockDestinationStats, mockPackagePerformance } from "@/data/mockAdminData";
import type { RevenueDataPoint, DestinationStat, PackagePerformance } from "@/types/admin";

export const analyticsService = {
  async getRevenueData(): Promise<RevenueDataPoint[]> {
    return mockRevenueData;
  },
  async getDestinationStats(): Promise<DestinationStat[]> {
    return mockDestinationStats;
  },
  async getPackagePerformance(): Promise<PackagePerformance[]> {
    return mockPackagePerformance;
  },
  async getKPIs() {
    const totalRevenue = mockRevenueData.reduce((s, d) => s + d.revenue, 0);
    const prevRevenue = mockRevenueData.reduce((s, d) => s + (d.previousRevenue ?? 0), 0);
    const totalBookings = mockRevenueData.reduce((s, d) => s + d.bookings, 0);
    return {
      totalRevenue,
      revenueChange: prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : 0,
      totalBookings,
      bookingsChange: 18.2,
      activePackages: 4,
      pendingBookings: 1,
      avgBookingValue: Math.round(totalRevenue / totalBookings),
      conversionRate: 11.3,
      customerSatisfaction: 4.8,
      upcomingDepartures: 3,
    };
  },
};
