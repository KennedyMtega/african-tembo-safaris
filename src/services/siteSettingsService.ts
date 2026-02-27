import { supabase } from "@/integrations/supabase/client";

export interface HeroMedia {
  mode: "image" | "video";
  imageUrl?: string;
  videoUrl?: string;
}

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
    const { error } = await supabase
      .from("site_settings")
      .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" });
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
