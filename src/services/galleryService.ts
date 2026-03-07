import { supabase } from "@/integrations/supabase/client";

export interface GalleryItem {
  id: string;
  title: string | null;
  type: "image" | "video";
  url: string;
  thumbnailUrl: string | null;
  sortOrder: number;
  createdAt: string;
}

function map(row: any): GalleryItem {
  return {
    id: row.id,
    title: row.title,
    type: row.type,
    url: row.url,
    thumbnailUrl: row.thumbnail_url,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
  };
}

export const galleryService = {
  async getAll(): Promise<GalleryItem[]> {
    const { data, error } = await supabase
      .from("gallery_items")
      .select("*")
      .order("sort_order");
    if (error) throw error;
    return (data || []).map(map);
  },

  async create(item: { title?: string; type: "image" | "video"; url: string; thumbnailUrl?: string }): Promise<void> {
    const { data: maxRow } = await supabase
      .from("gallery_items")
      .select("sort_order")
      .order("sort_order", { ascending: false })
      .limit(1)
      .single();
    const nextOrder = (maxRow?.sort_order ?? -1) + 1;

    const { error } = await supabase.from("gallery_items").insert({
      title: item.title || null,
      type: item.type,
      url: item.url,
      thumbnail_url: item.thumbnailUrl || null,
      sort_order: nextOrder,
    });
    if (error) throw error;
  },

  async remove(id: string): Promise<void> {
    const { error } = await supabase.from("gallery_items").delete().eq("id", id);
    if (error) throw error;
  },

  async updateTitle(id: string, title: string): Promise<void> {
    const { error } = await supabase.from("gallery_items").update({ title }).eq("id", id);
    if (error) throw error;
  },

  async uploadFile(file: File): Promise<string> {
    const ext = file.name.split(".").pop();
    const path = `gallery/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("site-media").upload(path, file, { upsert: true });
    if (error) throw error;
    const { data } = supabase.storage.from("site-media").getPublicUrl(path);
    return data.publicUrl;
  },
};
