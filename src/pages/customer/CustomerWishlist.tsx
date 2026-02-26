import { useQuery, useQueryClient } from "@tanstack/react-query";
import { wishlistService } from "@/services/wishlistService";
import { packageService } from "@/services/packageService";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Heart, Trash2 } from "lucide-react";

export default function CustomerWishlist() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: wishlistItems = [] } = useQuery({
    queryKey: ["my-wishlist"],
    queryFn: () => wishlistService.getAll(),
  });

  const { data: allPackages = [] } = useQuery({
    queryKey: ["packages"],
    queryFn: () => packageService.getAll(),
  });

  const wishlistedPackages = allPackages.filter((pkg) =>
    wishlistItems.some((w: any) => w.package_id === pkg.id)
  );

  const handleRemove = async (packageId: string) => {
    await wishlistService.remove(packageId);
    queryClient.invalidateQueries({ queryKey: ["my-wishlist"] });
    toast({ title: "Removed from wishlist" });
  };

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="font-display text-xl font-bold text-foreground">My Wishlist</h1>

      {wishlistedPackages.length === 0 ? (
        <Card className="border-border/50">
          <CardContent className="py-12 text-center">
            <Heart className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-3 text-muted-foreground">Your wishlist is empty.</p>
            <Button asChild className="mt-3" size="sm"><Link to="/packages">Browse Packages</Link></Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {wishlistedPackages.map((pkg) => (
            <Card key={pkg.id} className="group border-border/50 overflow-hidden">
              <div className="relative h-36 overflow-hidden">
                <img src={pkg.images[0] || "/placeholder.svg"} alt={pkg.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                <button onClick={() => handleRemove(pkg.id)}
                  className="absolute right-2 top-2 rounded-full bg-card/80 p-1.5 text-destructive hover:bg-card">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <CardContent className="p-4 space-y-2">
                <h3 className="font-display text-sm font-semibold text-foreground">{pkg.title}</h3>
                <p className="text-xs text-muted-foreground">{pkg.duration} days · {pkg.destination}</p>
                <p className="text-sm font-semibold text-primary">${pkg.priceMin.toLocaleString()} – ${pkg.priceMax.toLocaleString()}</p>
                <Button asChild size="sm" className="w-full mt-1"><Link to={`/book/${pkg.slug}`}>Book Now</Link></Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </motion.div>
  );
}
