import { supabase } from "@/integrations/supabase/client";
import type { Destination } from "@/types";

function mapDest(row: any): Destination {
  return {
    id: row.id,
    name: row.name,
    country: row.country,
    description: row.description || "",
    imageUrl: row.image_url || "",
    packageCount: row.package_count || 0,
  };
}

export const destinationService = {
  async getAll(): Promise<Destination[]> {
    const { data, error } = await supabase.from("destinations").select("*").order("name");
    if (error) throw error;
    return (data || []).map(mapDest);
  },

  async create(dest: Partial<Destination>): Promise<Destination> {
    const { data, error } = await supabase.from("destinations").insert({
      name: dest.name || "",
      country: dest.country || "",
      description: dest.description || "",
      image_url: dest.imageUrl || "",
    }).select().single();
    if (error) throw error;
    return mapDest(data);
  },

  async update(id: string, dest: Partial<Destination>): Promise<Destination> {
    const { data, error } = await supabase.from("destinations").update({
      name: dest.name,
      country: dest.country,
      description: dest.description,
      image_url: dest.imageUrl,
      updated_at: new Date().toISOString(),
    }).eq("id", id).select().single();
    if (error) throw error;
    return mapDest(data);
  },

  async deleteDestination(id: string): Promise<void> {
    const { error } = await supabase.from("destinations").delete().eq("id", id);
    if (error) throw error;
  },
};
