import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, Users, Star, Check, X, ChevronRight } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { packageService } from "@/services/packageService";
import { PackageCard } from "@/components/PackageCard";
import { useQuery } from "@tanstack/react-query";

function formatPrice(min: number, max: number): string {
  if (min === max || max === 0) return `$${min.toLocaleString()}`;
  return `$${min.toLocaleString()} – $${max.toLocaleString()}`;
}

export default function PackageDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: pkg, isLoading } = useQuery({ queryKey: ["package", slug], queryFn: () => packageService.getBySlug(slug!) });
  const { data: allPackages = [] } = useQuery({ queryKey: ["packages"], queryFn: () => packageService.getAll() });

  if (isLoading) return <div className="container py-20 text-center"><p className="text-muted-foreground">Loading...</p></div>;
  if (!pkg) return <div className="container py-20 text-center"><h1 className="font-display text-2xl font-bold text-foreground">Package not found</h1><Button asChild className="mt-4"><Link to="/packages">Back to Packages</Link></Button></div>;

  const related = allPackages.filter((p) => p.id !== pkg.id).slice(0, 3);
  const [mainImage, ...thumbs] = pkg.images.length > 0 ? pkg.images : ["/placeholder.svg"];

  return (
    <section className="bg-background py-10 md:py-16">
      <div className="container">
        <nav className="mb-6 flex items-center gap-1 text-sm text-muted-foreground">
          <Link to="/packages" className="hover:text-primary">Packages</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground">{pkg.title}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="overflow-hidden rounded-lg">
                <img src={mainImage} alt={pkg.title} className="h-72 w-full object-cover md:h-96" onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }} />
              </div>
              {thumbs.length > 0 && (
                <div className="mt-3 flex gap-3">
                  {thumbs.map((img, i) => (
                    <img key={i} src={img} alt="" className="h-20 w-28 rounded-md object-cover border border-border" onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }} />
                  ))}
                </div>
              )}
            </motion.div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge className="bg-primary text-primary-foreground">{pkg.destination}</Badge>
                <Badge variant="outline">{pkg.difficulty}</Badge>
                {pkg.tags.map((tag) => <Badge key={tag} variant="secondary">{tag}</Badge>)}
              </div>
              <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">{pkg.title}</h1>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{pkg.duration} days</span>
                <span className="flex items-center gap-1"><Users className="h-4 w-4" />Max {pkg.maxGroupSize}</span>
                {pkg.rating > 0 && <span className="flex items-center gap-1"><Star className="h-4 w-4 text-safari-gold" />{pkg.rating} ({pkg.reviewCount} reviews)</span>}
              </div>
            </div>

            <p className="text-muted-foreground leading-relaxed">{pkg.description}</p>

            {pkg.highlights.length > 0 && (
              <div>
                <h2 className="font-display text-xl font-bold text-foreground mb-3">Highlights</h2>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {pkg.highlights.map((h) => <li key={h} className="flex items-start gap-2 text-sm text-muted-foreground"><Check className="mt-0.5 h-4 w-4 shrink-0 text-safari-green" />{h}</li>)}
                </ul>
              </div>
            )}

            {pkg.itinerary.length > 0 && (
              <div>
                <h2 className="font-display text-xl font-bold text-foreground mb-3">Day-by-Day Itinerary</h2>
                <Accordion type="single" collapsible className="w-full">
                  {pkg.itinerary.map((day) => (
                    <AccordionItem key={day.day} value={`day-${day.day}`}>
                      <AccordionTrigger className="text-sm font-semibold text-foreground">
                        Day {day.day}: {day.title}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground space-y-2">
                        <p>{day.description}</p>
                        {day.meals.length > 0 && <p><strong className="text-foreground">Meals:</strong> {day.meals.join(", ")}</p>}
                        {day.accommodation && <p><strong className="text-foreground">Accommodation:</strong> {day.accommodation}</p>}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            )}

            <div className="grid gap-6 sm:grid-cols-2">
              {pkg.includes.length > 0 && (
                <div>
                  <h3 className="font-display text-lg font-bold text-foreground mb-2">What's Included</h3>
                  <ul className="space-y-1.5">{pkg.includes.map((i) => <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground"><Check className="mt-0.5 h-4 w-4 shrink-0 text-safari-green" />{i}</li>)}</ul>
                </div>
              )}
              {pkg.excludes.length > 0 && (
                <div>
                  <h3 className="font-display text-lg font-bold text-foreground mb-2">What's Excluded</h3>
                  <ul className="space-y-1.5">{pkg.excludes.map((e) => <li key={e} className="flex items-start gap-2 text-sm text-muted-foreground"><X className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />{e}</li>)}</ul>
                </div>
              )}
            </div>
          </div>

          {/* Right: Pricing sidebar */}
          <div>
            <Card className="sticky top-24 border-border/50">
              <CardContent className="p-6 space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">From</p>
                  <p className="font-display text-3xl font-bold text-primary">{formatPrice(pkg.priceMin, pkg.priceMax)}</p>
                  <p className="text-sm text-muted-foreground">per person</p>
                </div>
                {pkg.groupPriceMin && (
                  <div className="rounded-md bg-secondary/50 p-3">
                    <p className="text-sm font-semibold text-foreground">Group Discount</p>
                    <p className="text-sm text-muted-foreground">{formatPrice(pkg.groupPriceMin, pkg.groupPriceMax || pkg.groupPriceMin)} per person for 4+ travelers</p>
                  </div>
                )}
                <Button asChild size="lg" className="w-full">
                  <Link to={`/book/${pkg.slug}`}>Book Now</Link>
                </Button>
                <p className="text-center text-xs text-muted-foreground">50% deposit required to secure your booking</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="mb-6 font-display text-2xl font-bold text-foreground">You Might Also Like</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p, i) => <PackageCard key={p.id} pkg={p} index={i} />)}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
