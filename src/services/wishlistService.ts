import { supabase } from "@/integrations/supabase/client";

export const wishlistService = {
  async getByUser(userId: string): Promise<string[]> {
    const { data, error } = await supabase.from("wishlists").select("package_id").eq("user_id", userId);
    if (error) throw error;
    return (data || []).map((w: any) => w.package_id);
  },

  async toggle(userId: string, packageId: string): Promise<boolean> {
    const { data: existing } = await supabase
      .from("wishlists")
      .select("id")
      .eq("user_id", userId)
      .eq("package_id", packageId)
      .single();
    
    if (existing) {
      await supabase.from("wishlists").delete().eq("id", existing.id);
      return false; // removed
    } else {
      await supabase.from("wishlists").insert({ user_id: userId, package_id: packageId });
      return true; // added
    }
  },
};
