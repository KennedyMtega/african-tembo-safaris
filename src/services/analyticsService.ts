import { supabase } from "@/integrations/supabase/client";

export const analyticsService = {
  async getKPIs() {
    const [
      { data: bookings },
      { data: payments },
      { data: packages },
      { data: reviews },
    ] = await Promise.all([
      supabase.from("bookings").select("id, status, total_amount, payment_status, start_date"),
      supabase.from("payments").select("amount, status"),
      supabase.from("packages").select("id, status"),
      supabase.from("reviews").select("rating").eq("status", "approved"),
    ]);

    const totalRevenue = (payments || []).filter((p: any) => p.status === "paid").reduce((s: number, p: any) => s + Number(p.amount), 0);
    const totalBookings = (bookings || []).length;
    const activePackages = (packages || []).filter((p: any) => p.status === "published").length;
    const pendingBookings = (bookings || []).filter((b: any) => b.status === "pending").length;
    const avgBookingValue = totalBookings > 0 ? Math.round(totalRevenue / totalBookings) : 0;
    const avgRating = (reviews || []).length > 0 
      ? Number(((reviews || []).reduce((s: number, r: any) => s + r.rating, 0) / (reviews || []).length).toFixed(1))
      : 0;
    
    const now = new Date();
    const in30days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const upcomingDepartures = (bookings || []).filter((b: any) => {
      const start = new Date(b.start_date);
      return start >= now && start <= in30days && b.status !== "cancelled";
    }).length;

    return {
      totalRevenue,
      revenueChange: 0,
      totalBookings,
      bookingsChange: 0,
      activePackages,
      pendingBookings,
      avgBookingValue,
      conversionRate: 0,
      customerSatisfaction: avgRating,
      upcomingDepartures,
    };
  },

  async getRevenueData() {
    const { data } = await supabase
      .from("payments")
      .select("amount, status, created_at")
      .eq("status", "paid")
      .order("created_at");
    
    const months: Record<string, { revenue: number; bookings: number }> = {};
    (data || []).forEach((p: any) => {
      const d = new Date(p.created_at);
      const key = d.toLocaleString("default", { month: "short" });
      if (!months[key]) months[key] = { revenue: 0, bookings: 0 };
      months[key].revenue += Number(p.amount);
      months[key].bookings += 1;
    });

    return Object.entries(months).map(([month, vals]) => ({ month, ...vals }));
  },

  async getDestinationStats() {
    const { data } = await supabase
      .from("bookings")
      .select("total_amount, packages(destinations(name))")
      .eq("payment_status", "paid");
    
    const stats: Record<string, { bookings: number; revenue: number }> = {};
    (data || []).forEach((b: any) => {
      const name = b.packages?.destinations?.name || "Unknown";
      if (!stats[name]) stats[name] = { bookings: 0, revenue: 0 };
      stats[name].bookings += 1;
      stats[name].revenue += Number(b.total_amount);
    });

    const fills = ["hsl(var(--primary))", "hsl(var(--gold-accent))", "hsl(var(--savanna-green))", "hsl(var(--safari-brown-light))"];
    return Object.entries(stats).map(([name, vals], i) => ({
      name,
      ...vals,
      fill: fills[i % fills.length],
    }));
  },
};
