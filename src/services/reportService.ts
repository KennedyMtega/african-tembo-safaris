import { supabase } from "@/integrations/supabase/client";

export const reportService = {
  async generateRevenueReport(period: string) {
    const { data } = await supabase.from("payments").select("*").eq("status", "paid").order("created_at");
    return data || [];
  },

  async generateBookingReport(period: string) {
    const { data } = await supabase.from("bookings").select("*, packages(title)").order("created_at", { ascending: false });
    return data || [];
  },

  async generateCustomerReport() {
    const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
    return data || [];
  },

  async generatePackageReport() {
    const { data } = await supabase.from("packages").select("*").order("created_at", { ascending: false });
    return data || [];
  },
};
