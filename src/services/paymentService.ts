import { supabase } from "@/integrations/supabase/client";
import type { Payment } from "@/types";

function mapPayment(row: any): Payment {
  return {
    id: row.id,
    bookingId: row.booking_id,
    bookingRef: row.booking_ref || "",
    amount: Number(row.amount),
    currency: row.currency,
    status: row.status,
    method: row.method || "",
    paidAt: row.paid_at,
    createdAt: row.created_at,
  };
}

export const paymentService = {
  async getAll(): Promise<Payment[]> {
    const { data, error } = await supabase.from("payments").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return (data || []).map(mapPayment);
  },

  async getByBooking(bookingId: string): Promise<Payment | undefined> {
    const { data, error } = await supabase.from("payments").select("*").eq("booking_id", bookingId).single();
    if (error || !data) return undefined;
    return mapPayment(data);
  },
};
