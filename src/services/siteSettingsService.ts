import { supabase } from "@/integrations/supabase/client";

export interface HeroMedia {
  mode: "image" | "video";
  imageUrl?: string;
  videoUrl?: string;
}

// Keys that must be readable by anonymous (public) visitors
const PUBLIC_KEYS = new Set(["hero_media", "social_links", "contact_info"]);

export const siteSettingsService = {
  async get<T = any>(key: string): Promise<T | null> {
    const { data } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", key)
      .single();
    return data?.value as T ?? null;
  },

  async set(key: string, value: any): Promise<void> {
    const row: Record<string, any> = { key, value, updated_at: new Date().toISOString() };
    if (PUBLIC_KEYS.has(key)) row.is_public = true;
    const { error } = await supabase
      .from("site_settings")
      .upsert(row, { onConflict: "key" });
    if (error) throw error;
  },

  async uploadMedia(file: File, path: string): Promise<string> {
    const { error } = await supabase.storage
      .from("site-media")
      .upload(path, file, { upsert: true });
    if (error) throw error;
    const { data } = supabase.storage.from("site-media").getPublicUrl(path);
    return data.publicUrl;
  },
};
