import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Star, Shield, Users, MapPin, Clock, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import heroImage from "@/assets/hero-safari.jpg";
import { mockPackages, mockTestimonials, mockDestinations } from "@/data/mockData";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

export default function HomePage() {
  const featured = mockPackages.filter((p) => p.featured);

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden">
        <img src={heroImage} alt="African savanna at golden hour" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/40 to-foreground/20" />
        <div className="container relative z-10 py-20 text-center text-primary-foreground">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="mb-4 font-body text-sm uppercase tracking-[0.3em] text-primary-foreground/80">
            Authentic African Adventures
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="mx-auto max-w-3xl font-display text-4xl font-bold leading-tight md:text-6xl lg:text-7xl">
            Discover the Wild <br />Beauty of Africa
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="mx-auto mt-6 max-w-xl text-lg text-primary-foreground/80">
            Expert-guided safari experiences across Tanzania, Kenya &amp; South Africa. Create memories that last a lifetime.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }} className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              <Link to="/packages"><Search className="h-4 w-4" /> Explore Safaris</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
              <Link to="/contact">Plan My Trip</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ===== FEATURED PACKAGES ===== */}
      <section className="bg-background py-16 md:py-24">
        <div className="container">
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Handpicked Journeys</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-foreground md:text-4xl">Featured Safari Packages</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((pkg, i) => (
              <motion.div key={pkg.id} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                <Link to={`/packages/${pkg.slug}`}>
                  <Card className="group overflow-hidden border-border/50 transition-shadow hover:shadow-lg">
                    <div className="relative h-56 overflow-hidden">
                      <img src={pkg.images[0]} alt={pkg.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <Badge className="absolute left-3 top-3 bg-primary text-primary-foreground">{pkg.destination}</Badge>
                    </div>
                    <CardContent className="p-5">
                      <h3 className="font-display text-lg font-semibold text-foreground">{pkg.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{pkg.shortDescription}</p>
                      <div className="mt-4 flex items-center justify-between text-sm">
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{pkg.duration} days</span>
                          <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 text-safari-gold" />{pkg.rating}</span>
                        </div>
                        <span className="font-display text-lg font-bold text-primary">${pkg.price.toLocaleString()}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button asChild variant="outline" size="lg">
              <Link to="/packages">View All Packages <ChevronRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ===== WHY CHOOSE US ===== */}
      <section className="bg-secondary/50 py-16 md:py-24">
        <div className="container">
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Why Tembo Safari</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-foreground md:text-4xl">Experience the Difference</h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Shield, title: "Expert Guides", desc: "Certified, local guides with decades of bush experience and deep wildlife knowledge." },
              { icon: Users, title: "Small Groups", desc: "Intimate group sizes ensure personalized attention and minimal environmental impact." },
              { icon: MapPin, title: "Prime Locations", desc: "Access to the best wildlife hotspots across East and Southern Africa." },
              { icon: Star, title: "5-Star Service", desc: "Premium lodges, gourmet dining, and seamless logistics from start to finish." },
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

      {/* ===== DESTINATIONS ===== */}
      <section className="bg-background py-16 md:py-24">
        <div className="container">
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Where Adventure Awaits</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-foreground md:text-4xl">Popular Destinations</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {mockDestinations.map((dest, i) => (
              <motion.div key={dest.id} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                <Link to="/destinations" className="group relative block h-64 overflow-hidden rounded-lg">
                  <img src={dest.image} alt={dest.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
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

      {/* ===== TESTIMONIALS ===== */}
      <section className="bg-secondary/50 py-16 md:py-24">
        <div className="container">
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Traveler Stories</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-foreground md:text-4xl">What Our Guests Say</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {mockTestimonials.map((t, i) => (
              <motion.div key={t.id} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                <Card className="h-full border-border/50">
                  <CardContent className="flex h-full flex-col p-6">
                    <div className="mb-3 flex gap-0.5">
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <Star key={j} className="h-4 w-4 fill-safari-gold text-safari-gold" />
                      ))}
                    </div>
                    <p className="flex-1 text-sm italic text-muted-foreground">"{t.text}"</p>
                    <div className="mt-4 border-t border-border pt-4">
                      <p className="font-display text-sm font-semibold text-foreground">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.location} · {t.packageTitle}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="relative overflow-hidden bg-primary py-16 md:py-24">
        <div className="container relative z-10 text-center">
          <h2 className="font-display text-3xl font-bold text-primary-foreground md:text-4xl">Ready for Your African Adventure?</h2>
          <p className="mx-auto mt-4 max-w-lg text-primary-foreground/80">
            Let our experts craft the perfect safari itinerary for you. Contact us today to start planning.
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
