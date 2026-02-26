import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate JWT
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const anonClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await anonClient.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Service role client for DB operations
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { bookingId, action } = await req.json();
    if (!bookingId || !action) {
      return new Response(JSON.stringify({ error: "Missing bookingId or action" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Look up booking with package title
    const { data: booking, error: bErr } = await supabase
      .from("bookings")
      .select("*, packages(title)")
      .eq("id", bookingId)
      .single();

    if (bErr || !booking) {
      return new Response(JSON.stringify({ error: "Booking not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const pkgTitle = booking.packages?.title || "Safari Package";
    const ref = booking.booking_ref;

    const actionMessages: Record<string, { userTitle: string; userMsg: string; adminTitle: string; adminMsg: string }> = {
      created: {
        userTitle: "Booking Created",
        userMsg: `Your booking ${ref} for ${pkgTitle} has been created and is pending confirmation.`,
        adminTitle: "New Booking",
        adminMsg: `New booking ${ref} for ${pkgTitle} has been submitted.`,
      },
      confirmed: {
        userTitle: "Booking Confirmed",
        userMsg: `Your booking ${ref} for ${pkgTitle} has been confirmed! Get ready for your adventure.`,
        adminTitle: "Booking Confirmed",
        adminMsg: `Booking ${ref} for ${pkgTitle} has been confirmed.`,
      },
      cancelled: {
        userTitle: "Booking Cancelled",
        userMsg: `Your booking ${ref} for ${pkgTitle} has been cancelled.`,
        adminTitle: "Booking Cancelled",
        adminMsg: `Booking ${ref} for ${pkgTitle} has been cancelled.`,
      },
      completed: {
        userTitle: "Trip Completed",
        userMsg: `Your trip ${ref} for ${pkgTitle} is now complete. We hope you enjoyed it!`,
        adminTitle: "Trip Completed",
        adminMsg: `Booking ${ref} for ${pkgTitle} has been marked as completed.`,
      },
    };

    const msgs = actionMessages[action];
    if (!msgs) {
      return new Response(JSON.stringify({ error: "Invalid action" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Notify booking user
    await supabase.from("notifications").insert({
      user_id: booking.user_id,
      title: msgs.userTitle,
      message: msgs.userMsg,
      type: "booking",
      entity_id: bookingId,
    });

    // Notify all admins
    const { data: adminRoles } = await supabase
      .from("user_roles")
      .select("user_id")
      .eq("role", "admin");

    if (adminRoles && adminRoles.length > 0) {
      await supabase.from("notifications").insert(
        adminRoles.map((r: any) => ({
          user_id: r.user_id,
          title: msgs.adminTitle,
          message: msgs.adminMsg,
          type: "booking",
          entity_id: bookingId,
        }))
      );
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
