import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { packageService } from "@/services/packageService";
import { PackageCard } from "@/components/PackageCard";
import { PackageFilters } from "@/components/PackageFilters";
import { useQuery } from "@tanstack/react-query";
import SEOHead from "@/components/SEOHead";

export default function PackagesPage() {
  const [search, setSearch] = useState("");
  const [destination, setDestination] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const [sortBy, setSortBy] = useState("popular");

  const { data: packages = [], isLoading } = useQuery({ queryKey: ["packages"], queryFn: () => packageService.getAll() });

  const destinations = [...new Set(packages.map((p) => p.destination))];

  const filtered = useMemo(() => {
    let result = packages.filter((p) => {
      if (destination !== "all" && p.destination !== destination) return false;
      if (difficulty !== "all" && p.difficulty !== difficulty) return false;
      if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.shortDescription.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
    switch (sortBy) {
      case "price-low": result.sort((a, b) => a.priceMin - b.priceMin); break;
      case "price-high": result.sort((a, b) => b.priceMax - a.priceMax); break;
      case "duration": result.sort((a, b) => a.duration - b.duration); break;
      default: result.sort((a, b) => b.reviewCount - a.reviewCount);
    }
    return result;
  }, [packages, search, destination, difficulty, sortBy]);

  return (
    <>
    <SEOHead
      title="Tanzania Safari Packages"
      description="Browse African Tembo Safaris' curated Tanzania safari packages — Serengeti wildebeest migration, Ngorongoro Crater, Kilimanjaro treks, Zanzibar beach & more. Luxury, budget & family safaris. Book direct from Arusha."
      keywords="Tanzania safari packages, Serengeti safari packages, Ngorongoro safari tour, Kilimanjaro trek packages, Zanzibar safari combo, family safari Tanzania, luxury safari Tanzania, budget safari Tanzania, 7 day safari Tanzania, 10 day safari Tanzania, East Africa wildlife tour, Tanzania wildlife packages 2025"
      canonical="/packages"
    />
    <section className="bg-background py-12 md:py-20">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Our Collection</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-foreground md:text-4xl">Safari Packages</h1>
          <p className="mt-2 max-w-xl text-muted-foreground">Browse our carefully curated selection of African safari experiences.</p>
        </motion.div>
        <div className="mb-8">
          <PackageFilters destination={destination} setDestination={setDestination} difficulty={difficulty} setDifficulty={setDifficulty} sortBy={sortBy} setSortBy={setSortBy} search={search} setSearch={setSearch} destinations={destinations} />
        </div>
        {isLoading ? (
          <p className="py-20 text-center text-muted-foreground">Loading packages...</p>
        ) : filtered.length === 0 ? (
          <p className="py-20 text-center text-muted-foreground">No packages match your filters.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((pkg, i) => <PackageCard key={pkg.id} pkg={pkg} index={i} />)}
          </div>
        )}
      </div>
    </section>
    </>
  );
}
