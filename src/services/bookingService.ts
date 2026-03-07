import { supabase } from "@/integrations/supabase/client";

async function notifyBooking(bookingId: string, action: string) {
  try {
    await supabase.functions.invoke("booking-notification", {
      body: { bookingId, action },
    });
  } catch (e) {
    console.warn("Booking notification failed:", e);
  }
}
import type { Booking, Traveler } from "@/types";

function mapBooking(row: any, travelers: any[] = [], packageTitle?: string): Booking {
  return {
    id: row.id,
    bookingRef: row.booking_ref,
    packageId: row.package_id,
    packageTitle: packageTitle || row.packages?.title || "",
    userId: row.user_id,
    status: row.status,
    startDate: row.start_date,
    endDate: row.end_date,
    totalAmount: Number(row.total_amount),
    paymentStatus: row.payment_status,
    specialRequests: row.special_requests,
    createdAt: row.created_at,
    travelers: travelers.map((t: any) => ({
      firstName: t.first_name,
      lastName: t.last_name,
      email: t.email,
      phone: t.phone || "",
      dietaryNeeds: t.dietary_needs,
      specialNeeds: t.special_needs,
    })),
  };
}

export const bookingService = {
  async getAll(): Promise<Booking[]> {
    const { data, error } = await supabase
      .from("bookings")
      .select("*, packages(title), booking_travelers(*)")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data || []).map((row: any) =>
      mapBooking(row, row.booking_travelers || [], row.packages?.title)
    );
  },

  async getByUser(userId: string): Promise<Booking[]> {
    const { data, error } = await supabase
      .from("bookings")
      .select("*, packages(title), booking_travelers(*)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data || []).map((row: any) =>
      mapBooking(row, row.booking_travelers || [], row.packages?.title)
    );
  },

  async getMyBookings(): Promise<Booking[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    return bookingService.getByUser(user.id);
  },

  async create(booking: {
    packageId: string;
    userId: string;
    startDate: string;
    endDate: string;
    totalAmount: number;
    depositAmount?: number;
    specialRequests?: string;
    travelers: Traveler[];
  }): Promise<Booking> {
    const ref = `TEM-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9999)).padStart(4, "0")}`;
    
    const { data, error } = await supabase.from("bookings").insert({
      booking_ref: ref,
      package_id: booking.packageId,
      user_id: booking.userId,
      start_date: booking.startDate,
      end_date: booking.endDate,
      total_amount: booking.totalAmount,
      deposit_amount: booking.depositAmount || 0,
      special_requests: booking.specialRequests || null,
      status: "pending",
      payment_status: "pending",
    }).select("*, packages(title)").single();
    if (error) throw error;

    // Insert travelers
    if (booking.travelers.length > 0) {
      await supabase.from("booking_travelers").insert(
        booking.travelers.map((t) => ({
          booking_id: data.id,
          first_name: t.firstName,
          last_name: t.lastName,
          email: t.email,
          phone: t.phone || null,
          dietary_needs: t.dietaryNeeds || null,
          special_needs: t.specialNeeds || null,
        }))
      );
    }

    const result = mapBooking(data, [], data.packages?.title);
    notifyBooking(data.id, "created");
    return result;
  },

  async updateStatus(id: string, status: Booking["status"]): Promise<void> {
    const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
    if (error) throw error;
    notifyBooking(id, status === "confirmed" ? "confirmed" : status === "cancelled" ? "cancelled" : status === "completed" ? "completed" : status);
  },
};
