import { supabase } from "@/integrations/supabase/client";
import type { SafariPackage, ItineraryDay } from "@/types";

function mapPackage(row: any, destination?: any, itinerary?: any[]): SafariPackage {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description || "",
    shortDescription: row.short_description || "",
    destination: destination?.name || "",
    destinationId: row.destination_id,
    duration: row.duration,
    difficulty: row.difficulty,
    priceMin: Number(row.price_min),
    priceMax: Number(row.price_max),
    groupPriceMin: row.group_price_min ? Number(row.group_price_min) : undefined,
    groupPriceMax: row.group_price_max ? Number(row.group_price_max) : undefined,
    maxGroupSize: row.max_group_size,
    images: row.images || [],
    highlights: row.highlights || [],
    tags: row.tags || [],
    includes: row.includes || [],
    excludes: row.excludes || [],
    itinerary: (itinerary || []).map((it: any) => ({
      id: it.id,
      day: it.day_number,
      title: it.title,
      description: it.description || "",
      meals: it.meals || [],
      accommodation: it.accommodation || "",
    })),
    status: row.status,
    rating: Number(row.rating),
    reviewCount: row.review_count,
    featured: row.featured,
    createdAt: row.created_at,
  };
}

export const packageService = {
  async getAll(): Promise<SafariPackage[]> {
    const { data, error } = await supabase
      .from("packages")
      .select("*, destinations(*)")
      .eq("status", "published")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data || []).map((row: any) => mapPackage(row, row.destinations));
  },

  async getById(id: string): Promise<SafariPackage | undefined> {
    const { data, error } = await supabase
      .from("packages")
      .select("*, destinations(*)")
      .eq("id", id)
      .single();
    if (error || !data) return undefined;
    const { data: itinerary } = await supabase
      .from("package_itinerary")
      .select("*")
      .eq("package_id", id)
      .order("day_number");
    return mapPackage(data, (data as any).destinations, itinerary || []);
  },

  async getBySlug(slug: string): Promise<SafariPackage | undefined> {
    const { data, error } = await supabase
      .from("packages")
      .select("*, destinations(*)")
      .eq("slug", slug)
      .single();
    if (error || !data) return undefined;
    const { data: itinerary } = await supabase
      .from("package_itinerary")
      .select("*")
      .eq("package_id", data.id)
      .order("day_number");
    return mapPackage(data, (data as any).destinations, itinerary || []);
  },

  async getFeatured(): Promise<SafariPackage[]> {
    const { data, error } = await supabase
      .from("packages")
      .select("*, destinations(*)")
      .eq("status", "published")
      .eq("featured", true)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data || []).map((row: any) => mapPackage(row, row.destinations));
  },

  async getAllAdmin(): Promise<SafariPackage[]> {
    const { data, error } = await supabase
      .from("packages")
      .select("*, destinations(*)")
      .order("created_at", { ascending: false });
    if (error) throw error;
    // Fetch all itineraries
    const ids = (data || []).map((d: any) => d.id);
    const { data: itineraries } = await supabase
      .from("package_itinerary")
      .select("*")
      .in("package_id", ids)
      .order("day_number");
    const itMap = new Map<string, any[]>();
    (itineraries || []).forEach((it: any) => {
      if (!itMap.has(it.package_id)) itMap.set(it.package_id, []);
      itMap.get(it.package_id)!.push(it);
    });
    return (data || []).map((row: any) => mapPackage(row, row.destinations, itMap.get(row.id) || []));
  },

  async create(pkg: Partial<SafariPackage>): Promise<SafariPackage> {
    const { data, error } = await supabase.from("packages").insert({
      title: pkg.title || "",
      slug: pkg.slug || "",
      description: pkg.description,
      short_description: pkg.shortDescription,
      destination_id: pkg.destinationId || null,
      duration: pkg.duration || 1,
      difficulty: pkg.difficulty || "moderate",
      price_min: pkg.priceMin || 0,
      price_max: pkg.priceMax || 0,
      group_price_min: pkg.groupPriceMin || null,
      group_price_max: pkg.groupPriceMax || null,
      max_group_size: pkg.maxGroupSize || 10,
      images: pkg.images || [],
      highlights: pkg.highlights || [],
      tags: pkg.tags || [],
      includes: pkg.includes || [],
      excludes: pkg.excludes || [],
      status: pkg.status || "draft",
      featured: pkg.featured || false,
    }).select("*, destinations(*)").single();
    if (error) throw error;

    // Insert itinerary
    if (pkg.itinerary && pkg.itinerary.length > 0) {
      await supabase.from("package_itinerary").insert(
        pkg.itinerary.map((it) => ({
          package_id: data.id,
          day_number: it.day,
          title: it.title,
          description: it.description,
          meals: it.meals,
          accommodation: it.accommodation,
        }))
      );
    }

    return mapPackage(data, (data as any).destinations, []);
  },

  async update(id: string, pkg: Partial<SafariPackage>): Promise<SafariPackage | undefined> {
    const updateData: any = {};
    if (pkg.title !== undefined) updateData.title = pkg.title;
    if (pkg.slug !== undefined) updateData.slug = pkg.slug;
    if (pkg.description !== undefined) updateData.description = pkg.description;
    if (pkg.shortDescription !== undefined) updateData.short_description = pkg.shortDescription;
    if (pkg.destinationId !== undefined) updateData.destination_id = pkg.destinationId;
    if (pkg.duration !== undefined) updateData.duration = pkg.duration;
    if (pkg.difficulty !== undefined) updateData.difficulty = pkg.difficulty;
    if (pkg.priceMin !== undefined) updateData.price_min = pkg.priceMin;
    if (pkg.priceMax !== undefined) updateData.price_max = pkg.priceMax;
    if (pkg.groupPriceMin !== undefined) updateData.group_price_min = pkg.groupPriceMin;
    if (pkg.groupPriceMax !== undefined) updateData.group_price_max = pkg.groupPriceMax;
    if (pkg.maxGroupSize !== undefined) updateData.max_group_size = pkg.maxGroupSize;
    if (pkg.images !== undefined) updateData.images = pkg.images;
    if (pkg.highlights !== undefined) updateData.highlights = pkg.highlights;
    if (pkg.tags !== undefined) updateData.tags = pkg.tags;
    if (pkg.includes !== undefined) updateData.includes = pkg.includes;
    if (pkg.excludes !== undefined) updateData.excludes = pkg.excludes;
    if (pkg.status !== undefined) updateData.status = pkg.status;
    if (pkg.featured !== undefined) updateData.featured = pkg.featured;
    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase.from("packages").update(updateData).eq("id", id).select("*, destinations(*)").single();
    if (error) throw error;

    // Update itinerary if provided
    if (pkg.itinerary) {
      await supabase.from("package_itinerary").delete().eq("package_id", id);
      if (pkg.itinerary.length > 0) {
        await supabase.from("package_itinerary").insert(
          pkg.itinerary.map((it) => ({
            package_id: id,
            day_number: it.day,
            title: it.title,
            description: it.description,
            meals: it.meals,
            accommodation: it.accommodation,
          }))
        );
      }
    }

    return data ? mapPackage(data, (data as any).destinations) : undefined;
  },

  async deletePackage(id: string): Promise<void> {
    const { error } = await supabase.from("packages").delete().eq("id", id);
    if (error) throw error;
  },
};
