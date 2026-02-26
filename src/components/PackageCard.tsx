import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, Star, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { SafariPackage } from "@/types";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

interface PackageCardProps {
  pkg: SafariPackage;
  index?: number;
}

function formatPrice(min: number, max: number): string {
  if (min === max || max === 0) return `$${min.toLocaleString()}`;
  return `$${min.toLocaleString()} – $${max.toLocaleString()}`;
}

export function PackageCard({ pkg, index = 0 }: PackageCardProps) {
  return (
    <motion.div custom={index} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
      <Link to={`/packages/${pkg.slug}`}>
        <Card className="group overflow-hidden border-border/50 transition-shadow hover:shadow-lg h-full">
          <div className="relative h-56 overflow-hidden">
            <img src={pkg.images[0] || "/placeholder.svg"} alt={pkg.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <Badge className="absolute left-3 top-3 bg-primary text-primary-foreground">{pkg.destination}</Badge>
            <Badge variant="outline" className="absolute right-3 top-3 bg-background/80 text-foreground">{pkg.difficulty}</Badge>
          </div>
          <CardContent className="p-5">
            <h3 className="font-display text-lg font-semibold text-foreground">{pkg.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{pkg.shortDescription}</p>
            <div className="mt-4 flex items-center justify-between text-sm">
              <div className="flex items-center gap-3 text-muted-foreground">
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{pkg.duration} days</span>
                {pkg.rating > 0 && <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 text-safari-gold" />{pkg.rating}</span>}
              </div>
              <span className="font-display text-base font-bold text-primary">{formatPrice(pkg.priceMin, pkg.priceMax)}</span>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
