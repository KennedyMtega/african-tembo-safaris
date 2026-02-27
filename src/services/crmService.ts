import { supabase } from "@/integrations/supabase/client";

export interface CRMContact {
  id: string;
  userId: string | null;
  name: string;
  email: string;
  phone: string | null;
  source: string;
  status: string;
  notes: string | null;
  tags: string[];
  lastInteraction: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CRMInteraction {
  id: string;
  contactId: string;
  type: string;
  summary: string | null;
  createdAt: string;
}

function mapContact(row: any): CRMContact {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    source: row.source,
    status: row.status,
    notes: row.notes,
    tags: row.tags || [],
    lastInteraction: row.last_interaction,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapInteraction(row: any): CRMInteraction {
  return {
    id: row.id,
    contactId: row.contact_id,
    type: row.type,
    summary: row.summary,
    createdAt: row.created_at,
  };
}

export const crmService = {
  async getContacts(filters?: { status?: string; source?: string; search?: string }): Promise<CRMContact[]> {
    let q = supabase.from("crm_contacts").select("*").order("created_at", { ascending: false });
    if (filters?.status) q = q.eq("status", filters.status);
    if (filters?.source) q = q.eq("source", filters.source);
    if (filters?.search) q = q.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
    const { data, error } = await q;
    if (error) throw error;
    return (data || []).map(mapContact);
  },

  async getContact(id: string): Promise<CRMContact | null> {
    const { data, error } = await supabase.from("crm_contacts").select("*").eq("id", id).single();
    if (error) return null;
    return mapContact(data);
  },

  async getInteractions(contactId: string): Promise<CRMInteraction[]> {
    const { data, error } = await supabase
      .from("crm_interactions")
      .select("*")
      .eq("contact_id", contactId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data || []).map(mapInteraction);
  },

  async createContact(contact: { name: string; email: string; phone?: string; source?: string; notes?: string }): Promise<void> {
    const { error } = await supabase.from("crm_contacts").insert({
      name: contact.name,
      email: contact.email,
      phone: contact.phone || null,
      source: contact.source || "manual",
      notes: contact.notes || null,
    });
    if (error) throw error;
  },

  async updateContact(id: string, updates: Partial<{ name: string; email: string; phone: string; status: string; notes: string; tags: string[] }>): Promise<void> {
    const { error } = await supabase.from("crm_contacts").update({ ...updates, updated_at: new Date().toISOString() }).eq("id", id);
    if (error) throw error;
  },

  async deleteContact(id: string): Promise<void> {
    const { error } = await supabase.from("crm_contacts").delete().eq("id", id);
    if (error) throw error;
  },

  async addInteraction(contactId: string, type: string, summary: string): Promise<void> {
    const { error: intError } = await supabase.from("crm_interactions").insert({
      contact_id: contactId,
      type,
      summary,
    });
    if (intError) throw intError;
    await supabase.from("crm_contacts").update({ last_interaction: new Date().toISOString() }).eq("id", contactId);
  },

  async findOrCreateByEmail(email: string, name: string, source: string): Promise<string> {
    const { data: existing } = await supabase
      .from("crm_contacts")
      .select("id")
      .eq("email", email)
      .limit(1)
      .single();
    if (existing) return existing.id;
    const { data, error } = await supabase.from("crm_contacts").insert({
      name,
      email,
      source,
    }).select("id").single();
    if (error) throw error;
    return data.id;
  },

  async getStats(): Promise<{ total: number; leads: number; prospects: number; customers: number; newThisMonth: number }> {
    const { data: all } = await supabase.from("crm_contacts").select("status, created_at");
    const contacts = all || [];
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    return {
      total: contacts.length,
      leads: contacts.filter(c => c.status === "lead").length,
      prospects: contacts.filter(c => c.status === "prospect").length,
      customers: contacts.filter(c => c.status === "customer").length,
      newThisMonth: contacts.filter(c => c.created_at >= monthStart).length,
    };
  },
};
