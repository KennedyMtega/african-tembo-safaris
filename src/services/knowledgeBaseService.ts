import { supabase } from "@/integrations/supabase/client";

export interface KBArticle {
  id: string;
  title: string;
  content: string;
  category: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

function map(row: any): KBArticle {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    category: row.category,
    tags: row.tags || [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const knowledgeBaseService = {
  async getAll(): Promise<KBArticle[]> {
    const { data, error } = await supabase
      .from("knowledge_base")
      .select("*")
      .order("updated_at", { ascending: false });
    if (error) throw error;
    return (data || []).map(map);
  },

  async create(article: { title: string; content: string; category?: string; tags?: string[] }): Promise<void> {
    const { error } = await supabase.from("knowledge_base").insert({
      title: article.title,
      content: article.content,
      category: article.category || null,
      tags: article.tags || [],
    });
    if (error) throw error;
  },

  async update(id: string, article: { title: string; content: string; category?: string; tags?: string[] }): Promise<void> {
    const { error } = await supabase
      .from("knowledge_base")
      .update({
        title: article.title,
        content: article.content,
        category: article.category || null,
        tags: article.tags || [],
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);
    if (error) throw error;
  },

  async remove(id: string): Promise<void> {
    const { error } = await supabase.from("knowledge_base").delete().eq("id", id);
    if (error) throw error;
  },
};
