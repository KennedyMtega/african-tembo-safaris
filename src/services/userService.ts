import { supabase } from "@/integrations/supabase/client";
import type { Profile } from "@/types";

export const userService = {
  async getAll(): Promise<(Profile & { role: string })[]> {
    const { data: profiles, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    
    const { data: roles } = await supabase.from("user_roles").select("*");
    const roleMap = new Map<string, string>();
    (roles || []).forEach((r: any) => roleMap.set(r.user_id, r.role));

    return (profiles || []).map((p: any) => ({
      id: p.id,
      fullName: p.full_name || "",
      email: p.email || "",
      phone: p.phone || undefined,
      avatarUrl: p.avatar_url || undefined,
      createdAt: p.created_at,
      role: roleMap.get(p.id) || "user",
    }));
  },

  async updateProfile(id: string, data: Partial<Profile>): Promise<void> {
    const update: any = {};
    if (data.fullName !== undefined) update.full_name = data.fullName;
    if (data.phone !== undefined) update.phone = data.phone;
    if (data.avatarUrl !== undefined) update.avatar_url = data.avatarUrl;
    const { error } = await supabase.from("profiles").update(update).eq("id", id);
    if (error) throw error;
  },
};
