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

    const userId = claimsData.claims.sub;

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Get user's past bookings
    const { data: bookings } = await supabase
      .from("bookings")
      .select("package_id, packages(destination_id, difficulty)")
      .eq("user_id", userId);

    const bookedPackageIds = (bookings || []).map((b: any) => b.package_id);

    let recommendations: any[] = [];

    if (bookings && bookings.length > 0) {
      // Extract preferred destinations and difficulties
      const destIds = [...new Set(bookings.map((b: any) => b.packages?.destination_id).filter(Boolean))];
      const difficulties = [...new Set(bookings.map((b: any) => b.packages?.difficulty).filter(Boolean))];

      // Find matching published packages excluding already booked
      let query = supabase
        .from("packages")
        .select("*, destinations(name)")
        .eq("status", "published")
        .order("rating", { ascending: false })
        .limit(6);

      if (bookedPackageIds.length > 0) {
        // Filter out booked packages manually after fetch since .not('in') with array can be tricky
      }

      if (destIds.length > 0) {
        query = query.in("destination_id", destIds);
      }

      const { data } = await query;
      recommendations = (data || []).filter((p: any) => !bookedPackageIds.includes(p.id));

      // If not enough, fill with top-rated
      if (recommendations.length < 6) {
        const { data: fallback } = await supabase
          .from("packages")
          .select("*, destinations(name)")
          .eq("status", "published")
          .order("rating", { ascending: false })
          .limit(6);

        const existingIds = new Set(recommendations.map((r: any) => r.id));
        for (const pkg of fallback || []) {
          if (!existingIds.has(pkg.id) && !bookedPackageIds.includes(pkg.id)) {
            recommendations.push(pkg);
            if (recommendations.length >= 6) break;
          }
        }
      }
    } else {
      // No history — return featured/top-rated
      const { data } = await supabase
        .from("packages")
        .select("*, destinations(name)")
        .eq("status", "published")
        .order("featured", { ascending: false })
        .order("rating", { ascending: false })
        .limit(6);

      recommendations = data || [];
    }

    // Map to frontend-friendly shape
    const result = recommendations.slice(0, 6).map((p: any) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      shortDescription: p.short_description,
      images: p.images || [],
      duration: p.duration,
      destination: p.destinations?.name || "",
      priceMin: Number(p.price_min),
      priceMax: Number(p.price_max),
      rating: Number(p.rating),
      difficulty: p.difficulty,
    }));

    return new Response(JSON.stringify({ recommendations: result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
