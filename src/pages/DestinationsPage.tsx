import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, ChevronRight } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { destinationService } from "@/services/destinationService";
import { useQuery } from "@tanstack/react-query";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

export default function DestinationsPage() {
  const { data: destinations = [], isLoading } = useQuery({ queryKey: ["destinations"], queryFn: () => destinationService.getAll() });

  return (
    <>
    <SEOHead title="Destinations" description="Explore Tanzania's most iconic safari destinations — Serengeti, Ngorongoro Crater, Kilimanjaro, Zanzibar, Tarangire, Lake Manyara and more." />
    <section className="bg-background py-12 md:py-20">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Explore Africa</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-foreground md:text-4xl">Our Destinations</h1>
          <p className="mt-2 max-w-xl text-muted-foreground">Discover the most spectacular safari destinations across East and Southern Africa.</p>
        </motion.div>

        {isLoading ? (
          <p className="py-20 text-center text-muted-foreground">Loading destinations...</p>
        ) : destinations.length === 0 ? (
          <p className="py-20 text-center text-muted-foreground">No destinations available yet.</p>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {destinations.map((dest, i) => (
              <motion.div key={dest.id} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                <Card className="group overflow-hidden border-border/50 hover:shadow-lg transition-shadow">
                  <div className="relative h-56 overflow-hidden">
                    <img src={dest.imageUrl || "/placeholder.svg"} alt={dest.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                    <div className="absolute bottom-0 p-5 text-primary-foreground">
                      <h2 className="font-display text-2xl font-bold">{dest.name}</h2>
                      <p className="flex items-center gap-1 text-sm text-primary-foreground/80"><MapPin className="h-3.5 w-3.5" />{dest.country}</p>
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <p className="text-sm text-muted-foreground">{dest.description}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">{dest.packageCount} safari packages</span>
                      <Button asChild variant="ghost" size="sm">
                        <Link to={`/packages?dest=${dest.name}`}>View Packages <ChevronRight className="ml-1 h-3.5 w-3.5" /></Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
    </>
  );
}
