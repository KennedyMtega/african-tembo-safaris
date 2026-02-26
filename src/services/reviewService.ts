import { supabase } from "@/integrations/supabase/client";
import type { Review } from "@/types/admin";

function mapReview(row: any): Review {
  return {
    id: row.id,
    packageId: row.package_id,
    packageTitle: row.packages?.title || "",
    userId: row.user_id,
    userName: row.profiles?.full_name || "",
    rating: row.rating,
    title: row.title || "",
    text: row.text || "",
    status: row.status,
    featured: row.featured,
    createdAt: row.created_at,
  };
}

export const reviewService = {
  async getAll(): Promise<Review[]> {
    const { data, error } = await supabase
      .from("reviews")
      .select("*, packages(title), profiles(full_name)")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data || []).map(mapReview);
  },

  async getApprovedByPackage(packageId: string): Promise<Review[]> {
    const { data, error } = await supabase
      .from("reviews")
      .select("*, profiles(full_name)")
      .eq("package_id", packageId)
      .eq("status", "approved")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data || []).map(mapReview);
  },

  async updateStatus(id: string, status: Review["status"]): Promise<void> {
    const { error } = await supabase.from("reviews").update({ status }).eq("id", id);
    if (error) throw error;
  },

  async toggleFeatured(id: string, featured: boolean): Promise<void> {
    const { error } = await supabase.from("reviews").update({ featured }).eq("id", id);
    if (error) throw error;
  },
};
