import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { bookingService } from "@/services/bookingService";
import { wishlistService } from "@/services/wishlistService";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, Heart, MapPin, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

export default function CustomerDashboard() {
  const { profile, user } = useAuth();

  const { data: bookings = [] } = useQuery({
    queryKey: ["my-bookings"],
    queryFn: () => bookingService.getMyBookings(),
  });

  const { data: wishlist = [] } = useQuery({
    queryKey: ["my-wishlist"],
    queryFn: () => wishlistService.getAll(),
  });

  const { data: recommendations = [] } = useQuery({
    queryKey: ["recommendations", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("recommendation-engine", {
        body: { userId: user?.id },
      });
      if (error) return [];
      return data?.recommendations || [];
    },
    enabled: !!user,
  });

  const upcomingBookings = bookings.filter((b) => b.status !== "cancelled" && new Date(b.startDate) > new Date());
  const totalSpent = bookings.filter((b) => b.paymentStatus === "paid").reduce((sum, b) => sum + b.totalAmount, 0);

  const stats = [
    { label: "Total Trips", value: bookings.length, icon: MapPin },
    { label: "Upcoming", value: upcomingBookings.length, icon: Calendar },
    { label: "Wishlist", value: wishlist.length, icon: Heart },
    { label: "Total Spent", value: `$${totalSpent.toLocaleString()}`, icon: TrendingUp },
  ];

  return (
    <motion.div className="space-y-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Welcome */}
      <div className="rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 md:p-8">
        <h1 className="font-display text-2xl font-bold text-foreground">
          Welcome back, {profile?.fullName || "Explorer"}! 🌍
        </h1>
        <p className="mt-1 text-muted-foreground">Here's what's happening with your safari adventures.</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className="border-border/50">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Upcoming bookings */}
      <Card className="border-border/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Upcoming Adventures</CardTitle>
          <Button asChild variant="ghost" size="sm"><Link to="/dashboard/bookings">View All</Link></Button>
        </CardHeader>
        <CardContent>
          {upcomingBookings.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">No upcoming trips yet.</p>
              <Button asChild className="mt-3" size="sm"><Link to="/packages">Explore Packages</Link></Button>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingBookings.slice(0, 3).map((b) => (
                <div key={b.id} className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div>
                    <p className="font-medium text-foreground">{b.packageTitle || "Safari Package"}</p>
                    <p className="text-xs text-muted-foreground">{format(new Date(b.startDate), "MMM d")} – {format(new Date(b.endDate), "MMM d, yyyy")}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${b.status === "confirmed" ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"}`}>
                    {b.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recommended */}
      {recommendations.length > 0 && (
        <Card className="border-border/50">
          <CardHeader><CardTitle className="text-base">Recommended For You</CardTitle></CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recommendations.slice(0, 3).map((pkg: any) => (
                <Link key={pkg.id} to={`/packages/${pkg.slug}`} className="group rounded-lg border border-border overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-28 overflow-hidden">
                    <img src={pkg.images[0] || "/placeholder.svg"} alt={pkg.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                  </div>
                  <div className="p-3">
                    <p className="font-display text-sm font-semibold text-foreground">{pkg.title}</p>
                    <p className="text-xs text-muted-foreground">{pkg.duration} days · {pkg.destination}</p>
                    <p className="mt-1 text-sm font-semibold text-primary">${pkg.priceMin.toLocaleString()} – ${pkg.priceMax.toLocaleString()}</p>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}
