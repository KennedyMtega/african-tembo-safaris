import { supabase } from "@/integrations/supabase/client";
import type { Inquiry } from "@/types/admin";

function mapInquiry(row: any): Inquiry {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    email: row.email,
    subject: row.subject || "",
    message: row.message,
    status: row.status,
    priority: row.priority,
    createdAt: row.created_at,
    resolvedAt: row.resolved_at,
  };
}

export const inquiryService = {
  async getAll(): Promise<Inquiry[]> {
    const { data, error } = await supabase.from("inquiries").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return (data || []).map(mapInquiry);
  },

  async create(inquiry: { name: string; email: string; subject: string; message: string; userId?: string }): Promise<void> {
    const { error } = await supabase.from("inquiries").insert({
      name: inquiry.name,
      email: inquiry.email,
      subject: inquiry.subject,
      message: inquiry.message,
      user_id: inquiry.userId || null,
    });
    if (error) throw error;
  },

  async updateStatus(id: string, status: Inquiry["status"]): Promise<void> {
    const update: any = { status };
    if (status === "resolved") update.resolved_at = new Date().toISOString();
    const { error } = await supabase.from("inquiries").update(update).eq("id", id);
    if (error) throw error;
  },
};
