import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Star, Shield, Users, MapPin, Clock, ChevronRight, Footprints, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import heroImageFallback from "@/assets/hero-safari.jpg";
import { packageService } from "@/services/packageService";
import { destinationService } from "@/services/destinationService";
import { siteSettingsService, type HeroMedia } from "@/services/siteSettingsService";
import { useQuery } from "@tanstack/react-query";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

function formatPrice(min: number, max: number): string {
  if (min === max || max === 0) return `$${min.toLocaleString()}`;
  return `$${min.toLocaleString()} – $${max.toLocaleString()}`;
}

export default function HomePage() {
  const { data: featured = [] } = useQuery({ queryKey: ["packages-featured"], queryFn: () => packageService.getFeatured() });
  const { data: destinations = [] } = useQuery({ queryKey: ["destinations"], queryFn: () => destinationService.getAll() });
  const { data: heroMedia } = useQuery({ queryKey: ["hero-media"], queryFn: () => siteSettingsService.get<HeroMedia>("hero_media") });

  const showVideo = heroMedia?.mode === "video" && heroMedia.videoUrl;
  const heroSrc = heroMedia?.imageUrl || heroImageFallback;

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden">
        {showVideo ? (
          <video src={heroMedia!.videoUrl} autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <img src={heroSrc} alt="African savanna at golden hour with elephants" className="absolute inset-0 h-full w-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/40 to-foreground/20" />
        <div className="container relative z-10 py-20 text-center text-primary-foreground">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="mb-4 font-body text-sm uppercase tracking-[0.3em] text-primary-foreground/80">
            The Wild Is Waiting for You
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="mx-auto max-w-3xl font-display text-4xl font-bold leading-tight md:text-6xl lg:text-7xl">
            Feel the Heartbeat <br />of Africa
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="mx-auto mt-6 max-w-xl text-lg text-primary-foreground/80">
            Expert-led, ethical safari experiences through the heart of Tanzania. From the sweeping Serengeti to the ancient Ngorongoro Crater — carry a piece of Africa's soul with you.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }} className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              <Link to="/packages"><Search className="h-4 w-4" /> Explore Safaris</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-primary-foreground/70 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20">
              <Link to="/contact">Plan My Trip</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ===== TEMBO PHILOSOPHY ===== */}
      <section className="bg-secondary/50 py-16 md:py-24">
        <div className="container">
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">The Tembo Philosophy</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-foreground md:text-4xl">Why Journey With Us</h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              "Tembo" means elephant in Swahili — a symbol of wisdom, family, and an unbreakable bond with the land. Just as the elephant creates paths for others to follow, we pioneer authentic travel across the African continent.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Shield, title: "Unrivaled Expertise", desc: "Our guides are naturalists and storytellers who bring the wilderness to life with every track and every call." },
              { icon: Users, title: "Deep Connection", desc: "We introduce you to the heartbeat of Africa — local cultures, hidden trails, and stories that don't make it into guidebooks." },
              { icon: Footprints, title: "A Gentle Footprint", desc: "Sustainable tourism isn't a buzzword — it's our commitment to keeping these landscapes pristine for generations." },
              { icon: Eye, title: "Wildlife First", desc: "Ethical viewing practices always. We observe, we admire, but we never disturb. We are guests in their home." },
            ].map((item, i) => (
              <motion.div key={item.title} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED PACKAGES ===== */}
      <section className="bg-background py-16 md:py-24">
        <div className="container">
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Handpicked Journeys</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-foreground md:text-4xl">Featured Safari Packages</h2>
          </div>
          {featured.length === 0 ? (
            <p className="py-10 text-center text-muted-foreground">No featured packages yet. Check back soon!</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((pkg, i) => (
                <motion.div key={pkg.id} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                  <Link to={`/packages/${pkg.slug}`}>
                    <Card className="group overflow-hidden border-border/50 transition-shadow hover:shadow-lg">
                      <div className="relative h-56 overflow-hidden">
                        <img src={pkg.images[0] || "/placeholder.svg"} alt={pkg.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        <Badge className="absolute left-3 top-3 bg-primary text-primary-foreground">{pkg.destination}</Badge>
                      </div>
                      <CardContent className="p-5">
                        <h3 className="font-display text-lg font-semibold text-foreground">{pkg.title}</h3>
                        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{pkg.shortDescription}</p>
                        <div className="mt-4 flex items-center justify-between text-sm">
                          <div className="flex items-center gap-3 text-muted-foreground">
                            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{pkg.duration} days</span>
                            {pkg.rating > 0 && <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 text-safari-gold" />{pkg.rating}</span>}
                          </div>
                          <span className="font-display text-lg font-bold text-primary">{formatPrice(pkg.priceMin, pkg.priceMax)}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
          <div className="mt-10 text-center">
            <Button asChild variant="outline" size="lg">
              <Link to="/packages">View All Packages <ChevronRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ===== DESTINATIONS ===== */}
      {destinations.length > 0 && (
        <section className="bg-background py-16 md:py-24">
          <div className="container">
            <div className="mb-10 text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">Where Adventure Awaits</p>
              <h2 className="mt-2 font-display text-3xl font-bold text-foreground md:text-4xl">Popular Destinations</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {destinations.map((dest, i) => (
                <motion.div key={dest.id} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                  <Link to="/destinations" className="group relative block h-64 overflow-hidden rounded-lg">
                    <img src={dest.imageUrl || "/placeholder.svg"} alt={dest.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
                    <div className="absolute bottom-0 p-4 text-primary-foreground">
                      <h3 className="font-display text-lg font-bold">{dest.name}</h3>
                      <p className="text-sm text-primary-foreground/80">{dest.country} · {dest.packageCount} safaris</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== CEO QUOTE ===== */}
      <section className="bg-secondary/30 py-16 md:py-24">
        <div className="container max-w-3xl text-center">
          <motion.blockquote initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="space-y-4">
            <p className="font-display text-xl italic leading-relaxed text-foreground md:text-2xl">
              "From the moment you step off the plane in Arusha to the final sunset over the Serengeti, my team and I are dedicated to your safety, your comfort, and your inspiration."
            </p>
            <footer className="text-sm text-muted-foreground">
              <strong className="text-foreground">Mohamedi Shabani Mgomi</strong> — Founder &amp; CEO, African Tembo Safari
            </footer>
          </motion.blockquote>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="relative overflow-hidden bg-primary py-16 md:py-24">
        <div className="container relative z-10 text-center">
          <h2 className="font-display text-3xl font-bold text-primary-foreground md:text-4xl">Ready for Your African Adventure?</h2>
          <p className="mx-auto mt-4 max-w-lg text-primary-foreground/80">
            When you choose African Tembo Safaris, you aren't just booking a tour — you're joining a herd. Let our experts craft the perfect itinerary for you.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" variant="secondary">
              <Link to="/packages">Browse Packages</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
